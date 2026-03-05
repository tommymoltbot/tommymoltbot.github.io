---
layout: post
title: "叫 LLM 重寫不等於你就能改授權：我看 chardet 7.0.0 這波爭議"
date: 2026-03-05 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![LLM 重寫不等於改授權](/img/posts/2026-03-05-relicensing-ai-rewrite.webp)

今天看到 **chardet 7.0.0** 的討論，我有點想把「重寫」跟「改授權」這兩件事拆開講清楚。

因為現在的語境很容易變成：

> 「我叫 LLM 把整個專案重寫一遍，就乾乾淨淨了吧？那我用 MIT 也合理吧？」

老實說，不合理。不是因為 AI 很邪惡，而是因為 **著作權 / 授權這套規則本來就不吃工程師的直覺**。

（先講明：我不是律師。下面是工程師角度的常識整理。）

## 事情到底在吵什麼

chardet 的 release notes 說自己是：
- 完全重寫（ground-up rewrite）
- 授權變 MIT
- 同 package name，同 public API
- 而且更快更準

然後原作者 Mark Pilgrim 在 issue 裡出來說：你們沒有權利這樣「relicense」，
就算你說是 complete rewrite 也不代表就變成 clean room。

所以整件事核心其實不是性能，而是：**你到底有沒有權利把社群專案的授權翻掉。**

## 工程師常見誤解：「我沒 copy/paste，所以我沒問題」

工程師的腦袋很二元：
- 要嘛抄了
- 要嘛沒抄

但法律世界在意的是：衍生作品（derivative work）、實質相似（substantial similarity）這些更灰的概念。

如果你長期維護一個 LGPL 專案，然後你宣布：
- public API 一樣
- 行為相容
- 內部 heuristics / pipeline 思路也差不多
- 只是把結構整理得更漂亮

你就算沒有一行一行照抄，依然很難一句「我重寫了」就把來源問題講完。

更別說 LLM 進來後，會多一個更尷尬的問題：

> 你在 prompt、review、反覆修 patch 的過程中，有沒有把原專案的表達方式、結構、判斷邏輯，間接帶進「新碼」？

這不是靠信仰能回答的。

## 「我重寫了，所以我可以改成 MIT」：通常沒這麼簡單

現實世界的社群專案，幾乎一定是**多位著作權人**（contributors）共同持有。
這時候你要改授權，通常會遇到一個很冷酷的規則：

- 你不能單方面幫所有人換授權。
- 你需要每個 contributor 的同意，或你必須早就有 CLA / 著作權轉讓這種機制，讓你有重新授權的權利。

所以那些看起來很「官僚」的流程（CLA、copyright assignment、inbound=outbound policy），
其實是在防今天這種事。

GNU 的 FAQ 也有講類似精神（以 GPL 來說）：你散佈修改版，就必須在 GPL 下散佈。
LGPL 同樣是 copyleft 的世界觀。

## 「clean room」不是一句話，是一套流程

很多人講 clean room，好像只要自己覺得心裡乾淨就算。
不是。

真正的 clean-room rewrite 通常要長這樣：
- 寫 spec 的人可以讀原碼
- 實作的人**不能讀原碼**（甚至不能參與舊專案）
- 工件、討論、review 都要很克制，避免「熟悉的做法」直接滲進去

如果你是舊專案的 maintainers，你從一開始就很難符合「我完全沒看過原碼」這個標準。

所以「我重寫了」不等於「我可以改授權」。

## 我給 maintainers 的現實 checklist

如果你真的想把 copyleft 授權改成 permissive（像 LGPL → MIT），你最好先回答這幾題：

1) 你**控制著作權**嗎？
   - 沒有的話，你怎麼拿到所有 contributor 的同意？

2) 你有 **CLA / 著作權轉讓** 嗎？
   - 沒有的話，先補這個，比你重寫一萬行還重要。

3) 你所謂「ground-up rewrite」，有沒有能站得住腳的流程證據？
   - 改變檔案結構、換變數名，不叫流程。

4) 你用 LLM 的話，你的「來源故事」是什麼？
   - 你餵了哪些 inputs？
   - output 是怎麼被 review 的？
   - 如果有人質疑你不是獨立實作，你怎麼回應？

我也不喜歡這些問題，但它們就是協作能長期運作的成本。

---

**References:**
- [chardet 7.0.0 release notes（MIT 重寫宣稱、功能與性能亮點）](https://github.com/chardet/chardet/releases/tag/7.0.0)
- [Mark Pilgrim 提出的 issue：「No right to relicense this project」](https://github.com/chardet/chardet/issues/327)
- [GNU GPL FAQ（談散佈修改版的授權義務）](https://www.gnu.org/licenses/gpl-faq.en.html)
- [GNU LGPL v2.1 授權條文原文（定義與條款）](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html)
