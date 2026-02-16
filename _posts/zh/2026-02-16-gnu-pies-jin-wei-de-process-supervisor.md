---
layout: post
title: "GNU Pies：當你不想綁 systemd 時，一個很務實的 process supervisor"
date: 2026-02-16 06:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "有些系統你只想要『程式別死、死了能自動拉起來、log 有地方去』，但不想把整個部署故事綁到 systemd。GNU Pies 的味道很老派，但它做的事情非常現代：用可理解的契約，解決可預期的營運問題。"
image: /img/posts/gnu-pies-process-supervisor.webp
lang: zh
---

我最近越來越常遇到一種現實：

- 你不想「做一套 ops 平台」
- 你只想要你的程式 **不要死**
- 真要死了，至少 **要能自動拉起來**
- 然後不要再多一份「那個只有某個人看得懂的 deploy script」

多數時候答案是：**systemd。**

我同意，systemd 在正常 Linux server 上通常就是最穩的路。

但也有一些場景，你會不想把自己綁死在 systemd 上：

- 很薄的 container image（你只想要 entrypoint 管幾個 process）
- 你沒辦法控制 host 的 init system
- embedded-ish 的環境，越少依賴越好
- 你對「多一個大生態系」有過 PTSD（我懂）

這時候我覺得可以認識一下 **GNU Pies**（Program Invocation and Execution Supervisor）。

## 我怎麼評估一個 process supervisor（五個角度）

1) **商業角度：**它能不能把「程式掛了沒人發現」這種事故成本壓下來，而不是製造新的複雜度？

2) **工程角度：**它提供的 primitives 是不是少而清楚（start、restart、節流、順序），而且能組合？

3) **風險角度：**出事時我能不能用基本 Unix 工具 debug？還是得先學一整套宇宙？

4) **營運角度：**stdout/stderr 有沒有正常的去處（檔案或 syslog），不要 log 到處飄。

5) **未來我角度：**同事半年後打開設定檔，能不能讀懂這個系統「應該」怎麼運作？

GNU Pies 意外地符合這套標準。

## Pies 到底是什麼（講人話）

Pies 會啟動並監控外部程式（它叫這些程式是 components）。

它能做的事情很直白：

- 啟動 components，然後在背景監控它們
- **respawn**：component 結束就重啟
  - 但如果它掛太頻繁，Pies 會讓它睡一下，避免把機器資源吃爆
- **inetd-style**：Pies 自己先 listen socket，有連線進來才 exec handler
- stdout/stderr 可以導到檔案或 syslog
- 支援 startup / shutdown components + 啟停順序（含 prerequisites / dependents）

一句話：它是「把你本來會寫在 bash 監控 loop 裡的那些煩人細節，做成一個工具」。

## 它最像現代的地方：契約感很強，不想當你的宗教

很多現代 infra 工具給我的感覺是：

- 很強
- 很宣稱自己是 declarative
- 然後你用了才發現，它其實要你買整套 worldview

GNU Pies 反過來。

它不想統治你的整台機器。

它想回答一個很具體的問題：

> 「給我一串程式清單，我要怎麼可靠地啟動它們、重啟它們、把 I/O 接好？」

這是契約。

不是信仰。

## 我會在什麼時候真的考慮用它

老實講，我不會為了「潮」去替換正常 server 上的 systemd。

但我會在這幾種場景認真考慮 GNU Pies：

- **container entrypoint** 需要管多個協作 process，但你不想上完整 init stack
- **inetd-style** 的小服務：想把「socket listener + process lifecycle」收斂在一個地方
- **可預期 > 整合性** 的環境：你要的是簡單、可檢查、可教給別人，而不是一堆 integration magic

它是那種你會在意「讓它活著、讓它可理解」的人會喜歡的工具。

## 我會怎麼跟同事解釋它的價值

如果你寫過這種東西：

```text
while true; do
  ./server || sleep 1
done
```

你其實已經在做 process supervisor 了，只是做得比較差。

真正難的不是那個 loop。

真正難的是那些你每次都會踩的細節：

- 不要重啟太快（避免 thrash）
- log 要有地方去
- 要有啟動順序 / 關閉順序
- shutdown 要乾淨
- socket 的行為要一致

GNU Pies 的價值就是：把這些東西集中起來，變成你可以讀懂的設定。

## 結論

GNU Pies 不流行。

也不會讓你在社群上贏辯論。

但如果你跟我一樣，對 **小工具、清楚行為、可預期語義** 有偏執，它值得你知道它的存在——尤其當你所在的環境，systemd 不是你想要的答案時。

---

## References

- [GNU Pies 專案頁（簡介與版本資訊）](https://www.gnu.org.ua/software/pies/)
- [GNU Pies Manual（版本化文件）](https://www.gnu.org.ua/software/pies/manual/)
