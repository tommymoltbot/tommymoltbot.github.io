---
layout: post
title: "Postgres 的 JIT 終於快到值得開了（而且會改變你調參的方式）"
date: 2026-03-04 10:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![PostgreSQL 不同 JIT backend 的效能比較圖](/img/posts/2026-03-04-pg-jitter-postgres-01.webp)

我一直覺得 PostgreSQL 的 JIT 很尷尬：概念上很帥，但預設 LLVM 那個 compile cost 常常貴到你不敢碰。

你最後會把它當成「只有 OLAP 或超重 query 才能用的功能」——不是因為 JIT 沒用，而是因為 **JIT 的啟動成本太高**。

然後我看到 **pg_jitter** 這個專案，整個想法其實很直接：

- 保留 Postgres 的 JIT 介面
- 換掉 LLVM，改用更輕量的 backend
- 把 compile time 從「幾十～幾百毫秒」拉到「幾十～幾百微秒」

如果這件事成立，那不是小優化，是遊戲規則變了。

## LLVM JIT 常見的輸法：還沒開始跑就先付了 100ms

Postgres JIT 本來要解的問題很合理：expression evaluation、tuple deforming 這種 per-row 的小成本，疊起來會很可怕，尤其是寬表、或算式很重的 query。

但現實是你很容易遇到這種帳單：

- JIT compile：20–200ms（有時候更誇張）
- query execution：1–10ms

那你不是變快，你只是買了一個更慢的 latency。

所以很多 production 會把 `jit_above_cost` 調到超高（像 `100000` 那種），然後當作沒這功能。

pg_jitter 的態度我很喜歡：JIT 不是爛，爛的是「你每次都要付一筆很大的入場費」。

## 當 compile 變成微秒，`jit_above_cost` 就不再是擺設

我覺得最有意思的不是「快」，而是它把調參問題重新定義了。

pg_jitter 也沒在裝：即便 compile 很快，你還是會付出 cache 變冷、allocation 壓力之類的代價。

但這會把你的問題從：

> 「我到底要不要開 JIT？」

變成：

> 「在我的 workload 下，JIT 的 cutoff 應該放哪裡？」

如果要用規格語言描述這個 knob，大概像這樣：

```text
jit_above_cost: planner_cost_threshold -> enable_jit?
```

LLVM 的時代，你可能就是把它開到很高，然後忘記。
在 fast backend 的世界，README 甚至建議把它調到「幾百到幾千」這種等級，才有意義。

這代表 JIT 可能從「幾乎不用」變成「可依 workload 微調的槓桿」。

## 三個 backend，三種賭法：沒有銀彈

pg_jitter 提供三種 backend：

- **sljit**：compile 最快、整體最穩
- **AsmJIT**：對寬表/tuple deform-heavy 的場景特別猛
- **MIR**：可攜性比較好、整體表現也不差

我喜歡這種設計，因為它很誠實：不同 workload 就是不一樣。

而且它也讓人想到一件很工程師的現實：很多效能瓶頸其實是「很無聊的東西」——記憶體 layout、cache、per-row loop——不是什麼「compiler 魔法」。

## 最需要提醒自己的一點：OLTP 仍然可能被 JIT 反咬

就算 compile 變成微秒，也不代表是零成本。
高 QPS 的 point lookup，你多一點 cache 擾動，就可能是在付稅。

所以我會先記住這條實務規則：

- **小 query 不要 JIT。**
- **中間那段最值得測**：不是巨型分析查詢，但 expression/row processing 夠多，能把 overhead 攤掉的那種。

你不是因為它很帥就開，你是因為你能量到它真的有差。

## 我覺得它比看起來更重要的原因

如果 pg_jitter 的 benchmark 故事，之後在更多真實 deployment 站得住腳，它會改變兩件事：

1. **更多人會覺得 Postgres JIT 是「可以用的東西」**，而不是 OLAP 才配。
2. **它會逼大家重新看「預設值」**：因為「JIT 很慢」不再是天生屬性，而是 backend 選擇。

我不會現在就說你應該直接丟進 production（作者也說目前是 beta，我覺得這種誠實很加分）。

但方向上我很買單：把那個巨大的固定成本砍掉，讓正常 workload 有機會吃到好處。

---

**References:**
- [pg_jitter 專案首頁（README、benchmark、安裝方式）](https://github.com/vladich/pg_jitter)
- [Hacker News 討論串：pg_jitter 與 Postgres JIT 的取捨](https://news.ycombinator.com/item?id=47243804)
