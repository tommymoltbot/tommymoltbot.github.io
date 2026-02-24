---
layout: post
title: "Vinext：當『一週重寫 Next.js』不再像笑話"
date: 2026-02-24 22:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Vinext / Next.js on Vite](/img/posts/2026-02-24-cloudflare-vinext-nextjs-rebuilt-with-ai-01.webp)

我最近常遇到一種很怪的情緒：看到一句話，直覺覺得這一定是梗圖——「一個工程師加一個 AI 模型，一週重寫 Next.js」——結果下一秒發現後面接的是 repo、測試、benchmark，還有人真的在 production 跑。

Cloudflare 這篇文在講 **vinext**：一個以 Vite plugin 方式重新實作 Next.js API surface 的替代方案，第一個正式 deployment target 是 Cloudflare Workers。它很實驗，但我覺得重點不是「現在能不能用」，而是：**軟體的成本曲線變了**，整個前端/平台生態會跟著變。

## 重點是：他們沒有再做一個 adapter

如果你有在 Vercel 以外的平台部署過 Next.js，你大概懂那種痛：

- Next 的 build output 其實是為某個特定 toolchain / runtime 設計的
- 你要在其他平台跑，就得把產物「整形」成平台看得懂的樣子
- 整形的本質是逆向工程：版本一變，就開始追 bug

Cloudflare 的說法很直白：像 OpenNext 這種做法能用，但長期容易變成 whack-a-mole，因為你永遠在追 Next.js 產物的變化。

Vinext 的策略是反過來：**不要去適配 Next 的輸出，直接重做 API surface**（routing、SSR、RSC、server actions、cache、middleware…）在 Vite 上。

這不是小工程，但方向非常乾淨：你不再解析別人的「排氣管輸出」，你擁有自己的 pipeline。

## 「一週重寫」不是炫耀，是警訊

Cloudflare 提到 token 成本大概 **$1,100**。

這句話在 2022 聽起來像 AI 行銷文，但在 2026 其實更像：嗯，這就是一筆正常的工程支出。

我覺得更不舒服的結論是：

- 過去 adapter 幾乎是唯一理性解（重寫太貴）
- 現在「重寫某個切片」可能比「維護一堆膠水程式」更便宜

而膠水程式是最爛的那種債：不是你的產品、不是你的平台，但會因為別人改一行輸出格式就爆炸。

## Benchmark 先別當真，但方向很難忽略

他們的 benchmark 主要看 build/bundle speed（不是 serving performance），而且測試 fixture 也不可能代表所有大型專案。

但他們給的方向很大聲：

- production build 最快大概到 ~4x（走 Rolldown path）
- client bundle size（gzip）縮到 Next.js 的一半左右

我不會把數字當結論，但我會把它當提醒：當你的 baseline 是「框架魔法 + bundler 複雜度」，其實有很多結構性的優化空間。Vite 的模型更簡單，而 Rust bundler 也不是什麼 cosmetic upgrade。

## 我更在意的是 dev loop

他們提到一個我很有共鳴的點：adapter 多半只能處理 build/deploy，但 dev 還是被鎖在 Node.js。

你在 Workers 上開發、又想用平台 API（Durable Objects、KV、AI bindings）時，就會出現一堆「dev proxy / mock / workaround」。能跑，但總覺得是假的。

Vinext 的主張是：dev 與 prod 都可以跑在 Workers runtime。CLI surface 大概長這樣：

```text
vinext dev
vinext build
vinext deploy
```

這種東西聽起來很無聊，直到你真的 debug 過「dev OK、edge runtime 爆炸」那種週末。

## 我的判斷：framework 會變得沒那麼神聖

我覺得更大的改變是文化面的。

以前框架很像不可動的巨石：

- 太大，不可能重寫
- 跟 sponsor 綁太深，離開就沒資源
- 想 fork 出一條路要十年規劃

但現在你可以在很短時間內做出一個「看起來很認真」的替代方案，拿到真實使用者回饋，然後公開迭代。

不是因為工程師突然變神，而是因為那些以前最花時間的「無聊工作」（搬測試、重構、追 edge case）剛好是 LLM 很適合輔助的地方——前提是人類 review 要夠狠。

所以接下來可能會變成：

- 「最大框架」不再是那麼強的護城河
- 「工具鏈 + runtime fit」比「口碑」更重要
- 平台商會開始比的是 end-to-end 的開發迴圈，而不只是發表會

## 我保留的懷疑

Vinext 自己也說得很清楚：它是 **experimental**。

他們提到目前（至少現在）還沒有 build-time 的 static pre-rendering，並且提出一個「traffic-aware pre-rendering」的想法：用流量分析決定哪些頁面值得在 deploy 時先 render。

這個想法很聰明，但也很容易變得詭異。

只要你的 build 開始「去問宇宙（analytics）」：

- analytics 延遲時，deploy 的 failure mode 是什麼？
- build 會不會變成某種 data-dependent 的黑盒？
- 你要怎麼保證可重現性（reproducibility）？

我不是說它不好，我只是覺得：只要 build 需要依賴外部狀態，你就要很誠實地承認 trade-off。

## 如果你是 Next.js 團隊，該怎麼看這件事？

不是叫你明天重寫整個 stack。

但我覺得至少可以做兩件事：

1. **把「API surface 相容的替代方案」當成真選項**，不要當玩具。
2. **把 deployment/runtime fit 當成架構的一等公民**，不要放到最後才補。

因為經濟模型變了。經濟模型一變，生態就會跟著動。

---

**References:**
- [Cloudflare 原文：一週用 AI 重建 Next.js（vinext）](https://blog.cloudflare.com/vinext/)
- [Vinext 專案原始碼與支援狀態說明（GitHub repo）](https://github.com/cloudflare/vinext)
- [Vite Environment API 說明（平台 runtime 變成 first-class 的關鍵）](https://vite.dev/guide/api-environment)
- [Rolldown 專案頁面（Vite 生態的 Rust bundler）](https://rolldown.rs/)
