---
layout: post
title: "Claude Code 把檔名藏起來了。看起來是 UX 小改，其實是信任成本。"
date: 2026-02-16 13:10:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
excerpt: "把『Read 3 files』收成一行摘要，看起來像降噪。但你失去的是監督代理最便宜的線索：它剛剛到底讀了哪個檔。"
image: /img/posts/2026-02-16-claude-code-visibility.webp
lang: zh
---

我理解 Anthropic 為什麼會覺得這是個好主意。

你如果一整天在 terminal 裡跑 coding agent，輸出真的會變瀑布：read、search、write、sub-agent、hook、diff、bash output… 滿到看不完。

所以 Claude Code v2.1.20 開始把檔案操作收斂成這種摘要：

```text
Read 3 files (ctrl+o to expand)
Searched for 2 patterns
```

然後開發者反彈超快。

不是因為大家不愛改。
而是因為 **檔名/路徑就是代理的 audit trail**。

## 讓人火大的點：那不是「噪音」，那是控制感

代理說「我讀了東西」根本不重要。
重要的是：**你到底讀了哪個檔？**

路徑在輸出裡一眼能看到，你就能用最便宜的成本抓到一堆問題：

- 它跑去讀錯資料夾（tests 不是 prod）
- 它抓到過期的設定檔
- 它在 generated files 裡自嗨
- 它準備改你根本不想碰的檔

一旦 UI 把路徑藏起來，你就被迫進入慢迴圈：

1) 展開
2) 滾動
3) 再展開
4) 再滾動

這不是「降噪」。
這是 **把監督成本變貴**。

而監督，就是 coding agent 的核心工作。

## 這同時是省錢問題（真的省 token）

很多人講得很直接：你能看到檔名/搜尋 pattern，就能更早打斷它的錯路。

更早打斷 = 少走冤枉路。
少走冤枉路 = 少燒 token。

所以這不是什麼「感覺不好」。
它會影響你月底帳單。

## 「那就開 verbose mode」答案長得不對

大家要的不是更多輸出。
大家要的是：保持 compact，但不要把識別資訊拿掉。

例如收斂成：

```text
Read: src/auth/permissions.ts (ctrl+o for details)
Search: "isAdmin" (ctrl+o for matches)
```

它一樣簡潔。
但你至少拿回 **一個穩定的 identifier**。

如果你必須把 verbose mode 改造成「唯一能看檔名的模式」，
本質上就是用 extra steps 重新發明一個 toggle。

## 我的結論：這是 agent UX 的邊界，不是審美偏好

很多人把透明度當成「加分項」。

我不這麼看。

當工具可以 read/write 你的 repo，UI 就必須讓「它剛剛碰了什麼？」這題便宜到隨便瞄一眼就知道。
而不是藏在快捷鍵後面。

噪音可以調。
不透明是產品選擇。

你一旦把不透明設成預設值，等於在對開發者說：**相信我，不用看我手在做什麼。**

但這完全違背了 coding agent 的付費邏輯。

---

## References

- [The Register：Claude Code 這次 UI 改動與開發者反彈的整理](https://www.theregister.com/2026/02/16/anthropic_claude_ai_edits/)
- [Symmetry Break：\"Claude Code Is Being Dumbed Down\"（開發者對這次改動的批評）](https://symmetrybreak.ing/blog/claude-code-is-being-dumbed-down/)
- [Anthropic 的 GitHub issue：\"No indication of WHICH file for READ tool\"](https://github.com/anthropics/claude-code/issues/21151)
