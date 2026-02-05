---
layout: post
title: "硬體壞掉時，看起來就像模型變笨了（Production Debugging 的一課）"
date: 2026-02-05 22:00:00 +0000
categories: [Engineering]
tags: [Engineering]
image: /img/posts/debugging-hardware-not-model.webp
---

有一種 production 問題，最討厭的地方不是難修，而是很「耗心力」。

你跑一個 LLM pipeline。

輸出是垃圾。

第一反應很容易就會變成：*「模型在 hallucinate」*。

有時候是。

但有時候模型沒變、prompt 沒變、你 code 也沒寫錯 —— 壞掉的是 **硬體**。

我想把這件事寫下來，因為我看過也體驗過那種 debug 螺旋：你開始改 prompt、加 guard、調 sampling 參數，想盡辦法讓輸出「看起來像樣一點」；但其實你真正需要做的，是最無聊、也最關鍵的兩個 sanity check：

- 這個計算結果在同樣條件下，數值有沒有一致？
- 這台設備 run-to-run 的行為，還像同一台設備嗎？

## 陷阱：LLM 的失敗長得很像「模型品質」問題

LLM 系統的失敗特別會遮蔽 root cause。

硬碟壞了，通常你會看到 IO error。

DB 掛了，你會看到 timeout。

但 LLM pipeline 出事，很多時候你還是會拿到一段「看起來很像人話」的文字，只是它剛好錯到會讓你開始懷疑自己。

所以「輸出很怪」這個症狀很危險：它不指向某一層。

它直接打到你自尊心。

## 一個真實案例：iPhone 上跑 MLX，最後發現是 Neural Engine 壞了

之前有個故事在傳：有人在 iPhone 16 Pro Max 上跑 MLX LLM，輸出莫名其妙。

他做了所有正常工程師會做的事：

- 檢查 pipeline
- 對比 tensor 數值
- 換 input 測試
- 嘗試在可控條件下重現

最後結論很煩但很乾淨：**Neural Engine 硬體瑕疵**。

不是 prompt。

不是 MLX bug。

也不是「LLM 本來就不可靠」。

就是單純一台機器壞掉。

而最痛的點是：他花了三天以為自己不會寫 code。

## 我自己的 production 規則：別急著改 prompt，先驗證地基

如果你真的在乎 production，你需要一個很 boring 的 default posture：

1) **先檢查 determinism（或至少可控的 randomness）**

如果你預期同樣 seed/設定應該一致，那就驗證。

如果你本來就不追求 deterministic，也至少要確定結果的分佈穩定，不要忽上忽下。

2) **做 cross-run 的數值 sanity**

同一個 input，把 intermediate tensors / logits 拿來比。

如果你看到奇怪的漂移，不要第一時間就把它合理化成「量化」或「浮點誤差」。

拿另一台設備跑一次，比你寫 200 行 workaround 更快。

3) **先 A/B 硬體，再 A/B 模型**

換 checkpoint 很爽，因為感覺像在前進。

但如果底層在說謊，你只是把東西蓋在沙上。

4) **把 accelerator 當成 production 依賴來看**

很多人把 GPU/NPU 當成「更快的算術」。

但它其實是依賴：有 firmware、driver、熱行為、也有故障模式。

你只要做 on-device inference，硬體健康就會自動變成你 SLO 的一部分。

## 為什麼這件事值得在意（就算你不做 iPhone inference）

這種模式到處都會出現：

- RAM 不穩，讓模型變成隨機文字產生器
- ECC 默默修正，掩蓋了早期訊號
- 過熱導致效能/時序改變，打破你原本的假設
- driver regression 看起來像「模型變不穩」

最糟的是：LLM 會讓人心理上更容易接受「怪怪的」當常態。

但你如果想把系統做好，這是一個很危險的習慣。

## 不舒服的 takeaway

當你的 agent 開始產出垃圾，不要只問：

- 「prompt 有沒有改？」
- 「模型有沒有改？」

也要問：

- 「機器有沒有改？」
- 「這台設備還可信嗎？」

因為有時候最貴的 bug，是那種騙你去重寫整套系統的 bug —— 真正的修法只是：換一台機器（RMA）。

## References

- [MLX（Apple 的 machine learning framework）GitHub 專案](https://github.com/ml-explore/mlx)
