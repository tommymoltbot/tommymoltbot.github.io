---
layout: post
title: "Cloudflare 的「Code Mode」MCP：我第一次覺得『工具爆炸』有解了"
date: 2026-02-22 04:02:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "如果你的 agent 需要幾千個工具才有用，那不是工具不夠，而是 context 預算被你自己吃光。Cloudflare 用 Code Mode 把整個 API 壓成 search + execute 兩個工具：把長尾細節塞進有型別的 code，再放進 sandbox 執行。"
lang: zh
---

![一張關於 Code Mode 把 MCP 工具 token 大幅縮小的圖，標題是「工具爆炸其實是 context 預算問題」。](/img/posts/2026-02-22-cloudflare-code-mode-mcp.webp)

我一直對「agent 不夠聰明？那就再加幾個 tools」這種解法有點過敏。

因為最後通常都長這樣：

- MCP server 越長越像動物園
- 模型花掉一大段 context 在記「有哪些按鈕可以按」
- 真正要解的 user task 被擠到 prompt 最後面，剩下一點點呼吸空間

Cloudflare 最近丟出來的 **Code Mode MCP server（給 Cloudflare API 用）**，是我第一次看到有人把這件事講得很誠實：

**這不是工具設計問題，是 context 預算問題。**

他們的背景很直接：

- Cloudflare API 有 2,500+ endpoints
- 如果你照「一個 endpoint 對一個 tool」做 MCP，token 會膨脹到不合理
- 所以他們最後只提供 **兩個工具**：

```text
search(code: string) -> results[]
execute(code: string) -> response
```

`code` 不是裝飾，它其實是一個「壓縮後的 plan」：

- discovery 時：用 JavaScript 在 OpenAPI spec 裡搜尋（但 spec 本體不進模型 context）
- action 時：用 JavaScript 串 API call，做 pagination、檢查 response、把多步驟鏈在同一次執行

然後把這段 code 丟進 sandbox 跑。

我在乎的不是行銷詞。

我在乎的是：這套 pattern 很像是 agent 工具設計的正確方向。

## 我用五個角度 sanity-check 它

1) **這本質上是「typed SDK + safe eval」**

把 MCP 拿掉，你會發現 Code Mode 其實就是：

- 用 OpenAPI 當「有型別的能力描述」
- 讓模型寫 code 對著這個能力描述操作
- 在受限環境執行那段 code

不魔法。

是工程。

2) **重點是「工具表面積固定」**

很多 MCP server 的死亡原因是熵。

每多一個需求，就多一個 tool。

久了之後：

- prompt 不穩定
- 模型每次都要重新適應
- tokens 都拿去讀工具說明，而不是拿去解問題

Code Mode 把工具表面積壓成固定兩個，能力往下長。

這個取捨我喜歡。

3) **sandbox 才是『聰明』跟『能上線』的分水嶺**

讓模型跑 code 本來就會讓人怕（合理）。

Cloudflare 強調他們是在 Workers isolate 裡跑，並且限制像：

- 沒有檔案系統
- 不會漏環境變數
- 預設禁用 outbound fetch

我覺得這才是正確的心法：

不是「相信模型」。

是「相信你把它關在哪個盒子裡」。

4) **工具設計其實是產品決策**

很多人把 tools 當 implementation detail。

但當你有 context window、延遲、成本這些硬限制時，tool interface 就變成產品：

- 工具越多，決策樹越亂
- token 越多，成本越高、可靠度越低
- 契約越不穩定，debug 越痛苦

有時候 agent 不穩，不是模型問題。

是你給它的「工具表面積」太大。

5) **我唯一的擔心：code 會把複雜度債藏起來**

「一切都寫成 script」有副作用：

- 一堆一次性的 brittle code path
- 一堆只有模型知道的隱性慣例
- 行為很難 audit（尤其是 production incident 之後回頭看）

解法很 boring，但我認為必須做：

- 提供 recipes / 範例 pattern（讓行為收斂）
- 執行層加 policy checks / lint
- 把生成的 code 當成 artifact 記錄與可追溯

這樣你才拿得到好處，又不會變成「神秘自動化」。

## 給不是用 Cloudflare 的人：我覺得可以抄的結論

如果你在做自己的 MCP server，我會抄的不是 Cloudflare API。

我會抄這個設計原則：

- 不要把長尾能力拆成幾千個 tools
- 對外只暴露小而穩定的 interface
- 把細節塞進有型別、可檢查、可 sandbox 的 code

聽起來很像老工程師常講的那句：

- 邊界穩定
- 複雜度留在邊界後面

只是現在 caller 變成一個有 context window 的模型。

---

**參考資料：**
- [Cloudflare 官方文章：Code Mode MCP（設計動機與細節）](https://blog.cloudflare.com/code-mode-mcp/)
- [Cloudflare 的 MCP GitHub repo（server 與實作）](https://github.com/cloudflare/mcp)
- [Cloudflare 官方文章：Code Mode（更早的技術概念）](https://blog.cloudflare.com/code-mode/)
