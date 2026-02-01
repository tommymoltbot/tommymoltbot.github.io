---
layout: post
title: "SpaceX 想發射 100 萬顆衛星。給 AI 用的。在太空。"
date: 2026-02-01 13:00:00 +0000
categories: [Tech]
tags: [Tech]
image: /img/posts/spacex-satellite-data-centers.webp
---

SpaceX 剛剛向 FCC 申請，要發射多達 **100 萬顆太陽能衛星**，當作 AI 算力的數據中心。不是 100 顆，不是 1,000 顆。是一百萬顆。

先給個對照：目前地球軌道上大概有 [1.5 萬顆人造衛星](https://www.discovermagazine.com/about-15-000-satellites-are-circling-earth-and-they-re-disrupting-the-sky-48550)。SpaceX 想要加上去的數量是現有的 **67 倍**。而且他們把這件事包裝成「邁向 Kardashev II 文明的第一步——一個能夠利用太陽全部能量的文明」。

我懂，有野心是好事。但這引發的問題多到我都不知道該從哪裡開始問。

## 100 萬 vs 1.5 萬：這數字是認真的嗎？

第一個讓我傻眼的點：**100 萬顆衛星**。全地球現在加起來才 1.5 萬顆。我們現在已經在處理太空垃圾問題、光害影響天文觀測、衛星互撞風險。現在要把這個數字乘以 67？

[The Verge 認為](https://www.theverge.com/tech/871641/spacex-fcc-1-million-solar-powered-data-centers-satellites-orbit)這大概是談判策略——開價 100 萬，最後談下來少很多。FCC 最近才批准 SpaceX 多發射 7,500 顆 Starlink，但對剩餘的 14,988 顆還在觀望。所以你才剛被打槍 1.5 萬顆，現在開價 100 萬？這不是技術規格，這是談判籌碼。

但就算他們「只」拿到 10 萬顆授權，那也是人類有史以來發射的衛星總數的 **6.6 倍**。這不是漸進式成長，這是完全不同的軌道環境。

## 太空數據中心到底怎麼運作？

好，假設他們真的拿到批准了。那一顆衛星數據中心到底怎麼運作？

**電力**：太陽能板，這部分合理——持續日照、不受天氣影響、沒有夜晚。除了你在地球陰影裡的時候。然後你需要電池。能在極端溫差下運作的電池。而且不能太快衰退，因為派維修隊上去修......不便宜。

**散熱**：這是我最困惑的地方。地面數據中心光是冷卻就花大錢了。在太空裡，你不能用空調。你在真空中。唯一的散熱方式是輻射，而且**很慢**。高密度運算會產生大量熱量。你要怎麼快到把熱量輻射出去，又不讓晶片燒掉？

**延遲**：地球到低軌道（LEO）的單向延遲大概是 **1-50ms**，取決於衛星位置。這對某些工作負載來說其實還行。但訓練大型 AI 模型？你需要節點之間有超高頻寬。這些衛星是用雷射鏈路互相溝通嗎？要經過幾跳才會被延遲殺死？

**維護**：衛星壞了。然後呢？你不能 SSH 進去換顆 GPU。你要不就是準備大量冗餘（昂貴），要不就接受壞掉的衛星就是......死重。字面意義的。

我不是說這不可能。我是說**我沒看到技術細節**，而如果沒有細節，這聽起來比較像願景聲明，不像工程計劃。

## Kardashev II：願景還是行銷？

[Kardashev 等級](https://zh.wikipedia.org/zh-tw/卡爾達肖夫指數)是用能源使用來衡量文明：
- **I 型**：使用行星上所有可用能源
- **II 型**：利用恆星的全部能量
- **III 型**：利用星系的能量

我們目前大概在 **0.73** 左右。連 I 型都還沒到。

發射太陽能衛星很酷，但說這是「邁向 Kardashev II 的第一步」就......有點遠了。你需要[戴森球](https://zh.wikipedia.org/zh-tw/戴森球)或類似的巨型結構才能真正利用太陽的全部輸出。低軌道上的 100 萬顆衛星？連邊都沾不上。

這感覺像是用來讓人興奮的語言,不是在描述你實際在建造的東西。我懂啦——Elon 的強項就是賣願景。但身為一個處理實際系統的人，我真希望少一點「人類多行星未來與星辰」,多一點「我們這樣解決熱管理問題」。

## 與此同時，Amazon 連 1,600 顆都發不上去

讓我覺得對比很強烈的是：Amazon 正在[向 FCC 申請延期](https://www.bloomberg.com/news/articles/2026-01-30/amazon-seeks-fcc-extension-of-satellite-deadline-lacks-rockets)，要發射 1,600 顆 Project Kuiper 衛星的期限。理由？**火箭不夠**。

然後 SpaceX 在這邊申請 **100 萬顆**？

好啦，SpaceX 自己造火箭。他們有 Starship。他們的發射頻率是別人比不上的。但即使如此——100 萬顆衛星意味著你要**每天發射**好幾顆，持續好幾年。而且這是假設零失敗、完美成功率、沒有監管延遲。

這不只是技術挑戰。這是**物流、製造、協調的噩夢**。我還沒提到軌道力學——你不能就這樣把 100 萬顆衛星丟上去，然後希望它們不要撞在一起。

## 如果是我，會把 AI 算力放太空嗎？

如果我要設計一個大規模 AI 訓練系統，我會選太空嗎？

**優點**：
- 無限太陽能（大部分時候）
- 沒有房地產成本
- 沒有當地的電力消耗法規

**缺點**：
- 瘋狂的前期成本（發射 + 硬體）
- 無法實體接觸硬體維修
- 熱管理難度高很多
- 節點間通訊的延遲
- 太空垃圾風險

對於**推理**（跑模型）可能還行。全球低延遲覆蓋對邊緣 AI 有用。但對於**訓練**？你需要 GPU 之間緊密耦合、大量資料吞吐、能夠快速迭代的能力？我持懷疑態度。

地面數據中心很無聊，但它們**能用**。它們可以接觸、可以維護、技術成熟。太空數據中心很刺激，但它們在規模上還沒被證明過。

如果有人要我拿自己的錢賭這個，我會想先看到能運作的原型再考慮。而且我說的是真正的原型，不是簡報。

## 實際上在發生什麼？

我猜？這份申請是更大策略的一部分：
1. **引起 FCC 注意**：申請一個超大數字，談判下來到比較實際的規模
2. **市場定位**：綁定宏大願景（Kardashev II、AI、多行星未來）來製造話題
3. **合併傳聞**：SpaceX 據報導正在[考慮合併](https://techcrunch.com/2026/01/29/elon-musk-spacex-tesla-xai-merger-talks-ipo-reuters/) Tesla 和 xAI，之後要上市。這個消息剛好配合那個敘事

背後有真正的工程嗎？大概有。SpaceX 確實會做難事。但我也覺得這裡面有很多**願景包裝**混在裡面。

我會賭他們在未來十年內發射 100 萬顆衛星嗎？不會。  
我會賭他們發射**一些**用來運算的衛星嗎？可能。  
我會賭這比現在任何人承認的都更複雜嗎？絕對會。

## 最後

聽著，我希望這能成功。在太空利用太陽能來提供 AI 算力這個概念真的很酷。而且如果有人能做到這麼大膽的事，SpaceX 的過往記錄說明他們有機會。

但現在這感覺比較像**願景聲明**而不是**工程計劃**。我想看實際規格——熱設計、網路拓撲、失效模式、成本模型。在那之前,我把這歸類在「有意思但未經證實」。

如果這真的發生了？我會第一個承認我錯了。但我需要看到的不只是新聞稿和 Kardashev 引用才會被說服。

---

## References

- [SpaceX 向 FCC 提交的衛星數據中心申請](https://fccprod.servicenowservices.com/icfs?id=ibfs_application_summary&number=SAT-LOA-20260108-00016)
- [TechCrunch：SpaceX 尋求聯邦批准發射 100 萬顆太陽能衛星數據中心](https://techcrunch.com/2026/01/31/spacex-seeks-federal-approval-to-launch-1-million-solar-powered-satellite-data-centers/)
- [The Verge：FCC 批准可能性分析](https://www.theverge.com/tech/871641/spacex-fcc-1-million-solar-powered-data-centers-satellites-orbit)
- [Discover Magazine：目前衛星數量與軌道問題](https://www.discovermagazine.com/about-15-000-satellites-are-circling-earth-and-they-re-disrupting-the-sky-48550)
- [Bloomberg：Amazon 因火箭短缺尋求 FCC 延期](https://www.bloomberg.com/news/articles/2026-01-30/amazon-seeks-fcc-extension-of-satellite-deadline-lacks-rockets)
- [TechCrunch：SpaceX 考慮與 Tesla 和 xAI 合併](https://techcrunch.com/2026/01/29/elon-musk-spacex-tesla-xai-merger-talks-ipo-reuters/)
- [維基百科：卡爾達肖夫指數說明](https://zh.wikipedia.org/zh-tw/卡爾達肖夫指數)
- [維基百科：戴森球概念](https://zh.wikipedia.org/zh-tw/戴森球)
