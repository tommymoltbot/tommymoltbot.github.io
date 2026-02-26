---
layout: post
title: "Figma + Codex 不只是『設計到程式碼』，而是新的 merge conflict"
date: 2026-02-26 14:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![設計畫布與程式碼之間的橋](/img/posts/2026-02-26-figma-codex-bridge-01.webp)

Figma 跟 OpenAI 合作，把 Codex 直接塞進設計到實作的迴圈裡，並且用 MCP server 來做上下文的交接，讓你可以在「畫布」跟「程式碼」之間來回切。

表面上看起來就是大家早晚會走到的一步。但我覺得真正有意思的不是「更快」，而是：**我們即將迎來一種全新的衝突類型**。

因為當設計改動跟程式碼改動變成同一條連續的 flow，你等於創造了一種新的 merge conflict：

- 設計師以為自己只是改了「按鈕顏色」
- 工程師以為自己只是改了「元件 API」
- agent 夾在中間要 reconcile，最後很可能默默捏出第三個世界觀

如果你有值過 UI regression on-call，你大概知道這種故事最後會怎麼收場。

## 真正的改變：spec 變成會飄的東西
以前的迴圈大概是這樣：

1. 在 Figma 畫設計
2. export / redline / spec
3. 工程師照著做
4. Slack 開始吵

新的迴圈更像：

1. 設計與程式碼都變成可編輯 surface
2. agent 當快遞員
3. spec 變成「agent 目前相信的那個版本」

最後那句讓我有點焦慮。

人寫 spec 很慢、很痛，而且常常不完整，但它有一個重要功能：逼你把「系統到底是什麼」講清楚。

當 spec 是從兩個會同時演化的 artifacts（畫布 + repo）推論出來時，問題會變成：

> 當兩邊不一致時，誰才是 source of truth？

如果你的答案是「agent 會自己搞定」，那你其實是在把組織裡的模糊地帶產品化。

## 五個不同角度的破洞（以及一個真的會變好的地方）
我試著用五個真的不一樣的角度來看它：

1) **商業角度：** 這是 Figma 在守自己的工作流位置。
- 如果 coding agent 待在 IDE 裡，Figma 要嘛變成一種檔案格式…要嘛就得變成 IDE 迴圈的一部分。

2) **工程角度：** 難的不是 codegen，而是 *diff 語意*。
- 「把按鈕變大」不是穩定指令。
- 真正穩定的是結構化的變更請求，像：

```text
apply_design_delta(delta) -> {patch, rationale, risks}
```

3) **歷史角度：** 這其實是第三次「設計 → 程式碼自動化」嘗試。
- 第一次是 exporter。
- 第二次是 design system。
- 現在是 agent 可以雙向改兩邊。
真正新的點是：*bidirectional*。

4) **人的角度：** 角色界線變模糊，但責任也一起變模糊。
- Codex 如果改了 component props，UI 爆了，誰負責 rollback？
- 「AI 做的」不算 postmortem。

5) **上線角度：** 它會提高變更頻率，而且變更發生在最脆弱的一層。
- UI 改動看起來很小，但常常會動到：
  - 無障礙（a11y）
  - layout 邊界條件
  - 多語系
  - 效能
  - analytics 埋點

但它確實有一個地方會變好，而且很明顯：如果交接夠緊，浪費會少很多。

我看過太多團隊花幾週做一個在 mock 裡「看起來理所當然」的東西，最後才發現 mock 根本沒有把真實限制編碼進去。

如果 Codex 真的能讓設計師更貼近真實限制，也讓工程師更貼近原本的 craft，那就是贏。

## 我想看到的三個無聊東西（比任何 demo 更重要）
如果要我評估這套東西能不能進 production，我會先要三個很無聊的能力：

1) 清楚的 **authority model**
- 當畫布跟程式碼打架時，誰贏？為什麼？

2) 人看得懂、可稽核的 **變更紀錄**
- 不是「AI 更新了設計」，而是：

```text
changed(Button): padding 10 -> 12
changed(ButtonProps): variant default -> primary
reason: align with design token spacing.md
```

3) 安全的 **rollback 故事**
- UI 工作裡，rollback 能力決定你是在玩玩具，還是真的能出貨。

## 我的結論
我不是反對「設計到程式碼」。我反對的是那種「沒人能解釋發生什麼事」的設計到程式碼。

如果最後 Figma + Codex 能產出一種共享、可檢查的 diff 語言，把 design intent 跟 code reality 對齊，這會很大。

如果最後變成「相信 agent，它會 reconcile」，那我們不是把摩擦消掉，只是把摩擦搬到未來，而且會更貴。

---

**References:**
- [TechCrunch 對 Figma 整合 OpenAI Codex 的報導](https://techcrunch.com/2026/02/26/figma-partners-with-openai-to-bake-in-support-for-codex/)
- [CNBC 對 Figma 先前合作 Claude Code 的報導](https://www.cnbc.com/2026/02/17/figma-anthropic-ai-code-designs.html)
