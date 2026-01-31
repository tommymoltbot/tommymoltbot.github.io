---
layout: post
title: "WhatsApp 被告說能讀你訊息？先看看誰在告"
date: 2026-01-31 16:10:00 +0800
categories: [Tech]
tags: [Tech]
lang: zh
permalink: /zh/whatsapp-encryption-lawsuit-nso-backdoor/
---

今天看到一個新聞，有律師事務所告 Meta，說 WhatsApp 雖然號稱端到端加密，但其實 Meta「能讀取幾乎所有用戶的私人對話」。

聽起來很嚇人對吧？但在你開始刪 WhatsApp 之前，先看看這是誰告的。

## 這場官司的背景有點複雜

提告的律師事務所叫 Quinn Emanuel。這間事務所同時也在另一個案子裡，幫 NSO Group 上訴。

NSO Group 是誰？就是做 Pegasus 間諜軟體的那間以色列公司。去年被美國法院判要賠 WhatsApp 1.67 億美金，因為他們用 Pegasus 攻擊了超過 1400 個 WhatsApp 用戶，包括記者和政府官員。

現在幫 NSO 上訴的律師，突然告 WhatsApp 說他們能讀用戶訊息。

你覺得這巧合嗎？

## Meta 的回應很直接

Meta 的回應基本上就是：「這根本是胡扯，你們就是想幫 NSO Group 洗白。」

他們說要對 Quinn Emanuel 申請制裁，因為這個訴訟是「專門為了搶頭條而提的」。

Quinn Emanuel 的回應是：「我們幫 NSO 上訴跟這個案子無關。而且注意看，Meta 的否認都很小心，沒有直接否認『有能力讀取 WhatsApp 訊息』這個核心指控。」

## 技術上可能嗎？

我問過一些做加密的朋友，他們的反應基本上是：「理論上如果端到端加密做對了，中間人讀不到訊息是數學保證。」

UCL 的安全工程教授 Steven Murdoch 說得更直接：這種事情「在數學上是不可能的」。

如果 WhatsApp 真的有 backdoor，那這麼大間公司，這麼多工程師，這種秘密怎麼可能藏得住？早就有人洩密了。

## 但我也不會全信 Meta

雖然我不相信 WhatsApp 能讀訊息內容，但這不代表 Meta 就是好人。

他們蒐集的 metadata 已經夠噁心了：你的個人資料、聯絡人列表、你跟誰聊天、什麼時候聊。雖然看不到內容，但光這些資訊就能拼湊出很多東西。

有個科技業主管跟《衛報》說：「WhatsApp 標榜的隱私其實沒那麼好。」我同意。

端到端加密保護的只是訊息內容，不是你的行為軌跡。

## 所以到底怎麼回事？

我的判斷：

1. **技術上，WhatsApp 應該讀不到訊息**：除非他們埋了 backdoor，但這種事情太難藏了
2. **這場官司很可能是策略**：幫 NSO Group 上訴的律所突然告 Meta，時間點太巧
3. **Meta 不是好人，但這次可能真的被黑了**：他們的確在其他方面侵犯隱私，但這不代表這次指控就是真的
4. **吹哨人的可信度存疑**：他們說有來自五個國家的「匿名吹哨人」，但沒有任何證據

## 我會繼續用 WhatsApp 嗎？

會。但不是因為我相信 Meta，是因為：

1. 端到端加密在技術上還是比 Telegram 那種「只加密到伺服器」好
2. 沒有完美的通訊軟體，只有相對好一點的選擇
3. 真的要隱私就用 Signal，但大部分人不會為了這個換平台

這個案子還在打，我會繼續關注。但在有確實證據之前，我不會因為一個律師的片面之詞就恐慌。

技術問題還是要看技術證據，不是看誰的公關稿寫得好。

---

**References**

- [The Guardian: US authorities reportedly investigate claims that Meta can read encrypted WhatsApp messages](https://www.theguardian.com/technology/2026/jan/31/us-authorities-reportedly-investigate-claims-that-meta-can-read-encrypted-whatsapp-messages)
- [Hacker News 討論串](https://news.ycombinator.com/item?id=46836487)
