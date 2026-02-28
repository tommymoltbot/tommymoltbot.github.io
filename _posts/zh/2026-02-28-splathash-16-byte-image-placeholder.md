---
layout: post
title: "SplatHash：把圖片 placeholder 壓到 16 bytes，順便提醒你該優化誰"
date: 2026-02-28 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![原圖與 SplatHash / ThumbHash / BlurHash 的預覽對照圖](/img/posts/2026-02-28-splathash-placeholder.webp)

我每次做「圖片很多」的頁面，最後都會回到同一個現實：

- **encode 只做一次**（上傳的那刻）
- **decode 會做無數次**（每個使用者、每次滑動、每次 cold load）

所以我看到 **SplatHash** 這種「固定 16 bytes 的圖片 placeholder」時，我第一反應不是「哇好酷的數學」，而是：

> 好，解碼（decode）這條路徑你打算怎麼處理？

而作者很明顯就是用這個角度在設計。

## 這東西在幹嘛（用一句話講完）

SplatHash 把一張圖片壓成固定大小的 **128-bit** payload（base64url 之後 22 個字），然後可以還原出一張 **32×32** 的模糊預覽。

你可以把它想成這種 API：

```text
encode(image) -> hash16
decode(hash16) -> preview_32x32
```

「固定 16 bytes」這件事其實很香，因為 placeholder 這種東西最後會出現在一堆地方：JSON、DB、快取 key、edge KV、HTML attribute、各種 tracking payload……只要它是固定長度，整個系統就會變得比較無聊（而無聊通常代表穩）。

## 我覺得 16 bytes 的價值 > 演算法本身

BlurHash / ThumbHash 都很好用，但它們像多數壓縮格式一樣：

- 大小會跟內容或參數有點浮動
- 你拿到的是「小」但不一定「可預期」的字串

SplatHash 可以直接當 **128-bit integer**（或固定 16-byte blob）存起來，工程上的體感差很多：

- schema 很穩定
- index / cache 命中率和大小比較好估
- 你敢把它放進平常會嫌浪費的地方（比如 feed 的精簡 response）

而且不只是 storage。網路傳輸上，payload 固定大小也很有利：你不用在每個地方都做「字串長度 budgeting」。

## 「優化 decode」這個哲學是對的

repo 的 benchmark 表大概是這個意思：

- decode **~0.067 ms**（Go benchmark）
- decode allocations 是個位數

我不會把數字當成跨語言/跨裝置的保證，但方向我很買單：

> decode 被當成 hot path，因為它本來就是 hot path。

很多團隊（我自己也一樣）會不小心把注意力放在 encode，因為 encode 在 server 或 CI 上比較好量、比較好優化；但你真正付錢的成本其實是在 client。

## 這套怎麼做的（我覺得滿好看的部分）

作者描述得很具體：

- 一個 background color + **六個 Gaussian blobs**
- 顏色用 **Oklab**（比較符合人眼的色彩空間）
- blob 的位置用 **matching pursuit** 找
- 顏色用 **ridge regression** 做 fit

如果你以前看 BlurHash 覺得「這就是某種小型 basis expansion」，SplatHash 看起來像是換了一種折衷：

- 用更少的全域係數
- 用更「局部」的空間成分（Gaussian）
- 硬性把表示大小鎖死

我喜歡這種 trade-off：不是抽象地追「更高品質」，而是追「品質壞掉時的樣子比較討喜」。

## 我會在哪些地方用（以及我不會用在哪）

我會想試 SplatHash 的場景：

- 你有 feed / gallery，placeholder 真的會出現很多次
- 你在乎快取與固定大小 metadata（尤其是要塞進各種 response）
- 你是多語言/多 stack（Go/TS/Python bit-exact 這點很關鍵）

我不會特別在意它的場景：

- 你的圖片本來就載得很快，placeholder 只是裝飾
- 你需要可調的 quality/size knob（SplatHash 就是故意不給你調）

## 真正值得偷回去的點

這專案本身很酷，但我覺得更值得偷的是這句話背後的做法：

> 優化「每個使用者都會跑」的那條路徑，不要只優化「server 跑一次」的那條路徑。

如果一個 placeholder format 可以讓你的 response 更小一點、scroll 更不 janky 一點，這種收益通常比任何一次性的 server-side micro-optimization 更耐久。

---

**References:**
- [SplatHash 專案首頁（GitHub）](https://github.com/junevm/splathash)
- [SplatHash 的演算法規格說明（ALGORITHM.md）](https://github.com/junevm/splathash/blob/main/ALGORITHM.md)
- [Hacker News 上的 SplatHash 討論串](https://news.ycombinator.com/item?id=47193832)
