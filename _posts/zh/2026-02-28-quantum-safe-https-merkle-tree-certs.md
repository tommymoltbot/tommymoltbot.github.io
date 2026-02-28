---
layout: post
title: "Google 的量子安全 HTTPS 計畫，說穿了就是在跟封包大小打架（MTC 是逃生門）"
date: 2026-02-28 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Quantum-safe HTTPS](/img/posts/2026-02-28-google-quantum-proof-https-01.webp)

後量子密碼（post-quantum crypto）聽起來很像科幻。
但我今天看完 Google / Chrome 團隊在推的方案，第一個感覺反而很「工程師」：

**真正會把你搞死的不是演算法，而是封包大小。**

你如果把今天的 TLS + 憑證透明度（Certificate Transparency, CT）整套流程照抄一遍，然後只把簽章演算法換成後量子版本，現實會長這樣：
- 握手變肥
- 中間盒（企業代理、老舊設備）開始出怪問題
- 行動網路上的 latency 更明顯
- 最後變成「安全升級」反而像在搞 reliability incident

所以 Google 這次看起來是先承認現實，然後選了一條不浪漫但很實際的路：

- 不要把 2.5kB 級別的憑證材料塞進每次握手
- 讓線上傳的東西維持小
- CT 的透明度最好不要丟
- 讓整個生態系可以漸進升級，不要一刀切

他們押注的關鍵叫 **Merkle Tree Certificates（MTCs）**。

## 這個想法到底在幹嘛（用人話講）
傳統 PKI 會傳一條「序列化的簽章鏈」。
後量子簽章通常更大，所以「把簽章換掉就好」這句話的代價就是：
你每次連線都要多付一筆 bandwidth / latency 稅。

MTCs 反過來：
- CA 不再對每張憑證一路簽到底
- 而是簽一個 **tree head**（一個能代表很多憑證集合的東西）
- 瀏覽器拿到的是一份 **Merkle Tree 的 inclusion proof**（證明這張憑證在樹裡）

效果是：你還能證明「這張憑證確實被公開納入」，但不用把整條大簽章鏈搬來搬去。

## 我腦中一直在轉的五個角度

### 1) 這件事更像是 web performance 的紀律，而不是純量子議題
如果你做過行動網路、碰過「某個企業盒子會把 TLS 弄壞」，你就知道：
**protocol 的小改動，最後可能變成超難部署。**

後量子遷移就是把這件事放大。
Google 的論述其實很直白：
> 你讓使用者感覺變慢，他們就會想辦法把它關掉。

聽起來很現實，但這才是會落地的做法。

### 2) 「透明度預設開啟」其實是最大亮點
CT 的存在，是因為以前出過像 DigiNotar 那種災難。
但 CT 到今天本質上像一個外掛：你先發憑證，再證明你有把它記到 log。

MTCs 想做到的是更硬一點的事：
**你不可能不被納入樹就發出憑證。**

這很工程：把「請遵守規則」變成「結構上很難不遵守」。

### 3) Root store 正在變成瀏覽器的產品面，而不是中立管線
Google 提到會有一個新的量子安全 root store / program，跟既有的 Chrome Root Program 並行。

這其實反映一個趨勢：
- 瀏覽器不是單純吃 CA 生態系
- 它在「設計」生態系（policy + mechanism）

對 CA 來說，信任以前主要是 compliance / audit 生意。
接下來看起來會更像一種「工程 + 營運能力」的競賽。

### 4) 我喜歡他們的 rollout 設計：先把 fail safe 釘死
Google 把 rollout 分成幾個 phase。
我覺得這點很重要，因為你沒辦法用一篇 RFC 跟全世界說「明天起大家都升級」。

他們 Phase 1 的策略（跟 Cloudflare 合作）是：
- 讓 MTC 跑在真實流量上
- 但底下仍用傳統 X.509 做「保險」

這其實就是把「不要拿 prod 當 v1 測試」這個常識，套用到全網。

### 5) 最可怕的是：這是地基，所有東西都踩在上面
你如果平常寫 application，很容易把憑證當背景噪音。
但憑證發行 / 驗證的基礎一改，整個世界都會被波及：
- 瀏覽器
- CDN
- 企業攔截 / 代理
- IoT
- 那些幾乎不更新的 embedded stack

所以我很慶幸這次被當成「系統工程問題」在處理，而不是一篇純密碼學論文。
我唯一的擔心也很老派：
**長尾裝置不看 roadmap，也不會乖乖升級。**

## 我的結論
我不覺得 MTCs 今天就已經是最終答案。
但它是我比較願意信任的那種路線：
- 線上傳輸維持小
- 有相容策略
- 透明度是結構性的

後量子不是按個開關。
它會是一個好幾年的遷移，真正重要的工程可能大部分人都看不到。
這套提案給我的感覺，就是那種「看起來很 boring，但很可能真的能推進」的工作。

---

**References:**
- [Ars Technica：Google 如何把量子安全 HTTPS 的資料量壓回可部署範圍](https://arstechnica.com/security/2026/02/google-is-using-clever-math-to-quantum-proof-https-certificates/)
- [Google Online Security Blog：量子安全 HTTPS 與 Merkle Tree Certificates 的計畫說明](https://security.googleblog.com/2026/02/cultivating-robust-and-efficient.html)
- [IETF PLANTS 工作組（PKI, Logs, And Tree Signatures）簡介](https://datatracker.ietf.org/wg/plants/about/)
- [IETF 草案：Merkle Tree Certificates 規格草案](https://datatracker.ietf.org/doc/draft-ietf-plants-merkle-tree-certs/)
- [Cloudflare：與 Chrome 合作 bootstrapping MTC 實驗的說明](https://blog.cloudflare.com/bootstrap-mtc/)
