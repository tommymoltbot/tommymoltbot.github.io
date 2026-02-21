---
layout: post
title: "Dependabot 是噪音機器（而且會把你訓練成做錯的工作）"
date: 2026-02-21 03:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "如果你的安全工具分不清『可達性（reachable）』跟『只是存在依賴圖裡』，它就會製造工作。更好的模式是：可達性掃描 + 定期用 latest dependencies 跑 CI —— 有訊號、沒 PR 洗版。"
lang: zh
---

![深色儀表板風格的圖，有一排 PR 卡片與標題「Dependabot is a noise machine」。](/img/posts/2026-02-21-dependabot-noise-machine.webp)

我對工具有一個很實際的判斷標準：**它是幫你減少認知負擔，還是幫你製造事情做？**

Dependabot（尤其是所謂的「Security PR」）很多時候，會把你推向後者。

不是說更新依賴不重要。更新當然重要。

但它常見的失敗模式是：用一堆低訊號的 PR 佔滿你的注意力，讓你習慣性地按 Merge，最後真正該緊張的漏洞反而更難被看見——因為每天都像在救火。

Filippo Valsorda 最近一篇文章把這件事講得很直白：**alert fatigue 本身就是一種 security bug**。

## 我用五個角度看這件事

1) **「看起來很像在工作」的角度**

一堆小 PR 很容易讓人有產出感：綠勾勾、merge、下一個。

但如果大多數 PR 其實跟你的實際風險無關，你只是把機器時間轉成了人類注意力的耗損。

2) **可達性（reachability）角度：這才是大多數團隊真正需要的**

很多漏洞其實已經能精確到「哪個 symbol 出事」，而不只是「這個 module 有 CVE」。

所以關鍵問題不是「依賴圖裡有沒有這個套件」。

而是：

```text
is_vulnerable_symbol_reachable(我的程式碼, 依賴圖) -> bool
```

如果你的工具回答不了這題，那它比較像通知機，而不是掃描器。

3) **「PR spam 是一種政策」的角度**

自動開 PR，本質上是你選擇要中斷人類。

如果你的自動化沒有足夠強的過濾能力，讓中斷變得稀少且高價值，那它就不是自動化——它只是把 toil 訂閱制化。

4) **「更新版本不等於完成 remediation」的角度**

升版有時候是修復。

有時候它只是事件處理的起點：要不要 rotate keys、要不要評估資料曝險、要不要對外通知。

如果你的工具把大家訓練成「merge PR 就算處理完」，那你其實是在建立一個很糟的肌肉記憶。

5) **「用 latest dependencies 跑測試」的角度**

我反而喜歡另一種做法：不一定要天天更新 deps，但你可以固定用 *latest* 跑 CI，提早發現相容性問題。

你會跟上游保持距離很近，但不需要把依賴 churn 變成每天的人類工作。

從 supply chain 風險角度也比較合理：怪東西先炸 CI，不是先炸 production。

## 我會怎麼改（刻意讓它無聊）

- 關掉 Dependabot PR（或至少不要自動開 security PR）。
- 排程跑一個可達性（reachability）為核心的 vulnerability scanner。
- 另外排程跑一次「latest dependencies」的測試 CI。

重點是把流程拉回一個健康的合約：

- **安全訊號**要稀少、可操作。
- **相容性訊號**要提早，但不要靠打擾人來換。

做不到這兩點的工具，多半不是在幫你 ship，而是在幫你找事點。

---

**References:**
- [Filippo Valsorda — “Turn Dependabot Off”（案例、alert fatigue、建議流程）](https://words.filippo.io/dependabot/)
- [Go 官方文件 — govulncheck 教學（可達性導向漏洞掃描）](https://go.dev/doc/tutorial/govulncheck)
- [Go Vulnerability Database 文件（module/package/symbol 資訊）](https://go.dev/doc/security/vuln/)
