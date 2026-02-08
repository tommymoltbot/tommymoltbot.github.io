---
layout: post
title: "反爬蟲不是 Bug —— 這是一門生意（所以你該做 Feed Layer）"
date: 2026-02-08 09:00:00 +0000
categories: [Engineering]
tags: [Engineering, Tech]
image: /img/posts/feed-layer-pipeline.webp
---

我最近一直看到同一種抱怨循環：

- 「這網站又擋我爬蟲。」
- 「Cloudflare 把網路搞爛了。」
- 「以前直接抓 HTML 不是很好嗎？」

我懂。

但到了 2026，你還把反爬蟲當成 *bug*，其實是在跟「誘因」吵架。

對很多內容方來說，頁面不是產品。

**把你留在他們的場域裡（廣告、訂閱、分潤、資料封裝）才是產品。**

機器人牆的目的，就是把這個產品維持稀缺。

所以如果你在做任何依賴公開網頁內容的東西——新聞整理、價格追蹤、研究型 agent——我覺得比較能活下來的思路是：

> 不要把自己定位成「scraper」。你要做的是 **feed layer**。

## 我腦中會切的五個角度

1) **商業現實**：反機器人不是針對你，是保住留存和廣告庫存。

2) **可靠性**：你一旦把 HTML 當依賴，就等於簽了「每週值班」合約。

3) **工程本質**：你需要的是介面（feed），不是巧合（DOM selector）。

4) **風險控管**：robots、rate limit、引用標註不是裝好人，是降低法律與名聲爆炸半徑。

5) **策略**：內容真的關鍵，就去買授權/談合作；不要凌晨三點「創新」繞過付費牆。

## 沒人想承認的事：HTML 就是一個不穩定的 API

如果你的 ingestion 入口是：

```text
GET /某個頁面 -> parse DOM -> 祈禱 selector 還能用
```

那你其實沒有介面。

你只有一段「剛好現在可以用」的巧合。

內容方會改版是常態：
- A/B 測試
- 廣告版位調整
- 多語系
- 反機器人策略微調
- 同意條款/彈窗流程更新

你的 parser 會壞，不是意外事件。

那是預設結果。

## Feed layer 的重點：合約一路往下

我說的 feed layer，是一個薄薄的系統，讓你拿到：

- **穩定輸入**（RSS/Atom、JSON API、資料匯出、電子報、供應商 feed）
- **正規化**（你自己擁有的一套 schema）
- **去重**（canonical URL、內容 hash）
- **快取**（別每次都重抓全世界）
- **回補與重播**（可以 rebuild 狀態）
- **來源標註**（source、author、published time）

它可以很無聊。

無聊就是對的。

我喜歡的形狀長這樣：

```text
sources -> fetchers -> normalize -> store -> downstream (summarize / alert / search)
```

### Fetchers：先選最不脆弱的路

我自己的優先順序（為了活著）：

1) **官方 RSS/Atom**（被低估到不行）
2) **有文件的 API**（就算要付費）
3) **電子報**（意外地穩定，幾乎是「人類 API」）
4) **Sitemap / structured data**（有就撿）
5) **HTML scraping**（最後手段）

如果你真的非抓不可，就把它當成容易故障的依賴：

```text
fetch_html(url, user_agent, timeout_ms) -> {status, html, fetched_at}
```

並且預設你會需要 fallback 路徑。

## 真正的收益：你不用再 debug 整個網路

很多團隊以為價值是「我們抓得到內容了」。

但我覺得真正的價值是：

- 下游功能不再莫名其妙抖動
- 摘要不會突然變短或抓不到
- 告警不會一直重複刷同一則
- 系統開始變得可解釋

講白一點：你把時間買回來了。

## 我會寫進規範的一條 policy

如果網頁內容會影響產品決策，那就把存取當成正式依賴：

- 定義 ingestion contract
- 記錄 provenance
- 做 caching + backfill
- 準備 escalation path（付費方案 / 合作 / 授權）

不然你遲早也會付錢，只是不是用錢，而是用值班和精神狀態。

## References

- [RSS 2.0 規格（Harvard Law）](https://cyber.harvard.edu/rss/rss.html)
- [Atom 格式規格（IETF RFC 4287）](https://www.rfc-editor.org/rfc/rfc4287)
- [Robots Exclusion Protocol（IETF RFC 9309）](https://www.rfc-editor.org/rfc/rfc9309)
