---
layout: post
title: "如果 AI 開始寫世界的程式碼，驗證就變成你的工作"
date: 2026-03-03 18:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Leo de Moura（原文作者）的照片 —— 提醒你：難的從來不是寫，而是「怎麼確定它是對的」](/img/posts/2026-03-03-ai-verification-gap-01.webp)

軟體圈現在有個很奇妙的轉折：**寫程式**正在變便宜。

但 **相信程式** 這件事，還是很貴。

我剛看完 Leo de Moura 寫的那篇「當 AI 開始重寫世界的軟體，誰來驗證？」老實說有點被戳到。

因為 vibe coding 最可怕的失敗模式，根本不是「AI 會寫爛 code」。
而是「AI 會寫出**看起來很像對的** code，然後人類開始不看 diff。」

## 1) “Accept All” 不是流程，是負債
當 AI 產出的 code 有 80–90% 都能用，你就會不自覺把它當成 99.9% 都能用。

差那一點點，在 production 會變成差超多。

一旦大家習慣「我不看 diff 了」，你失去的不只是正確性，還有**理解**。
而沒有理解的系統，最後只剩下運氣在撐。

## 2) 測試能 scale，但它不等於 cover
我不是反測試派。我超愛測試、fuzzing、property-based testing。

但有些 bug，測試跑綠了也不太讓人安心：
- side channel（timing、cache access pattern）
- concurrency interleaving
- 「抽樣到的 input 都對，但你沒抽到的地方全錯」

一句話版本是這樣：

```text
passing_tests(program) != correctness(program)
```

更不舒服的是：AI 會對你給的「正確性 proxy」過度擬合。

如果你唯一的評分標準是「CI 綠燈」，那你最後就會得到一個很會產生 CI 綠燈的系統。

## 3) 形式化驗證（formal verification）看起來才像真正的對手
文章核心的意思我覺得滿直白：AI 能大量生產程式碼，那驗證也要能大量 scale。
而能 scale 的驗證，大概就得靠「小而可信的 proof checker（kernel）」來 mechanically check。

我不會裝懂說 formal methods 突然就變簡單了。沒有。
很多團隊連 API 行為的規格都講不清楚，更別說證明。

但這個解法的形狀很對：
- 核心很小、可審計（checker）
- AI 去做大量的工作（寫 code + 找 proof）
- 用機械化檢查把信任從「感覺」拉回「可驗證」

心態轉換也很硬：你不再是「交付 code」，你是「交付 claim」。

```text
spec + implementation + proof  ->  shippable_artifact
```

## 4) 規格（spec）會變成新的工程槓桿
當 implementation 變便宜，稀缺能力會往上移：
- 你到底要系統做什麼？
- 哪些 invariant 必須永遠成立？
- 面對惡意 input，「正確」到底定義成什麼？

這其實不是新想法。
只是以前你可以用「很會寫」來掩蓋「想得不清楚」。

AI 把這個藉口拿走了。

我猜接下來會有一個分岔：
- 把 spec 當成真正 artifact 的團隊，會越來越強
- 把 prompt 當 spec 的團隊，會被 workslop 淹死

## 5) 近期不會 verified-by-default，但會出現一堆「驗證孤島」
我比較保守的預測：我們不會把所有東西都拿去證明。

但一些「一個 bug 就能炸掉整個世界」的地方，會開始被集中驗證：
- 密碼學 library
- compiler / interpreter
- 核心基礎建設（身份、權限、支付）
- kernel / hypervisor

這樣就夠了。

因為真正的系統性風險，不是 AI 把一般 CRUD app 變得更爛一點。
而是 AI 開始以人類 review 跟不上的速度去碰底層基礎，而我們還假裝舊的儀式能 scale。

你想用 AI 的速度 shipping，就得接受「done」的定義要換。

---

**References:**
- [Leo de Moura 原文：當 AI 寫世界的軟體時，誰來驗證？](https://leodemoura.github.io/blog/2026/02/28/when-ai-writes-the-worlds-software.html)
- [Anthropic 工程文章：用平行 agents 做出能 boot Linux 的 C compiler](https://www.anthropic.com/engineering/building-c-compiler)
- [Andrej Karpathy 談 “Accept All” 的開發習慣（X 貼文）](https://x.com/karpathy/status/1886192184808149383)
- [Heartbleed 背景與影響整理（Wikipedia）](https://en.wikipedia.org/wiki/Heartbleed)
- [Veracode 報告：AI 生成程式碼的安全性現況](https://www.veracode.com/blog/genai-code-security-report/)
