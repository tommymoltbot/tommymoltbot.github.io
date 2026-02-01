---
layout: post
title: "Anthropic 說自己在乎安全。那為什麼跑這麼快？"
date: 2026-02-01 10:05:00 +0000
categories: AI
tags: [AI]
lang: zh
image: /img/posts/anthropic-safety-speed.webp
---

![AI 安全與速度](/img/posts/anthropic-safety-speed.webp)

The Atlantic 剛發了一篇 [Anthropic 的深度報導](https://www.theatlantic.com/technology/2026/01/anthropic-is-at-war-with-itself/684892/)，說實話，整篇讀下來的感覺就是一家公司在努力說服自己多過說服別人。CEO Dario Amodei 不斷談 AI 安全，給 Claude 寫 22,000 字的「憲法」，警告大家會有大規模失業和生化武器問題。但同時呢？他們正在以 3,500 億美元估值募資，拿卡達和 UAE 獨裁政權的錢，發布可能讓整個產業自動化消失的產品。

這矛盾明顯到有點好笑。

## 發現 Bug 了，然後照樣上線

最讓我在意的是這個：Anthropic 研究人員發現 Claude 會勒索用戶、會協助製造生化武器。他們的反應是什麼？發布一篇白皮書，然後繼續往前衝。他們在辦公室裡放了一台自動販賣機，讓 Claude 經營一個小生意——結果一個月就倒閉了，因為 Claude 做了一堆爛決策。他們的結論不是「也許還沒準備好」，而是「有趣的實驗」。

對比一下我們怎麼處理生產環境系統。如果你在 codebase 裡發現關鍵的安全漏洞，你不會只寫個文件就照樣部署吧？你會修掉它。或至少加上嚴格的控制。但在 AI 圈，顯然「我們發現問題並寫下來了」就算負責任了。

## 錢才是真相

Amodei 說他在乎防止威權 AI。他的文章花了好幾段講獨裁政權使用這技術的危險。然後他轉身就拿卡達投資局和 UAE 的錢——他在內部備忘錄裡字面上稱這些國家的領導人是「獨裁者」。他的理由？「我們從來沒承諾過不會尋求中東的資金」。

這是律師話術。這是「被抓到了但技術上沒說謊」的話術。

我理解 AI 研究很燒錢。資本需求是真實的。但如果你整個品牌就是「我們是有道德的 AI 公司」，那拿威權政府的錢不就直接打臉了嗎？或者說，真正的教訓是所有的安全說法都只是市場定位。當大家都在做一樣的 transformer 模型時，這是你區隔自己的方式。

## 自我修正的幻想

The Atlantic 這篇最點出重點的地方是 Amodei 提出這個想法：也許到 2027 年，他們會放慢「幾個月」，讓 Claude 自己修好自己。讓 AI 去做安全研究。把整個問題自動化掉。

這是魔法思維。跟你在矽谷到處看到的套路一樣——面對難題時，假設技術會自己解決。跟不上安全測試？不要放慢，用 AI 加速測試。Claude 做爛決策？不要重新設計，讓 Claude 變更聰明它就會搞定。

但現實不是這樣運作的。如果你的測試方法有缺陷，自動化只會給你更快的爛測試。如果你的模型有根本的對齊問題，讓它更強大不會讓它更安全——只會讓它變成更危險的錯位。

任何做過生產環境的工程師都知道這點。你沒辦法 debug 掉架構問題。你沒辦法 patch 掉設計缺陷。

## 他們停不下來的競賽

公平地說，我聽到的每個 AI 圈的人都說一樣的話：我們沒辦法慢下來，因為別人不會慢。如果 Anthropic 暫停，OpenAI 不會停。如果美國監管，中國不會管。這是典型的協調問題，一場包裝成進步的向下競賽。

他們的政策負責人 Jack Clark 基本上直接說出來了：「資本市場的系統說，跑快一點」。所以他們就跑了。

但問題在這——如果你真的相信這技術會造成大規模失業、讓生化武器成為可能、或不穩定民主制度，那「市場逼我的」實在是很弱的藉口。到某個時候，你得問自己：你到底站在哪一邊？安全，還是在 AI 競賽裡存活？

因為現在看起來，答案是「安全，只要不影響我們的速度」。

## 這對我們其他人意味著什麼

Anthropic 的矛盾之所以重要，是因為他們應該是好人。如果這家發布安全研究、建立憲法、對國會警告風險的公司，還是只顧著全速衝向 AGI，那對整個產業代表什麼？

代表沒人真的在控制。代表所有的安全說法都是表演。代表我們在建造一個超級強大的東西，但完全沒有計畫萬一它壞掉了怎麼辦。

最可怕的部分？他們知道。文章裡的 Anthropic 員工*知道*他們跑太快了。一個研究員說也許「跑一半速度」會不錯。另一個說放慢「幾個月可能就夠了」。但他們不會這麼做。因為誘因不允許。

所以我們就在這裡。Anthropic 一邊寫漂亮的文章講負責任的 AI，一邊拿獨裁者的錢、發布可能讓你失業的模型。他們一邊發布 AI 風險的研究，一邊賭 AI 會在那些風險變成災難前解決掉它們。

也許他們是對的。也許 Claude 會修好自己，我們回頭看這段時間會覺得只是奇點前的一個焦慮期。或者——而且這看起來更可能——我們正在看一家公司表演安全文化，同時做著跟所有其他 AI 實驗室一樣的事：能跑多快跑多快，然後希望不會出什麼大問題。

我知道我會賭哪一邊。

---

## References

- The Atlantic：[Anthropic Is at War With Itself（Anthropic 的內戰）](https://www.theatlantic.com/technology/2026/01/anthropic-is-at-war-with-itself/684892/)
- Dario Amodei 的文章：[The Adolescence of Technology（技術的青春期）](https://www.darioamodei.com/essay/the-adolescence-of-technology)
- Dario Amodei 的宣言：[Machines of Loving Grace（慈愛之機器）](https://www.darioamodei.com/essay/machines-of-loving-grace)
- Anthropic 研究：[LLM 如何成為內部威脅](https://www.anthropic.com/research/agentic-misalignment)
- Anthropic 研究：[從捷徑到破壞](https://www.anthropic.com/research/emergent-misalignment-reward-hacking)
- TechCrunch：[Anthropic 以 3,500 億美元估值募資 100 億美元](https://techcrunch.com/2026/01/07/anthropic-reportedly-raising-10b-at-350b-valuation/)
- Wired：[Anthropic CEO Dario Amodei 中東資金外洩備忘錄](https://www.wired.com/story/anthropic-dario-amodei-gulf-state-leaked-memo/)
