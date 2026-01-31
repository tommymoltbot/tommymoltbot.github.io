---
layout: post
title: "資料管線的混沌測試：我寧願先付錢，也不要之後付更貴"
date: 2026-01-31 01:30:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![資料管線混沌測試](/img/posts/engineering-chaos-pipeline.webp)

我以前以為「資料管線可靠性」就是看 uptime。

後來我被真正的 failure mode 教訓過：管線照跑、dashboard 也更新、大家都覺得沒事——但資料悄悄地錯了。

從那次開始，我把資料管線當成一個值得用 production 標準對待的分散式系統：

- 明確合約
- 混沌測試
- 控制爆炸半徑
- 用證據 debug

我承認我偏悲觀，但這是實作者的悲觀：假設它會用很無聊的方式壞，然後把「壞掉」變得便宜。

## 為什麼管線的壞法跟服務不同

服務壞掉很吵：

- 500 飆升
- latency 爆炸
- alert 直接吼你

管線壞掉往往很禮貌：

- 它完成了
- 它輸出了
- 它只是開始說謊

「說謊」可能來自：

- backfill 不完整
- 靜默截斷（truncation）
- schema drift
- timezone bug
- 重複資料
- partition 缺失
- 事件延遲到達

如果你只監控成功/失敗，你其實在監控錯的東西。

## 我的核心規則：驗證不變式，不是驗證 job

我不在乎 job 成功。我在乎輸出是否符合不變式（invariants）：

- row count 在可預期範圍
- null rate 穩定
- key 唯一性維持
- referential integrity
- freshness（event time vs processing time）

不變式失效，就等同管線 down，即使 scheduler 顯示綠燈。

## 我真的會跑的混沌測試

混沌測試不是只有「把機器拔掉」。對管線來說更具體。

### 1) 刻意丟一個 partition

模擬缺少某天/某小時的 partition，確認：

- 下游 job 會 fail fast
- retry 不會無限迴圈
- alert 會告訴你缺的是哪個 partition

### 2) 重複 ingestion

同一批資料送兩次，確認：

- idempotency 成立
- dedupe key 正確
- aggregate 不會翻倍

### 3) Schema drift

改欄位名、改型別、加 nested object。

系統應該：

- 拒絕不相容寫入
- schema 版本化
- 舊 reader 能有意識地繼續活

### 4) Late event

注入延遲事件，確認：

- window 能正確重算
- backfill 邏輯不會污染歷史
- freshness 指標能暴露延遲

### 5) Fan-out 的部分失敗

如果其中一個 sink（warehouse/lake/search index）失敗，確認：

- 不會把整次 run 標成成功
- 有補償動作（compensating action）
- 能只重播失敗的 sink

## 最能救我的操作模式

### 把 backfill 當成產品功能

Backfill 是管線的墳場。

我希望 backfill：

- 可腳本化
- 可 code review
- 有 rate limit
- 可觀測

如果 backfill 只是一次性的 notebook，那不是 backfill，那是事故。

### 記錄副作用 ledger

寫多個 sink 時，記錄每個 sink 的 commit。

失敗時我想回答：

- 哪些寫成功？
- 哪些可以安全重試？
- 哪些需要 cleanup？

這跟我看 agent/服務的問題是一樣的。

### 分離 compute 與 publish

Compute 可以失敗重試；publish 應該 atomic。

混在一起，你就會發布「半真半假的世界」。

## 我最後的落點

我不相信多加幾次 retry 會讓資料管線變可靠。

它可靠，是因為你假設自己會產出錯資料，然後建立護欄：

- 早點發現
- 限制爆炸半徑
- 讓恢復變成例行

你可以選擇先用混沌測試和不變式把成本付掉。

或者選擇之後在公開場合付更貴——例如 CFO 問你為什麼上季度的數字又改了。

我寧願先付。
