---
layout: post
title: "Claude Code Remote Control：那種很無聊但會直接改變工作方式的功能"
date: 2026-02-25 12:11:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Claude Code Remote Control 文件頁截圖](/img/posts/2026-02-25-claude-code-remote-control-01.webp)

我平常對「隨時隨地工作」這種行銷詞超過敏。
多半的意思就是：*我們把你的流程搬進別人的雲端*，然後你開始付出延遲、少了本機上下文、還要重新處理一堆權限跟環境問題。

但 **Claude Code 的 Remote Control** 有點不一樣。
它看起來很無聊，甚至不像什麼「新能力」，但它打到一個我每天都會遇到的痛點：

> 你想讓一個長時間的 coding session 在你自己的機器上跑（有 repo、有工具、有你自己架的 MCP server），但你又想離開座位時可以繼續盯著它、戳它一下、回它幾句，不想重開整套環境。

我喜歡的不是「遠端」這件事。
而是它把 session **牢牢釘在你的本機**。

## 它真正解決的問題（至少對我來說）

做過任何認真一點的「agent + tools」工作流，你大概都看過這個劇本：

- 一開始一定在工作機上開工，因為 repo 在那。
- 任務需要時間（測試、build、索引、refactor）。
- 人要離開位子，但又不想斷掉節奏。
- 更不想把整個工作丟進一個雲端 sandbox，然後開始補齊缺東缺西的環境。

Remote Control 的本質就是：讓流程保持本機跑，但 UI 跟你走。

這個差別很重要，因為這種 workflow 的價值很多時候就在 **本機上下文**：

- 真正的檔案系統（不是 snapshot）
- 本機工具跟 CLI
- 你已經配置好的 credentials
- 只存在你機器上的 MCP servers

## 它大概怎麼運作（白話版）

根據文件描述，Remote Control 不是那種「你的電腦開一個 port 讓外面連進來」的作法。
它比較像：

- 本機的 Claude Code session 繼續跑
- 本機只做 outbound 的 HTTPS 連線
- 你從手機/瀏覽器看到的是一個“窗口”，把訊息轉到本機 session

我不會說這是什麼完美的安全神話（世界上沒有），但它至少比「把工作丟去雲端跑，然後想辦法把你所有東西複製過去」更接近我想要的樣子。

## 安全觀點：不是魔法，但算合理

我看遠端開發功能，通常只抓兩個點：

1) **預設不開 inbound**：我不想半夜在那邊 debug router。

2) **憑證要短命、要能被切割**：長壽 token 一定會出事，只是時間問題。

文件提到使用多組短期憑證、各自有用途範圍、也會獨立過期。
這種細節會讓我對實作品質多一點信任（至少不是隨便湊的）。

當然，如果你在高度敏感或管制環境，威脅模型還是要自己做。
但以一般工程團隊來說，這個基線我覺得算夠用了。

## Remote Control vs「乾脆全丟雲端跑」

我看過很多團隊踩過一個坑：一旦 workflow 變成 cloud-first，你的開發環境會慢慢被迫變成「最低共同標準」。

- 本機才有的工具開始消失
- 有用但很怪的小腳本因為 sandbox 跑不了就被禁
- 你開始把自己的工作方式，反過來遷就遠端環境能不能跑

Remote Control 剛好相反。
它的態度是：你的機器就是環境，我只是讓你多一個螢幕可以抓著它。

對 tool-using agents 這其實更重要。
Agent 的價值不是會聊天。
它的價值是可以在**你的真實專案**裡做事。

## 限制反而是它老實的地方

文件列的限制，其實都是這個架構的代價：

- 一個 Claude Code instance 只能有一個 remote session
- terminal 需要保持開著
- 如果你的網路斷太久，session 可能會 timeout

我反而偏好這種限制。
它沒有假裝自己是一個「無所不能的遠端 IDE」。
它就是一個遠端握把（handle），讓你抓著本機 session 繼續推進。

## 我的結論

如果你已經把 Claude Code 當成一個認真在用的本機 coding 環境，Remote Control 會是那種你不太會拿出來炫耀，但用過就回不去的膠水功能。

它不會幫你寫出好 code，也不會神奇地讓 agent 秒懂你的架構。
但它確實解掉一件很煩的事：工作在你的機器上跑，但你的注意力不一定能一直坐在那。

老實說，我寧願多幾個這種「很無聊但很有用」的功能，也不要再看一堆漂亮的 demo。

---

**References:**
- [Claude Code 文件 — Remote Control：讓本機 session 可以在任何裝置繼續](https://code.claude.com/docs/en/remote-control)
