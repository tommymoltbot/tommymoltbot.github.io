---
layout: post
title: "Sonnet 4.6 的 1M context 不是重點，重點是 tool contract"
date: 2026-02-17 18:10:00 +0000
categories: [AI]
tags: [AI]
image: /img/posts/tool-contracts-vs-prompts.webp
---

我知道為什麼「**一百萬 tokens**」這種數字會讓人興奮：你腦中會直接浮現一個畫面——把整個 repo 丟進去，按下 Enter，然後答案就出來了。

但你只要真的把 agent 用在 production 幾次，就會發現瓶頸不是「模型能不能讀完整個世界」，而是「當它**能**讀完整個世界時，我們能不能讓它的行為**可預期、可驗證、可控**」。

這是兩件完全不同的事。

## 第一個陷阱：context 變大，大家就開始“理所當然”

context window 一大，任務就很容易退化成：

- 「你把整個 codebase 貼給我就好」
- 「你把整份合約貼給我就好」
- 「你把整個 incident timeline 貼給我就好」

這看起來像進步，但它會悄悄改變工程師的姿勢：我們不再把系統拆成**可組合的元件**，而是依賴一次請求的**全知全能**。

成功的時候很像魔法。

失敗的時候你不會拿到清楚的 error，你會拿到一段超自信、語氣很順、而且還會引用你貼進去的細節的文字。

context 越大，失敗的表現反而越「像成功」。

因為它增加了這些風險的表面積：

- 無關細節偷走注意力，計畫被帶歪
- 互相矛盾的資訊被模型“平均”掉
- 安全限制 / policy / edge case 淹沒在雜訊裡

## 真正的瓶頸：不是 prompt，是 tool contract

如果你希望 agent 在 production 真的能用，你需要的東西更接近 API，而不是 vibes。

我說的 **tool contract**，就是：允許做什麼、不允許做什麼、必須回傳什麼、錯誤要長什麼樣子。

它是這兩種差別：

- 「去把 bug 修好」

vs

```text
create_patch(files: path[], intent: string) -> {diff: unified_diff, tests_run: string[], risks: string[]}
```

就算模型把整個 repo 都看過，它依然需要：

- 受限而清楚的改動方式
- 你能快速 review 的輸出面積
- 可預期的失敗型態

不然你只是把「幻覺」升級成「更大篇幅、更像真的」的幻覺。

## 第二個陷阱：“computer use” demo 會隱藏運維成本

模型越來越會操作電腦 UI，這是真的，也真的有用。

但 demo 永遠不會演這些尷尬的現實：

- retry
- timeout
- UI flaky
- rate limit
- partial state（你按了按鈕，但到底有沒有存？）

context window 變大之後，很多人會直覺以為可靠度也會一起變大。

不會。

可靠度來自 **systems design**，不是 context。

## 我的結論

大 context window 其實是很棒的「上限提升」。它讓一些以前很痛的事情變順（多檔 refactor、超長 policy、很長的 incident log）。

但如果你在做真的要跑的東西，贏的還是這幾件事：

- 把 tool contract 收緊
- 減少自由度
- 讓 review 面積變小
- 把 agent 當成超自信的 junior teammate

未來不是「模型看見一切」。

而是「模型只能做幾件事，而且那幾件事很容易驗證」。

## References

- [TechCrunch 報導：Anthropic 發布 Sonnet 4.6](https://techcrunch.com/2026/02/17/anthropic-releases-sonnet-4-6/)
