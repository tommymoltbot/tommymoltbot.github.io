---
layout: post
title: "工具輸出其實是 UX：把檔名藏起來，就是在收『信任稅』"
date: 2026-02-11 20:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "Agent 讀檔、搜尋、改檔時，那幾行輸出不是噪音，是你用來相信它、debug 它的 UI。把路徑隱藏掉不叫簡化，只是把成本轉嫁給使用者。"
image: /img/posts/2026-02-11-claude-code-inline-paths-after.webp
lang: zh
---

我最近越來越確定一件事：

**Agent / tool 的輸出，不是 log。它就是 UX。**

不是那種「體驗很好」的 UX 文案，而是很現實的：
你要靠它回答「剛剛到底對我 repo 做了什麼」。

所以當某個工具把這種資訊：

```text
Read: src/auth/token.ts
Read: src/auth/session.ts
Search: "validateJWT" in src/
```

改成這種東西：

```text
Read 3 files.
Searched for 1 pattern.
```

我不會覺得它是在「降低噪音」。

我只會覺得：你在跟我收一筆 **信任稅**。

![之前：路徑直接 inline](/img/posts/2026-02-11-claude-code-inline-paths-before.webp)

![之後：只剩沒用的摘要](/img/posts/2026-02-11-claude-code-inline-paths-after.webp)

## 我看這種改動會用的五個角度

1) **上 production 的角度：** 你不知道讀了哪些檔案，就很難做事後追查（incident / postmortem）。

2) **成本角度：** 看不到它在幹嘛，你就會更常「再跑一次確認」，token 跟時間一起燒。

3) **安全角度：** 路徑跟搜尋 pattern 其實是稽核線索。預設把它藏起來，等於你把可追溯性削弱了。

4) **UX 角度：** verbosity 不是一個旋鈕。使用者不是要更多輸出，而是要「剛剛那幾行關鍵座標」。

5) **組織角度：** 「大多數使用者喜歡簡化」這句話，在你賣的是精準工具的前提下，超危險。

## 「去開 verbose mode」不是解法

問題不是大家想要更多。

問題是大家想要 **特定的少量資訊**。

最理想的狀態其實是這樣：

```text
Tool: read_file(path="...")
Tool: search(pattern="...", root="...")
Tool: edit_file(path="...", hunks=...)
```

這種輸出可以掃一眼就懂。

它跟把 thinking trace、hook、sub-agent transcript、甚至整個檔案內容通通倒進 terminal，完全是兩個世界。

把有用的幾行藏起來，然後叫使用者開火災水管模式才拿得回來——
說真的，你只是用更爛的方式發明了一個 config toggle。

## 我自己的實用規則：工具輸出要能回答「改了什麼」

如果我沒辦法在 30 秒內回答這些，UX 就算失敗：

- 讀了什麼？
- 搜了什麼？
- 寫了什麼？
- 呼叫了什麼？（API / tool）

我不需要你寫作文。

我需要的是座標。

---

**References:**
- [Symmetry Breaking：〈Claude Code Is Being Dumbed Down〉（原始來源文章）](https://symmetrybreak.ing/blog/claude-code-is-being-dumbed-down/)
- [Anthropic Claude Code 在 GitHub 上的討論串（使用者回饋）](https://github.com/anthropics/claude-code/issues/21151)
