---
layout: post
title: "Go 越來越會躲 heap allocation 了（你看 profile 的方式也該更新）"
date: 2026-02-28 03:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張簡單的圖：對比 stack vs heap allocation 的成本](/img/posts/2026-02-28-go-stack-allocations-01.webp)

我不知道你們怎樣，但我自己在看 Go 服務的 hot path 時，常常會看到那種很熟悉的「小優化」：先把 slice capacity 開大一點。

像這樣：

```go
buf := make([]T, 0, 128)
```

這招不錯，也不會錯。

但最近我重新讀了 Go blog 講 allocation 的文章，才意識到：有些情況你以為是你「手動優化」帶來的效果，其實是 compiler 早就開始幫你做了，而且做得比你想像的更 aggressive。

## 真正的成本不是「有沒有 allocation」，是 allocator + GC 的整包稅

Heap allocation 的代價通常有兩層：

1. allocator 本身要跑一堆流程（metadata、size class、同步/快取之類的）
2. 你製造出來的東西最後都會變成 GC 要追的垃圾

Go 的 GC 這幾年確實進步很多，但「heap churn 很大」這件事還是很容易把 latency 和 CPU 吃掉。

所以 Go team 最近的方向很明確：能放 stack 就放 stack。

## Slice 便宜的是 header，貴的是 backing array

Slice 這個值本身很小，真正貴的是它指到的 backing array。

經典寫法：

```go
var tasks []task
for t := range c {
    tasks = append(tasks, t)
}
```

前幾次 append 會一路長大（1、2、4、8…）。也就是：你不只在 allocator 上花時間，還在地上留一排很快就變垃圾的舊 backing array。

如果你真的知道大概只會有 10 個元素，寫：

```go
tasks := make([]task, 0, 10)
```

在某些情況下 compiler 可以把 backing array 放在 stack，然後你的 allocation 數字直接變 **0**。

但前提是：它不能 escape（例如被你丟到別的地方、或被呼叫鏈弄到 heap）。

## 新的地方：compiler 會先給你一小塊 stack buffer「試試看」

我覺得比較有意思的是：新版 Go compiler 開始會在更多情況下，用一個「小的、推測性的」stack backing store 先撐住。

Go blog 文章裡大概是這樣的節奏：

- Go 1.24：常數大小的 `make` 比較容易 stack allocate；變動大小通常就直接 heap
- Go 1.25：對某些 `make([]T, 0, n)` pattern，如果 `n` 很小，compiler 會先用小的 stack backing store
- Go 1.26：連 `append` 的早期成長階段也開始套用同樣想法，減少那個很浪費的「startup phase」heap churn

如果你腦中還有那種「append 一開始就會一直 heap allocate」的直覺，老實說這個直覺要更新了。

## 會逃逸的 case：回傳 slice，也可能先少繳一堆小稅

最經典的「一定會 heap」例子是回傳 slice：

```go
func extract(c chan task) []task {
    var tasks []task
    for t := range c {
        tasks = append(tasks, t)
    }
    return tasks
}
```

對，最後回傳出去的結果必須活得比 stack frame 久。

但 Go 1.26 的思路是：早期那幾次成長是不是還是可以先用 stack 撐？真的要回傳再 move 到 heap。

文章裡提到 compiler+runtime 會有一個「必要時把 slice move 到 heap」的機制。

這種改變對 profile 的影響會很直覺：
- 前面一堆 1/2/4 那種小 allocation 變少
- 最後可能變成一次「剛剛好大小」的 allocation

## 我自己的結論（不要玩花的）

幾個務實的 takeaways：

- 你真的知道 size，就 preallocate。可讀性也更好。
- 但不要把「0 allocations」當成 KPI。要看的是 tail latency、GC CPU、整體吞吐。
- 升級 Go 版本後，舊的 workaround 可能變多餘，新的「莫名其妙變快」也可能是真的。

如果你想確認這些新優化是不是影響到你，Go blog 提到可以用一個 compiler flag 把它們關掉：

```text
-gcflags=all=-d=variablemakehash=n
```

（是的，這名字真的很 Go。）

我滿喜歡這種方向：它不是讓你學一堆新語法，而是讓「把服務寫得很 boring、但很快」這件事變得更容易。

---

**References:**
- [Go blog：〈Allocating on the Stack〉（heap vs stack、slice 與 compiler 優化）](https://go.dev/blog/allocation-optimizations)
- [Go blog：〈Green Tea〉GC 改善（理解為什麼 heap churn 會痛）](https://go.dev/blog/greenteagc)
- [Go 文件：escape analysis 與哪些情況會跑到 heap](https://go.dev/doc/gc-guide#Escape_analysis)
