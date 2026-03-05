---
layout: post
title: "Google Workspace CLI：動態長出指令這件事很酷，但也有點可怕"
date: 2026-03-05 08:25:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Google Workspace CLI (gws)](/img/posts/2026-03-05-google-workspace-cli-01.webp)

老實說我一開始看到「One CLI for all of Google Workspace」這種標語，直覺反應通常是：喔，又來。

但 **Google Workspace CLI（`gws`）** 有一個點真的讓我停下來：它不是硬寫一堆子指令，而是**靠 Google 的 API Discovery 文件，在 runtime 動態長出整個指令樹**。

聽起來很玄，但它其實是在承認一個現實：

- Google Workspace API 的 surface area 大到靠人手維護指令清單很難長期撐住。
- REST 文件你可以查到所有東西，但你不會覺得「好用」。
- 大家最後都在寫自己的 curl wrapper / 小腳本，然後一年後沒人敢碰。

## 我喜歡的部分：把 schema 當一等公民

Workspace API 的痛點從來都不是「我不會打 HTTP」。

痛點是：

- endpoint / params 到底要怎麼組
- pagination 怎麼搞才不噁心
- 哪個 API 沒 enable、要去哪裡點才能解
- 結果到底要怎麼輸出，才能舒服地接到下一個工具

所以當我看到它強調「structured JSON output」跟 schema introspection，我其實蠻買單的。

像這種用法：

```text
gws schema drive.files.list
```

我腦中想的不是「哇 AI agent」。
我想的是：終於有人把「API 的形狀」當成介面的一部分，而不是藏在文件裡。

## 我有點怕的部分：動態 discovery 也可能把不穩定藏起來

「Google 新增 endpoint，你的 CLI 會自動支援」這聽起來很爽。

但換個角度，它也代表：

- 你的 CI 可能某天就因為 Discovery doc 變了，行為跟昨天不一樣
- 文件、截圖、教學很快就過期
- tab completion 的世界變成流動的

如果要拿去做比較嚴肅的 automation，我會很在意它的穩定性策略（例如 Discovery doc 的 cache / pinning 機制、是否能鎖版本等等）。

## 比較意外的是：它的「agent 故事」其實是工程問題

repo 裡面也講 MCP、skills、agents。
通常看到這種詞，我會先把行銷濾鏡開到最大。

但這次我覺得比較不一樣的原因是：**如果你的 CLI 本來就輸出乾淨的 JSON，而且 request/response schema 明確，那 agent 只是一種消費者而已。**

人類用起來更好。
agent 也不用靠 prompt 去猜 output。

這不是 hype，這只是把介面做乾淨。

## 我的結論

如果你本來就常碰 Google Workspace（哪怕只是 Drive + Gmail），我覺得它值得你花個週末試一下。

它看起來不是要「顛覆什麼」，而是把幾個最煩的地方收起來：

- schema 驅動的指令樹
- 可預期的 JSON 輸出
- pagination / dry-run 這種工程師真的會在意的 ergonomics

唯一要小心的是：**能做全部事情的工具，最後你一定會依賴它**。
所以越早搞懂它的穩定性與風險範圍，越不會在半年後被反噬。

---

**References:**
- [googleworkspace/cli 專案首頁（README 與設計說明）](https://github.com/googleworkspace/cli)
- [Google API Discovery Service（Discovery 文件的概念與入口）](https://developers.google.com/discovery)
- [Model Context Protocol（MCP）官方概覽](https://modelcontextprotocol.io)
- [Google Cloud Model Armor（回應掃描 / prompt injection 防護的產品介紹）](https://cloud.google.com/security/products/model-armor)
