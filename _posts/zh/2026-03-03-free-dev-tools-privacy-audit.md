---
layout: post
title: "免費線上開發工具其實不免費：那份隱私稽核讓我不敢再隨便貼 secrets"
date: 2026-03-03 21:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![鍵盤上的鎖頭](/img/posts/2026-03-03-dev-tools-privacy-tracking-01.webp)

我承認，我也常做一件很工程師的蠢事：趕時間的時候，JSON 亂掉了，就隨便開個「線上 formatter」把它排一下版。

然後心裡默念：不要貼真的 key。

但我最近看到一篇「熱門免費開發工具的隱私稽核」之後，心態有點變了。

因為最大的風險不只是「你貼的 API key 會不會被偷」。

更噁心的是：**你在用工具的同時，那個頁面可能正在跑一整套追蹤產業鏈。**

## 不舒服的商業模式：工具只是誘餌

有些網站可以做到「功能本身在瀏覽器端完成」（不把你貼的內容 POST 出去），但整頁還是隱私災難。

因為它同時可能在做這些事：
- 你一進頁面就先打 20+ 個 tracker / ad network
- 採集瀏覽器指紋（timezone、解析度、甚至 WebGL/GPU 相關特徵）
- 跟一堆廣告交易所做 identity sync
- 把 page URL / title 丟給 analytics

結果就是：就算你貼的內容沒送出去，**你的「開發行為」本身被做成資料**。

這句話我越想越不爽。

## 稽核裡幾個我看完忘不掉的點

那篇稽核用自動化瀏覽 + 監控網路請求的方式，觀察大家常用的免費工具到底對外送了什麼。

幾個重點：

### 1) 「只是 JSON formatter」但先啟動追蹤堆疊
有些站是你連字都還沒打，追蹤/廣告競價就先開跑。那不是「放個橫幅廣告」而已，是整套 tracking stack。

### 2) 看起來把你的 diff 存到伺服器上
稽核提到的其中一個線上 diff 工具，按下比較後 URL 會長得像 `/unsaved/{id}`。

這種「伺服器發一個 id 給你」的味道很重——通常代表內容被上傳並用那個 id 來引用。

### 3) 用 page title 也能漏資料
如果網站把你輸入內容的一小段塞進 tab title，那它會出現在你以為不相關的地方：
- 瀏覽器 history
- 分享螢幕時的 tab 標題
- 讀取 `document.title` 的第三方 analytics

### 4) Base64 解碼器居然可以有「1,570 個合作夥伴」
如果同意視窗上寫著「我們和 1,000+ 合作夥伴會存取你的裝置資訊」，老實說我不在乎它解碼有多快。

那已經不是工具了，是廣告生意披著工具的皮。

## 我現在的實際做法（比較不假掰）

我不會裝清高說大家以後都不用 web 工具。有時候就是要快。

但我至少把規則改成更可執行的一套：

### 任何敏感內容，優先用本機 CLI
真的沒必要上網的就不要上網：

```text
jq . file.json

diff -u old.txt new.txt

base64 --decode < input.b64 > output.bin
```

### 非用 web 工具不可時
- 把那個 tab 當成 hostile environment
- 先開 DevTools → Network，觀察它到底送了什麼
- 開 ad blocker
- 內容先遮罩（真的 key 用 `REDACTED` 取代）
- 看到「會產生可分享 URL」的工具就提高警覺

### 找真的 client-side、追蹤很少的替代品
世界上不是沒有比較乾淨的工具。稽核裡有提到 regex101 這種相對克制的例子（我看完也是「喔，這個可以」）。

## 工程師的結論

我們每天在聊 secret scanning、vault、zero trust，但最容易被忽略的是那些「日常的小偷懶」：

「快速排一下 JSON」
「線上 diff 一下」
「把 token decode 一下」

單次看起來都還好。
累積起來，就是你工作習慣被做成 profile 的方式。

而我不想為了縮排，順便把自己變成別人的 ad inventory。

---

**References:**
- [熱門免費線上開發工具的隱私稽核（ToolBox 部落格）](https://www.toolbox-kit.com/blog/i-audited-popular-dev-tools-privacy-results-are-scary)
- [本文首圖來源（Unsplash：Towfiqu barbhuiya）](https://unsplash.com/photos/FnA5pAzqhMM)
