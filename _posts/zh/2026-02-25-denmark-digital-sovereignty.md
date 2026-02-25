---
layout: post
title: "丹麥要離開 Microsoft：重點其實不是 LibreOffice，而是『能不能自己踩煞車』"
date: 2026-02-25 11:00:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![丹麥數位主權](/img/posts/2026-02-25-denmark-digital-sovereignty-01.webp)

看到「政府單位要把 Microsoft Office 換成 LibreOffice」這種新聞，大家第一反應通常是：

- 「那 .docx 怎麼辦？」
- 「巨集、格式會死一片吧？」
- 「最後一定會回去 Microsoft。」

我覺得這些吐槽都合理，但它們都只是在看表層：**Office 套件長得像什麼**。

丹麥這次比較像是在講一件更現實的事：

> 「當政治、價格、平台策略突然變動時，我們是不是有能力自己踩煞車？」

根據報導，丹麥的數位現代化相關部門預計下個月先讓超過一半員工從 Microsoft Office 轉到 LibreOffice，目標是在今年底前完成更完整的開源轉換。他們也明說了：希望降低對美國科技公司的依賴。

## 無聊但真實：表格與文件只是入口
是的，辦公套件真的會痛。

格式相容性、流程表單、模板、習慣、訓練成本……這些都是硬成本。

如果只是省錢，正常作法是談授權、砍方案、重新採購，政府很擅長做這種事。

但這次他們明顯是在做「更痛」的選擇，表示目的不是省那幾張 license。

## 真正的痛點：依賴感只會在最糟的那天爆開
vendor lock-in 平常其實不明顯。你是在這些時刻才會真的被打醒：

- **支援截止日到了**（像 Windows 10 停止支援這種硬 deadline）
- **地緣政治/監管風向變了**，資料落地與主權突然從「理念」變成「風險」
- **平台漲價或改規則**，你只剩下「吞下去」或「緊急搬家」

「數位主權」講白一點就是：

> 「我希望我能走，但我不要只能用『放火』的方式走。」

LibreOffice 可能不是終點，它更像是：丹麥願意先付一筆遷移稅，去買到「可退出」的選項。

## 以工程師角度，我更在意的是這些（不是 Office 的 UI）
Office app 是最顯眼的，但真正決定成敗的通常是周邊系統：

1. **身分與裝置管理**：如果要鬆開 Microsoft 365，那 auth、MDM、政策與稽核靠誰？
2. **Email / 行事曆**：動到 Outlook/Exchange 相關，組織痛感會瞬間倍增。
3. **文件工作流**：合規、保存期限、搜尋、法遵調閱、簽核。
4. **格式與互通規則**：內部是否強制採用開放格式（像 ODF），還是最後仍然活在 .docx 宇宙？

如果丹麥（以及歐洲其他正在做類似事情的地方）能整理出一套可重用的遷移劇本，這件事就不只是「一個國家很硬」而已，而是會變成很多組織都能參考的路線圖。

## 我的結論
我不覺得「開源」是魔法。開源是工作，甚至很多時候是苦工。

但我也覺得：**控制權這種東西，平常你不會覺得它值錢，直到你失去它。**

而且我滿欣賞他們說「太複雜就可能回去」這句話。那不是軟弱，那是 operational honesty。

最後如果真的做成了，最大的成果也不是 LibreOffice。

最大的成果是：證明一個現代組織可以把「退出方案」當成一開始就要設計的能力。

---

**References:**
- [Recorded Future News：丹麥政府單位推動以開源軟體取代 Microsoft 產品，目標降低依賴](https://therecord.media/denmark-digital-agency-microsoft-digital-independence)
- [Politiken（丹麥文）：部長談論在數位化部門逐步淘汰 Microsoft 的計畫](https://politiken.dk/viden/tech/art10437680/Caroline-Stage-udfaser-Microsoft-i-Digitaliseringsministeriet)
- [Euronews：丹麥主要城市先前也曾以成本與主權等理由宣布移轉](https://www.euronews.com/next/2025/06/12/two-city-governments-in-denmark-are-moving-away-from-microsoft-amid-trump-and-us-big-tech-)
