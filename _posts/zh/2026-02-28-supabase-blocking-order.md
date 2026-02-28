---
layout: post
title: "Supabase 在印度被擋這件事，對我來說其實是『可靠性設計』的提醒"
date: 2026-02-28 07:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Supabase blocking banner](/img/posts/2026-02-28-supabase-blocking-order-01.webp)

我看到一篇報導說 **Supabase 在印度出現被封鎖/不穩定的情況**：有些 ISP 連得到，有些 ISP 連不到，甚至同一個國家不同城市狀況也不一樣。

這種事情很容易被當成「政治新聞」滑過去，但我第一時間想的是更無聊、也更致命的那一面：

> 當你的核心依賴可以在網路層直接消失，你遇到的不是 uptime 問題。
> 你遇到的是 *架構假設* 被打臉。

## 我腦中一直轉的五個角度

### 1) 「開源」不會自動幫你避險，除非你真的有能力自己跑
Supabase 是開源沒錯，但如果你用的是 hosted 版本，你的 blast radius 還是 hosted 版本。

開源在這裡比較像是：
- **你理論上有退路（exit）**
- 但不代表你**平常就走在退路上**

大多數團隊選 BaaS 是因為不想自己維運 Postgres、Auth、Storage、Realtime…
所以出事的那天，你會突然發現「能 self-host」跟「現在能切過去」是兩回事。

### 2) 真正可怕的是『不確定性』
報導裡提到，封鎖的原因並沒有很清楚、也不是每個網路都一致。

你想像一下 debug 的過程會多折磨：
- 同事 A 說可以連
- 同事 B 說不行
- 換 DNS 有時有效
- VPN 幾乎都能過

這不是一般的 incident。
這是那種會讓你先浪費好幾個小時檢查「是不是自己程式壞了」的那種。

### 3) 「叫使用者用 VPN」不是 production strategy
我理解 vendor 會先丟 DNS/VPN workaround 出來救火。
但你如果真的在做產品：
- 終端使用者不會配 VPN
- 企業客戶很多還會禁止
- 合規/風控講不過去

如果你的核心使用流程需要「請客戶改 DNS」，那你已經是長期事故模式了。

### 4) Hosted developer infra 已經是供應鏈的一部分
以前講 supply chain 風險，大家想到的是：
- package registry
- CI/CD
- build pipeline

但現在很多產品的「核心能力」本來就外包給 managed service：
- DB 是產品
- Auth 是產品
- Storage 是產品
- rate limiting 也是產品

所以封鎖一個 domain，有時候效果就像**撤銷你的 runtime**。
而且報導提到印度是 Supabase 重要的流量來源之一，這完全不是什麼極端小機率事件。

### 5) 真正能解的是架構，不是公關
如果我今天要用 hosted BaaS，我會逼自己寫下這幾個問題（然後真的做）：

- **控制平面（console / dashboard）掛了，我的 app 還能活多久？**
  - 讀取能不能繼續？
  - 寫入能不能排隊？

- **我到底有沒有 failover 計畫？**
  - 「兩週內可以搬家」不算 failover。

- **能不能有一個最小可運作的 self-host fallback？**
  - 不求功能全，只求核心流程別死。

- **我有沒有把外部依賴當成『依賴預算』在算？**
  - 每加一個 managed service，就多一個「非技術因素」的故障模式。

這聽起來很麻煩，但跟「以前大家覺得 multi-region 太奢侈」是同一種成熟化。
你真的被燒過一次，就不會覺得這是 paranoia。

## 我的結論（很務實那種）
我不覺得答案是「不要用 managed service」。
這不現實，也不一定划算。

但你要接受一件事：**外包基礎建設，你同時也外包了故障模式。**
裡面有些不是技術因素，甚至你根本控制不了。

使用者最後只看結果：能不能用。
原因他們不在乎。

---

**References:**
- [TechCrunch：關於 Supabase 在印度出現連線中斷/不穩的報導](https://techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order/)
- [Supabase 官方說明印度連線問題的更新串（X 貼文）](https://twitter.com/supabase/status/2027444736479420571)
- [TechCrunch（2014）：印度曾短暫限制 GitHub 等平台連線](https://techcrunch.com/2014/12/31/indian-government-censorsht/)
- [Times of India（2023）：部分 ISP 封鎖 GitHub 內容網域的報導](https://timesofindia.indiatimes.com/gadgets-news/github-content-domain-blocked-for-these-indian-users-reports/articleshow/96687992.cms)
