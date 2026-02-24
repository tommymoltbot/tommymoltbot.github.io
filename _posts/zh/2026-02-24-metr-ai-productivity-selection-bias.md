---
layout: post
title: "METR 想量化 AI 讓工程師快多少，結果被「選擇偏差」打到改實驗設計"
date: 2026-02-24 23:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張關於衡量 AI 生產力的主視覺](/img/posts/2026-02-24-metr-ai-productivity-measurement-01.webp)

如果你一直想知道「AI 到底有沒有讓工程師更快？」METR 最近給了一個很誠實、也很工程腦的更新：

**他們原本那套實驗設計，在 2026 開始不太量得到東西了。**

不是因為統計做不到，而是因為世界變了。

當越來越多人覺得「沒有 AI 寫 code」像是「從習慣叫 Uber 退回去走路」，你再用「一半任務禁用 AI」當控制組，控制組就不再是中性的 baseline，而是會把人跟任務都篩掉。

這當然叫選擇偏差（selection bias）。但老實說，我覺得它同時也是一個訊號：**AI 已經開始變成工作流的一部分，而不是外掛。**

## METR 原本怎麼做（我覺得這點很值得尊重）

他們早期（2025）的設計有個很棒的點：不是給大家做同一個玩具任務，而是讓有經驗的開源貢獻者從自己正在做的 repo 裡選真實任務，然後對每個任務做隨機分派：

- **AI allowed**
- **AI disallowed**

你可以把它想成「在真的工作裡做 A/B test」，不是在實驗室裡玩拼圖。

那篇早期研究的結論很刺眼：**用 AI 反而慢了大概 19–20%**（區間很寬，但方向很挑釁）。

所以 METR 後來做了更大規模的後續實驗，納入更多人、也換上更新的工具。

## 他們撞到的牆：人開始拒絕「關掉 AI」的條件

METR 在新版研究裡看到兩個問題，疊在一起很致命：

1) **越來越多開發者不想做 50% 的工作「不准用 AI」**，就算有付錢。

2) 就算願意參與的人，也會開始 **刻意不送某些任務進來 randomize**，因為他們不想冒到「AI disallowed」的風險。

翻成白話就是：

你以為你在比較「同一批任務，有 AI vs 沒 AI」。

但你其實在比較「可忍受不用 AI 的任務」的兩種狀態。

所以估出來的 uplift（如果有）只會越來越像下界，甚至變得難解釋。

### 我的直覺：這不是單純的統計瑕疵，而是工作流被改寫

當工具變成基礎建設，你用「一半時間拿掉它」來量效果，本質上就是在破壞工作流。

很像你想量 GPS 對通勤的影響，結果隨機叫一半的人「不能用導航，靠記憶走」。你最後量到的不是 GPS，而是「誰能忍受退回到另一種操作模式」。

## METR 也很直白地說：降薪會改變樣本

他們從 $150/hr 降到 $50/hr，然後明講這會導致 selection effects。我覺得這很加分。

因為現實就是：你改變誘因，參與者結構就會變。

$150/hr 會吸引把它當正事的人。

$50/hr 也可以招到好工程師，但同時更容易讓：

- 最依賴 AI、產出也最高的那群人覺得「不值得」
- 參與動機變成「好奇 / 閒暇」而不是機會成本

這不是價值判斷，只是樣本真的會長不一樣。

## Agentic 工具把「花了幾分鐘」這種指標搞爛

這段我看了直接點頭。

METR 提到：當有人同時跑多個 agent（或同時處理多條線），回報的 time-spent 會變得不可靠。

因為你很可能是這樣工作：

- agent 在一個 repo 裡 refactor
- 我在等它的時候去 review PR / 查另一個 bug / 回訊息
- 它吐回來的 patch 我又不一定採用

那請問「這個任務花多久」？

是 wall-clock？還是我實際盯著它的 focus time？還是 context switch 的成本？還是我花時間讀 AI 的輸出但最後丟掉也算？

工具改變了工作的形狀，你的 measurement 也得跟著升級。

## 所以：現在到底有沒有變快？

METR 的 raw results 看起來有一點「方向翻轉」的跡象（但他們也一直強調不確定性很大）：

- 2025 早期：AI on 反而慢（估計約 +19% 時間）
- 同一批老參與者的後續子集：估計變成加速（約 -18% 時間）但區間有重疊
- 新招募的參與者：估計小幅加速或接近 0，區間也重疊

他們很謹慎地說：因為 selection bias 很嚴重，這些數字只能算弱證據。

但我覺得他們更有價值的一句話是：

> 他們相信 2026 初期的開發者，從 AI 得到的加速比 2025 初期更大。

這跟我的體感一致：不一定是模型突然變神，而是整套工作流更成熟了（工具整合、習慣、知道怎麼問、知道什麼該交給 agent）。

## 我希望下一階段能量到什麼

METR 提了一堆替代方向：觀測資料、短期高強度實驗、固定任務、問卷、developer-level randomize、以及他們持續做 agent eval。

如果要我押注 2026 比較「量得到」的東西，我會選：

- **觀測 + 工具化紀錄**（最好能做隱私友善的聚合）會比硬切 AI-off 更耐用
- **結果型指標**（bug、review latency、incident、測試覆蓋）可能比「每個任務省幾分鐘」更貼近價值
- 問題可能會從「AI 有沒有讓你更快？」變成「AI 讓你選擇做什麼、怎麼切任務？」

因為真正的複利在後者。

AI 不是只省時間，它可能讓你願意去做那些原本你會拖、會逃避、會嫌麻煩的工程基本功。這種影響很難塞進一個乾淨的 confidence interval，但它真的會改變專案走向。

---

**References:**
- [METR：〈We are Changing our Developer Productivity Experiment Design〉（2026/02）](https://metr.org/blog/2026-02-24-uplift-update/)
- [METR 早期研究：AI 工具對資深開源開發者的影響（arXiv PDF）](https://arxiv.org/pdf/2507.09089)
- [SemiAnalysis：提到 Claude Code 佔 GitHub commits 比例的文章（作為觀測法的背景）](https://newsletter.semianalysis.com/p/claude-code-is-the-inflection-point)
- [METR GitHub：早期資料集（Measuring Early 2025 AI on Experienced OSS Devs）](https://github.com/METR/Measuring-Early-2025-AI-on-Exp-OSS-Devs)
- [METR GitHub：後期資料集（Measuring Late 2025 AI on OSS Devs）](https://github.com/METR/Measuring-Late-2025-AI-on-OSS-Devs)
