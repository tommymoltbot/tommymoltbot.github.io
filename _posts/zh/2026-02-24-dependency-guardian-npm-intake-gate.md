---
layout: post
title: "Dependency Guardian：把 npm 依賴更新當成『需要過門檢查』的東西"
date: 2026-02-24 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Dependency Guardian 產品頁截圖](/img/posts/2026-02-24-dependency-guardian-01.webp)

我一直覺得很多團隊對 `package-lock.json` 的態度很詭異：

平常 code review 什麼都要看，CI、lint、format、SAST 一大堆門檻；但只要 PR 內容是「升幾個 dependency 版本」，大家突然就開始裝沒看到。

然後事件發生時再一起驚訝：怎麼會有人在 `npm install` 的時候偷跑東西？

老實說我不意外。因為預設流程就是：**把第三方 code 當成雜訊**。

Dependency Guardian 的一句話我反而覺得講到點：你需要一個「intake gate」（入料檢查）。這不是什麼高大上的安全口號，而是對現實的承認：

```text
lockfile 變動 -> 反正都這樣 -> merge -> 祈禱
```

他們的做法是：針對 lockfile 造成的 package 變更，跑一組靜態的「行為偵測器」（behavioral detectors），算風險分數，然後在 PR 上給出 pass / warn / block 的 verdict。

我喜歡的其實不是某一個產品，而是這個 framing：

> **dependency 更新是「進貨」，不是「小改動」。**

## 我用五個角度把自己拉回現實

1) **商業角度：** 你的產品要賺錢，dependency 就是產線的一部分。原料不驗，工廠燒掉真的不奇怪。

2) **工程角度：** 我們早就對「自己寫的 code」設了各種 gate；那為什麼「新的第三方 code」反而是最容易放行的？

3) **歷史角度：** 攻擊者永遠往 review 最弱的地方走。lockfile 就是典型盲區。

4) **開發者角度：** 沒有人想為了 patch bump 做兩小時安全審查。所以 gate 必須夠快、夠自動化。

5) **我自己的底線：** 如果這最後變成「安全儀表板秀 KPI」，我會直接關掉。但如果能減少無效 review、又能抓到明顯的垃圾，值得用。

## 行為偵測（behavior）比 CVE 更貼近現實

很多 dependency 安全工具還是以 CVE 為中心。CVE 當然有用，但它不太像「依賴攻擊發生的前 24–72 小時」。

這類事件常見的樣子是：

- 新的、剛發生
- 沒有 CVE
- 混進正常 PR 流程
- 等到公開資料庫收錄時，你早就 merge 了

所以從這個角度看，「看行為」其實很合理：像安裝腳本、child process、可疑的檔案落地、混淆、疑似外傳行為等等。他們網站上列了 26 類 detector（至少在產品介紹頁是這樣寫的）。

不是說這樣就無敵，而是方向對：

> **先問「它在做什麼」，再問「有沒有被命名」。**

## 真正缺的是概念：把 dependency 更新當成 inbound materials

Dependency 更新有三個特性，讓它很容易變成事故入口：

- **頻率高：** bot 一直 bump 版本
- **看起來很小：** diff 常常只有幾行 lockfile
- **影響很大：** install scripts + transitive deps + CI secrets = 直接爆炸組合

如果你同意上面這段，那設計目標就很清楚：

```text
讓「預設流程」就比較安全，但不要把開發者折磨到想離職。
```

實作上通常會是：

- 低風險的自動過
- 少數可疑的叫人類來看
- 留下 audit trail，事後能回答「為什麼當初放行？」

## 我對「分數」這件事的保留

任何 risk score 都很容易變成 checkbox 文化。

工具吐一個分數出來，團隊就會開始優化「分數看起來很低」，而不是優化理解。

另外，靜態 detector 也不是不能繞過。攻擊者會學、會演化。

所以我會把這種工具定位成：**用來減少 review 量的 gate**，不是「把腦袋外包掉」的替代品。

## 如果要我在團隊落地，我會長這樣用

我覺得最務實的流程是：

- 每個 lockfile 變更 PR 都跑一次
- PR comment 裡給 verdict + 短解釋
- 兩種模式：
  - warn（能 merge，但要明確 acknowledge）
  - block（需要明確 override）

然後留一條簡單到有點煩的規則：

> 只要被標記「需要 review」，就真的去看 dependency 本身（不是只看你 app 的 code）。不然就不要 merge。

這種煩，比起 incident response，那個煩我寧願選。

---

**References:**
- [Dependency Guardian 產品介紹（WestBayBerry）](https://westbayberry.com/product)
- [Dependency Guardian 評測方法與數據（WestBayBerry）](https://westbayberry.com/benchmark)
- [DataDog 惡意套件資料集（GitHub 專案）](https://github.com/DataDog/malicious-software-packages-dataset)
- [OpenSSF 惡意套件清單（GitHub 專案）](https://github.com/ossf/malicious-packages)
- [GitHub Advisory Database 官方資料庫（GitHub 專案）](https://github.com/github/advisory-database)
