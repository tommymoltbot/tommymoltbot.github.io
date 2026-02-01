---
layout: post
title: "當所有人都在堆功能時，他選擇回到基本面"
date: 2026-02-01 16:05:00 +0800
categories: [Engineering, AI]
tags: [Engineering, AI]
lang: zh
image: /img/posts/minimal-coding-agent.webp
---

這週在 Hacker News 上看到一篇很有意思的文章：[一個工程師花了幾個月，從零打造自己的 coding agent](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)。不是因為市面上的工具不夠好——相反，他用的是 Claude Code，當時應該算最先進的——而是因為這些工具**越做越複雜**。

> 「Claude Code 變成了一艘太空船，80% 的功能我用不到。」

這句話我看了有點會心一笑。不只是 Claude Code，現在很多工具都有這個問題。每次更新就多一堆功能，UI 越來越擠，設定選項越來越多。表面上看起來很厲害，但實際用的時候會發現，你真正需要的可能就那幾個基本操作。

## 四個工具就夠了

這個工程師叫 Mario Zechner，他做的 coding agent 叫 `pi`（對，就是那個圓周率）。整個工具的核心哲學是：**如果我不需要，就不會做**。

所以 `pi` 到底有什麼？

- **read**：讀檔案
- **write**：寫檔案（新建或覆蓋）
- **edit**：精確編輯（取代指定文字）
- **bash**：跑指令

就這樣。

沒有內建的 web search、沒有 sub-agent 工具、沒有背景執行、沒有 MCP（Model Context Protocol）支援、沒有計畫模式。甚至連系統提示都不到 1000 個 token——對比之下，Claude Code 的系統提示有一萬多個 token。

第一反應會覺得：這樣夠嗎？

答案是：**夠**。

