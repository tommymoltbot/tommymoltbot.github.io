---
layout: post
title: "Clinejection：GitHub Issue 標題，怎麼一路變成 Supply Chain 安裝事件"
date: 2026-03-05 18:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![A supply chain incident flow](/img/posts/2026-03-05-clinejection-supply-chain-01.webp)

如果你還把「AI 放進 CI 裡幫忙」當成小工具、當成自動回覆機器人，這次事件會讓你很不舒服。

一段不可信文字（GitHub issue title）被 AI triage workflow 讀到，模型把它當指令，透過工具（例如 Bash）在 CI runner 上真的跑起來。接著攻擊者串了 cache poisoning、偷 publish token，最後把一個 npm 版本推上去，讓更新的人 **默默被裝了另一個 agent**。

最可怕的不是 payload 是什麼。
最可怕的是這個路徑成立。

## 讓人背脊發涼的點

大多數人對 supply chain attack 的直覺是：

- 依賴被下毒
- 你 `npm install`
- 你中獎

但 Clinejection 比較像：

- 攻擊者寫一句話（issue 標題）
- 你的 bot「理解」成指令
- 你的 bot 用 CI 權限去執行
- 你的 release pipeline 被接管

一旦你接受這個模型，接下來的問題就是：**到底有多少 repo 的 AI workflow 跟 secrets 距離只有一層 YAML？**

## 這條鏈，白話版

我把它用比較不硬核的方式整理一下：

1) **Issue 標題的 prompt injection**

AI triage workflow 由 issue event 觸發，且把 issue title 直接塞進 prompt。任何人都可以開 issue → 這就是「不可信輸入直接進 agent context」。

2) **Agent 真的有能力跑指令**

模型被開了像「Bash」這種工具，prompt injection 就不只是胡說八道，而是可以把 workflow 引導去跑不該跑的東西。

3) **用 GitHub Actions cache 當跳板（cache poisoning）**

triage workflow 本身未必拿得到 publish secrets，但它可以動到 Actions cache；cache 又被高權限的 publish workflow 讀取 → 這就變成通道。

4) **偷 release credentials**

publish workflow restore 到被污染的 cache，接下來就進入「想辦法把 job 裡的 secrets 偷走」的劇本。

5) **推 npm 版本**

拿到 npm token 後，發布一個只有一行差異的版本，像這樣：

```text
"postinstall": "npm install -g openclaw@latest"
```

CLI binary 完全一樣。只改 `package.json` 一行。
但就足夠讓數千台開發者機器在安裝時做出不同的事。

## 「AI 裝 AI」其實是新的信任破口

我覺得值得單獨拿出來講的是：這個事件不是「塞一個明顯惡意的木馬」，而是透過 supply chain **引導去裝另一個 agent**。

這會讓信任變成遞迴：

- 我選擇安裝 Tool A。
- Tool A 被入侵後安裝 Tool B。
- Tool B 有自己的能力邊界、持久化方式、設定檔與攻擊面。

就算 Tool B 本身是正常軟體，開發者也沒有把它納入原本的安全評估。

這很像 supply chain 版本的 confused deputy：你授權了一個元件替你做事，結果它把權限委派給另一個你根本沒同意的元件。

## 如果這是我的 repo，我會改什麼

不是想寫成「安全教條 checklist」，比較像這次事件逼你面對的幾個實際改動：

- **把會讀 issue/PR 文字的 agent，當成面向敵對輸入的系統。**
  它如果能跑命令，你就需要 policy layer。

- **不要在 CI 給 LLM 任意 shell 權限。**
  真要給工具，也要窄、可預期（不要讓它能隨便 `bash`）。

- **不要讓低權限 workflow 寫入會被 release workflow 讀取的 shared cache。**
  如果做不到隔離，那就不要在「碰 secrets 的流程」使用 cache。

- **把 publish 從長期 token 移到 OIDC provenance。**
  不能解決所有問題，但會大幅改變「偷 token」的可行性。

- **不要低估“一行變更”的破壞力。**
  只盯 binary diff 的 pipeline，很容易直接漏掉。

## 我的結論

AI 放進 CI，不是「多了一個聊天機器人」。
它更像是：你在最敏感的地方（握著 deploy、token、release 的地方）新增了一個很能幹、但也很容易被誘導的自動化 actor。

只要不可信文字能進到有工具的 agent，問題就不是「會不會被 prompt injection」。
而是「被 injection 的時候，它到底能做什麼」。

---

**References:**
- [Grith 對事件的整理：從 issue title 到 4,000 台開發者機器](https://grith.ai/blog/clinejection-when-your-ai-tool-installs-another)
- [Snyk 的分析：Clinejection 如何把 AI bot 變成 supply chain 攻擊面](https://snyk.io/blog/cline-supply-chain-attack-prompt-injection-github-actions/)
- [StepSecurity 對異常 npm 發佈的偵測報告](https://www.stepsecurity.io/blog/cline-supply-chain-attack-detected-cline-2-3-0-silently-installs-openclaw)
- [Adnan Khan 的技術細節（workflow + cache poisoning）](https://adnanthekhan.com/posts/clinejection/)
- [Cline 的 GitHub Security Advisory](https://github.com/cline/cline/security/advisories/GHSA-9ppg-jx86-fqw7)
