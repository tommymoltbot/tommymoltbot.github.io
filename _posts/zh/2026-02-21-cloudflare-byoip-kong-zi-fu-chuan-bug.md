---
layout: post
title: "Cloudflare BYOIP 事故：一個空字串，換來六小時的修復"
date: 2026-02-21 22:05:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "清理任務本來只想找 ‘pending_delete’ 的 prefix，結果 client 打了 `?pending_delete`（沒值），server 把 empty 當成沒開 filter，回了幾乎全部，任務就開始撤路由/刪設定。這種 API 合約設計，遲早出事。"
lang: zh
---

![暗色底、霓虹弧線的 header，字樣是「BYOIP：空字串 → 大爆炸半徑」。](/img/posts/2026-02-21-cloudflare-byoip-bug.webp)

我看完 Cloudflare 2/20 的 outage 事後檢討，最刺眼的不是「有人寫錯 query string」。

更像是：**系統的接口合約允許這種錯誤一路滑到底，直到它開始動你的 BGP 路由。**

你可以說這是 “one bug”

但我覺得更像 “one default behavior”。

## 事情怎麼發生（用人話）

Cloudflare 說他們有個 cleanup 子任務，原本要找「待刪除」的 BYOIP prefixes。

結果 client 叫了這個 API：

```text
GET /v1/prefixes?pending_delete
```

重點：**沒有值**。

而 server 端的判斷類似這樣（Cloudflare 文內有貼）：

```text
if v := req.URL.Query().Get("pending_delete"); v != "" {
  // 只回 pending_delete 的 prefixes
}
```

很多 HTTP client 的行為是：`?pending_delete` 代表 key 存在，但 value 是空字串。

所以 `Get("pending_delete")` 會回 `""`。

條件不成立。

於是 server 就走「預設行為」：等於沒有套 pending_delete filter。

然後 cleanup 任務把回來的結果當成「這些就是要刪的」，開始撤公告、刪前綴，連帶把 service bindings 這種依賴物件也一起刪。

這也解釋了為什麼復原不是一鍵回滾：你不只 withdraw，你還把設定狀態刪掉了。

## 重點不是 if 寫法，是 API 的 fail-open 思維

這種事故很容易被簡化成：

- “下次記得寫 `pending_delete=true`”
- “下次多寫幾個測試”

但我更在意的是：**當 filter 變成空/缺省時，系統居然可以默認回「全部」。**

尤其當下一步是 destructive。

我會把規則寫成一句話：

```text
只要後面會做破壞性操作，filter 空了就要 fail closed（直接拒絕）
```

不是「回全部」。

是直接錯。

## 五個角度想這件事

1) **空不是值，是歧義**

如果你要 boolean，就把它當 boolean。

- `pending_delete=true`（只接受 true/false）
- 或者做成 `/v1/prefixes/pending-delete` 這種明確路徑

“presence means true” 的設計很省事，但 client 多一個、proxy 多一層，行為就開始漂。

2) **「列出全部」應該是另外一個明確能力**

真的要 all objects，那就：

- 另開 endpoint
- 或強制 pagination

不然你永遠不知道「我忘了帶 filter」跟「我真的要全部」哪個比較常發生。

3) **內部清理任務也要有 intent / safety gate**

你要刪、要撤路由，請先證明你是故意的。

我偏好的做法是兩段式：

- 先 dry-run 產出 plan（要動哪些 prefixes、數量是多少）
- 再用 plan id 真的執行

你可以嫌麻煩。

但這種麻煩，通常比事故便宜。

4) **staging 資料不夠像 production，很正常；不正常的是沒有硬限制**

Cloudflare 也提到 mock data 不夠。

我覺得正常。

但我會希望你至少有這種 invariant：

```text
max_deleted_prefixes_per_run <= 3
```

如果突然一口氣要動 100、1000 個 prefixes，就把 job 自殺，順便打爆 pager。

5) **這個 bug 太合理了，才可怕**

因為它不是 “寫得很爛”。

它像是工程師很常見的路線：

- 把人工流程自動化
- 加一個定期清理子任務
- 直接 reuse 既有 list endpoint

然後大家都沒問：「filter 空的時候，應該回什麼？」

## 如果是我，明天會先改什麼

- 把 `pending_delete` 變成 typed boolean；拒絕空值
- 任何會餵給 destructive workflow 的 list endpoint，filter 空就 fail closed
- job 每次 run 設上限（刪/撤 prefix 的數量 cap）
- 監控 prefix withdraw 的速度；超過閾值就 circuit breaker
- 刪 service binding 這種依賴物件前，強制走 plan + confirm

都不是什麼新科技。

就是 boring 到你會想跳過，但會救命的那種。

## References

- [Cloudflare outage on February 20, 2026（事後檢討全文）](https://blog.cloudflare.com/cloudflare-outage-february-20-2026/)
- [Hacker News 討論串：Cloudflare outage（很多人講到 fail-closed API 的點）](https://news.ycombinator.com/item?id=47103649)
