---
layout: post
title: "檔案系統突然又紅了（而且不是復古情懷）"
date: 2026-03-07 22:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![把檔案系統當成最無聊但最通用的介面](/img/posts/2026-03-07-filesystems-are-having-a-moment-01.webp)

我最近一直看到同一個論點在 agent 圈反覆出現：

**不要再堆一堆工具／插件了，給它一個檔案系統就好。**

老實說我一開始是有點酸。
檔案系統？2026？聽起來很像我們終於承認「agent memory」有一半其實就是把 `README.md` 換個名字。

但看完一篇在講「為什麼大家突然開始聊檔案系統」的文章後，我覺得這件事不是在吹古早味，也不是在說「資料庫要死了」。比較像是：

> **在 agent 時代，檔案系統正在變成 persistence 最低摩擦的 API。**

## 1) Context window 不是記憶，只是一塊白板

只要你用過 coding agent 在真的 repo 裡做事，你就懂那個焦慮：
事情正順，然後突然看到「context 快要 auto-compact」那行字一路逼近。

這不是「context window 再大一點就好」的問題，這是**記憶架構**的問題。

- context window 會被抹掉
- 沒有選擇性回想
- 沒有一個穩定地方存決策

所以大家做的事其實很人類：

- 寫下來
- 放在工作旁邊
- 需要時再讀回來

最通用的地方，就是檔案。

## 2) 檔案系統會贏在介面（但底下你可能還是需要資料庫）

檔案系統很無聊，但它無聊得很強：

- 每個工具都會讀
- 每個 OS 都有
- 每個 LLM 大概都「懂」怎麼用
- 可以直接跟 git / diff / grep 這些東西組合

所以現在最能打的那批 agent（尤其是 coding agent），往往都是那種**真的能在本機讀寫檔案**的工具。

但我不太信「檔案取代資料庫」這種極端說法。
我比較同意的模型是：

- **檔案是介面**（agent 直接摸到的東西）
- **資料庫是底層**（索引、併發、搜尋、去重、recency weighting）

你如果做過「在資料夾裡做快速語意搜尋」，就知道最後多半會走到：
你自己又做了一個迷你資料庫，只是你不想承認。

## 3) 一個很尖的提醒：寫得爛的 context files 可能比沒有更糟

文章裡提到一個我覺得很刺的點：
有研究顯示 repository-level 的 context files 可能會**降低 agent 完成任務的成功率**，同時把 inference cost 拉高。

這其實很符合我看到的現象：

- 你給 agent 一份很長的規則文件
- 它變得超級聽話
- 它很勤勞地把「所有該做的步驟」都做一遍
- 然後它就晚了半小時才走到真正需要修的那行

所以解法不是「把 onboarding 文件寫更長」。
解法比較像：

> **把持久化的 context 寫得更短、更具體、更能驗證。**

如果一條規則不會改變 agent 這週該怎麼做，那它大概不該在 hot path 裡。

## 4) 我真正覺得有價值的是：檔案格式正在變成 API

有趣的不是檔案系統本身，而是當**指令、技能、記憶**都開始變成「普通檔案」會發生什麼事。

因為一旦是檔案：

- 它可攜（portable）
- 它可審（auditable）
- 它不會跟著某個 SaaS 聊天介面一起消失

這是一種很小但很實際的反向拉力：
把重要的東西從「某個 app 的 chat history」搬回「你自己的資料」。

我不覺得 fragmentation 會消失（現在已經有一堆不同檔名在競爭）。
但我很希望最後會收斂到一個比較健康的狀態：

- 專案約束就放在 repo 裡
- 個人偏好放在你自己擁有的檔案
- 能力用可組合的 markdown 描述，而不是靠插件市集

這聽起來很樸素，但我覺得很對。

---

**References:**
- ["Filesystems are having a moment"（原文）](https://madalitso.me/notes/why-everyone-is-talking-about-filesystems/)
- [LlamaIndex："Files Are All You Need"（用檔案做 agent 記憶）](https://www.llamaindex.ai/blog/files-are-all-you-need)
- [LangChain：用檔案系統做 context engineering 的方法](https://blog.langchain.com/how-agents-can-use-filesystems-for-context-engineering/)
- [ETH Zürich：repo context files 對 agent 任務成功率的影響（論文）](https://arxiv.org/abs/2602.11988)
- [Dan Abramov：social filesystem（把資料當檔案來做互通）](https://overreacted.io/a-social-filesystem/)
