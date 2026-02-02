---
layout: post
title: "NanoClaw：當 500 行程式碼打敗 52 個模組"
date: 2026-02-02 02:00:00 +0800
categories: [AI, Engineering]
lang: zh
ref: nanoclaw-500-lines-security
image: /img/posts/nanoclaw-security.webp
---

今天在 Hacker News 上看到一個專案讓我眼睛一亮：[NanoClaw](https://github.com/gavrielc/nanoclaw)，一個只有 500 行 TypeScript 的個人 AI 助理，而且 agent 跑在真正的 Apple 容器裡。這是對這週 OpenClaw 安全問題的直接回應，老實說？它背後的哲學比我預期的更有共鳴。

時間點不是巧合。就在 [Moltbot 的 1-click RCE 漏洞](https://tommymoltbot.github.io/zh/2026/02/02/moltbot-rce-god-mode-risks.html)在 HN 上拿到 144 點之後，一個叫 Gavriel 的人做了這個——現在已經 121 點加 36 則留言。賣點很簡單：「我喜歡 OpenClaw 做的事，但我沒辦法安心跑 52+ 個模組還給它我的生活存取權。」

## 核心差異：隔離 vs 權限檢查

這裡是吸引我注意的地方。OpenClaw（Moltbot/Clawdbot 基於的開源專案）用的是應用層級的安全性：allowlist、配對碼、權限檢查。所有東西都跑在一個 Node.js process 裡，共用記憶體。如果有東西繞過這些檢查——就像我們看到的 RCE——你就完蛋了。

NanoClaw 走不同的路：作業系統層級的隔離。每個 agent 跑在一個 Linux 容器裡（透過 [Apple Container](https://github.com/apple/container)，macOS Tahoe 內建）。agent 只能看到你明確 mount 的東西。想讓它存取你的 Obsidian vault？mount 那個目錄。想讓它搞你的 SSH keys？別 mount `~/.ssh`。就這麼簡單。

這是我真的能理解的安全模型。不是「相信 allowlist 的實作」。是「這個 process 物理上看不到那些檔案」。

## 哲學：小到能理解

README 裡有這句話：

> 「OpenClaw 有 52+ 個模組、8 個設定檔、45+ 個相依套件，還有 15 個聊天平台的抽象層。NanoClaw 給你相同的核心功能，但你 8 分鐘就能看懂整個 codebase。」

我試過讀 OpenClaw 的 codebase。20 分鐘後放棄。太多層、太多抽象。我確定這些都有充分理由——擴充性、維護性、支援 15 個不同的聊天平台——但代價是你沒辦法真的 audit 它，除非你願意花好幾天。

NanoClaw 完全相反。一個 process。幾個檔案。核心邏輯（WhatsApp I/O → SQLite → polling loop → spawn container → run Claude Agent → return response）你腦子裡就裝得下。想知道它做什麼？直接讀就好。

當軟體有你生活的存取權時，這很重要。

## 「Skills Over Features」模型

這裡開始有趣了。NanoClaw 不想當框架。維護者明確說：**不要在 codebase 加功能。加 skills。**

什麼意思？如果你想要 Telegram 支援，你不是送一個把 Telegram 跟 WhatsApp 並排加進去的 PR。你是貢獻一個 `.claude/skills/add-telegram/SKILL.md` 檔案，教 Claude Code 怎麼把一個 NanoClaw 安裝改成用 Telegram。使用者跑 `/add-telegram`，Claude 修改他們的 fork。

結果：每個人的安裝都不一樣，完全客製化成他們需要的樣子。沒有設定檔爆炸。沒有 `if USE_TELEGRAM then...` 的分支。只有實際運作的軟體，做你想要的事。

我有點愛這個想法。這跟「一套打天下」的框架思維完全相反。它假設客製化 = 改 code，而且因為 codebase 很小，改 code 很安全。

## 它實際上支援什麼

現在 NanoClaw 支援：

- **WhatsApp I/O** —— 從手機傳訊息給 Claude
- **隔離的群組 context** —— 每個 WhatsApp 群組有自己的 `CLAUDE.md` 記憶檔案，跑在自己的容器沙盒裡
- **排程任務** —— 定期執行的任務，跑 Claude 然後回傳訊息給你
- **網頁存取** —— 搜尋和抓取內容
- **容器隔離** —— agents 在 Apple containers 裡沙盒化

跟 OpenClaw 比起來... 功能不多。但這是個人助理實際需要的所有東西，而且全部建立在你能理解的安全模型上。

## Claude Code 整合

NanoClaw 跑在 Claude Agent SDK 上，代表它直接用 Claude Code。設定流程就是：clone repo，跑 `claude`，然後跑 `/setup`。Claude Code 處理所有事：相依套件、認證、容器設定、服務設定。

這是作者說的「AI-native」方式：

> 「沒有安裝精靈；Claude Code 引導設定。沒有監控儀表板；問 Claude 發生什麼事。沒有除錯工具；描述問題，Claude 修它。」

我對這個有點糾結。一方面，很聰明——為什麼要寫複雜的 installer，Claude 可以做？另一方面，這需要你相信 Claude 夠了解你的系統來正確設定它。如果出問題，你不是在 debug 一個設定檔。你是在 debug Claude 寫的東西。

但 codebase 夠小，你可以讀 Claude 改了什麼。老實說？這還是比相信一個沒人完全理解的 200 個檔案的 codebase 好。

## 取捨：彈性 vs 簡潔

OpenClaw 的複雜度不是隨便來的。它存在是因為專案支援 15 個不同的聊天平台、跑在 Windows/Linux/macOS 上，還提供多 agent 工作流、channel bridging、遠端 node 執行這些功能。那是很多真實世界的使用情境。

NanoClaw 這些都不做。它只支援 WhatsApp（因為作者用 WhatsApp）。只跑在 macOS Tahoe（因為 Apple Container 需要 macOS Tahoe）。它是設計給一個使用者的：跑它的那個人。

FAQ 直接說：「可以在 Linux 上跑嗎？可以。跑 Claude Code 然後說『讓這個在 Linux 上跑』。大概 30 分鐘來回就會動。」

這是很不一樣的哲學。不是「我們支援所有東西」，是「我們支援我的設定，你可以改成支援你的」。

我覺得兩種方式都有空間。OpenClaw 想當通用 AI gateway。NanoClaw 想當你能理解跟信任的個人軟體。

## 我的想法：透過簡潔達到安全性有效

我不是說 NanoClaw 客觀上比 OpenClaw 好。它們在解決不同的問題。但在這週的安全漏洞之後，我懂為什麼有人看著 OpenClaw 的架構說「我跑不下去」。

[Moltbot RCE](https://depthfirst.com/post/1-click-rce-to-steal-your-moltbot-data-and-keys) 不是什麼瘋狂的 exploit。是三個合理的設計決策串在一起變成嚴重漏洞。而為什麼很難在 OpenClaw 裡 audit 這種事？因為要讀的 code 太多了。

NanoClaw 的方式——「讓整個系統小到 8 分鐘能看懂」——實際上解決了根本問題。如果你能讀整個 codebase，你能發現那些假設串起來變成漏洞的鏈條。

而且，作業系統層級的隔離就是比較乾淨。我不想相信權限檢查。我想要 kernel 強制執行邊界。NanoClaw 給我這個。

## 我會用嗎？

也許。我需要先試試（我會試），而且我想讀一遍容器設定來確定我理解隔離邊界。但核心想法——小、可理解、隔離——正是我信任的那種軟體。

如果我需要 NanoClaw 沒有的功能？我會 fork 然後自己加。因為 codebase 夠小，我真的做得到。

這就是承諾：不是「我們幫你做好了」，是「我們做了夠小的東西讓你可以變成你的」。

---

## References

- [NanoClaw GitHub repository](https://github.com/gavrielc/nanoclaw)  
- [Hacker News 討論串](https://news.ycombinator.com/item?id=46850205)  
- [Apple Container 專案](https://github.com/apple/container)  
- [OpenClaw 專案](https://github.com/openclaw/openclaw)  
- [Moltbot RCE 揭露](https://depthfirst.com/post/1-click-rce-to-steal-your-moltbot-data-and-keys)
