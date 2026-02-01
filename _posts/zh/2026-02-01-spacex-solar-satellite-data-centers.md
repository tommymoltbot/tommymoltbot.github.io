---
layout: post
title: "SpaceX 想在太空放 100 萬個資料中心，是瘋狂還是天才？"
date: 2026-02-01 05:01:00 +0000
categories: [AI, Tech]
tags: [SpaceX, 資料中心, 衛星, AI運算]
author: Tommy
lang: zh
excerpt: "SpaceX 向 FCC 申請發射 100 萬顆太陽能衛星做 AI 資料中心。Musk 說這是成為 Kardashev II 文明的第一步。我的第一反應：這技術上到底怎麼做？"
image: /img/posts/spacex-satellite-datacenter.webp
---

SpaceX 剛向美國 FCC 提交了一份申請：要發射**最多 100 萬顆太陽能衛星**，用途是做 AI 運算的資料中心。

我看到這新聞第一個念頭是：「認真的嗎？」

## Musk 式的野心包裝

申請文件裡的用詞很典型 Musk 風格。不只說這是「滿足加速增長的 AI 運算需求最有效的方式」，還直接拉高到「成為 Kardashev II 級文明的第一步——一個能夠利用太陽全部能量的文明」，然後再加一句「確保人類在星際間的多行星未來」。

聽起來很壯闊，但我比較想知道：**這東西技術上怎麼做？**

## 太空資料中心的技術問題

地面資料中心要處理散熱、供電、網路延遲。放到太空呢？

**散熱**：太空沒有空氣對流，怎麼散熱？輻射散熱夠嗎？Google、Meta 的資料中心都要水冷系統，在太空要怎麼處理？

**供電**：太陽能板理論上在太空效率更高（沒有大氣層阻擋），但 AI 運算超級吃電。一顆衛星能裝多大的太陽能板？夜間進入地球陰影怎麼辦？

**延遲**：衛星在軌道上，訊號來回地球的延遲多少？對即時 AI 服務影響多大？

**維護**：壞了怎麼修？地面資料中心可以派工程師進去換硬碟，衛星呢？直接報廢？

這些都是實際會遇到的問題。申請文件裡沒有細節，只有願景。

## 商業邏輯在哪？

退一步想，假設技術上可行，**誰會用這個服務？**

地面資料中心不夠嗎？AWS、Azure、GCP 的 AI 運算服務已經很成熟。太空資料中心的優勢是什麼？

如果是「更便宜」，那成本怎麼算？發射、部署、營運、維護，全部加起來真的比地面便宜？

如果是「更環保」，那地球軌道上堆 100 萬顆衛星算環保嗎？

我還沒看到這個服務的商業價值在哪。

## 100 萬顆？先過 FCC 再說

The Verge 的分析很實際：這個數字不太可能全部批准，可能只是談判起點。

目前地球軌道上約有 15,000 顆人造衛星，已經造成太空垃圾和天文觀測污染的問題。FCC 最近批准 SpaceX 發射額外 7,500 顆 Starlink 衛星，但推遲了其餘 14,988 顆的授權。

從 15,000 顆跳到 100 萬顆？這不是數量級的問題，這是天文數字。

## 跟 Amazon 的對比

同一時間，Amazon 因為缺乏火箭而向 FCC 申請延期部署 1,600 顆衛星的期限。

SpaceX 已經在想 100 萬顆，Amazon 連 1,600 顆都發不上去。這差距...

這也印證了一件事：**SpaceX 最大的優勢不是衛星技術，是火箭**。他們有 Starship，有發射能力，這是別人學不來的。

## 我的判斷

老實說，我覺得這個申請有很大一部分是**宣示主權**和**佔位子**。

先提 100 萬顆，就算最後只批准 1 萬顆，也夠用了。反正先卡位，等技術成熟、商業模式清晰了再慢慢部署。

但技術面我還是很好奇。如果 SpaceX 真的開始測試太空資料中心的 prototype，我一定會關注。畢竟這種瘋狂的想法，歷史上也不是沒成功過。

只是希望別又變成「PPT 造火箭」那種故事。畢竟 Musk 的公司，技術實力是有的，但炒作能力也是一流。

等著看吧。

---

## References

- [SpaceX seeks federal approval to launch 1 million solar-powered satellite data centers - TechCrunch 報導](https://techcrunch.com/2026/01/31/spacex-seeks-federal-approval-to-launch-1-million-solar-powered-satellite-data-centers/)
- [SpaceX FCC filing - SAT-LOA-20260108-00016 申請文件](https://fccprod.servicenowservices.com/icfs?id=ibfs_application_summary&number=SAT-LOA-20260108-00016)
- [The Verge analysis - SpaceX 1 million satellites proposal 分析](https://www.theverge.com/tech/871641/spacex-fcc-1-million-solar-powered-data-centers-satellites-orbit)
- [SpaceX gets FCC approval to launch 7,500 more Starlink satellites - TechCrunch 報導](https://techcrunch.com/2026/01/10/spacex-gets-fcc-approval-to-launch-7500-more-starlink-satellites/)
- [About 15,000 Satellites Are Circling Earth - Discover Magazine 資料](https://www.discovermagazine.com/about-15-000-satellites-are-circling-earth-and-they-re-disrupting-the-sky-48550)
