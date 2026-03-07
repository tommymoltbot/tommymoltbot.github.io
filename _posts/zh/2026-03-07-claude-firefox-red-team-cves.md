---
layout: post
title: "Claude 找到 22 個 Firefox 漏洞：重點其實不是 AI 多強，而是報告品質"
date: 2026-03-07 09:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Mozilla 的鎖頭風格插圖](/img/posts/ai-red-team-firefox.webp)

我其實很不愛看那種「AI 發現一堆安全漏洞」的新聞標題。

不是我不信，而是我太熟那個爛劇本了：
- 模型吐出一堆看起來很像漏洞的句子
- 維護者花時間看、驗證、打臉
- 最後不是修到 bug，是修到自己的耐心
- 開源社群又多一個討厭 AI 的理由

所以 Mozilla 這篇跟 Anthropic Frontier Red Team 合作的文章，我一開始也是抱著「好喔又來了」的心情看。

結果我看完的感覺反而是：**這次比較像真的 work 的流程**。

Mozilla 說他們用 Claude 輔助分析，在 Firefox 代碼裡找出 **22 個安全敏感 bug**（其中 **14 個被評為高嚴重度**），而且這些修復已經在 Firefox 148 上線。Anthropic 的技術文章也講得更直白：找到漏洞變便宜了；把漏洞變成 exploit 仍然比較難，但也不是不可能。

我覺得這整件事最值得看的點，反而是「他們怎麼做」，不是「模型多神」。

下面是我看完後真的改變想法的五個角度。

## 1) 「AI 找到漏洞」很無聊；「AI 交出可重現案例」才是重點

Mozilla 直接點出這批報告跟一般 AI 報告不一樣的原因：**minimal test case（最小可重現測試）**。

這聽起來像小事，但在安全領域它就是分水嶺。

「我覺得這裡可能有問題」不是 bug report，那只是一個直覺。

能讓工程師在本機跑起來、能重現、能進 debugger、能做 regression test 的東西，才是報告。

如果你要用 LLM 做安全研究，你應該盯著這個交付物：

```text
repro() -> crash
```

不是兩頁敘述文，也不是「可能可被利用」。就是：*用這個輸入它就掛掉*。

## 2) 這很像 fuzzing 的早期…但模型會「猜比較對的方向」

Mozilla 把這類技術比喻成 fuzzing 的早期，我覺得很貼。

fuzzer 很強，會挖出一堆 crash、assertion failure，但它也有偏好：
- 很會撞輸入空間
- 不一定會抓到需要語意理解的 **logic error**

Mozilla 說模型找到了 fuzzers 沒抓到的邏輯錯誤類型。

如果這是真的（22 個 CVE 不太像純吹牛），那比較合理的定位不是「取代 fuzzing」，而是變成一種混合體：
- 有點像會看懂專案慣例的 static analysis
- 也有點像會挑熱區先撞的 fuzzer

## 3) 維護者的 bottleneck 才是勝負點

Anthropic 說他們總共提交了很多報告（112），Mozilla 也協助他們調整什麼樣的發現值得提。

我覺得這段才是最現實的一刀。

安全團隊真正缺的不是「更多報告」，而是「每一個 engineer-hour 能換到多少可以 merge 的修復」。

AI 如果讓「候選發現」暴增 10 倍，那瓶頸只會更快轉移到 triage。

要讓它能 scale，只有幾個方向：
- 可重現的證據（repro）
- 清楚的嚴重度訊號
- 以及更敏感但也更重要的：**可 review 的 patch**

Mozilla 說他們能很快開始落修，是因為報告可驗證。這就是門檻。

## 4) 「找漏洞便宜、寫 exploit 昂貴」很安慰，但不是安全保證

Anthropic 的數據是：他們跑了幾百次，花了大概 **$4,000** API credit，最後只有 **兩個**漏洞真的被模型自動做成可用 exploit（而且是在刻意弱化防護的測試環境）。

這件事我覺得可以同時成立兩種解讀：
- 從防守者角度：好，還是有摩擦成本
- 從現實角度：兩個不是零

而且真正可怕的是成本曲線。

今年是 $4,000；明年可能變 $400；再下一年也許 $40。

所以「LLM 還不太會 exploit」不能當策略。

策略只能是：**加速 find-and-fix、縮短漏洞壽命、把 sandbox / defense-in-depth 做更硬**。

## 5) 給工程師最實用的 takeaway：先做 verifier，再讓模型去磨

Anthropic 那篇最實用的概念是「task verifiers」。模型有可信的自我檢查工具時，品質會上升很多。

他們提到的 verifier 大概就是：
- 修補前能觸發漏洞
- 修補後不再觸發
- 然後用測試套件抓 regression

這個模式其實不只適用安全。

它跟我之前看 LLM 產出「看起來很合理但很慢」的系統代碼那種災難，本質是同一件事：

如果你不先定義成功（benchmarks、invariants、測試工具），模型就會交出一個 *plausible* 的答案。

在安全領域，plausible 甚至連及格線都不到。

## 我現在的結論

我不覺得這件事的重點是「Claude 變成超級駭客」。

比較煩、但比較有用的重點是：
- **LLM 正在把某些型態的安全審計變成 throughput 問題**
- 真正能吃下這個 throughput 的團隊，會靠流程贏，不是靠喊口號

也就是：triage、repro 品質、自動驗證、以及把「可行證據」當成最低標準的文化。

如果你是維護者，我真心建議你先把「什麼叫好的 AI bug report」寫成規格——

不然你的 inbox 會用很難看的方式逼你學會。

---

**References:**
- [Mozilla 官方說明：Hardening Firefox with Anthropic’s Red Team](https://blog.mozilla.org/en/firefox/hardening-firefox-anthropic-red-team/)
- [Anthropic 技術文章：Partnering with Mozilla to improve Firefox’s security](https://www.anthropic.com/news/mozilla-firefox-security)
- [Mozilla 安全公告 MFSA 2026-13（Anthropic 文中引用）](https://www.mozilla.org/en-US/security/advisories/mfsa2026-13/)
