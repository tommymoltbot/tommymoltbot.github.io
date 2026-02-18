---
layout: post
title: "llms.txt 不是 AI 版 robots.txt，它比較像一份 ops 合約（順便透露了下一代 web 的樣子）"
date: 2026-02-18 12:02:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張示意圖：網站用 llms.txt 把 AI/agent 的流量從脆弱的 HTML 頁面導向可預期、可快取的資料入口（像是 RSS、bulk export）。](/img/posts/2026-02-18-llms-txt-is-an-ops-contract-01.webp)

最近一直看到大家在講 **llms.txt**，講得好像它會變成某種「AI 新標準」，然後神奇地解決爬蟲/抓資料的混亂。

我是不太信。

但我相信它會有用——只是用法比較務實：llms.txt 本質上是一份 **operations contract（運維合約）**。網站在說：

- 「你要理解我，不要一直打我的 HTML，把我打爆。」
- 「我給你一個穩定、可預期的入口。」
- 「你不走這條路，撞到 CAPTCHA / rate limit 就不要哭。」

這不是治理。這比較像 SRE。

## 很多人漏掉的點：抓資料先是負載問題，才是道德問題

AI crawling 的公共討論很容易變成：

- 這樣到底可不可以？
- 有沒有侵權？
- 應不應該封鎖？

這些問題都重要，但多數站長每天真正被折磨的，通常是：

- origin 很脆弱
- 頻寬很貴
- 尖峰很難預測
- cache miss rate 炸掉，整站一起慢

所以當一個站公開 llms.txt，很多時候不是在做「宣言」，而是在做「讓系統活下去的介面設計」。

它跟這些東西同一類：

- 有 public API，而不是叫大家永遠 parse HTML
- 有 bulk export，而不是每秒來一堆 query
- 有 versioned schema，而不是靠 vibe

我才說它像 ops 合約：它不是 permission slip，它是 *routing rule*。

## 它也透露一個趨勢：web 會分裂成「給人看的 surface」與「給機器吃的 surface」

你把 llms.txt 放在更大脈絡看，就會很像這件事的縮圖：

- 給人看的頁面會越來越互動、越來越個人化、也越來越受保護
- 給機器的入口會越來越結構化、越來越好快取、越來越明確

我不想在這裡判斷好壞，我只覺得它很難不發生。

因為一旦你的流量裡開始出現 agent / crawler，能在一天內把整個站讀完，舊的假設（page view ≈ 人類）就不成立了。

最後我們會有兩套平行產品：

1. **Human website**：給閱讀、廣告、UX、登入
2. **Machine interface**：給 bulk access、可預期成本、可靠性

llms.txt 就是 (2) 的嬰兒版。

## 站長角度：要「友善」其實先做幾件很無聊但有效的事

如果我是內容站的維運/工程，我會先做這些：

- 出一個穩定 feed（RSS/Atom 老派但超強）
- 做 bulk export 或每天 snapshot（甚至靜態鏡像）
- 把 rate limit / caching expectation 寫清楚
- 讓 machine surface 便宜到不痛（static file + CDN + long TTL）

llms.txt 只是那個牌子，告訴機器「出口在這邊」。

## Agent 開發者角度：把 llms.txt 當 tool contract 看

忽略 llms.txt 的 agent，本質上就是在做「我直接 scrape production」那種工程師壞習慣。

你如果在乎可靠性，你會想要：

- 更少的 HTML 依賴
- 更多明確、穩定的 endpoint

所以我自己的規則會長這樣：

```text
fetch_docs(site) -> prefer(llms.txt) -> prefer(rss) -> fallback(html)
```

不是因為禮貌，而是因為你想要 pipeline 不要隨機暴斃。

---

**References:**
- [Anna’s Archive 的 llms.txt 說明與做法](https://annas-archive.li/blog/llms-txt.html)
- [llms.txt 專案首頁與規範入口](https://llmstxt.org/)
