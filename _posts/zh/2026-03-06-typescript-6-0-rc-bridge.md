---
layout: post
title: "TypeScript 6.0 RC 像是暴風雨前的安靜（而且接下來會變快）"
date: 2026-03-06 21:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![TypeScript 6.0 RC](/img/posts/2026-03-06-typescript-6-rc-01.webp)

TypeScript 6.0 出 RC 了。
但這次的重點不是什麼新語法、什麼炫技 feature。
重點反而很「樸素」：**TS 6.0 會是最後一個基於現有 JavaScript 編譯器 codebase 的版本**，接下來 TypeScript 7.0+ 會以 Go 寫的新版 compiler / language service 當基底。

所以我覺得 TS 6.0 的正確讀法是：
它不是要讓你興奮，它是在幫你把「引擎換掉」之前的摩擦先削掉。

## 多數團隊最有感的是：行為對齊（alignment）

要換實作、要變快、要上多執行緒，那最怕的是「細節行為不一致」。
TypeScript 6.0 很多改動都在做這件事：盡量讓 6 → 7 的心理落差變小。

幾個我覺得很有代表性的點：

- 一些 generic call（包含某些 generic JSX）型別檢查更嚴格了：它會抓到真 bug，但也可能逼你在少數地方補上明確的 type argument。
- import assertion（`import ... assert { ... }`）的 deprecation 更往前推了一步，連動態 `import()` 的用法也被納入。

不華麗，但這種改動是「大版本換引擎」之前最該做的清理。

## 我最喜歡的改動其實超無聊：沒有用到 `this` 的 function，不要再被當成高度敏感

這個問題你通常只會在「你已經很煩」的時候才會遇到：
同一個 object literal 內有兩個 function，因為你用的是 method syntax 還是 arrow function，推斷結果居然不同。

TS 6.0 在這裡變得比較務實：如果 function 根本沒用到 `this`，就不要把它當成那種「推斷時很難處理」的 contextually sensitive function。

我的感覺是：TypeScript 終於比較像在服務工程師，而不是在展示 type system 的腦力。
我們要的是少驚喜，不是多巧妙。

## #/ subpath imports：小功能，但它會讓更多人願意走正規路

Node 的 `imports` 欄位，算是目前最接近「不靠 bundler 魔法的 module alias」。
TypeScript 6.0 支援 Node 新增的行為：subpath imports 可以用 `#/` 當開頭。

它聽起來很小，但有個很實際的效果：
更多人會願意用「標準化的 alias」，而不是把 `../../../../` 相對路徑寫到人生懷疑。

## `--stableTypeOrdering`：這個 flag 在大聲說「並行 typecheck 要來了」

TypeScript 提到 internal type ID 會影響 union type 的排序，甚至影響 `.d.ts` 輸出。
當你要把 typecheck 並行化，如果不刻意處理，輸出就可能變得 non-deterministic。

所以 TS 6.0 加了一個 migration flag：

```text
--stableTypeOrdering
```

為什麼我覺得它重要（而且很工程）：
- 你如果有發 library，`.d.ts` 差異亂跳就是一種長期稅。
- 你如果 CI 有針對 generated output 做驗證（你應該要有），non-determinism 會把大家的時間吞掉。

這個 flag 的味道很像 TS 團隊在說：
「我們會變快，但我們不打算假裝 determinism 是免費的。」

## 我會怎麼建議團隊處理 6.0

如果你們每次升 TypeScript 都像在拆炸彈，那 TS 6.0 不要當作可有可無。
把它當作 7.0 換引擎前的「預演」。

很務實的做法：

```text
npm install -D typescript@rc
```

然後：
- 跑完整 typecheck + build。
- 注意 `.d.ts` 有沒有大量 churn。
- 如果你有對外輸出 types，提早用 `--stableTypeOrdering` 來試水溫。

目的不是「永遠最新」。
目的其實只有一個：**把 TypeScript 7 換引擎的爆炸半徑縮小。**

我不會對 TypeScript 版本有情緒。
我對「升級要可預期」很有情緒。
TS 6.0 RC 看起來是在幫工程師買這個可預期。

---

**References:**
- [Microsoft TypeScript 團隊公告：Announcing TypeScript 6.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-rc/)
- [TypeScript native port 介紹：TypeScript’s native port](https://devblogs.microsoft.com/typescript/typescript-native-port/)
- [TypeScript 7 進度更新：Progress on TypeScript 7 (December 2025)](https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/)
