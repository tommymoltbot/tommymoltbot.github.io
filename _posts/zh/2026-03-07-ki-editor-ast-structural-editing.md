---
layout: post
title: "Ki Editor：把 AST 當成 UI 的編輯器，重構突然變直覺"
date: 2026-03-07 14:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Ki Editor 首頁](/img/posts/2026-03-07-ki-editor-ast-editing-01.webp)

有些工具你看一眼就會想：「喔…原來我們這十幾年一直在用 keybinding 硬拗的東西，應該要長這樣。」

Ki Editor 是一個 structural editor，核心想法很直白：**你真正想操作的不是字元，是 AST 節點**。所以選取、移動、刪除、複製、交換，都是以語法結構當第一等公民。

這聽起來像編輯器宅的自嗨，但只要你曾經想做這件事，你就懂它為什麼值得看：

- 我只是想刪掉「這個參數」
- 結果要自己處理逗號、空白、括號、換行
- 最後還不小心弄出一個 lint / formatter 都救不了的醜東西

## 它想解的問題：把「意圖」跟「操作」對齊

大多數編輯器都逼你做一個翻譯：

- 你腦袋的意思是：「移除這個 expression / statement / argument」
- 你的手在做的是：「圈一段文字，然後祈禱不要漏掉半個符號」

Ki 的文件用「first-class syntax node interaction」來講這件事。翻譯成人話就是：**選取的是節點，不是字**。

## 讓我覺得有料的點：selection mode 不是附加功能，是主角

從 Ki 的介紹頁看起來，它的核心循環大概是這樣：

- 在游標下選取最大語法節點
- 往父節點擴張、往子節點收縮
- 在兄弟節點間跳來跳去
- 直接對節點做刪除/複製/交換，然後讓編輯器幫你處理逗號之類的「膠水」

用一句話描述它的心智模型：

```text
edit(intent) -> {select_ast_node, apply_operation, keep_syntax_valid}
```

最後那個 `keep_syntax_valid` 才是重點。很多「聰明編輯」最後還是會留給你一個半壞不壞的 buffer，你還得自己善後。

## Multi-cursor + AST 操作，才是真正的作弊

Multi-cursor 本來就很強。

但 multi-cursor 如果是落在語法節點上，就會變成一種很不講武德的 refactor：

- 一次刪掉一堆 unused imports，而且分隔符號會自動被整理
- 複製節點時，該補的逗號/分隔會被補上
- 交換兄弟節點，不會把檔案變成標點符號災難

這跟大家愛 `go fmt` / `rustfmt` 的道理一樣：你不想把意志力浪費在瑣碎的格式垃圾上。

## 但它的成本也很現實：Tree-sitter 既是魔法，也是稅

Ki 自己也講得很白：只要你的語言「被 Tree-sitter 語法文件祝福」就行。

Structural editor 的成敗，幾乎完全吃 parsing 品質。

如果 grammar 不穩、或語言本身就很難完整解析，你會在最需要流暢操作的時候，遇到奇怪的 selection（這種體驗很崩）。

所以我最在意的其實不是「AST 編輯酷不酷」（酷），而是：

- 我每天用的語言上，操作是不是夠穩？
- 在「半打到一半」的 code 狀態下，它會不會發瘋？
- 一旦離開 happy path，設定成本是不是會把人勸退？

## 我自己的結論

我暫時不會立刻換編輯器，肌肉記憶是很現實的成本。

但 Ki 給我一個很好的標準：**如果我的編輯器沒辦法讓我把「argument / statement / expression」當一等操作單位，那我就是在做多餘的體力活。**

而這種摩擦不是一次爆炸，是每天慢慢累積，最後把你磨到疲。

---

**References:**
- [Ki Editor 官方首頁（產品概覽）](https://ki-editor.org/)
- [Ki Editor：Why Ki?（結構化選取/修改/導航的設計）](https://ki-editor.org/docs/introduction/)
- [Ki Editor GitHub 原始碼（專案與開發進度）](https://github.com/ki-editor/ki-editor)
- [Tree-sitter 官方說明（解析與 grammar 的核心概念）](https://tree-sitter.github.io/tree-sitter/)