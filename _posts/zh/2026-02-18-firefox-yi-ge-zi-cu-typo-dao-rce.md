---
layout: post
title: "一個字元到 RCE：為什麼「&」跟「|」是生產環境問題"
date: 2026-02-18 10:05:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "一篇 Firefox SpiderMonkey / Wasm 的漏洞分析寫得很直白：有人在 forwarding pointer 的標記位上把「|」打成「&」，結果把本來穩固的 invariant 打穿，最後可以一路走到 renderer RCE。真正值得看的是背後那套『怎麼讓這種 typo 變成不可上線』的工程方法。"
lang: zh
---

![一張暗色系、仿流程圖的縮圖，上面寫著「One typo → RCE」](/img/posts/2026-02-18-firefox-typo-rce-01.webp)

有些 bug 很複雜，複雜到你看完只會說「這也太神」。

這個 bug 反過來：它簡單到讓人有點不爽。

最近看到一篇分析 Firefox SpiderMonkey / Wasm 的漏洞文章，核心點是：某段 refactor 裡，有人要在 forwarding pointer 上「把最低位設成 1 當 tag」，結果把 `|` 打成 `&`，然後一串 invariant 就崩了，最後甚至能走到 renderer code execution。

你如果做過底層 review，應該懂那種感覺：這種 diff 看起來太像「應該沒事」，所以眼睛會自動略過。

但越是這樣，越危險。

## 我用五個角度看「一個字元」等級的安全漏洞

1) **工程角度：** 一個字元的 bug，效果可以是完整功能的 bug。在 pointer tagging 這種世界，一個 bit 基本上就是你的型別系統。

2) **流程角度：** 如果一個關鍵 invariant 能被 typo 打穿，那你的安全網只能靠 review + 測試 + fuzzing，而不是靠「大家都很懂」。

3) **系統角度：** 真正嚇人的不是 exploit chain 的花活，而是它發生在「GC 正在搬東西」且「JIT 還假設東西在原地」那條邊界上。

4) **人性角度：** 這就是「我看過這個 pattern」的副作用。越熟悉越容易看漏。

5) **生產角度：** renderer sandbox 是在幫你擋子彈的。你想要的不是『不會出錯』，而是『出錯也不會直達災難』。

## 這個 bug 用一行就能講完（也因此更可怕）

文章描述的狀況大意是：SpiderMonkey 想在某個 header word 裡存 forwarding pointer，並且把 LSB 設成 1 當 tag。

但某次改動疑似變成這樣：

```text
oolHeaderOld->word = uintptr_t(oolHeaderNew) & 1;
```

而本來意圖更接近：

```text
oolHeaderOld->word = uintptr_t(oolHeaderNew) | 1;
```

如果你的 pointer 是對齊的（通常都會），`ptr & 1` 幾乎一定是 `0`。

也就是說：你原本想寫「pointer + tag」，結果寫出來變成「0」。

然後後面一連串依賴這個 tag 判斷 inline / out-of-line 的邏輯，就可能開始把物件當成它不是的東西。

這種錯誤一旦進到 memory layout 的領域，後面很多看起來很正常的 code，會瞬間變成「非常不正常」。

## 我真正想帶走的三個結論

### 1) Invariant-heavy 的程式碼要靠「機械化的保護」

這種 subsystem 只要靠「大家記得要 `| 1`」就會出事。

你要的是很 boring 但很有效的護欄：

- 把 tagging 寫進 helper function / macro，減少手打機會
- 用 assert 把不可能的 header word 直接炸掉
- fuzzing 要特別針對 moving GC + JIT 的交互

### 2) Review 的嚴格程度要跟風險對齊

很多團隊 review refactor 的方式很像在看排版。

但你碰到 GC movement、forwarding、tagging、JIT 假設，這就不是「cleanup」。這是 production change。

我的粗暴標準：如果 diff 碰到這些字眼，就算 PR 沒寫「security」，也要用安全心態去看。

### 3) 「一個 typo」不是道德問題，是必然事件

人一定會打錯字。

你能選的是：你的流程要不要在它出事前抓到。

你想要快，OK。

那你就得同時付得起：

- fuzzers
- sanitizers
- defense-in-depth
- 把 invariant 寫進 regression tests（不是只測症狀）

## 我的底線

我不意外有人會打錯。

我更在意的是：你的工程文化有沒有把這類 typo 當成「一定會發生，所以要系統性處理」的事情。

Exploit 是標題。

流程才是教訓。

---

## References

- [原文分析：“How a single typo led to RCE in Firefox”](https://kqx.io/post/firefox0day/)
- [Lobsters 討論串](https://lobste.rs/s/2tpg37/how_single_typo_led_rce_firefox)
