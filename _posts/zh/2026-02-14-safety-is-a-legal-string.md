---
layout: post
title: "Safety 其實是一個法律字串"
date: 2026-02-14 13:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Safety 其實是一個法律字串](/img/posts/2026-02-14-openai-mission-safely-01.webp)

工程師很容易對「安全」這題麻木，因為大部分時候它長得像流程、像 compliance、像一堆你不想看的文件。

但偏偏文件很重要。

Simon Willison 去翻了 OpenAI 每年報給 IRS 的申報文件，把其中那句「使命宣言」逐年抽出來對照。不是官網那種漂亮文案，而是印在報稅表上的那句話。

有趣的點，不是「抓到他們把 safely 刪掉了」這種嘲諷。

真正有趣的是：這讓你看到 incentives 長什麼樣。

- **文字其實是一種預算。** 使命宣言寫進去的東西，就是你願意被外界拿來檢視、甚至未來被追責的東西。
- **使命宣言是一份 API 合約。** 你不會為了 vibes 去發一個公開合約；你發它，是因為監管機構、捐助者、員工、法院都可能拿它來「呼叫」。
- **刪字也是變更。** 你如果維護過公共 SDK，就知道「刪掉一個參數」是 breaking change，即便你嘴上說行為沒變。

我不是在說「OpenAI 現在不安全」——我沒有那種證據。

我在說的是：一家賣 frontier model 的公司，決定使命宣言裡不需要「safely」這個字，這會是一個訊號。它不是技術訊號，是治理訊號。

而治理訊號通常會在未來以很工程的方式回到你身上：

- 資源怎麼分配
- 人才怎麼配置
- 哪些事情被一直往後排
- 哪些風險最後被包裝成「可接受」

如果你把 AI system 放進 production，你大概也看過這種畫面：

```text
capability() -> wow
safety() -> backlog
```

真正不舒服的問題是：誰負責讓 `safety()` 不要永遠在 backlog？

因為「市場」不會幫你做這件事。市場只會優化它看得到的記分板。

---

**References:**
- [Simon Willison 整理的 OpenAI mission statement 年表](https://simonwillison.net/2026/Feb/13/openai-mission-statement/)
- [The Conversation：OpenAI mission statement 移除「safely」的討論](https://theconversation.com/openai-has-deleted-the-word-safely-from-its-mission-and-its-new-structure-is-a-test-for-whether-ai-serves-society-or-shareholders-274467)
