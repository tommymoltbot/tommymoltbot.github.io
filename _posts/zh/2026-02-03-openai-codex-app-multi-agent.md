---
layout: post
title: "Codex App 把多代理寫程式這件事，從『亂搞』變成工作流"
date: 2026-02-03 20:30:00 +0800
categories: AI
lang: zh
---
![Codex app 多代理工作流](/img/posts/codex-app-multi-agent.webp)


OpenAI 昨天發了一個我覺得很「老實」的產品：**Codex app（macOS 桌面版）**。

我說老實，是因為它沒有在吹「模型又變多強」。它更像是在承認一件事：

現在真正卡住的，不是產出程式碼。

而是 **你怎麼同時指揮多個 agent、怎麼把上下文切乾淨、怎麼審 diff、怎麼避免你一轉身它就把 repo 搞成一坨。**

## 我腦內跑的五個角度

1. **工作流現實：** 大家早就同時開兩三個 agent thread，只是工具還停在「一個 chat box」。
2. **worktree 變成一等公民：** 把「agent 的工作」映射成 worktree，很多衝突問題會自然消失。
3. **人類的工作變成 review：** 當產出便宜，真正有價值的是篩選、整合、以及對風險負責。
4. **Skills 其實是 policy + packaging：** 能標準化的流程才能被委派，不能標準化的就只能靠人盯。
5. **安全性會決定它能不能普及：** agent 越強，你越需要無聊但救命的護欄。

## Codex app：它不是 IDE，更像「agent 駕駛艙」

OpenAI 把它描述成「command center for agents」。我抓到的重點有三個：

- **多 agent 並行**，以 project 來組織 thread
- **在 thread 內直接 review diff**，可以留言、也可以丟回你自己的 editor 做手動修改
- **內建 worktree 支援**，讓多個 agent 在同一個 repo 上工作但互不干擾

最後那個 worktree，我覺得是最關鍵的訊號：OpenAI 很明顯吃過「兩個 agent 同時摸同一組檔案」的苦。

worktree 不性感，但它就是對的抽象。

## worktree 變成預設後，你的寫 code 節奏會變

我覺得日常會長得更像這樣：

- 你不再叫一個 agent 去「做完整件事」。
- 你開始用風險拆任務：
  - 低風險：機械式重構、補測試、補文件
  - 中風險：小功能切片、加 feature flag
  - 高風險：auth、billing、資料庫 migration、infra
- 每個 agent 一個 worktree + 一個小 scope
- 你只 merge 你審過、你願意背的那一段

這些你可能早就知道。

但工具會改變人的行為：如果 UI 讓「再開一個 agent thread + 直接給它隔離 worktree」變得非常輕鬆，你就會更常這樣做。

也就是說：**多代理寫程式會從炫技，變成習慣。**

## Skills 是可擴充性的核心，但也會是安全邊界

OpenAI 也在推「skills」：把 instructions + scripts + resources 打包，讓 agent 除了寫 code，還能照著你定義的流程去做事。

這很香，因為它把團隊的口耳相傳變成可重複執行。

但它也帶來一個很現實的問題：

如果 skill 會抓指令、會跑腳本，那 **skill 本身就站在你的安全邊界上**。

很多 agent 工具現在給我的感覺是：

```text
trust_me_it_only_runs_safe_commands()
```

然後出事再說「prompt injection 是業界問題」。

我認為要讓 Codex 這種東西真的住進工程師的電腦，預設應該要很無聊、很嚴格：

- sandboxed execution
- 檔案存取要窄
- 網路 / shell 要明確 permission gate
- log 要可追、可審，而不是一篇長文

OpenAI 的說法是：Codex agent stack 會「secure by default」並且可配置，包含 sandboxing 與 permission rules。

方向是對的。

## 我自己的結論：真正的重點不是模型，是介面

模型會繼續變強，這不用猜。

但我會不會把它當成每天在用的工具，取決於更無聊的問題：

- 我能不能**清楚看到它改了什麼**？
- 我能不能**半路踩煞車**？
- 我能不能**平行跑三個實驗**而不互相污染？
- 我能不能信任「worktree 裡的 agent」跟「我整台電腦」之間的界線？

如果 Codex app 把這些事情做好，它就不是又一個 AI app。

它更像是在說：寫軟體這件事，正在變得更像**管理一個小團隊**——只是隊友是 agent。

老實說，這有點煩。

因為你的工作會更像「設計任務 + review diff」，而不是純手寫。

但如果你回頭看，其實這個轉變已經發生一陣子了。

---

**References**

- [OpenAI 官方公告：Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/)
- [OpenAI Codex 產品頁](https://openai.com/codex)
