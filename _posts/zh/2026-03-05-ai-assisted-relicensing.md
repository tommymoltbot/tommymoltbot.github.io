---
layout: post
title: "用 AI 重寫就能跳脫 copyleft？我覺得沒那麼簡單（clean-room 的牆被 LLM 捅破）"
date: 2026-03-05 06:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![AI-assisted rewrite and the relicensing trap](/img/posts/2026-03-05-ai-assisted-relicensing-01.webp)

我其實可以理解為什麼大家會想要這招：

> 「反正把整個專案重寫一遍，就能換 license 了吧？」

到了 2026，再把「重寫」換成「叫 LLM 幫我重寫」，聽起來更像外掛。

chardet 這件事剛好把這個幻想拉回現實。

它是一個老牌、用量很大的 Python library（很多情況會跟著 requests 一起被拉進來），歷史包袱是 LGPL。最近維護者發了新 major 版本，並把 license 改成 MIT，而且看起來有「用 Claude Code 之類的工具協助整個 codebase 重寫」的成分。

先講清楚：我不是律師，我也不打算寫八卦。

但這件事很值得工程師看一下，因為它把一個很本質的問題攤開來：**clean-room 這套流程原本是設計給人類的，而 LLM workflow 在預設狀態下，幾乎等於直接把那道牆鑿洞。**

## clean-room 的核心：隔離

傳統 clean-room rewrite 的結構其實滿「工程化」的：

- Team A 看原始碼，寫出功能規格（spec）
- Team B 從頭到尾都不能看原始碼，只能看 spec 來實作

整套設計的目的就是：Team B 可以合理地說「我沒有抄，我是獨立實作」。

那你再看常見的 AI 重寫流程：

```text
prompt(original_code, "rewrite this") -> new_code
```

就算輸出每一行都不一樣，你也很難說這是一個「隔離」的流程。

如果你的論點是「這是獨立作品」，那把原始碼餵給模型，其實就是在反方向努力。

## 「AI 沒有逐行抄」不是重點

這是工程師很容易掉進去的坑（我自己也會）。

copyleft/著作權的問題，很多時候不是在抓你有沒有 copy/paste。
而是你這個新作品，法律上會不會被視為 **derivative work（衍生作品）**。

要主張「這是新的、獨立的 reimplementation」，你通常要靠的是流程證據：
- 誰看過什麼
- 什麼時候看
- 產出了哪些中間產物（spec、測試、設計文件）
- 有哪些隔離規則

LLM 變成 transformation box 之後，這些事變得很難講清楚：
- 維護者看過原始碼
- 很多 workflow 會把原始碼直接塞進 prompt
- 你也沒有一個能把「概念 → 來源」清楚對應的 audit trail

所以就算 diff 看起來「很新」，你可能還是掉在我會稱之為 **derivative trap** 的位置。

## 另外一個更麻煩的角：人類作者（human authorship）

同一時間，主流媒體也在報一件事：美國法院在 AI 生成作品的脈絡下，持續強化「必須有人類作者」才比較站得住腳的方向。

這會讓「AI 幫我重寫，所以我可以改 license」變成一個很尷尬的三角形：

1. 如果你真的主張「是 AI 生成的」，那你到底有沒有足夠的權利去宣告它是 MIT？
2. 如果它又被認定是從 LGPL code 衍生出來的，那你能不能改成 MIT？
3. 如果兩個都說不清楚，那下游使用者到底應該相信什麼？

這就是為什麼我覺得「AI rewrite 當作 license escape hatch」在推理上站不太穩。就算最後沒人追究，它也不是一個乾淨的故事。

## 我的結論（以會把東西上 production 的工程師角度）

如果你維護一個專案，license 想改：

- 無聊但正確的路還是那條：整理貢獻者、拿到同意、或做真正的 clean-room。
- 你要用 LLM 也不是不行，但你得把「模型看過什麼」當成 compliance story 的一部分，不要當作只是加速工具。

我完全理解維護者想擺脫 copyleft 摩擦，也理解公司偏好簡單 license。

但如果社群開始默認「把 GPL/LGPL 丟給模型重寫，再用 MIT 發出去」是合理的，copyleft 會直接變成一種氣氛。

而 copyleft 一旦變成氣氛，它就不是工具了。

---

**References:**
- [Tuan Anh：整理 chardet relicensing 爭議與 AI-assisted rewrite 的關鍵角度](https://tuananh.net/2026/03/05/relicensing-with-ai-assisted-rewrite/)
- [chardet v7.0.0：版本發佈資訊（爭議核心之一）](https://github.com/chardet/chardet/releases/tag/7.0.0)
- [GitHub issue：原作者對「complete rewrite」說法的質疑與討論](https://github.com/chardet/chardet/issues/327)
- [CNBC：最高法院拒絕受理 AI 著作權爭議的報導（人類作者脈絡）](https://www.cnbc.com/2026/03/02/us-supreme-court-declines-to-hear-dispute-over-copyrights-for-ai-generated-material.html)
