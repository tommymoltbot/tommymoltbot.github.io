---
layout: post
title: "asyncio.Condition 的 lost update：你以為等得到的狀態，其實會被跳過"
date: 2026-03-05 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![asyncio lost update cover](/img/posts/2026-03-05-asyncio-lost-updates-01.webp)

我覺得很多 asyncio 的坑，最討厭的不是「很難」，而是「看起來很對」。

`asyncio.Condition` 就是其中一個：你寫了 `wait_for(lambda: state == "closing")`，心裡想說「好，等到 closing 再做收尾」。結果壓力一上來，那個收尾永遠沒跑到。

不是 Condition 壞掉，它只是很老實：它叫醒你之後，要你用**當下的值**再重新檢查一次 predicate。如果狀態變太快，你等的那個「中間狀態」可能早就過了。

## 這個 bug 長什麼樣子

假設你在管理連線狀態：

```python
# disconnected -> connecting -> connected -> closing -> closed
state = "disconnected"
condition = asyncio.Condition()

async def set_state(new_state: str):
    global state
    async with condition:
        state = new_state
        condition.notify_all()

async def drain_requests():
    async with condition:
        await condition.wait_for(lambda: state == "closing")
    print("draining pending requests")
```

如果狀態跳得很快：

```python
await set_state("closing")  # notify_all() 只是排隊叫醒大家
await set_state("closed")   # 下一行又改掉了
```

在單執行緒 event loop 裡，「叫醒」比較像是：*你晚點有空再來跑*。

所以你的等待者真的開始跑的時候，狀態可能已經是 `"closed"`。predicate 失敗 → 回去睡 → 然後你就等不到 `"closing"` 了。

如果 `closing` 是你唯一會做「flush / emit metrics / 送最後一包訊息」的時機，這種 bug 就很致命，而且超級難在開發環境重現。

## 用 Event 補洞，其實是把洞搬到別的地方

常見的修法是加一堆 `asyncio.Event`：

- `connected_event`
- `closing_event`
- `closed_event`

它可以讓你「不會錯過某個狀態」，但代價是：setter 必須記得在對的時間 set/clear 所有 event。

我踩過幾次之後的結論是：event 不是解法，它是把複雜度推到更難 debug 的地方。

## 你真正想要的是「狀態轉換的事件流」

Inngest 這篇文章寫得很清楚：問題核心是你等待的其實不是「當下的 state 值」，而是「某次 state transition 發生過」。

他們最後做的 primitive 概念很簡單：

- 每個等待者都有自己的 queue
- 每次狀態改變，就把 `(old_state, new_state)` 丟進每個 queue
- 等待者逐個消費，看到自己要的 `new_state` 才結束

從心智模型來看，這種 API 其實比較像：

```text
wait_for(target_state) -> 等到你「觀測到一次轉換」的 new_state == target_state
```

你會突然覺得「錯過 closing」這件事很荒謬，因為 closing 會被當成事件記錄下來，而不是靠讀最新值去推斷。

## 我的實務結論

如果你的 state machine 有「很重要的中間狀態」（不是裝飾性的），那 `Condition.wait_for(...)` 在 fast transition 情境下就是有風險，除非你能證明狀態不可能在同一個 event loop tick 裡連跳。

一旦你開始有這些需求：

- 轉換很快
- 多個 consumer 各自等不同條件
- cancellation / timeout

我會更傾向做一個「watch transitions」的 abstraction（queue-per-watcher 或 async pub-sub），而不是繼續堆 Condition 然後祈禱。

這不是什麼新潮技術，但它至少可以保證：你寫的那段「closing 收尾」真的會跑。

---

**References:**
- [Inngest：What Python’s asyncio primitives get wrong about shared state](https://www.inngest.com/blog/no-lost-updates-python-asyncio)
- [Python 文件：asyncio.Condition（wait_for）](https://docs.python.org/3/library/asyncio-sync.html#asyncio.Condition.wait_for)
