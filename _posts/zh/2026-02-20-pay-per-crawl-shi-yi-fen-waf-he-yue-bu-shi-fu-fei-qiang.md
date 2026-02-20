---
layout: post
title: "Pay-per-crawl 是一份 WAF 合約，不是內容付費牆"
date: 2026-02-20 05:05:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
excerpt: "Stack Overflow + Cloudflare 談的 pay per crawl，我覺得更像是在邊界把 bot 存取變成一份『可讀、可執行』的合約：你是誰、你在做什麼、代價是什麼、不付錢會怎樣。"
lang: zh
---

![A dark, minimal illustration of a web gateway with a small label "402 Payment Required" and two bot silhouettes on the outside of the boundary.](/img/posts/2026-02-20-pay-per-crawl-01.webp)

過去很多網站跟爬蟲之間其實有個默契：

- 你可以爬
- 你讓我被搜尋到
- 你會把流量帶回來

AI 爬蟲把第三點打爛了。

所以我看到 Stack Overflow 跟 Cloudflare 在講 **pay per crawl**，我腦中不是「網頁也要訂閱」。

我想到的是更無聊、但也更有用的東西：

**在邊界上建立一份工程合約（contract）。**

不是法律合約。是工程師講的那種「介面定義」。

## 我用五個角度去想這件事

1) **真正的問題：** 不是「有人讀了我的內容」。是「有人製造了成本、拿走了價值，但 referral loop 沒了」。你的帳單變高，你的分發沒有跟著變好。

2) **介面角度：** 這件事其實是在把 WAF 變成 bot 的 API gateway。

如果你能把 agent 分類，那你就能寫出至少*看得懂*的 policy：

- 放行
- 限速
- 擋掉
- 或者要求付費

3) **Ops 角度：** 你買到的不只是錢，是*少一點打地鼠*。

以前 bot 流量是「DDoS + 很明顯的爬蟲」。現在是 headless browser 像正常人一樣進來，吃你頻寬，甚至把你的廣告曝光吃掉。

如果你還在維護越長越噁心的 allow/block list，你是在做沒有產品邊界的 ops。

4) **誘因角度：** pay per crawl 其實就是「對煩人行為課稅」。

它會逼 crawler 朝幾件事靠攏：

- 乖乖表明身份
- 少打幾次
- 行為可預測

即使網站最後一毛錢都沒收到，這些也很有價值。

5) **不太舒服的角度：** 很多網站會想要這個，因為它給了第一個「可規模化」的中間選項：不是開放網路 vs 全面封鎖。

## 402 才是重點

我覺得最關鍵的細節，是它用 **HTTP 402 Payment Required**。

這不是內容付費牆。這是給機器看的拒絕訊號。

如果把 crawling 當成介面，那邊界上需要一套很小的詞彙：

```text
ALLOW -> 200
SLOW  -> 429
STOP  -> 403
PAY   -> 402
```

很粗暴，但它是一個真正的 contract。Contract 的意義是：你不用再把規則寫在 Slack thread 裡。

## 這解決了什麼、沒解決什麼

它**有幫助**的部分：

- 讓 bot policy 變得一致
- 把戰場從「抓 user-agent 字串」移到「這個 actor 是哪一類」
- 讓網站在 open vs block 之間有一個可用的選項

它**沒有**魔法解掉：

- attribution
- 訓練同意
- 「我的內容被摘要成答案，但沒人回來」

那些是分發問題，不是 WAF 問題。

## 結論

如果這套東西成功，最大收穫不是網站都變成收費站。

最大收穫是：bot 存取變成一個一等公民的介面，語意清楚，誰能做什麼也更清楚。

對，還是很無聊。

但真正的槓桿常常就在無聊裡。

---

**References：**
- [Stack Overflow Blog：為什麼 Stack Overflow 與 Cloudflare 推出 pay-per-crawl（文章與逐字稿）](https://stackoverflow.blog/2026/02/19/stack-overflow-cloudflare-pay-per-crawl/)
- [MDN：HTTP 402 Payment Required（語意與用途）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)
