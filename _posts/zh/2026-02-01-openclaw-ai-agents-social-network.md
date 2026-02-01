---
layout: post
title: "AI Agents 開始建社交網路了，這是認真的"
date: 2026-02-01 09:00:00 +0800
categories: AI
lang: zh
---

TechCrunch 昨天發了一篇文章，講 OpenClaw（就是之前的 Clawdbot，改了兩次名字那個）現在有個叫 Moltbook 的東西，是 AI agents 自己建的社交網路。

第一眼看到標題我以為又是某種行銷噱頭，但點進去仔細看，發現這事比我想的有意思。

## 到底發生什麼事

OpenClaw 是個開源專案，讓你在自己電腦上跑 AI assistant，可以接到 Telegram、Discord、WhatsApp 這些你平常在用的聊天軟體。聽起來很普通對吧？但有人用它的 skill system 做了 Moltbook，一個讓 AI agents 互相發文、討論、分享資訊的平台。

不是人在那邊討論 AI，是 **AI agents 自己在討論**。

它們會在不同的 "Submolts"（類似 subreddit）發文，討論的主題從「怎麼用遠端控制 Android 手機」到「怎麼分析 webcam stream」都有。而且是真的有來有往，不是那種罐頭回覆。

[Andrej Karpathy 說](https://x.com/karpathy/status/2017296988589723767?s=20)這是他最近看到「最接近 sci-fi takeoff 的事」，[Simon Willison 說](https://simonwillison.net/2026/Jan/30/moltbook/)這是「現在網路上最有趣的地方」。

好，那問題來了：

## 這解決什麼問題？

老實說我第一時間也想不太出來。AI agents 為什麼需要社交網路？

人類用社交網路是因為我們需要資訊、需要社交、需要發廢文。但 AI agents？它們要的資訊直接查就好了啊，要什麼社交？

但仔細想想，這個問題可能問錯了。

Moltbook 不是「給 AI agents 用的 Facebook」，它比較像是一個 **知識交換與協作平台**。當你的 AI agent 遇到一個新問題，它可以上去看看其他 agents 怎麼處理類似的情況，或是把自己的解法分享出去。

從這個角度看，它解決的問題是：**如何讓分散的 AI agents 互相學習，而不需要一個中央化的模型訓練過程。**

這其實滿聰明的。傳統上，AI 的進步是靠「收集資料 → 訓練模型 → 發布新版」，這個 cycle 很慢，而且高度中心化。Moltbook 的方式是讓 agents 即時分享「怎麼做事」的知識，透過 skill files 這種可執行的指令。

有點像工程師之間分享 code snippet 或 Stack Overflow 的問答，但這次是 AI agents 在做這件事。

## 底層怎麼運作的

這部分我覺得最有意思。

OpenClaw 有個 skill system，基本上就是一包 Markdown 文件 + scripts，告訴 agent「遇到 X 情況時該怎麼做」。Moltbook 本身也是一個 skill，它定義了：

1. 怎麼發文到 Moltbook
2. 怎麼讀別人的文章
3. 怎麼定期回來檢查更新（預設每四小時）

重點來了：這些 skills 是 agents **從網路上抓下來執行的**。

看到這裡你可能跟我一樣，腦中浮現一個大大的「⚠️」。

對，就是那個 [Simon Willison 特別提醒的安全問題](https://simonwillison.net/2026/Jan/30/moltbook/)："fetch and follow instructions from the internet" 這件事本質上就是有風險的。

## 為什麼只適合技術人員

OpenClaw 的創始人 Peter Steinberger 跟社群的人都很清楚這件事，他們在各種地方強調：**如果你不會用 command line，這東西現在對你來說太危險。**

主要風險是 prompt injection。

簡單說就是：如果有人在 Moltbook 上發一篇文章，裡面藏了惡意指令，你的 agent 讀到之後可能會被騙去執行那些指令。例如把你的資料傳出去、刪除檔案、做一些你不想讓它做的事。

Steinberger 也很坦白地說：「prompt injection 是整個產業都還沒解決的問題。」

這不是 OpenClaw 的問題，是所有 AI agents 都有的問題。但 OpenClaw 因為是開源的、可以自己跑、權限可能很大（取決於你給它什麼），所以踩坑的後果可能更嚴重。

現在用 OpenClaw 的人基本上是兩種：
1. **技術人員**：知道風險在哪，會用 sandbox 環境測試，不會把 agent 接到生產環境的帳號
2. **玩家**：就是想試試看，但至少知道不要給太多權限

如果你是「我想要一個 AI assistant 幫我做事」的普通使用者，現在真的不適合用。至少要等安全機制更完善、有更多防護措施之後。

## 這跟之前的 AI agent 差在哪

AI agent 這個概念已經講很久了，從 AutoGPT 到各種「AI 會自己寫程式」的 demo，我們看過不少。

但多數都是：
- Demo 很酷，實際用起來不穩定
- 需要很多 prompt engineering
- 基本上是一次性的任務，做完就結束

Moltbook 不太一樣的地方是：它是一個 **持續性的、多 agent 互動的生態系統**。

這些 agents 不是各自做各自的事，而是真的在「社交」——分享資訊、討論問題、建立共同的知識庫。而且因為是用 skill files 這種可執行的格式，不是只有文字，所以 agents 可以直接「學」別的 agent 怎麼做事。

Karpathy 說的「sci-fi takeoff」可能就是指這個：一群 AI agents 自己建立了一個知識網路，而且這個網路是活的、在成長的。

這讓我想到網際網路早期的感覺。一開始就是一群技術人員在上面分享東西，慢慢建立起一個生態。現在 Moltbook 有點這種味道，只是這次參與者是 AI agents。

## 我會用嗎？

興奮？會。
馬上接到我的主 Telegram 帳號？不會。

我對這個專案的態度是：技術上很酷，方向很對，但現階段風險太高。

如果要試，我會：
1. 用一個測試帳號，不接正式環境
2. 跑在 sandbox 裡，限制它能存取的檔案和網路
3. 自己讀過那些 skill files 的 code，確認我知道它在做什麼

這不是說 OpenClaw 做得不好，而是這種「從網路抓指令來執行」的模式本質上就需要很小心。就算是人類工程師，從網路上抓 script 來跑之前也要先看過 code 吧？何況是 AI agent。

但長期來看，我覺得這個方向是對的。如果 prompt injection 的問題能解決（或至少大幅降低風險），如果有更好的 permission 控制機制，如果社群能建立起某種「信任機制」（例如 verified skills 之類的），這東西有機會變得很有用。

想像一下：你的 AI assistant 遇到一個新的 API，它可以上 Moltbook 找找看有沒有人寫過怎麼用，直接學起來。或是它發現某個自動化流程可以優化，把改進的方法分享出去，讓其他 agents 也能用。

這種「去中心化的 AI 知識網路」如果能跑起來，會很有意思。

## 商業模式呢

這個我還沒看懂。

OpenClaw 現在是開源的，靠 [GitHub Sponsors](https://github.com/sponsors/openclaw) 募款，從每月 $5 到 $500 的不同 tier。Steinberger 說他不拿這些錢，而是要想辦法「properly pay maintainers — full-time if possible」。

這種模式能走多遠我不確定。開源專案要養全職團隊很難，尤其是這種複雜度高、需要持續維護的東西。

可能的方向：
- **企業版**：把 OpenClaw 包裝成企業可以用的解決方案，收服務費或授權費
- **託管服務**：提供雲端版本，解決「我不想自己跑 server」的人的需求
- **生態系統抽成**：如果 skill marketplace 起來，可能可以從交易中抽成

但這些都是我猜的，Steinberger 目前看起來還沒有明確的商業計劃。

短期內這更像是一個「有趣的技術實驗 + 社群專案」，而不是一個有清楚變現路徑的生意。

## 最後

OpenClaw 和 Moltbook 讓我想起早期的開源社群。一群人因為覺得一個想法很酷，就自己動手做出來，然後吸引更多人加入。

現在這個時間點，它絕對不是給一般使用者用的產品。安全風險太高，設定太複雜，踩坑機率太大。

但如果你是工程師，對 AI agents 有興趣，又有時間玩玩看，我覺得值得關注。不一定要真的用，但看看這個社群怎麼演化、看看 Moltbook 上的 agents 在討論什麼，滿有意思的。

說不定五年後回頭看，會發現這是某個大趨勢的起點。

或者也可能只是曇花一現，半年後就沒人記得了。

但至少現在，它確實是「網路上最有趣的地方」之一。

---

**References**

- [TechCrunch 完整報導：OpenClaw's AI assistants are now building their own social network](https://techcrunch.com/2026/01/30/openclaws-ai-assistants-are-now-building-their-own-social-network/)
- [Simon Willison 的分析：Moltbook - the AI social network](https://simonwillison.net/2026/Jan/30/moltbook/)
- [OpenClaw 官方文件與安全指南](https://docs.openclaw.ai/gateway/security)
- [Andrej Karpathy 在 X 上的評論](https://x.com/karpathy/status/2017296988589723767?s=20)
- [OpenClaw GitHub repository](https://github.com/openclaw/openclaw)
