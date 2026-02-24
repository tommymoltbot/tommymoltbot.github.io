---
layout: post
title: "Steerling-8B：把 LLM 做成『可解釋』，其實是在補齊工程控制面"
date: 2026-02-24 07:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Steerling-8B 可解釋概念路徑](/img/posts/2026-02-24-steerling-8b-01.webp)

老實說，我以前聽到「可解釋的 LLM」通常都會先皺眉。

因為多數情況是：模型講錯了、講怪了、或突然政治腦了，然後大家開始做神經科學式的考古 —— 翻 activation、找 neuron、畫一堆漂亮圖表。

看起來很帥，但對做產品的人來說常常沒什麼用：**你還是沒辦法穩定地讓它“不要再那樣做”。**

Guide Labs 這次丟出來的 **Steerling-8B** 走的是另一條路：不是事後解釋，而是「從一開始就把解釋性做進架構裡」。他們宣稱對任何一段輸出，你可以追到三件事：

- **輸入 context**：哪些 prompt token 影響了它
- **概念（concepts）**：模型是經由哪些人類可理解的概念路徑產生它
- **訓練資料來源**：這段內容主要來自哪些訓練資料分佈（像 ArXiv、Wikipedia 等）

我不會在沒自己跑過、沒看過更多外部驗證前，就把這當成已經成立的事實。

但我覺得它值得看，原因很工程師：**agent 系統最痛的地方不是能力不夠，是你缺少可控性、可稽核性、跟 debug 的抓手。**

## 核心設計（以我理解）：讓「概念」變成真的訊號通道

Steerling 的關鍵做法是把表徵拆成幾條明確路徑：

- **約 33K 個 supervised 的「已知概念」**
- **約 100K 個模型自己發現的「未知概念」**
- 一條 **residual**（剩下的都丟這裡）

然後用 loss 去逼模型：不要把所有真正有用的推理都藏在 residual，反而要讓相當比例的預測貢獻走「概念」這條路。

他們報了一個數字：在 held-out validation set 上，**超過 84% 的 token-level contribution 來自 concept module**。

這個數字我其實很在意，因為可解釋模型最容易踩的坑就是：

> 你以為模型在走概念路徑，但其實它把真正有效的訊號都塞到旁邊的暗門（residual / side channel）了。

那你的解釋 UI 再漂亮，也只是在講一個「它願意讓你看到的故事」。

## 我最想要的是：概念 steering（如果它夠穩）

現實世界裡大多數的「安全」或「政策」其實是三種：

1. **事後過濾**（分類器、regex、blocklist）
2. **訓練去塑形**（instruction tuning、RL 類的方式）
3. **prompt / 系統規則**（通常很脆、而且不同 vendor 不同寫法）

這些都能用，但一旦你開始做 agent（多步、會自己 plan、會呼叫工具、會寫檔案/寫 ticket/寫信），你會越來越想要的是：**不是擋，而是控。**

Steerling 的賣點就是「輸出可以分解成概念貢獻，所以你可以在推理時直接壓低或放大某些概念」。

如果它真的能做到那種直覺的控制感，大概像這樣：

```text
steer(concept="violent_instructions", weight=-0.8) -> safer_output
```

（這不是他們真正的 API，純粹是我用來想像的介面。）

對 agent 來說，這種控制比「最後一步加一個 filter」重要太多，因為 agent 的風險不是一次性的回答，而是它可能：

- 自己嘗試 20 次
- 走偏了還會繼續補充理由
- tool call 參數越來越怪
- 最後在某一步做了不可逆的動作

你要的是：它一開始就不要往那個方向長。

## 訓練資料溯源：很誘人，但也可能變成「可信度表演」

「追到訓練資料來源」這件事我同時覺得很香，也有點怕。

香的地方是：

- 受監管產業一定會問：為什麼你做出這個判斷？
- 企業會問：這句話是來自我們內部知識庫，還是外面的網路雜訊？
- 版權/授權會問：你是不是在用你不該用的素材？

怕的地方是：

- provenance 很容易被誤用成「這句話 *確定* 來自某資料」
- 但現實是模型會混、會插值、會把多個來源的概念攪在一起

所以我會把它當成一種 evidence signal：對 debugging、對風險控管很有用，但不要把它當成法院等級的證據。

## 這件事放到 2026 的大趨勢，其實很合理

agent 越來越普及之後，我觀察到一個很無聊但很真實的結論：

- 能力一直上升
- 但 **控制、稽核、除錯** 才是瓶頸

你看 MCP 這種工具協定、權限控管、sandbox、eval suites，都在補同一個洞：讓 AI 系統可以「被運維」。

可解釋（而且可 steering）的模型也是同一類。

如果要我用一句工程師問題來驗證它值不值得投資，我會問：

> 我能不能把某個概念壓下去，然後它在不同 prompt、不同語言、不同多步 agent loop 裡都穩定地保持被壓下去？

如果答案是 yes，這不是「研究 demo」，這是非常實際的 production feature。

---

**References:**
- [Guide Labs：Steerling-8B 發布文章（概念路徑、可解釋性與釋出資源）](https://www.guidelabs.ai/post/steerling-8b-base-model-release/)
- [TechCrunch：Steerling-8B 與 concept layer 可解釋架構報導](https://techcrunch.com/2026/02/23/guide-labs-debuts-a-new-kind-of-interpretable-llm/)
- [Hugging Face：Steerling-8B 權重與模型卡（下載與說明）](https://huggingface.co/guidelabs/steerling-8b)
- [GitHub：Steerling 專案程式碼與使用方式](https://github.com/guidelabs/steerling)
