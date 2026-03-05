---
layout: post
title: "C 要變快，但我不想出兩個版本：動態 Feature Detection（AVX2、IFUNC、target_clones）"
date: 2026-03-05 01:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張簡單示意圖：程式先偵測 CPU feature，然後分派到 AVX2 快路徑或 portable fallback](/img/posts/2026-03-05-dynamic-feature-detection-01.webp)

我最近又看到一個很典型的 performance 對話（而且通常會吵很久）：

- 「這段用 AVX2 / BMI2 之類的指令集可以快很多。」
- 「但我們不能假設所有機器都有。」

最後大家不是走向：

1) 直接用最低共同規格編譯，能跑就好。
2) 出兩個（甚至更多）binary，讓使用者自己選。

這兩種都能解，但老實說第二種很煩：你把「選對 build」變成產品的一部分，然後還要祈禱 ops / 使用者不會選錯。

比較乾脆的做法是第三條路：

> **同一個 binary，啟動時/執行時根據 CPU 能力選擇實作。**

這就是動態 feature detection + dispatch。

## 真正的痛點：portable vs. 把硬體吃乾淨

在 x86-64 上，「能跑」跟「跑很快」中間差距很大。

如果你編譯的時候不敢假設 AVX2 這些擴充指令集存在，compiler 也不可能幫你亂用，最後就只能保守。

如果你能控制一整個 fleet，當然可以直接設定比較高的 baseline（例如 x86-64-v3）就結束。

但現實是很多軟體就是要跑在未知的環境：

- 使用者的老機器
- CI 的奇怪 runner
- 你根本不知道雲端 instance 會被排到哪顆 CPU

所以問題變成：

> 有沒有辦法同時保留 portable fallback，但在新 CPU 上自動走快路徑，而且不用使用者手動選？

有。

## 作法 A：讓 compiler 幫你做（target_clones）

如果你在 GCC/Clang + glibc 這種比較「標準 Linux」的組合上，可以直接用 function multiversioning。

概念大概是：同一個 function 生出多個版本，然後 loader 在程式啟動時選一個。

像這樣：

```text
[[gnu::target_clones("avx2,default")]]
void *my_func(void *data) {
  ...
}
```

你不用在 call site 做任何事，編譯器跟 runtime 會幫你把「挑版本」塞進去。

缺點是：你其實在吃平台紅利。

不同 libc / 不同平台，支援程度會不一樣。

## 作法 B：自己寫快路徑 + runtime dispatch（intrinsics + builtin 檢查）

更常見（也更直覺）的做法是：

- 寫一個 portable 版本
- 寫一個（或多個）用 intrinsics 的版本
- runtime 偵測 CPU feature
- 分派

在 GCC/Clang，你可以要求某個 function 用特定 ISA 編譯：

```text
[[gnu::target("avx2")]]
void *my_func_avx2(void *data) {
  ...
}

void *my_func_portable(void *data) {
  ...
}
```

然後用 builtin 檢查：

```text
void *my_func(void *data) {
  return __builtin_cpu_supports("avx2")
    ? my_func_avx2(data)
    : my_func_portable(data);
}
```

這個做法的 trade-off 很明顯：

- 你要維護多個實作（這是真的成本）
- 但你換來可預期的效能提升
- 也保證老 CPU 照樣能跑

如果你不想每次呼叫都 branch，一般會做「啟動時決定一次，然後存 function pointer」；或者你可以走 IFUNC。

## IFUNC：啟動時決定版本（快，但有點刁鑽）

IFUNC（indirect function）可以讓 dynamic linker 在載入時直接把 symbol 解析到最佳版本。

概念長這樣：

```text
static void *(*resolve_my_func(void))(void *) {
  __builtin_cpu_init();
  return __builtin_cpu_supports("avx2") ? my_func_avx2 : my_func_portable;
}

void *my_func(void *data) __attribute__((ifunc("resolve_my_func")));
```

好處是 call site 幾乎不付出成本（沒有每次呼叫的分支）。

但我會把它當成「電動工具」：很好用，但也比較容易割到手。

例如：

- 不是每個 libc 都支援（musl 就是大家常提的例子）
- debug / sanitizer / tooling 有時會變得比較怪
- 一旦出事，比較難解釋

## 我自己的結論：這種 "boring" 的效能工程，其實很值錢

動態 dispatch 一點都不潮。

但它很務實，因為它同時解決了三件事：

- portable
- performance
- deploy / release 不用搞到很痛苦

而且它會提醒你「效能」很多時候不是在拼什麼神奇演算法，而是更基本的這句話：

```text
我們到底要怎麼把正確的 machine code 送到正確的 CPU？
```

如果你做的是 latency-sensitive 的 C/C++ library（compression、crypto、parser、numeric kernel），這招真的該放進工具箱。

---

**References:**
- [Faster C software with Dynamic Feature Detection（原文 gist）](https://gist.github.com/jjl/d998164191af59a594500687a679b98d)
- [x86-64 microarchitecture levels（Wikipedia 概覽）](https://en.wikipedia.org/wiki/X86-64#Microarchitecture_levels)
- [GCC 文件：Function attributes 與 target_clones](https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html)
