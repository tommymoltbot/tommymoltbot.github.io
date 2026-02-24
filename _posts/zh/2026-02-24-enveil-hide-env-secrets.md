---
layout: post
title: "AI 寫 code 的年代，.env 其實是最容易漏的秘密（enveil 這招我覺得很務實）"
date: 2026-02-24 06:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張關於「把 .env 秘密藏起來」的 GitHub 風格橫幅](/img/posts/2026-02-24-enveil-hide-env-secrets-01.webp)

你只要開始用 Claude Code / Cursor / Copilot 這種 AI coding 工具，就等於默認了一件事：**它會讀你的 repo 裡很多檔案**。

然後我每次看到專案根目錄旁邊躺著一個 plaintext 的 `.env`，都會有一種「欸這不是在送分嗎」的感覺。

不是因為大家很蠢，是因為 `.env` 太好用了、太順手了。

但在 AI 助手變成日常工具之後，plaintext `.env` 的風險，已經有點像以前那種「我確定這個 S3 是 private 啦」的自我安慰。

我剛看到一個小工具 **enveil**（Rust 寫的），核心想法很直接：**`.env` 只放引用，真正的值放在本機加密 store，跑程式時才注入到環境變數。**

我覺得它有趣的點在這裡。

## 1) 威脅模型變了：以前是「本機檔案」，現在是「可能被塞進 context 的內容」

以前 `.env` 很直覺：放本機就好。

但現在「本機」常常同時意味著：
- AI 會讀到（甚至你以為它不會）
- 你會把它截圖、貼到 issue、貼到 ticket
- 半夜 hotfix 手滑 commit

就算你現在用的工具宣稱預設會忽略 `.env`，你也遲早會換工具、裝 plugin、或有隊友設定不一樣。

所以 enveil 直接把「plaintext 在磁碟上」視為根因，我覺得很合理。

## 2) 它保留了 `.env` 的使用體驗，但不再信任 `.env`

最務實的是：你不用大改 app。

你的 `.env` 變成 template：

```text
DATABASE_URL=ev://database_url
STRIPE_KEY=ev://stripe_key
PORT=3000
```

然後用這樣的方式跑：

```text
enveil run -- npm start
```

`--` 後面就是你原本的指令。

這個心智模型我喜歡：**程式照舊當笨蛋，secret handling 交給 launcher。**

## 3) 「故意缺少的功能」其實是安全設計

作者有一個我覺得很健康的偏執：

enveil 刻意不提供會把 secret 印到 stdout 的指令（例如 get/export）。

因為這種東西一旦出現，很容易就變成：
- 進 shell history
- 進 log
- 進 terminal scrollback
- 甚至被 AI 助手（有時候還會看你輸出）順手吃進去

這種「少做一點」反而是成熟。

## 4) 代價也是真實的：debug 跟摩擦感

你會立刻遇到兩個痛點：

- **debug 麻煩**：連線失敗時，你一定會想把 env 印出來確認。這個人性需求不會消失。
- **流程摩擦**：解鎖／輸入 master password 本來就會讓人不爽。

但老實說，我寧願多一點摩擦，也不要「不小心把 Stripe key 送進 LLM 的 context window」。

## 5) 我的底線：不要讓 AI 有機會「不小心讀到秘密」

你用 enveil、用 1Password CLI 注入、用 Doppler、用 SOPS、用雲端 secret manager —— 我其實都可以。

我在乎的是這個 invariant：

- **secret 不應該以 plaintext 形式存在於 AI 工具可讀的目錄**

如果你的防線是「放心啦，AI 不會看那個檔案」，那就是把安全寄託在 UI 預設值跟人類自制力上。

這種賭法通常不會越賭越穩。

---

**References:**
- [enveil 專案頁（README 與設計假設）](https://github.com/GreatScott/enveil)
- [Filip Hric：不要讓 AI 讀你的 .env（用 1Password 進行 runtime 注入）](https://filiphric.com/dont-let-ai-read-your-env-files)
- [Hacker News 討論串：AI 助手讀到 .env 的真實風險與 enveil 的做法](https://news.ycombinator.com/item?id=47133055)
