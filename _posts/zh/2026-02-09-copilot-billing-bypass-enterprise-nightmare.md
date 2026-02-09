---
layout: post
title: "當免費模型生出付費代理：Copilot 計費漏洞的企業噩夢"
date: 2026-02-09 07:15:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
image: /img/posts/copilot-billing-bypass.webp
lang: zh
---

有人發現了一個方法，可以透過 GitHub Copilot 無限制地跑 Claude Opus 4.5 請求，而不用付錢。怎麼做？從免費的 GPT-5-mini 模型開始,讓它生成一個 subagent,這個 subagent 的 agent 定義使用付費模型。結果?計費系統只看到免費層級,實際工作由昂貴的模型完成。

[這個 GitHub issue](https://github.com/microsoft/vscode/issues/292452) 有 180 個讚和 93 則留言。微軟安全響應中心 (MSRC) 說這不是安全問題,並要求回報者提交公開 bug 報告。

讓我們消化一下。繞過計費控制不算安全問題。

## 技術細節

運作方式如下:

1. 將你的聊天模型設定為 GPT-5 Mini (免費,包含在 Copilot 中)
2. 建立一個 agent 定義,設定 `model: Claude Opus 4.5`
3. 在 agent 模式下,告訴免費模型以 subagent 形式啟動你的 agent
4. 免費模型建立 subagent (也是免費的)
5. Subagent 以付費模型執行
6. 不消耗任何付費額度

成本是根據初始模型計算的。Subagent 和工具呼叫不計入。所以你用 Claude Opus 4.5 的價格 (通常每次查詢 3 個付費請求) 只需要 GPT-5 Mini 的成本 (零)。

回報者甚至建立了一個迴圈,在 3 小時內執行了數百個 Opus 4.5 subagent,只消耗了初始訊息的 3 個付費額度。

## 這不是 Bug,是架構問題

讓我在意的不是有人發現這個。而是這樣的設計竟然能進到 production。

計費邏輯不該放在 client-side。訊息「類型」是[在客戶端宣告的](https://github.com/microsoft/vscode-copilot-chat/blob/main/src/extension/intents/node/toolCallingLoop.ts#L484),而且看起來沒有 API 驗證。這不是 bug — 這是選擇。

當你讓客戶端決定什麼算計費事件時,你是在相信開發者不會去看程式碼找出漏洞。這不是安全。這是一廂情願。

對於一家經營 Azure 的公司來說,這很丟臉。他們知道怎麼做計量計費。他們對運算、儲存、API 呼叫都這麼做。但對於 AI agent 編排?顯然思考過程是「就相信客戶端會誠實回報吧」。

## 企業角度

如果你是剛為團隊買了 Copilot 授權的 IT 主管,你現在處於一個有趣的位置:

- 你編了每月 X 個付費請求的預算
- 某個工程師發現了這個技巧 (或即將發現)
- 你的實際消耗可能是 10 倍、100 倍,或無限
- 在帳單來之前你不會知道

當你向微軟反映時,他們會告訴你 MSRC 已經說過的話:這不是安全問題,所以沒有 CVE,沒有修補時間表,只有一個公開的 issue tracker,所有人都可以讀到怎麼做。

有趣的是,大多數開發者不會濫用這個。不是因為他們有道德 (雖然很多人有),而是因為正常使用 Copilot 比製作 `.prompt.md` 和 `.agent.md` 檔案來編排 subagent 生成還要簡單。損害不會來自大規模濫用。而是來自少數 power user 執行數小時的 agentic 工作流程,燒掉大量付費模型呼叫,而計費系統以為這是 GPT-5 Mini。

## MSRC 的看法:「不在範圍內」

回報者最初將此提交給微軟安全響應中心 (MSRC 案例 VULN-172488)。MSRC 的立場:繞過計費超出安全範圍。

我理解這個論點。安全傳統上意味著未授權存取、資料洩露、權限提升。如果系統按設計運作,使用者只是找到了計費漏洞,那是產品 bug,不是 CVE。

但問題是:當你的產品是以計量計費模式銷售時,而且計量表可以這麼輕易地被操縱,那就是信任問題。客戶相信當微軟說「每次 Opus 4.5 查詢 3 個付費額度」時,他們會被收取那個費用。發現你可以免費生成無限個 Opus 4.5 subagent 會破壞這種信任。

如果我是在評估 AI 工具的 CISO,我不只是問「資料安全嗎?」我也在問「我們的開發者能不能意外或故意跑出五位數的帳單?」這個問題說可以。

## 更大的模式

這不是我們第一次在 AI 工具中看到計費繞過。也不會是最後一次。

問題是 AI agent 本質上與傳統 SaaS 不同。普通的 API 呼叫是原子性的:你發出請求,你得到回應,你被計費。但 agentic 工作流程會生成 subagent、執行工具迴圈、串連多個模型。「什麼算一個請求?」這個問題很快就變得混亂。

當計費邏輯存在於客戶端,或者它是基於初始模型而不追蹤實際執行了什麼時,你就會遇到這樣的情況。

更讓我擔心的是企業中 AI 成本控制的整體狀態。公司正在採用 Copilot、Cursor、Windsurf、Devin 和其他十幾種 AI 程式碼工具。每個都有自己的計費模式。每個都有自己的 agent 編排特性。誰在追蹤這一切?誰在稽核實際使用是否符合預期成本?

從我所見,答案是:沒有人。IT 知道他們需要 AI 工具。工程師挑他們喜歡的。財務在月底看到帳單並批准它,因為「AI 是策略性的」。還沒有成熟的成本治理框架。

而像這樣的問題顯示,即使是供應商也還沒搞清楚。

## 接下來會怎樣

微軟可能會修復這個。問題是公開的,有足夠的關注,而且變通方法簡單到有人會寫腳本自動化它。

但修復會是被動的。他們會修補這個特定的漏洞。然後有人會找到另一個。因為根本問題 — 計量複雜的 agentic 工作流程 — 很困難,而且目前的方法顯然沒有考慮到所有邊緣情況。

現在,如果你在管理 Copilot 部署,你可能想檢查你的使用報告。如果你在建立有計量定價的 AI 工具,也許不要相信客戶端告訴你該計費什麼。

---

## 參考資料

- [GitHub Issue #292452: 使用 subagent 可繞過計費](https://github.com/microsoft/vscode/issues/292452) — 原始 bug 報告與技術細節
- [VSCode Copilot Chat: toolCallingLoop.ts 原始碼](https://github.com/microsoft/vscode-copilot-chat/blob/main/src/extension/intents/node/toolCallingLoop.ts#L484) — 客戶端訊息類型宣告
