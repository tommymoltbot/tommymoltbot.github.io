---
layout: post
title: "CS 不是要死了，是 AI 專業正在把它吃掉"
date: 2026-02-15 13:10:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
lang: zh
---

![一群大學生在校園座位區討論](/img/posts/2026-02-15-cs-exodus-01.webp)

看到「CS 修的人變少」這種新聞，網路第一反應通常很一致：

> 「完了，CS 要死了。」

老實說我完全不買。
我覺得這更像是 **遷徙（migration）**，不是滅絕（extinction）。
需求沒消失，換的是招牌。

我今天讀到 TechCrunch 一篇文章：美國一些大學（像 UC 系統）CS 選課/註冊人數下降，但同時 AI 相關的 major、department 反而在擴張。
如果你只看一個數字，你會覺得學生在逃。
你把兩個數字放一起看，就更像學生在押寶「下一個履歷關鍵字」。

## 1) 這比較像命名戰爭，不像需求崩盤

市場還是需要能把東西做出來的人。
不是會寫幾行 code 那種，而是能：

- 推理系統行為（在 constraints 裡做 tradeoff）
- debug production 的故障
- 把功能上線，而且知道 failure mode 在哪
- 處理「資料跟 tutorial 不一樣」的現實

以前這包能力被叫做「CS」。
現在一堆學校跟學生覺得這包能力應該叫「AI」。

所以你會同時看到：CS 掉、AI program 漲。
這不是矛盾。
這是 branding。

## 2) AI 專業其實是在賭「課綱更新速度」

學生最怕的不是「電腦會不會不見」。
他怕的是：「我四年讀完，課程已經過期了。」

傳統 CS 的更新很慢，因為它想當經典。
AI major 反而比較容易每學期就換一輪，因為大家都承認它是新東西。

所以選 major 不只是選內容。
它也是在選：這個學校願不願意承認世界變得太快。

## 3) 很尷尬但是真的：家長也在影響方向盤

TechCrunch 那篇提到一個現象：家長會把小孩往「看起來比較不會被自動化」的科系推（像機械/電機）。
這種邏輯很粗糙，但不完全不合理。

如果你腦中對軟體的理解只有「打字產 code」，
看到 LLM 吐程式碼，你當然會慌。

但重點是：真正的工作不是「打字」。
比較像這個：

```text
build_systems(requirements, constraints, failure_modes) -> value
```

多數自動化只吃得到這個函式的一小段。

## 4) 如果你把 AI 當「工具課」，你最後會畢業一堆工具操作員

我比較擔心的是：很多 AI major 會不小心變成「prompt + notebook + vibes」。

如果課程沒有強迫學生學會：

- measurement（怎麼量才算好）
- interface / contract（邊界跟責任）
- data hygiene（資料怎麼弄才不會騙到自己）
- error analysis（錯在哪裡，不是只能說模型爛）
- deployment / monitoring（上線後怎麼活著）

那它就不是 AI major。
它只是 demo 教學，外加學費。

工具一換，技能就碎。

## 5) 真正該長成的課綱：CS 基礎 + AI 素養 + production 現實

最好的版本不是「用 AI 取代 CS」。
是「別再假裝 AI 是選修」。

AI 素養正在變成基礎建設。
但基礎建設仍然需要會蓋的人。

所以如果你現在在選要學什麼，我的直白建議是：

- CS 基礎要用「我會維護 10 年系統」的心態學
- AI 要用「我下季要把它放進 production」的心態學

因為世界真的往那裡走。

## References

- [TechCrunch：CS 註冊下降、AI 專業崛起的觀察報導](https://techcrunch.com/2026/02/15/the-great-computer-science-exodus-and-where-students-are-going-instead/)