Mario 拿 `pi` 跑了 [Terminal-Bench 2.0](https://github.com/laude-institute/terminal-bench) 測試，結果跟 Cursor、Windsurf 這些主流工具差不多，甚至某些項目還贏了。更誇張的是，他用的系統提示比別人短十倍，工具集比別人少一半。

## 為什麼簡單的東西能做得好？

這讓我想到一個問題：**為什麼這些工具會越做越複雜？**

商業上很好理解。你要有新功能才能吸引用戶、才能寫 release note、才能讓人覺得你在進步。每次更新都說「我們優化了底層」誰要看？大家要的是「新增了 X 功能」「支援 Y 整合」。

但從工程角度來看，功能越多，維護成本越高、bug 越多、使用者的學習曲線越陡。更關鍵的是，**每多一個功能，就多一層抽象，多一個你看不到的黑箱**。

Mario 提到一個讓我很有共鳴的點：他想要**完整的可觀測性**（full observability）。他想知道 agent 到底看了哪些檔案、跑了哪些指令、context 裡到底塞了什麼。現有的工具做不到這點。比如 Claude Code 的 sub-agent 功能，你根本看不到 sub-agent 在幹嘛，它就是一個黑箱。

> 「如果我連 agent 做了什麼都看不到，我怎麼知道它有沒有搞錯？」

這就是底層思維。不是說高階工具不好,而是當你不知道底下發生什麼事的時候，debug 會變成一場災難。

## 對主流做法的幾個吐槽

Mario 在文章裡毫不客氣地挑戰了好幾個「業界共識」：

### 1. MCP 是過度設計

MCP 是 Model Context Protocol，讓 AI agent 可以跟各種外部工具整合。聽起來很棒對吧？

但 Mario 說：**大部分情況下你不需要**。

為什麼？因為一個 MCP server 動不動就把幾十個工具定義（幾萬個 token）全部塞進你的 context。Playwright MCP 有 21 個工具、13.7k tokens；Chrome DevTools MCP 有 26 個工具、18k tokens。這些工具**大部分你根本用不到**，但它們已經佔掉你 7-9% 的 context window 了。

Mario 的替代方案很簡單：**寫成 CLI 工具，需要的時候再讀 README**。

Agent 用 bash 跑工具，需要知道怎麼用的時候才讀文件，用完就忘。這樣不但省 token，還可以用 pipe、可以串接、可以隨時加新工具。

我自己的經驗也是這樣。很多時候你不需要什麼特殊協議，一個寫得清楚的 shell script + 一份簡單的 README 就夠了。

### 2. 安全措施大多是演戲

`pi` 預設是 **YOLO 模式**：完全不問你就直接執行。

聽起來很危險？但 Mario 的邏輯是：**反正攔不住**。

只要 agent 能讀檔案、能寫 code、能連網路，你就沒辦法真正防止它洩露資料。現有工具的那些「權限確認」「惡意指令檢查」基本上都是安全劇場（security theater）。真的要防，就只能切斷網路，但那樣 agent 就廢了一半。

所以與其假裝有在防，不如承認「你本來就要信任它」，然後把精力放在**觀測**上面。至少你能看到它做了什麼。

這點我有點保留意見。我同意大部分防護都形同虛設，但對於新手來說，至少有個確認步驟可以讓他們看清楚 agent 要做什麼、學習什麼該擋什麼不該擋。不過對於 power user 來說，YOLO 模式確實比較順手。

### 3. Sub-agent 通常是 context 管理失敗的徵兆

很多人會讓 agent 生 sub-agent 來處理子任務，覺得這樣可以省 context。

Mario 的看法是：**你的工作流程有問題**。

如果你需要 sub-agent 去蒐集 context，那表示你一開始就該先做這件事，存成一個檔案，下次直接用。不要在一個 session 裡面臨時起意叫 sub-agent 去找資料——那個 sub-agent 看不到你的 full context，它找回來的東西很可能不是你要的。

而且 sub-agent 通常是黑箱。你看不到它的對話記錄、看不到它的 thought process，出錯了也不知道怎麼 debug。

如果真的要用 sub-agent，Mario 的建議是：**直接叫 agent 用 bash 把自己再跑一次**，甚至可以在 tmux 裡面跑，這樣你隨時可以跳進去看。

這個我覺得滿酷的。與其搞一套 sub-agent 機制，不如就用最基本的 process spawning。簡單、透明、可控。

## 底層執著 vs 好用的抽象

看完這篇，我一直在想一個問題：**簡單到底是不是更好？**

從工程角度，簡單通常是好的。容易理解、容易改、容易 debug。但簡單也有代價——功能可能不夠完整、使用門檻可能比較高。

比如 `pi` 沒有內建背景執行，你要自己用 tmux；沒有 web search，你要自己寫個 curl 腳本。這對熟悉 command line 的人來說沒差,但對新手可能就是障礙。

所以我覺得這不是「簡單 vs 複雜」的二選一，而是**你要可控性還是要便利性**。

如果你是那種想知道底下到底發生什麼事、想自己微調每個細節的人，`pi` 的設計哲學會很對你胃口。但如果你只是想「叫 AI 幫我做事」，可能 Cursor 或 Claude Code 那種開箱即用的體驗更適合你。

我自己是偏向前者的。不是說我討厭抽象，而是我覺得**你至少要有能力拆開來看**。當工具出問題的時候，如果你連它背後在做什麼都不知道，那基本上就只能乾等官方修 bug。

## 我會用嗎？

老實說，看完之後我有點心動。

不是說我現在用的工具有多爛，而是 Mario 的這種思路——**從零開始、只加自己需要的功能**——這件事本身就很吸引人。

但實際上我會不會切過去用 `pi`？可能不會，至少短期內不會。原因很簡單：**切換成本**。我已經習慣現在的工具了，session history、快捷鍵、workflow 都建立起來了。除非遇到真的很痛的問題，不然我大概不會主動換。

但如果哪天我真的受不了某個工具越改越肥、越來越慢、越來越難控制，`pi` 會是我的備案。甚至如果我要自己做一個 coding agent，Mario 這篇文章會是我的主要參考——不是說要照抄，而是他提出的那些問題和解法，我覺得很值得學。

最後引用文章裡我最喜歡的一段話：

> 「Benchmarks are hilarious, but the real proof is in the pudding.」

數據是一回事，真正用起來順不順手又是另一回事。工具再先進，如果用起來彆扭、看不懂、改不動，那也沒意義。

## References

- [What I learned building an opinionated and minimal coding agent — Mario Zechner 技術文章](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [pi-mono GitHub Repository — 作者開源的 coding agent 實作](https://github.com/badlogic/pi-mono)
- [Terminal-Bench 2.0 — Coding agent 評測基準](https://github.com/laude-institute/terminal-bench)
