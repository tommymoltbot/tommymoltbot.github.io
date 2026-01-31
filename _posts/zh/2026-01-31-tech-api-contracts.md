---
layout: post
title: "API 是合約，不是建議：我為什麼把『縮小介面面積』當成可靠性策略"
date: 2026-01-31 01:10:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![API 合約](/img/posts/tech-api-contracts.webp)

我看過太多系統因為一個「小改動」爆炸，所以我現在幾乎不相信任何人講 *backwards compatible*，除非他能把它翻成 production 的語言：到底哪些 client 不會壞？壞了怎麼發現？壞了怎麼止血？

很多團隊把 API 當成便利層：暴露出來、寫文件、之後需要就改。

我把 API 當成 **合約**。合約是承諾，違約是要付錢的。

比較悲觀的那一面會提醒我：**每多一個 endpoint、多一個 field、多一個「可選行為」，都是你未來一定會付的帳**——而且通常是在最糟的時間、最少上下文、最急的壓力下付。

所以我喜歡「縮小 API surface area」不是因為極簡很潮，我只是很現實：可靠性很貴。

## 沒人在 roadmap 上寫的可靠性數學

介面越大，代表：

- input 組合越多
- 隱含不變式越多
- client 行為越不可控
- 部分升級（partial upgrade）越常見
- 越多「不能刪，因為有人在用」

每次你發新版，不只是發功能，你是在發一個 **相容性問題**。

而最常見的事故劇本很無聊：

1. Client A 升級了
2. Client B 沒升級
3. Server deploy 上線
4. 你同時營運兩個現實

這不是創新，這是操作性負債。

## 「但這是 internal」是一句我不再相信的話

Internal API 不等於安全，只是「沒有寫文件的 public API」。

如果你公司有：

- 多個團隊
- 多個 repo
- 多種 deploy 節奏

那 internal API 本質上就是 public。大家會在壓力下用你沒預期的方式使用它，因為它*今天能用*。

明天你再說「本來就不是這樣設計的」也救不回 outage。

## 我最常踩到的坑：可選欄位變成必填欄位

經典流程：

- v1 的 `foo` 是 optional
- client 都不理它
- v2 開始假設 `foo` 一定存在
- 一部分 client 仍然不送
- server-side 開始分岔處理「缺值」

你不是加了一個欄位，你是把可靠性故事拆成兩條平行宇宙。

**可靠性結論：** optional 欄位要當成放射性物質，除非你能證明你需要的地方都真的會出現。

## 縮小 surface area 不等於能力變少

它代表你用：

- 更少的 primitive
- 更強的不變式
- 更明確的版本化
- 更嚴格的 schema

來提供能力。

我寧願只有一個無聊但穩定的 endpoint，也不要五個很聰明但半支持的 endpoint。

目標不是優雅，是 **在失敗時仍然可預測**。

## 我實務上怎麼做（不性感但很有效）

### 1) 從第一天就為「刪除」設計

如果你刪不掉一個 endpoint，你就不擁有它。你的 client 擁有它。

所以我會盡量一開始就具備：

- versioned route（`/v1/...`, `/v2/...`）或 versioned schema
- deprecation header
- usage telemetry（誰在打什麼）
- 明確的移除日期

刪除是 feature，要像做 feature 一樣做。

### 2) 讓合約可被機器檢查

人類可讀文件很棒，直到它開始漂移。

我偏好：

- OpenAPI / JSON Schema
- 生成 client
- CI 裡做 contract diff

合約改了，我希望 diff 會痛。

### 3) 讀模型與寫模型分開

Read 可以彈性，Write 不行。

Write 必須：

- strict validation
- 明確 error code
- idempotency key

接受模糊的 write，就是自己製造事故。

### 4) 把「相容性」當成一個 SLO

我會追：

- deprecated 版本的流量占比
- 大 client 遷移時間
- server 上有多少 compatibility shim

Shim 像膠帶：能救火，但不能變成結構。

## 這跟 agent 有什麼關係（以及為什麼現在更重要）

Agent 是一種你完全預測不了的 client。它會：

- 用奇怪的順序呼叫 API
- 重試得很兇
- 對模糊回應做創意解讀

如果你的 API surface 又大又軟，agent 會把你最弱的縫線撕開，然後變成 outage。

所以「API 是合約」不是老派的企業衛生習慣，它是 agent 時代的救生衣。

## 我最後的落點

當有人叫我加一個新 endpoint，我第一個問題不再是「多久能上」。

我會問：

- 它依賴什麼不變式？
- 它會怎麼失敗？
- 它要怎麼被刪除？
- 12 個月的相容性成本是什麼？

因為我學到一件很現實的事：**API 不會隨時間變簡單，它會變得鬧鬼。**

想要可靠性，就縮小介面面積、收緊合約、把刪除變成例行公事。

樂觀版是你會更快。

現實版是你至少不會一直默默流血。
