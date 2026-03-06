---
layout: post
title: "Async 其實不神：就是在 function 中間硬塞一段『時間』"
date: 2026-03-06 14:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Async = 把時間塞進同一個 function call 裡](/img/posts/2026-03-06-async-inject-time-01.webp)

我一直覺得 `async/await` 很像一種「大家都會用，但很少人真的能講清楚」的工程師默契。

最近看到一個說法，乾脆到有點刺人：

**Async 就是「把時間注入（inject）到 function 裡」。**

同一個 function 跑到一半，硬插一段時間進來，過一陣子它再接著跑，表面看起來像從沒離開過。

你把這句話放進腦袋後，很多 async 的怪感會突然變得…很普通，普通到你終於能 debug。

## 先承認一件事：一般的 function call 本來就很怪

我們平常看 function signature 都像在看數學函數：

```text
foo(x) -> y
```

但 CPU 的世界不是這樣。

- 呼叫 function：跳到一個固定位置
- return：跳回一個「動態位置」（也就是呼叫點）

你可以把它想成 caller 其實偷偷塞了一個隱形參數：「回來要回到這裡」。

所以 function 本來就是一個很成功的控制流抽象。

Async 只是再多加一招：

- 不只可以 return 一個值
- 也可以 return「晚一點」

## 「塞時間」其實就是：把繼續執行的位置包起來

每次你 `await` 一下，runtime 必須記住：
- 你現在跑到哪一行
- local variables 長什麼樣
- 你在等什麼 I/O / future / promise

然後等條件滿足，再把你丟回去接著跑。

這包「我之後要回到這裡繼續」的東西，在 PL（程式語言）圈裡有個名字：continuation。

這也解釋了為什麼 async stack trace 常常讓人不爽：
- 你的腦袋預設是「一條 call stack = 一條時間線」
- 但 async 的世界是「很多段 stack 被時間縫起來」

你如果一直把 async 當成「看不見的 threads」，遲早會在半夜被自己寫的程式教育。

## Exceptions、generators、async 其實是表兄弟

我喜歡那篇文章的其中一個原因是：它逼你承認「function 只是抽象」，然後你就會看到同一個模式反覆出現。

- **exceptions**：不是回到 return site，而是直接跳到 handler
- **generators**：在 `yield` 暫停，之後再 resume
- **async/await**：在 `await` 暫停，之後再 resume

表面語法不同，本質都是：**控制流不再是一條直線**。

這也是為什麼聊 async 常常會扯到 effects / effect systems。

我自己的翻譯很工程師：

> 你能不能用更結構化、甚至可被 type system 管到的方式，描述「這個 function 會跳」「這個 function 會暫停」？

因為我們現在靠的很多是社交規則：

- 「async 裡面不要 blocking」
- 「不要把 exception 吞掉」
- 「UI thread 不要做這件事」

規則能撐一陣子，但當系統一大、團隊一多人一換，這些規則就變成事故的前奏。

## 為什麼這不是學術嘴砲：在 production 會直接撞到

真正痛的是這三件事：

1) **Cancellation（取消）**

取消基本上是「第二條控制流通道」。
如果 runtime 把它當成一個 side flag，你會得到很多看起來對、其實不對的 code。

2) **資源安全**

你以為你寫的是：

```text
open -> do work -> close
```

但 async 會變成：

```text
open -> do work ->（時間塞在這裡）-> close
```

如果你的 close 是靠 `defer` / `finally` 這種語意保證，這時候你會很想要語言跟 runtime 幫你背書。

3) **可觀測性（observability）**

Tracing 要跨 `await` boundary，其實就是承認：

> 我的執行不再是一條連續的 stack 了

好的 tracing 會把故事補回來。
爛的 tracing 會讓一切看起來像「一堆隨機 callback」。

## 我的結論

我沒有突然變成 PL 理論派，但這個「inject time」的說法讓 async 變得可理解很多：

- async 不是平行運算
- async 也不是「更便宜的 threads」
- async 是 **一種允許暫停、然後在未來某個時間點續跑的控制流抽象**

你把它當成控制流問題來想，就能像處理 exceptions 一樣問自己：

- 控制流可能跳去哪？
- 什麼狀態會被保留？
- resume 回來後，哪些 invariants 必須仍然成立？

這差別很現實：
不是「能跑就好」，而是「這個 service 我能維持兩年不崩」。

---

**References:**
- [Will Richardson：〈Async Programming Is Just @Inject Time〉（這篇讓我改用這個角度看 async）](https://willhbr.net/2026/03/02/async-inject-and-effects/)
- [Wikipedia：Continuation（把『稍後回來繼續』這件事命名）](https://en.wikipedia.org/wiki/Continuation)
- [Koka 語言首頁（effects 為核心的一個代表例）](https://koka-lang.github.io/)
