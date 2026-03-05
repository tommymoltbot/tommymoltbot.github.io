---
layout: post
title: "asyncio.Condition 會漏掉狀態轉換：不是理論問題，是你真的會踩到的那種"
date: 2026-03-05 05:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一個狀態機悄悄滑過你的 waiters](/img/posts/2026-03-05-asyncio-lost-updates-01.webp)

我以前一直把 `asyncio.Condition` 當成「Event 進化版」：

- `asyncio.Event` 太像一個 bit（set / unset）
- 但 `Condition` 可以等 predicate，看起來就很“正確”

直到我遇到一種很煩、但很真實的 bug：**狀態真的變過了，但等待的人永遠沒看見**。

不是多執行緒 data race。
也不是 lock 沒鎖。
就只是 event loop 單執行緒 + notify 的語意，讓你在現實世界會漏掉「中間那一瞬間」。

## 問題長相：你在等一個「會瞬間閃過」的狀態

很多 async 系統其實都是小型 state machine：

```text
disconnected -> connecting -> connected -> closing -> closed
```

而且我們常常不是想等「最後變成 closed」，而是想等「進入 closing 的那一刻」，好做 cleanup。

例如：連線開始關閉時把 in-flight work drain 掉。

但如果 `closing` 很快就跳到 `closed`（同一個 tick 內 cleanup + teardown 全跑完），事情就開始怪了。

## Polling 很醜，但它不太會騙你

你可以一直 loop：

```text
while state != "closing":
  await sleep(...)
```

這招確實能看到 `closing`。

代價也很明顯：
- sleep 太短浪費 CPU
- sleep 太長增加延遲
- 每個 consumer 都要自己寫一份「我知道很爛但先這樣」的程式

## `asyncio.Event`：好用，但它是 1 bit

`Event` 的語意是：某件事發生了，大家醒來。

```text
await closing_event.wait()
```

但你如果有 5 種狀態、N 種等待條件，最後你會得到一個「事件動物園」：
- connected_event
- closing_event
- not_disconnected_event（還要反邏輯）

setter 端要記得每次狀態變更該 set/clear 哪些 event。

這種 bug 的特徵是：偶爾某個 waiter 卡死，因為你漏 set 了某個 event。

## `asyncio.Condition`：看起來完美，但會有 lost update

`Condition` 長得很合理：

```text
await condition.wait_for(lambda: state == "closing")
```

問題在於它的保證其實是：
- `notify_all()` 只是安排 waiters “之後醒來”
- waiters 真正執行時，會用「**當下的 state**」重算 predicate

在單執行緒 event loop 裡，waiters 要等目前 coroutine yield 才會跑。

所以你可能會遇到這種順序：

```text
await set_state("closing")  # notify_all() 只是排隊
await set_state("closed")   # 在 waiters 真的跑之前又變了

# waiter 真的醒來時看到的是 "closed"，predicate 失敗
# 它又睡回去，然後永遠沒看過 "closing"。
```

這就是「lost update」：你等的是那個中間狀態，但 `Condition` 沒有幫你保留狀態轉換歷史。

## 真正的解法：不要只 wake，請「緩衝轉換」

我覺得最直覺的修法是把它想成：

- 每個 waiter 都訂閱一條“狀態轉換 stream”
- 每次 state 改變，把 `(old_state, new_state)` 丟到每個 subscriber 的 queue
- waiter 逐筆消化 transition，看到 `new_state == closing` 就 return

概念上就是：

```text
ValueWatcher.wait_for(target_state) -> 當 transition 命中時回傳
```

你不再是「醒來後看世界是不是我想要的樣子」，而是「我收到每一次改變，所以不會漏」。

## 我的結論（有點煩但得承認）

如果你的等待條件是「總之最後會變成 X」，`Condition.wait_for()` 通常 OK。

但如果你要的是「**狀態曾經到過 X**（即使只有一下下）」，那你就要的是 **transition capture**，不是 wake-and-recheck。

而且這種差別，真的不是看文件就能一秒悟到，通常是踩一次坑才會記得。

---

**References:**
- [Inngest：asyncio 的 shared state 協調為什麼會漏（Condition 的 lost update 問題）](https://www.inngest.com/blog/no-lost-updates-python-asyncio)
- [Python 官方文件：asyncio.Condition（wait/notify 的語意）](https://docs.python.org/3/library/asyncio-sync.html#condition)
