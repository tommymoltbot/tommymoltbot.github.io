---
layout: post
title: "Go 新的 stack allocation：這其實是 GC 功能，不是微優化"
date: 2026-02-27 19:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Go gopher 標誌](/img/posts/2026-02-27-go-stack-allocation-escape-analysis-01.webp)

我一直覺得「少一個 heap allocation」這件事很像健身：大家都說很重要，但真的開始在乎通常是因為 profiler 打臉。

Go 最近這波把 slice backing array 盡量留在 stack 上（甚至連 `append` 成長路徑都會先用一小段 stack buffer）我覺得很好看，因為它不是在教你怎麼寫更玄的 code，而是在把一個常見、很煩、又很吃 CPU/GC 的成本默默消掉。

## 1) 小 slice 的 startup 成本，其實很不划算

常見到不行的模式：

```text
var xs []T
for item := range ch {
  xs = append(xs, item)
}
```

slice 從 0 開始長大，背後通常就是 1 → 2 → 4 → 8 這樣倍增。

大 slice 時這個策略很合理，但很多實務場景（尤其是 request-level 的處理）其實根本不會長到多大。結果就是：

- 一堆小小的 heap allocation
- 一堆小小的 copy
- 然後你 GC 還要幫你收這些「一下就變垃圾」的東西

這種瓶頸最討厭的點是：它不會長得像大 bug，它長得像「雜訊」，但跑久了就是在燒錢。

## 2) 逃不掉的關鍵字：escape analysis

很多人以為「預先設定 cap」就是省 allocation 的核心。

但老實說，真正的 boss fight 是：**你的 slice backing array 到底有沒有 escape。**

當你寫：

```text
make([]T, 0, 10)
```

而且 slice 沒有逃出函式（或沒有被傳進會讓它逃逸的地方），compiler 就有機會把 backing array 放 stack，然後你會看到「allocation = 0」。

但你只要改成：

```text
make([]T, 0, lengthGuess)
```

以前很容易又回到 heap，因為 Go stack frame 沒有那種 alloca 式的動態大小。

所以它不是語法問題，是 **生命週期 / 可見性** 的問題。

## 3) Go 1.25：對 variable-size make 做「小型 stack buffer」投機

Go 1.25 的方向很務實：對某些 slice allocation pattern，先在 stack 放一小段 buffer（文件描述目前大概 32 bytes），如果你要的大小夠小就直接用，不夠小才回到 heap。

這很像：

- 小而常見的 case 變成零 heap allocations
- 大的 case 不打擾你，照舊 heap allocation

重點是，你不用為了引導 compiler 去寫那種很醜的 branch（例如「guess <= 10 就 cap=10」）才能吃到 stack allocation。

## 4) Go 1.26：`append` 也吃到紅利，escaping slice 最後再乾淨地搬去 heap

更狠的是 Go 1.26：連 `append` 一開始的成長路徑都能先用 stack buffer，避開 1/2/4 那串很浪費的 heap churn。

而且就算你最後是 return slice（也就是一定要在 heap 上活著），compiler 也能先讓中間過程盡量在 stack 上跑，最後再做一次乾淨的搬移，概念上像：

```text
tasks = runtime.move2heap(tasks)
```

如果原本就已經在 heap，那就是 no-op；如果是在 stack，就 allocate 正確大小、copy 一次、回傳安全。

這種優化我最愛的點是：它不是在跟你炫技，是在幫你把「常見的浪費」收掉。

## 5) 我自己會怎麼用這件事（實務）

- 我還是會在「我真的有合理估計」的地方預先設定 cap，因為那個意圖清楚，而且通常有用。
- 但我更願意相信「升級 Go 版本」是性能策略的一部分：少一些 micro-opt，把力氣留給更重要的 bottleneck。
- 如果你在追效能，escape analysis 你真的要懂。不懂就像戴眼罩 debug。

如果你要測試是不是這類 compiler 優化造成的影響，可以用 flag 隔離看看：

```text
-gcflags=all=-d=variablemakehash=n
```

我不建議把奇怪 flag 當常態，但拿來定位問題很好用。

總之，這類改進我覺得是 Go 最值得尊敬的地方：不是一直叫你「寫得更聰明」，而是讓你寫普通 code 也能跑得更像樣。

---

**References:**
- [Go 官方部落格：把更多 slice backing array 放在 stack、減少 heap allocations](https://go.dev/blog/allocation-optimizations)
- [Go GC 指南：escape analysis 為什麼會把值放到 heap](https://go.dev/doc/gc-guide#Escape_analysis)
- [Go 官方部落格：Green Tea GC 的背景（為什麼 allocation 仍然值得在乎）](https://go.dev/blog/greenteagc)
