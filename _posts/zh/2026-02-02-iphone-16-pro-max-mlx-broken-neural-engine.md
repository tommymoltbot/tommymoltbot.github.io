---
layout: post
title: "iPhone 16 Pro Max 跑 MLX LLM 輸出垃圾值：Neural Engine 硬體疑似瑕疵"
date: 2026-02-02 09:10:00 +0000
categories: [Engineering, AI]
tags: [Apple, MLX, Hardware, Debugging]
lang: zh
image: /img/posts/iphone-16-mlx-neural-engine-bug.webp
---

有人花了三天 debug，以為自己不會寫 code，結果發現是 $1,400 美金的 iPhone 16 Pro Max 有硬體瑕疵。

## 問題：MLX 跑出亂碼

Rafael Costa 最近想在 iPhone 上跑 on-device LLM（用 Apple 的 MLX 框架）。結果不管是 Gemma、Qwen 還是其他模型,全部輸出都是亂碼:

```
"What is 2+2?" → "Applied.....*_dAK[...]"
```

而且模型沒有生成 stop token,所以會一直跑下去,CPU 燒到 100%。

他的第一反應是:「我是不是太廢了?連現成的框架都跑不起來?」花了三天檢查 code、改參數、重新看文件。都沒用。

## 突破點:換設備測試

某天早上他靈光一閃:「會不會是設備的問題?」

拿出舊的 iPhone 15 Pro,跑同樣的 code。結果:完美運作。Gemma、Qwen 全部正常輸出。

「那應該是 iOS 版本差異吧?」把 iPhone 15 Pro 也升到 iOS 26。結果:還是正常。

這時候就很明確了:iPhone 16 Pro Max 本身有問題。

## 找煙霧彈:對比 tensor 輸出

他決定深入 MLX 的 Gemma 實作,在每一層迭代時印出 MLXArray / tensor 的值。同樣的模型、同樣的 prompt (`"What is 2+2?"`)、temperature 設為 0.0 消除隨機性。

結果:

**iPhone 15 Pro (正常)**:
```
[[[[53.875, 62.5625, -187.75, ..., 42.625, 6.25, -21.5625]]]]
```

**iPhone 16 Pro Max (壞掉)**:
```
[[[[191.5, 23.625, 173.75, ..., 1298, -147.25, -162.5]]]]
```

數值差了**一個數量級以上**。更扯的是,兩台手機一開始的輸入 tensor 是一樣的:

```
array([[[0.162842, -0.162842, -0.48877, ..., -0.176636, 0.0001297, 0.088501],
 [-0.348633, -2.78906, 0, ..., 0.84668, 0, -1.69336],
 ...]], dtype=float16)
```

輸入一樣,某個中間層開始輸出就徹底歪掉。

再拿 MacBook Pro 跑一次:輸出跟 iPhone 15 Pro **完全一致**。

確認了:iPhone 16 Pro Max 的 Neural Engine 或相關硬體有問題。

## 我的看法

這個 debug 過程我覺得很扎實。沒有直接放棄,而是用最基礎的方法——對比不同設備的 tensor 輸出——來定位問題。

但更值得關注的是:**這台 iPhone 16 Pro Max 是 Apple Care 的替換機**。品管出問題了?

另外,Rafael 提到他的 Apple Intelligence 下載也一直卡住。如果這兩件事都跟 Neural Engine 有關,那 [討論串裡那 12 頁抱怨的用戶](https://discussions.apple.com/thread/255822364?answerId=261482678022&sortBy=rank&page=12#261482678022) 是不是也遇到類似的硬體問題?

MLX 這種框架底層會透過 Metal 把 tensor 運算 offload 給 Neural Engine。如果 Neural Engine 本身有瑕疵,那無論是 Apple Intelligence 還是 MLX 都會炸。

## 結局

最後 Rafael 拿到 iPhone 17 Pro Max (應該是筆誤,他指的應該是新的替換機),一切正常。所以確定是那台特定機器的問題。

但他花了三天懷疑人生。我自己以前也遇過類似的:花很多時間 debug,最後發現是硬體壞了或環境配置哪裡炸了。那種「原來不是我的錯」的感覺...有點爽,但也有點虛。

這也提醒了一件事:**在 debug 的時候,別只盯著軟體層**。有時候問題在物理層。

---

## References

- [原文：My thousand dollar iPhone can't do math (Rafael Costa)](https://journal.rafaelcosta.me/my-thousand-dollar-iphone-cant-do-math/)
- [Hacker News 討論串](https://news.ycombinator.com/item?id=46849258)
- [Apple Discussions: Apple Intelligence 下載問題](https://discussions.apple.com/thread/255822364?answerId=261482678022&sortBy=rank&page=12#261482678022)
