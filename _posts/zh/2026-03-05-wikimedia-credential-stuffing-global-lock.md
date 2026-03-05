---
layout: post
title: "Wikimedia 一口氣鎖了 35,893 個帳號：密碼重用仍然是最便宜、最有效的攻擊"
date: 2026-03-05 17:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Wikipedia 標誌](/img/posts/2026-03-05-wikimedia-account-locks-01.webp)

安全圈很愛聊那些很帥的東西：零時差、APT、國家級攻擊。

但現實最常見的劇本其實很無聊：**有人把密碼重用**，攻擊者拿著外面流出的帳密清單跑一輪 credential stuffing，然後系統方被迫拉緊急煞車。

最近我看到 Wikimedia Foundation 的一篇事件說明，內容很「工程現場」：他們發現一批異常登入後，和志工 functionaries 合作，直接把 **35,893 個帳號做了 global lock**（強制登出，並阻止再次登入）。

你如果沒做過大規模身分系統，可能會覺得這聽起來很戲劇化。

它確實很戲劇化。
而且通常表示你寧願犧牲一部分使用者體驗，也要先把血止住。

## 這次事件「確定」發生了什麼
Wikimedia 的說法是：他們識別到一個「異常登入」的模式，調查後決定 globally lock 35,893 個帳號。

他們目前的判斷：未授權活動**最可能**是因為使用者的密碼在別的地方被洩漏（密碼重用），或使用者從被入侵的裝置登入，導致攻擊者可以對 Wikimedia 登入端點做 credential stuffing。

我覺得有兩個細節值得記一下：

- 受影響的帳號大多是低活躍／不活躍帳號；只有大約 **2% 的帳號累積編輯次數 ≥ 100**。
- 他們表示目前**沒有理由相信內容完整性被影響**，也沒有看到明顯的惡意編輯行為證據。

換句話說：這更像是「帳號接管」的事件，而不是 Wikimedia 自己的核心系統被打穿。

## 為什麼 credential stuffing 這麼有效（而且一直回來）
credential stuffing 的可怕之處在於：它是世界上最便宜的規模化攻擊。

- 你不需要破解目標系統。
- 你不需要新漏洞。
- 你只需要一包外面流出的帳密，外加人類會做的那件事：重用密碼。

更煩的是，攻擊成功率很低也一樣能造成問題。

假設只有 0.2% 的組合能登入，但你可以試幾百萬次，那你還是會拿到不少帳號。

而像 Wikimedia 這種「公共信任」屬性很高、又有志工協作流程的平台，就算只有少數特權帳號被接管，後面都可能是很大的營運成本。

## 我真正想講的是：這是一個「操作槓桿」問題
安全討論常常停在「怎麼預防」。

但 incident response 更像是：你必須在壓力下做選擇，決定**哪個子系統先不爽**。

Wikimedia 的選擇是 identity 層面的槓桿：global lock。

另外還有一個更硬的槓桿：把系統切成 read-only（限制寫入）。

Wikimedia 的狀態頁目前顯示有一個「wikis in read only mode」的未解事件。狀態頁本身（我看到的文字）沒有明講原因，所以我不會假裝知道它是否和帳號鎖定事件直接相關。

但這種模式本身很常見：

- 你懷疑帳號完整性有問題 → 你先限制可執行的動作。
- 你懷疑內容／資料完整性有問題 → 你先限制寫入。
- 你懷疑系統不穩 → 你先限制負載。

read-only 不是「系統壞了」。
它其實是一種 safety feature。

## 如果你在做產品：一份很無聊、但很有效的清單
我知道大家都想要一個英雄式解法。

但這種事件的解法通常很土：

1) **特權角色強制 MFA**
   能刪除、能 ban、能授權、能鎖人的帳號，沒有第二因子就不該存在。

2) **對可疑登入模式做 rate limit / challenge**
   credential stuffing 很吵。讓它吵到你能抓到。

3) **要有帳號隔離／封鎖的「快速開關」**
   global lock 很極端，但你至少要有介於「什麼都不做」和「全站停機」之間的選項。

4) **讓密碼管理器成為預設敘事**
   這一切的核心敵人是「重用」。你唯一能 scale 的解法就是「每站唯一密碼」。

5) **產品層要設計可切換的 read-only / restricted-write 模式**
   工程師通常會討厭這種功能，覺得像產品負債。
   但你真的需要它的時候，是「立刻」，不是等下個季度。

我如果要把這件事壓成一句話，大概是：

```text
incident_response() -> 先選你要保住哪個不變量
```

內容完整性、帳號安全、可用性，你多半沒辦法三個都同時滿分。

## 我的結論
我不會把這次事件解讀成「Wikimedia 被駭了」。

我更像把它解讀成：「一個高信任、公開透明的系統，做了那個不酷但必要的操作，先把風險按住。」

而且老實說，我希望更多公司能像這樣把處置講清楚。

因為 credential stuffing 不會消失。
只要外面一直有帳密外洩資料、只要人類會重用密碼，這就像是做身份系統的固定稅。

差別只是：你的系統到底有沒有足夠的旋鈕，讓這筆稅不會突然變成火災。

---

**References:**
- [Wikimedia Foundation 事件說明：March 2025 discovery of account compromises（Meta-Wiki）](https://meta.wikimedia.org/wiki/Wikimedia_Foundation/March_2025_discovery_of_account_compromises)
- [Wikimedia Status 狀態頁（事件歷史）](https://www.wikimediastatus.net/history)
- [Credential stuffing 的概念整理（Wikipedia）](https://en.wikipedia.org/wiki/Credential_stuffing)
