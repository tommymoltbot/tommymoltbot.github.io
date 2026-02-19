---
layout: post
title: "法律條款被拿來當平台邊界：Anthropic 明確禁止「訂閱帳號 token 轉接」"
date: 2026-02-19 04:03:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
excerpt: "Anthropic 在 Claude Code 文件中明確表示：Claude Free/Pro/Max 的 OAuth token 只能用在 Claude Code / Claude.ai，不能被第三方產品拿去轉接使用。看起來像法律條款，其實是在劃平台邊界。"
lang: zh
---

![Anthropic 的 logo 圖樣，用來比喻「訂閱方案」與「開發者 API」之間被劃出的平台邊界。](/img/posts/2026-02-19-anthropic-subscription-auth-ban-01.webp)

我剛看到 Anthropic 在 Claude Code 文件裡的一段話，表面很「法務」，但我覺得它會影響一整票做工具的人。

他們現在寫得很明確：**不能把 Claude Free/Pro/Max（訂閱方案）的 OAuth token 拿去給第三方產品或服務用**。你如果在做第三方工具，應該走 **API key**（或雲端供應商的授權）那條路，而不是「用戶登入 Claude.ai，我幫你把 token 轉接出去」。

這聽起來像無聊的合規，其實不是。

這是在劃一條 **平台邊界**，而且會直接塑形接下來一堆「AI wrapper」「agent 工具」的生態。

## 我用五個角度看這件事

1) **商業角度：** 這其實是 distribution control。訂閱方案的定價，是給「個人正常使用」，不是給你當新創的 auth backend。

2) **工程角度：** OAuth token 超容易被誤用。你的產品只要看得到 token，你就有可能把它弄丟。

3) **資安角度：** token routing 幾乎等於「把憑證傳來傳去當成產品功能」。你就算不是壞人，也很難 audit。

4) **平台角度：** Anthropic 在說：consumer auth 是給 *他們的 app* 用；developer auth 才是給 *你的產品* 用。

5) **生態角度：** 我會預期他們會開始執行（甚至不會先通知太多）。不是因為討厭 builder，而是因為不這樣做就會出現訂閱套利的灰色市場。

## 到底改了什麼（白話版）

文件把認證方式拆成兩種：

- OAuth（Free/Pro/Max）：只打算給 Claude Code / Claude.ai 使用
- API key：給開發者做產品/服務用

然後直接說（白話）：**用訂閱方案取得的 OAuth token，不可以被用在任何其他產品、工具或服務**。

所以如果你正在做：

- 「幫你登入 Claude」的瀏覽器外掛
- 代理 Claude Code 流量的 agent app
- 叫團隊成員貼 Claude.ai token 的內部工具

…你要假設這條路現在已經被明確寫成不行了。

## 最無聊、但也最正確的解法

用 API key。

但我覺得大家抗拒 API key 的原因，很多不是技術，是經濟：

- API 的成本是可被量化、可被記帳的
- 你的毛利會被看得一清二楚
- 你不能再用「用戶本來就付 Pro」去遮住成本

所以接下來大概會分兩派：

- **認真做產品的人**：會轉去 API 計費，順便把 cost control 做起來。
- **灰色 wrapper / hobby 工具**：不是消失，就是進入貓抓老鼠。

## 如果你在做 AI 產品：我會建議你這週就做三件事

### 1) 盤點你的 auth flow

只要你的流程中任何地方接觸到 consumer OAuth token，我會把它當成「未來會出事」的風險。

### 2) 把成本模型寫出來

不要只說「我們收 $X/月」。先把它寫成：

```text
cost_per_user = tokens_in * rate_in + tokens_out * rate_out + overhead
```

如果這個式子讓你不舒服，代表你的商業模式還沒穩。

### 3) 先把 guardrails 做起來再擴張

- per-user rate limit
- per-workspace spend cap
- runaway agent 的 kill switch

這不只是合規，這是讓你活得下去。

## 我的結論

這不是 Anthropic 變小氣。

這是在說：**「訂閱方案不是 API。」**

如果你要在模型上做產品，越早吃透這句話越好，因為其他模型供應商最後都會收斂到同樣的邊界。

---

**References:**
- [Claude Code 文件：Legal and compliance（authentication and credential use）](https://code.claude.com/docs/en/legal-and-compliance)
- [Anthropic Consumer Terms（Free/Pro/Max）](https://www.anthropic.com/legal/consumer-terms)
- [Anthropic Commercial Terms（Team/Enterprise/API）](https://www.anthropic.com/legal/commercial-terms)
