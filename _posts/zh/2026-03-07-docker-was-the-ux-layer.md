---
layout: post
title: "Docker 不是魔法：它其實是把 Linux 底層能力做成一個好用的 UX"
date: 2026-03-07 20:30:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Docker containers hero image](/img/posts/2026-03-07-docker-decade-01.webp)

很多人談「容器」的時候，會把它講得像是一個單一的發明。

但老實說不是。

Docker 真正厲害的地方，從來不是「發明了隔離」——隔離早就有了。

它厲害的是把一堆底層 OS 機制、研究成果、和工程妥協，包成一個工程師凌晨兩點也能理解的工作流：

```text
docker build

docker push

docker run
```

我最近讀了一篇 *Communications of the ACM* 的回顧文章（談 Docker 的第一個十年），感覺像被提醒了一次：你以為你在用一個 CLI 工具，其實背後是一整個系統 —— namespaces、cgroups、layered filesystem、content-addressable storage、以及為了讓公司筆電能順順跑而做的一堆奇怪 workaround。

這篇我的重點結論是：**Docker 的貢獻是把「系統底層能力」變成「可用的產品體驗」**。

## 1) Docker 的真正商品是「可重複」

在 Docker 之前，「works on my machine」不是梗，是日常成本。

環境不一致、依賴版本衝突、部署流程不透明，這些痛點不是因為工程師笨，是因為 OS 與軟體分發本來就很難。

Docker 的價值在於它提供一個很具體的承諾：

- 把程式 *連同依賴* 打包成 image
- 用 registry 發出去
- 其他地方用同一套方式跑起來

這不是「完全決定性」（網路、時間、GPU 這些都不會因為你寫了 manifest 就乖），但它把工程的基礎盤拉高到一個可用的水準：**環境不再是口頭描述，而是可傳遞的 artifact**。

## 2) 所謂容器，很多時候只是 Linux 默默很強

VM 強隔離，但重。

OS primitives 輕，但過去很難組合、很難讓一般開發者順順用。

Linux namespaces 讓 Docker 有機會踩到那個「又快、又夠隔離、又可用」的平衡點：

- 同一個 kernel
- 不同 process 看到不同的資源視角（mount、PID、network…）
- 開銷小、效能接近原生

CACM 那篇文章有個我很認同的 framing：Docker 的選擇其實是「相容性優先」。

如果你追求純粹優雅，你會走 Nix/Guix 那種路線：把世界重新打包。

但 Docker 走的是「讓世界照舊運作」——不要求所有人改 packaging，而是用 kernel feature 來製造邊界。這個妥協，才是它普及的原因。

## 3) Docker 之所以變成標配，是因為它很在意「筆電」

很多 infra 工具會假設：開發環境不重要，反正上 production 就好。

Docker 反過來。

當它要服務 macOS / Windows 的 developer fleet，問題變成：

> host OS 根本不能原生跑 Linux container，那 UX 要怎麼一樣？

解法不浪漫，但很務實：

- 在 desktop app 裡塞一個輕量 Linux VM
- 然後把複雜度藏起來，讓你還是用同一套 CLI

網路那段更精彩。

文章提到 Docker 甚至把 **SLIRP**（1990 年代撥接時代的工具）拿回來用，讓 container traffic 看起來像 host 發出來的系統呼叫，避開公司防火牆對「橋接網路」的限制。

這種「無聊但救命」的工程，才是工具能不能大規模擴散的關鍵。

## 4) Docker 是一個系統，不是一個 binary

很多人還是會說「裝 Docker」像裝一個程式。

但今天的 Docker 其實更像一組組件 + 規格：建置工具、runtime、image store，以及要讓不同 vendor 能互通的標準。

那篇文章提到像 BuildKit、containerd 這種拆分，其實是合理的進化：

- build 變成效能與 cache 的戰場
- runtime 變成安全與隔離的戰場
- image format 必須可攜、可互通

最後這點我覺得很常被低估。

**OCI image / runtime spec** 把容器從「某公司格式」變成「產業合約」。Kubernetes 的生態能長成今天這樣，標準化是基礎。

## 5) 下一個十年，不是容器，而是「異質硬體」

如果你跑的是一個普通 web service（x86 Linux），Docker 其實早就很成熟了。

變動來自於周邊：

- GPU 變成越來越多 workload 的標配
- AI pipeline 更在乎環境可重複，也更在乎資料與計算假設
- agentic workflow 讓 code/infrastructure 產出速度變快，但驗證速度跟不上

所以 container 的故事會從「我能把 app 打包」變成「我能把 app + 它的 compute 假設一起打包」。

這裡我反而有點保留。

CPU world 的確被容器改善很多。

但一旦碰到 GPU driver、CUDA stack、kernel module、vendor 差異，「works on my machine」會用另一種方式回來。

Docker 能幫忙，但它不能改變物理現實。

## 6) 我的實務 takeaway

如果你在做工具或平台，我會從 Docker 偷一個最實用的 lesson：

- 不要迷信 primitive
- 要 obsess 的是 workflow
- 把 developer laptop 當一級公民

因為能擴散的不是 kernel feature。

能擴散的是體驗。

而 Docker 就是靠這件事，讓我們到現在還在說「docker run」。

---

**References:**
- [CACM 回顧文章：A Decade of Docker Containers](https://cacm.acm.org/research/a-decade-of-docker-containers/)
- [Open Container Initiative（OCI）規格入口：image 與 runtime specs](https://opencontainers.org/)
- [Docker 官方文件：Getting Started 與核心概念](https://docs.docker.com/get-started/)
- [Linux namespaces（kernel 文件）總覽](https://www.kernel.org/doc/html/latest/admin-guide/namespaces/index.html)
