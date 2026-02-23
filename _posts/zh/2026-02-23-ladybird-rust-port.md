---
layout: post
title: "Ladybird 開始把瀏覽器引擎搬到 Rust（而且把 Claude + Codex 當成電動螺絲起子在用）"
date: 2026-02-23 14:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Ladybird logo](/img/posts/2026-02-23-ladybird-rust-01.webp)

瀏覽器引擎把 Rust 拉進 C++ codebase，這幾年其實不算稀奇。
真的還算值得看的，是 **他們怎麼做**：不把專案搞成長期的「遷移內戰」，而是用一種很煩、但很像 production 的方式推進。

Ladybird（Andreas Kling 領導的獨立瀏覽器專案）剛寫了一篇「採用 Rust」的文章。坦白說，「記憶體安全」這個理由我聽到快背起來了；我比較有感的是他們給自己的硬限制：

- 他們把 JavaScript 引擎 LibJS 的一大段搬去 Rust。
- **Rust pipeline 必須做到 byte-for-byte 跟原本 C++ pipeline 一模一樣的輸出。**
- 過程中大量使用 Claude Code 跟 OpenAI Codex，但強調是「人主導」而不是放飛自動寫。

這組合看起來就不像那種「我們要重寫、要更乾淨、要更優雅」的幻想。
比較像是：你真的想出貨、真的怕 regression、所以不得不老實。

## 我喜歡的點：先求相容，再談品味

摸過成熟系統的人都知道，痛點從來不是「寫新 code」。
痛點是：你換內部實作的同時，**行為要穩**。

Ladybird 這次選的是最 boring（也因此最安全）的路線：

- 先挑相對自洽、邊界清楚的子系統。
- 讓測試當老大。
- 保留舊實作，做等價驗證。

他們從 lexer / parser / AST / bytecode generator 開刀，份量依然很大，但好處是「對錯」很清楚：有 test262，加上他們自己的 regression tests。

文章裡甚至說：你去看 PR 會覺得 Rust code 很像「從 C++ 翻譯來的」。
這種東西常被嘲笑，但只有沒出過貨的人才會把它當缺點。

你要的是 correctness，不是一開始就長得像 Rust 教科書。
你要的是「先一模一樣」，再慢慢變好看。

## Rust 在這裡是一種「政策」，不是宗教

他們其實在 2024 年評估過 Rust，當時拒絕的原因也滿務實：
web platform 的 object model 很 OOP、很 1990s（深繼承、GC 的那套思維），Rust 的 ownership model 不是自然的 fit。

但 2026 年他們的態度就是一句話：

> 夠了，該做務實選擇了。

Rust 在這裡不是「我們站隊 Rust」；比較像是想把專案的長期約束寫進 codebase 裡：

- **新寫的東西，應該更難「不小心」寫出 unsafe。**

再來，生態系跟 contributor economics 也很現實：
Swift interop 沒有走到他們要的地方；Rust 的跨平台支援跟工具鏈更成熟，而且貢獻者本來就比較多人會。

你不能忽略「誰願意維護」這件事。

## 「AI 幫忙」不是重點，重點是 workflow

我對那種「我們用 AI 兩週重寫 X」的文章其實很敏感。
因為很多時候是把風險藏起來，把帳留給未來的人。

Ladybird 這篇比較好，因為它承認這種工作真正長什麼樣：

- 幾百個小 prompt。
- 人決定要 port 什麼、順序是什麼、Rust code 最終想長什麼樣。
- 翻完之後，還做多輪 adversarial review，甚至用不同模型互相挑毛病。

這不是「AI 寫 code」。
比較像是：**AI 幫一個知道標準答案的人，做大量機械翻譯 + review。**

更關鍵的是 byte-for-byte 的限制，某種程度上是「讓 AI coding 變可控」的作弊碼：

- 你可以讓模型翻得很激進。
- 人類把注意力放在 invariants / 邊界 / 架構。
- 錯的地方直接被測試跟等價檢查打掉。

差別就是：
- 「幫我做一個新東西」→ 容易翻車
- 「把同一個東西用另一種語言寫出來，然後證明它一樣」→ 真的比較能落地

## 一個很現實的代價：翻譯腔 Rust 可能變成技術債

文章也很誠實：現在 Rust code 不 idiomatic，等 C++ pipeline 退場後會再整理。

我同意這個策略，但它也帶著一個真風險：

- 如果 cleanup 永遠沒做，你就會得到一坨「行為像 C++、維護起來也像 C++」的 Rust。
- 然後你還多了 FFI 邊界、兩套 toolchain、更多 build/debug 的複雜度。

專案慢慢死掉，通常不是因為一次大錯，而是因為「半完成」變成常態。

我猜 Ladybird 也知道這點，所以他們才強調：port 的順序跟範圍要由核心團隊協調，避免大家各自開工最後 merge 不進來。

## 我的結論

這篇故事最值得偷的，不是「Rust vs C++」也不是「Claude vs Codex」。
而是這個工程套路：

- 選一個有強 test oracle 的子系統。
- 用很硬的等價要求逼自己不要亂跑。
- 把 AI 放在它擅長的地方（翻譯、機械工作、review）。
- 人類負責 invariants 跟邊界。

這不是 hype。
這就是一套能用在 production 的 playbook。

老實說，我也覺得「AI coding」真正變成工程能力的時刻，就是它被焊進驗證流程、不能 freestyle 的時候。

---

**References:**
- [Ladybird 官方文章：採用 Rust 並在過程中使用 AI 輔助](https://ladybird.org/posts/adopting-rust/)
- [LibJS 的 Rust 移植 PR（想看 code 長什麼樣就看這裡）](https://github.com/LadybirdBrowser/ladybird/pull/8104)
- [test262：JavaScript 一致性測試套件](https://github.com/tc39/test262)
- [Anthropic 的 Claude Code 文件](https://docs.anthropic.com/en/docs/claude-code)
- [OpenAI Codex 產品頁（文章提到的工具）](https://openai.com/codex/)
