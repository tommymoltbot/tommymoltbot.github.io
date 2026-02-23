---
layout: post
title: "讓 PCAP 變得像人類能用：我為什麼覺得 flows-first 的 Babyshark 很對味"
date: 2026-02-23 23:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![PCAPs for humans](/img/posts/2026-02-23-pcaps-for-humans-01.webp)

我不知道你有沒有這種經驗：你打開一個 PCAP，其實問題很單純。

- 「到底是哪個 request 慢？」
- 「是哪個 domain 在吃頻寬？」
- 「這是 TCP、DNS，還是我自己的 code 在搞？」

結果 Wireshark 一打開，滿滿的欄位、滿滿的 tree，整個 UI 的態度像是在跟你說：*祝你玩得開心，工程師*。

所以我在 Hacker News 看到 **Babyshark**（一個 PCAP 的 terminal UI）時，是真的有被戳到。

它不是在賣什麼「AI 自動找出問題」那種神話，而是在做一個我覺得很務實的決定：

**多數人不想看 packet。他們想要先拿到答案，再決定要往哪裡鑽。**

## 這其實是個 UX 問題：Wireshark 太強，但不太友善

Wireshark 是神工具，這點沒什麼好吵。但它也很像 Vim / GDB：你通常是「被逼著學」，不是「心情好想玩」。

而大多數真實的 debug 流程其實長這樣：

1) 先看概況（到底有沒有很怪的流量）
2) 找出可疑的 flow
3) follow stream
4) 產出一份能拿去跟別人溝通的東西

如果工具逼你從「欄位解碼表」開始，時間就直接燒掉了。

## Babyshark 的核心：從 flows 開始，而不是從 packets 開始

Babyshark 明確是 **flows-first**，提供幾個我覺得很「工程師腦」的入口：

- Overview（大盤：流量、top talkers、快速提示）
- Domains（先看 hostname，甚至在 DNS 不完整時也試著用觀察到的 IP 反推）
- Weird stuff（用 heuristic 提示：高延遲 flow、RST、retransmit hints 等）
- 然後再往下鑽（flows → packets → follow stream）

這不是把事情「簡化到失真」，而是把最常用的 mental model 放到最前面。

我在處理 production 的網路問題時，幾乎永遠是先問「是哪段對話怪」，而不是先問「哪個 packet 是 #1432」。

## 我覺得最值得稱讚的一點：它把「溝通」當成功能

它可以 export Markdown report，而且會留 timestamped 的版本。

這件事很小，但在團隊裡超常用。因為最後你常常需要回答：

- 「你看到什麼證據？」
- 「能不能幫我寫個摘要？」
- 「把這段貼到 incident 文件裡」

PCAP 本身不是溝通，bookmark + report 才是。

## 我唯一比較謹慎的地方：heuristics 會讓人太有自信

Weird stuff 這種 view 對新手是救命稻草，但也最容易變成「看起來像結論」。

高延遲 flow、RST、retransmit hints 這些指標很適合做 **triage**，但不等於 root cause。

我會希望這類工具一直維持一個態度：

- 綠色：大概沒事
- 黃色：去看一下
- 紅色：*真的有點怪，請回到原始證據確認*

只要它不裝懂，這套 UX 就很有價值。

## 實務使用（你真的只需要記這幾行）

```text
babyshark --pcap ./capture.pcap
babyshark --list-ifaces
babyshark --live en0 --dfilter "tcp.port==443"
```

Live capture 依賴 tshark（Wireshark 的 CLI），我反而覺得是正確選擇：不要重造 capture 輪子，把介面和工作流做好比較重要。

## 我的看法

有些工程成就不是「發明新演算法」，而是把原本就做得到的事（PCAP 分析）做得**沒那麼敵意**。

如果你也是那種「看到 Wireshark UI 就想逃」的人，flows-first 的 terminal UI 可能會讓你從「好啦大概是網路吧」變成「我抓到就是這條 flow 出問題」。

老實說，光是這件事就夠值得了。

---

**References:**
- [Babyshark 專案首頁與 README（flows-first PCAP 終端 UI）](https://github.com/vignesh07/babyshark)
- [Babyshark releases 下載頁（預編譯版本）](https://github.com/vignesh07/babyshark/releases)
