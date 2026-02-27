---
layout: post
title: "JavaScript Streams 很強，但 API 像陷阱：Cloudflare 想把它重做一次"
date: 2026-02-27 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一個極簡的串流管線，箭頭連接 buffer 區塊](/img/posts/2026-02-27-better-streams-api.webp)

我對 Web Streams 有一種很矛盾的感情。

喜歡它，是因為**串流才是處理現代工作負載最誠實的方法**：大回應、增量解析、背壓（backpressure），以及「不要把記憶體炸掉」這種真的會出事的需求。

討厭它，是因為它的 *API* 看起來你可以用得很對……直到某天你突然發現你其實一直站在地雷陣上。

Cloudflare 最近寫了一篇長文，基本上也是在講這件事：Web Streams 的問題不是「有點 verbose」而已，而是它背著一堆在 **async iteration 出現之前** 做出的設計決策。那些歷史包袱，現在直接變成開發者體驗跟效能問題。

## 我在意的不是複雜，而是「儀式感」

多數時候，大家只是想把 stream 讀完。

以前標準做法大概長這樣：

```text
stream.getReader() -> reader
reader.read()      -> Promise<{ value, done }>
reader.releaseLock() -> void
```

第一次看覺得可以。

第五十次看就開始有點煩：這感覺像是你在塞車時還要一直手排換檔。

當然現在可以用 `for await...of` 來讀 stream，比較乾淨。

但老實說，它比較像是「後來加上去的外掛」。底下那套鎖（lock）、reader、controller、狀態機的世界觀還是在。

平常沒事你不會注意。

一出事你就會開始 debug：

- 「為什麼 stream 被 lock 住？」
- 「誰 lock 的？」
- 「為什麼 pipe 之後我這邊就不能用了？」
- 「為什麼 cancel 沒有照我以為的方式傳下去？」

錯誤訊息通常不是錯的，但也通常不夠幫助。

## 鎖是合理的，但「手動鎖」很容易變成坑

鎖本身我沒意見：你確實不希望兩個 consumer 同時搶讀。

但現在這個模型讓人太容易寫出一段「看起來沒問題」的 code，最後卻把整個 pipeline 弄死。

Cloudflare 提到的經典地雷就是：拿到 reader、讀一個 chunk、忘了 releaseLock，然後你後面所有的讀取都直接掛掉。

這種 bug 很擅長活過 code review，因為它不是「寫錯」。它只是少了一行，而且通常只在某個路徑才會踩到。

做過 production 的人都懂：下一步就是半夜被叫起來，因為 stream 永遠 lock 住了。

## BYOB 是「我們做了超難的事，但沒人用」的完美例子

Web Streams 有 BYOB（bring your own buffer），目標是減少 allocation。

紙上看起來很棒。

但實務上：

- API 複雜
- buffer detachment 的語意很反直覺
- 跟「就用迭代讀」的心智模型不太合
- 多數 userland 的自訂 stream 根本不會完整支援 default + BYOB 兩條路

最後它變成最糟糕的那種 feature：平台背上更多複雜度、實作者更難寫對，但使用率又不高。

Cloudflare 的意思（也跟我的感覺一致）大概是：**我們為複雜度付了錢，但沒有拿到回報。**

## 麻煩的是：Streams 已經變成「基礎設施」，所以錯誤會擴散

如果 streams 只是某個小眾 library，我可能也懶得吵。

但現在 streams 已經在底下支撐：

- `fetch()` 的 body
- 瀏覽器跟 server runtime 的一堆 API
- `TransformStream` 之類的平台原生元件

當一個基礎元件很怪，它不會只怪在那裡。

它會滲透到每一個包裝它的工具跟框架，最後你會看到很典型的現代 JS 生態：

- 簡單用法還行
- 中階用法開始迷路
- 進階用法太痛苦，大家乾脆自己再包一層

然後生態就開始碎裂。

## Cloudflare 真正在提案的：把 async iterables 拉回中心

我覺得那篇文章最關鍵的一句話是：

> Web Streams 是在 async iteration 還不存在的時候設計的。

如果你接受這個前提，你會突然覺得很多 API 其實不是「必要的複雜」。它只是「當年只能這樣設計」。

而 async iterable 本來就是 JS 表達「一個會隨時間到來的序列」最自然的語言原生能力。

所以他們的方向是：

- 不要讓使用者把 lock/reader 當成主要介面
- 主要介面改用語言原生的抽象
- 下面實作再去處理那些困難的狀態跟效能細節

他們還宣稱跑 benchmark 可能 2× 到 120× 更快。

我一律先對 benchmark 保留態度（尤其是同一篇文章裡）。但比較可信的點是他們講的「為什麼會更快」：

- 少一些抽象層
- 少一些狀態/鎖的 bookkeeping
- 少一些為了符合 spec 而必須存在、但對使用者沒幫助的機械化流程

就算實際上我關心的場景只有 1.5×，在 scale 起來的系統裡也很香。

## 我自己的結論：這不只是 streams 的問題，是「JS 怎麼演化」的老問題

我覺得這件事更像一種 recurring pattern：

- 規格會依照當下的語言能力寫出來
- 然後語言長出新的原生能力
- 接著大家就被迫用一個「不完全適合 2026 的 API」去做 2026 的事情

streams 只是這個模式裡超顯眼的一個案例。

比較現實的問題是：要怎麼在不把世界弄壞的前提下，替換一個已經是基礎設施的 API？

「重做一套」很爽，但 web platform 的遷移速度通常像冰河。

除非你能講出一個很硬的故事：**更簡單、也更快、而且跟現有 streams 互通，不會讓人覺得被詛咒。**

如果 Cloudflare 能把這件事做到：

```text
ReadableStream <-> AsyncIterable   （互通但不痛苦）
```

那我覺得生態真的會慢慢往那邊靠。

因為工程師想要的其實一直都沒變：

- 少一點地雷
- 錯誤行為更可預期
- API 的心智模型跟我們現在寫 JS 的方式一致

如果「更好的 streams」可以讓我重新專注在 data flow，而不是在那邊想「這次到底誰把它 lock 住」，我願意聽下去。

---

**References:**
- [Cloudflare：為什麼我們需要重新設計 Web Streams API](https://blog.cloudflare.com/a-better-web-streams-api/)
- [WHATWG Streams Standard（規格文件）](https://streams.spec.whatwg.org/)
- [MDN：for await...of（async iteration 語法）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
