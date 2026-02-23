---
layout: post
title: "Ubuntu 開始用 Rust：這比大多數 Rust 的 hype 更重要"
date: 2026-02-23 19:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Ubuntu 以 Rust 當橋，讓 Rust 從早期採用者走向早期大眾](/img/posts/2026-02-23-ubuntu-rust-crossing-chasm-01.webp)

Rust「贏」很久了。

但我最近越來越在意一件事：**到底是贏在哪裡？**

在雲端 infra、效能導向、願意為了正確性多付出一點成本的圈子，Rust 其實已經算日常。

但在更大的「無聊中間地帶」——大多數公司寫的那種軟體——Rust 的採用還是很不均勻。

Niko Matsakis 有一篇文把這件事講得很清楚：Ubuntu（Canonical）採用 Rust，不只是又一個「大公司用 Rust」的新聞而已。

它更像是在做一件很實際的事：**替 Rust 蓋一座橋**，讓 Rust 從「喜歡新東西的工程師」走向「討厭意外的組織」。

那個落差，就是 chasm。

## 「跨越鴻溝」真正難的地方

新技術一開始的採用者，本質上是在買一張彩券：

- 邊緣有點利、坑有點深，都可以忍
- 反正早用早爽，賭對了就賺

但早期大眾（early majority）不是這樣。他們想要的是：

- 少一點未知
- 可靠、可維護
- 相容性最好是「無聊到沒人注意」
- 最重要：要看到「跟我們一樣的人」真的用過、上線過、沒被搞死

所以你要改變「大部分公司預設會選什麼」，靠 benchmark 不夠。

你需要的是 **reference customer（參考客戶）**。

而 Ubuntu 這種「要讓一般人日常用、要顧相容性、要顧升級體驗」的 Linux 發行版，就是很強的 reference customer。

## 為什麼 Ubuntu 這個訊號很特別

Canonical 不是在某個獨立的小服務偷偷用 Rust。

Niko 轉述 Jon Seager 的 keynote 時提到的方向，是更底層的東西：**基礎工具、核心 utilities**。

這個領域很不舒服，因為：

- 它出事的時候，不是「某個功能壞了」而已，是整個系統一起抖
- 相容性不對，使用者會馬上發現
- 效能/體積/行為有差異，會被放大檢視

所以 Ubuntu 願意把資源押在「用 Rust 重寫記憶體安全的基礎工具」，這不是 vibe。

這比較像是在說：

> 我們願意先付那個風險稅，證明這條路走得通。

而這種承諾，就是 early majority 想看到的。

## 真正的產品不是 Rust，是「可替換的無聊」

我覺得這篇文最重要的洞察，是「用 drop-in utilities 當橋」。

重點不是「Rust 很酷」。重點是：

- 我可以換掉某個工具，但不用重寫整套 workflow
- 行為跟我原本信任的那套差不多
- 出問題時，影響範圍是可控的

所以像這些專案（或投資方向）就很關鍵：

- sudo-rs（有資助、有組織在推）
- ntpd-rs（時間同步這種東西，只有壞掉你才會知道它存在）
- uutils 的 coreutils

這是一種很「工程師」的採用策略，而不是靠行銷話術。

## 我自己用五個角度在看接下來會怎樣

我現在的心情大概是「普通偏樂觀」：覺得有戲，但也很好奇第一個踩到的坑會是什麼。

### 1) Reference customer 不能亂替代

雲端公司用 Rust，不會自動說服 Linux 發行版。

Linux 發行版用 Rust，也不會自動說服車用供應鏈。

每個領域都有自己的風險模型。

如果 Rust 想跨越很多鴻溝，它需要很多座橋；Ubuntu 是 Linux userland 這一座很重要的橋。

### 2) 生態壓力會從「新功能」變成「基本盤」

早期採用者會說：

> 反正加個 crate 就好。

但 early majority 要的是：

- 穩定且無聊的預設
- 有人幫你整理過的組合（curated stacks）
- 文件要跟現實一致
- 長期維護的訊號要清楚

Niko 提到以前的「Rust Platform」提案（想把一組 crates 變成某種延伸 stdlib），當年大家不買帳。

但我覺得這就是常見的現象：

對 pioneer 來說很「多此一舉」的東西，到了 pragmatist 時期就會變成必需品。

### 3) 開源的同理心，其實是擴張瓶頸

這段我看得有點痛。

開源社群很容易「國中化」：小圈圈、黑話、口耳相傳的規則，外人進來一句話講錯就被嗆。

但如果你的採用策略是靠「新類型的使用者」，你就真的不能這樣。

因為 early majority 沒時間解你們的暗號。

如果 Rust 想要更多 Ubuntu 式採用，生態圈得更擅長：

- 跟不同背景的人溝通
- 把「新手問題」當 onboarding，而不是噪音
- 清楚標記哪些是穩定的、哪些還在實驗

### 4) 投資常常發生在採用之前，不是之後

我很喜歡 Niko 的觀察：很多公司其實有預算，願意在採用前先把缺口補起來。

這會改變整個對話。

不是「因為你用到 Rust 所以來捐款」，而是：

- 「你需要 X 才能在你的環境上線 Rust，就資助 X」
- 「你想要無聊可靠，就為無聊可靠買單」

這才符合現實世界的運作方式。

### 5) 對一般工程師來說，這是一個更成熟的說服點

如果你在的公司還把 Rust 當成興趣語言，你其實可以用 Ubuntu 這件事換一個說法。

不是：

- Rust 很快
- Rust 很安全

而是：

> 「連最在乎相容性、最不想出意外的 distro，都開始用 Rust 做 drop-in 的基礎工具，因為他們想把預設變安全，但不想改使用者習慣。」

這是一個更「成年人」的論點。

## 我的看法

我不太在意 Rust 去打什麼文化戰。

我比較在意的是：Rust 能不能成為那種我們其實最討厭維護、但又不得不維護的程式碼的預設選擇——安全敏感、底層、生命週期超長。

Ubuntu 往 Rust 這邊靠，是一個訊號：無聊中間地帶終於開始有真正的選項。

接下來就看 Rust 生態圈能不能承受它帶來的副作用：

- hype 會變少
- 期待會變多
- 使用者會更務實，只想「拜託它好好跑」

老實說，這是一個很棒的問題。

---

**References:**
- [Niko Matsakis：Ubuntu 用 Rust（以及 reference customer 為什麼重要）](https://smallcultfollowing.com/babysteps/blog/2026/02/23/ubuntu-rustnation/)
- [Rust 官方部落格：要把 Rust 上線到 safety-critical 軟體需要什麼](https://blog.rust-lang.org/2026/01/14/what-does-it-take-to-ship-rust-in-safety-critical/)
- [Trifecta Tech Foundation（sudo-rs 等專案的資助背景）](https://trifectatech.org/)
- [sudo-rs 專案 repo（用 Rust 重寫 sudo 的方向）](https://github.com/trifectatechfoundation/sudo-rs)
- [ntpd-rs 專案 repo（用 Rust 做 NTP daemon）](https://github.com/pendulum-project/ntpd-rs)
- [uutils coreutils（Rust 的 drop-in userland utilities）](https://uutils.github.io/coreutils/)
