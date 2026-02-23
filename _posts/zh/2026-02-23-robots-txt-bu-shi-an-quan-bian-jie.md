---
layout: post
title: "robots.txt 不是安全邊界（它比較像路標）"
date: 2026-02-23 04:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "把 robots.txt 當成鎖，你一定會踩到資料外洩的坑。robots.txt 是給守規矩爬蟲的協調規則，不是存取控制。這篇用工程師語言講清楚它能做什麼、不能做什麼，以及真正要保護資料時該用的 checklist。"
lang: zh
---

![一張暗色系極簡插圖：網站入口掛著一張寫著「robots.txt」的紙牌，而真正的鎖（登入、權限、網路規則）在後面。](/img/posts/2026-02-23-robots-txt-security-boundary-01.webp)

很多人談 **robots.txt** 的語氣，像它是一個安全機制。

我懂為什麼會這樣。

它長得很像「禁止進入」的告示牌：放在網站根目錄、有規則、搜尋引擎會看。

但如果你是工程師，我會你用一個比較誠實的翻譯：

```text
robots.txt -> 給守規矩爬蟲看的交通號誌
security   -> 身分 + 權限 + 強制執行（鎖）
```

你把號誌當鎖，就會出事。

## 我用五個角度把這件事釘死

1) **強制執行角度：robots.txt 沒有任何武力**

robots.txt 本來就是公開檔案。

爬蟲永遠可以讀完然後完全無視它。你也不能因為它違規就「自動 403」。

所以如果你想用 `Disallow` 來「藏」某個路徑，你其實是在 **指路**。

2) **威脅模型角度：它只對好人有效**

robots 的世界本質上是協調：

- 搜尋引擎通常會遵守
- 研究用途的 crawler 可能會遵守
- 惡意 bot、爬資料的、掃洞的通常不會

安全的重點是：你面對的是你 *不能* 跟他談規矩的人。

3) **資料風險角度：真正的風險不是 crawling，而是「你把它放出去了」**

大多數外洩不是「Google 不守 robots.txt」。

大多數外洩長這樣：

- 你把私密匯出檔丟在一個可猜的 URL
- staging build 不小心佈到 prod
- 物件儲存（S3 之類）被設成 public
- debug endpoint 在公網可打

robots.txt 對這些都沒用，它只影響「守規矩的人會不會幫你建立索引」。

4) **營運角度：robots.txt 很有用，只是用途不是安全**

正確使用時它很務實：

- 避免 bot 把脆弱 endpoint 爬爆
- 把垃圾 URL 釘在搜尋引擎外
- 引導 bot 去 sitemap

這是「流量管理 / 索引衛生」，不是存取控制。

5) **LLM 時代角度：bot 變多，誤解就會爆炸**

現在的 bot 包含：

- 搜尋引擎
- SEO scraper
- 各種「AI training crawler」
- 代理型工具臨時抓頁

於是大家第一反應就去找那個自己記得的檔案：robots.txt。

但真正能收斂風險的，還是老派但有效的東西：

- 認證（authentication）
- 授權（authorization）
- rate limit
- 網路邊界（IP allowlist / VPN / private subnet）
- 私有 bucket、signed URL

## 我會用的 checklist（真正想保密時）

如果你要的是「不公開」，那就做以下一個或多個：

- **放到登入後才可存取**（basic auth 都比沒鎖強）
- **回 401/403** 給沒有權限的人
- **不要放在公網**（VPN / 私網 / IP allowlist）
- **物件儲存預設 private**，權限最小化
- **不要把敏感檔案丟 web root**（聽起來很蠢，但真的常發生）

如果你要的只是「不要被索引」，那 robots.txt 可以用，但你要對目標誠實。

## 一句話規則

如果某個 URL 必須保密，**伺服器就必須強制執行權限**。

robots.txt 做不到。

它是路標。
不是鎖。

---

**References:**
- [robots.txt 規格（RFC 9309）](https://www.rfc-editor.org/rfc/rfc9309)
- [Google 搜尋中心：robots.txt 與 robots meta 基礎介紹](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
