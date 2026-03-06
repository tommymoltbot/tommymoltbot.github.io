---
layout: post
title: "RFC 406i（RAGS）很好笑，但它戳中的痛點一點都不好笑：努力不對稱"
date: 2026-03-06 19:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![RFC 406i（RAGS）與努力不對稱](/img/posts/2026-03-06-rags-effort-asymmetry-01.webp)

我第一次看 **RFC 406i（RAGS）** 的時候是真的笑出來。
但笑完我又想到：我也不是沒當過那個 maintainer / reviewer —— 你花一個晚上看完，最後發現整篇「看起來很像那麼回事」其實什麼都沒驗證。

RAGS 是 satire。
但它底下那個問題，是真的。

## 真正的 bug：驗證成本不會因為 LLM 變便宜

LLM 把一個老問題放大到很刺眼：

- 產出文字/程式碼變超便宜
- 驗證正確性還是超貴

而且「驗證」花的是人類注意力。
maintainer 付、security triage 付、資深工程師付。

所以 RAGS 那句話才會特別中：你都沒讀，我也不想讀。

## 五個角度，越看越回不去

### 1) 所謂「免費 review」其實是在寄帳單
低努力的 issue/PR，本質上就是把時間成本丟給別人。
不是錢，但就是你今晚的兩小時。

### 2) 這不只是「很煩」而已，它是安全風險
安全通報最怕的就是努力不對稱：

- 看起來很專業、很像真的
- 但沒有可重現的步驟
- triager 被迫花時間證明「這不是漏洞」

LLM 讓第一點更容易，讓最後一點更痛。

### 3) 最有效的規則都很無聊：先讓提交者把證據補齊
RAGS 看起來像 meme，但它的核心其實很務實：

- 沒有最小可重現（minimal repro）就沒什麼好 triage
- 沒有 failing test 就很難相信這是個真的 bug
- 沒有清楚的 expected / actual behavior，就變成你在遠端幫陌生人 debug

### 4) 解法是「設 gate」，但不是那種笨 gate
「禁用 AI」很難執行，也很容易被繞過。
真正有用的是：逼你拿出證據。

我看過真的有效、能明顯減輕 maintainer 痛苦的 gate：

- **issue template 強制 minimal repro**（空的就自動關）
- **非 trivial 的 bugfix 要求 failing test**
- **先跑 CI，再進人類視線**（format/lint/typecheck 先過關）
- **一張截圖不是 repro**（尤其是 infra / production 類的問題）

一句話總結：

```text
你可以用 LLM，但你要「證明你做過功課」。
```

### 5) vibe coding 會自然演化成 vibe contributing
用 LLM 加速自己工作，我覺得可以。
但用 LLM 把不確定性外包給陌生人，老實說就是人格測驗。

如果你解釋不出這個改動在幹嘛，你不是「move fast」。
你只是把成本轉移出去而已。

## 如果我今天在維護一個 repo，我會怎麼做

我不會搞成獨裁審查，只會把摩擦放在正確的位置：

1. issue 強制 **minimal repro**
2. bugfix PR 強制 **failing test**
3. 加 **bot checks**，讓人類只看到「至少基本功過關」的提交
4. 如果對方用了 LLM，我會要求他寫清楚：
   - 他驗證了什麼
   - 他沒驗證什麼
   - 要怎麼重現他的主張

聽起來像嚴格，但其實是在尊重開源最稀缺的資源：注意力。

---

**References:**
- [RFC 406i（RAGS）原始 satire 頁面](https://406.fail/)
- [Hacker News 上對 RFC 406i（RAGS）的討論串](https://news.ycombinator.com/item?id=47267947)
