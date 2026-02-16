---
layout: post
title: "JS-heavy 不是一種 stack，是你會重貸一輩子的 performance debt。"
date: 2026-02-16 07:00:00 +0000
categories: [Engineering, Tech]
tags: [Engineering, Tech]
author: Tommy
excerpt: "大量 client-side JavaScript 不只是一次性的載入成本，它更像是會複利成長的維護與效能負債：依賴膨脹、規律很脆弱、回歸很難抓、最後用戶在 critical path 付 CPU 稅。更 server-centric 的 baseline 很無聊，但就是因為無聊才穩。"
image: /img/posts/2026-02-16-server-centric-web-performance.webp
lang: zh
---

我最近一直看到同一種劇本：

大家選 **JS-heavy**，因為前期真的很快。

然後兩個季度後，效能變成一個很奇怪的「長期專案」，永遠做不完。

這不是因為大家都不會寫。

是因為**架構本身會讓利息越滾越大**。

我想把那句大家不太敢直接講的話講出來：

**JS-heavy 不是一種 stack，是你會重貸一輩子的 performance debt。**

（對，你可以把它弄快。對，但它不會一直維持好弄。）

## 我用來評估「JS-heavy 是不是值得」的五個角度

1) **商業角度：**我們是不是在用真金白銀（轉換、留存、客服工單）換取一個其實用「無聊 baseline」也能做到的 UX？

2) **工程角度：**我們到底簽了多少 glue code（hydration 邊角、狀態同步、routing、cache/invalidation）？

3) **風險角度：**誰負責效能？一個 dashboard？一位英雄級 staff engineer？還是「大家都要小心」（通常等於沒人負責）？

4) **效能角度：**用戶是在 critical path 付 CPU + memory 稅，還是大部分工作在 server 端用可預期的資源解掉？

5) **未來我角度：**團隊規模翻倍後，系統會更安全…還是更容易不小心塞出一個 400KB 回歸？

## 那些 pitch deck 不會寫的複利成本

### 1) Dependency bloat 不是 bug，它是預設值

在 JS-heavy app，依賴打包進瀏覽器是常態。

聽起來沒什麼，直到你承認兩件事：

- npm package 會越長越大
- 升級是被迫的（資安修補、transitive deps、框架大版本循環）

更討厭的是：回歸通常不會以「你剛剛多加了 120KB」這種乾淨訊號出現。

它會以這些形式冒出來：

- 中階 Android 的 LCP 默默變差
- 某些重頁面偶爾 input lag
- 工單說「最近整個 app 變卡」

這種死法，是一千刀。

### 2) 它很脆：一個看似無害的 import 就能毀掉你半年紀律

很多 JS-heavy 的效能工作，本質上是「用團隊紀律當作系統設計」。

你可以做得很對：

- lazy-load
- route-split
- memoize
- 避免 top-level import

然後某個 PR 很善意地把東西加進 shared entry point，突然：

- parse time 飆
- hydration 變慢
- baseline 對每個用戶都更差

這不是「開發者不夠乖」。

這是系統本來就脆。

### 3) Debug 變難，因為你在平台跟你之間塞了更多層

Browser devtools 其實很強。

但 JS-heavy stack 往往又疊了自己的 abstraction 與 tooling，而且不太能跟平台原生資訊好好拼起來。

你最後會在這些東西之間對照：

- browser profile
- framework profile
- bundler output
- runtime 行為

然後「為什麼變慢」的答案就變成尋寶。

### 4) 用戶在最糟的位置付錢：critical path

把工作移到 client，本質上就是把工作移到：

- 不可控 CPU
- 不可控 memory
- 不可控 network
- 不可控 thermal throttling

在 server，你至少可以花錢買到可預期性。

在 client，你的效能策略常常變成：「希望使用者今天手機狀態還行」。

## 那個一直默默獲勝的無聊選項：server-centric baseline

我不是在說「不要用 JavaScript」。

我是說：**先從一個不用靠大量 client runtime 也能用的 baseline 開始**。

server-centric 的做法通常比較像：

- HTML 先 stream 出去
- cache 做好做滿
- 預設少送 JS
- fallback 會動

而它最大的、但常常被低估的優點是：

**它把回歸能躲的地方變少了。**

## 我喜歡的一個實用準則

如果你能把核心流程先做成：

```text
request -> server renders -> HTML ships -> user can do the primary action
```

那 JavaScript 就回到它應該的位置：增強層。

不是氧氣供應。

差別就在這裡。

## 我的結論

JS-heavy 不是邪惡。

它只是**不便宜**，而且也不是一次性的成本。

你如果要選它，就老實承認你在買什麼：

- 前期比較快
- 但長期更高機率要一直救火

有些產品這個 trade-off 值得。

但如果你的產品要的是「多年都可預期的效能」，無聊架構其實很香。

---

## References

- [“JS-heavy approaches are not compatible with long-term performance goals” （立場很強，但經驗很扎實）](https://sgom.es/posts/2026-02-13-js-heavy-approaches-are-not-compatible-with-long-term-performance-goals/)
- [Hacker News 討論串（適合看反方觀點與戰場故事）](https://news.ycombinator.com/item?id=47029339)
