---
layout: post
title: "pg_background 讓 Postgres 幫你跑長工，但你還能好好 on-call"
date: 2026-02-18 00:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "很多人把 async 當成救命稻草，結果只是把複雜度搬到另一個地方。pg_background 有趣的點是：它把 async 邊界留在 Postgres 裡，而且把 wait / cancel / detach 這些語意講清楚，才算是能營運的 async。"
lang: zh
---

![一張極簡黑白插畫：資料庫圓柱旁邊開一個小門寫著 background worker，旁邊有一張 checklist](/img/posts/2026-02-18-pg-background-async-01.webp)

真實系統裡的「async」大概分兩種：

- 讓你的 latency 圖好看的那種
- 讓你 on-call 變地獄的那種

大家會想做 async，理由通常很正當：

- 某些 request 太慢
- backfill 太重
- 維護 SQL 不想卡在服務路徑裡

但很多團隊的第一反射是：**再加一個 moving part**。

- queue
- worker fleet
- retry policy
- dead-letter
- 一套「為什麼卡住」的監控

有些情況你真的需要。

但也有一大票情況，你只是把原本單純的問題，變成分散式問題而已。

我最近看到的 pg_background，讓我覺得它至少是在用一種比較誠實的方式談 async：

> 讓 Postgres 在 background worker 裡非同步執行 SQL，你的 client session 可以先走，但工作在自己的 transaction 裡跑完。

它不是 scheduler，也不是 job platform。

它是一把很銳利的刀。

## 我用五個角度判斷「Postgres-native async」到底值不值得碰

1) **商業角度：** 少一個 component 省很多錢，但前提是它要真的好營運。

2) **系統角度：** 把工作移出 request path 不會自動變好；關鍵是新路徑要有清楚的 failure mode。

3) **歷史角度：** 資料庫的「autonomous transaction」從來都不是新概念，危險點也一直都在：handle/identity 做不好就出事。

4) **工程師角度：** 不要用「它是 async」當成藉口。背景工作一樣吃資源，一樣會把你拖進容量地獄。

5) **我的最低標準：** 如果我沒辦法在 60 秒內講清楚 wait / cancel / detach，這東西就不適合進 production。

pg_background 大致上有在往這方向走。

## pg_background 是什麼、不是什麼

它的核心能力很直白：把 SQL 丟到 server-side background worker 去跑。

這件事在 production 重要，因為隔離單位是清楚的：

- 跑在 Postgres 裡
- 有自己的 transaction scope
- client connection 不需要傻等

它 **不是**：

- cron
- durable queue
- app workflow engine

它比較像：

> 「把這段 SQL 丟去那邊跑，然後給我一個 handle，我決定要等、要取消、還是先放著。」

## 真正值得注意的點：handle model 被硬化了

我看到一個很務實的方向是：v2-style API 用 `(pid, cookie)` 當 handle。

這聽起來很無聊，但我反而覺得是好事。

因為這代表作者很清楚一個 on-call 常識：

```text
PID 會被重用。
```

如果你把 PID 當成永久身份，你遲早會在某個夜晚取消到「另一個剛好拿到同 PID 的工作」。

cookie 的存在就是在把「這個 worker」變成真的 identity，而不是「碰巧拿到這個 PID 的誰」。

## Detach 不是 cancel（而且我很高興有人寫下來）

很多 async 工具最討厭的地方，是把不同意圖揉成一坨。

pg_background 至少把語意切清楚：

- **wait**：我在乎結果，我願意 block
- **cancel**：我想讓它停
- **detach**：我讓它繼續跑，我只是先不從「這個 session」追了

Detach 其實很合理：例如你啟一個 backfill，讓它跑，之後再查。

但如果你的團隊把 detach 當 cancel，你就會得到一種很陰險的事故：工作根本沒停，只是你以為停了。

所以如果你要用它，我建議把「detach ≠ cancel」當成必教的語意（像你教 isolation level 一樣）。

## 你不能忽略的營運規則：background workers 是容量

Postgres 的 background worker 不是免費資源。

它會吃 worker slots，也會跟其他需要 worker 的東西競爭。

所以負責任的姿勢應該是：

- 把 worker capacity 當成一個 **budget**
- 對最大併發有 **guardrail**
- 有 **timeout**，避免「它會跑完」變成「它跑到下週」

如果 extension 提供 per-session 上限、預設 timeout 這種 knob，我會說：那才是能上線的 async。

## 我會用在哪、我不會用在哪

我會考慮用在：

- 重但封閉的 maintenance SQL（例如某些 VACUUM / ANALYZE / REINDEX 形式）
- 可以自然用 SQL 表達的 backfill / repair
- 你真的要把 side effect 切成 autonomous transaction 的情境

我不會拿它當：

- 萬用 workflow engine
- 不設計 idempotency 的藉口
- 需要 durability 時的 queue 替代品

## 結論

如果你跟我一樣對「再加一個 worker fleet」有點過敏，pg_background 是一種少見比較能營運的 async：

- async 邊界留在 Postgres
- 語意清楚（你要等、要取消、要先放著）
- identity/handle 往 production-safe 的方向走
- 容量是第一級問題

它不會幫你把架構變好。

但它可以讓你少發明一些你其實不想維護的 distributed systems。

---

## References

- [原始文章：pg_background 的設計與為什麼 Postgres-native async 有時比另一套 job system 更 sane](https://vibhorkumar.wordpress.com/2026/02/16/pg_background-make-postgres-do-the-long-work-while-your-session-stays-light/)
