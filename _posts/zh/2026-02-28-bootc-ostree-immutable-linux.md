---
layout: post
title: "bootc + OSTree 讓我重新思考 Linux 部署：少一點『安裝』，多一點『出貨』"
date: 2026-02-28 06:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![bootc + OSTree cover](/img/posts/2026-02-28-bootc-ostree-01.webp)

我這幾年一直在追一個很無聊、但很實用的夢：**我的機器要可重現（reproducible）。**
不只 server。
我的 dev laptop 也要。
因為一旦你的筆電變成「只能靠祈禱才能升級」的雪花機，你就會開始對自己的工作環境失去信任——而且最可怕的是，你還會慢慢習慣這件事。

最近看到一篇在講 **bootc** 跟 **OSTree** 的文章，算是把我的腦袋轉了一下：
別再把 Linux 當成「裝完之後一路 patch 到老」的東西。
把它當成你會對待 production 服務一樣：**build、version、ship、rollback**。

先把這幾個名詞講清楚（我自己也是看完才終於串起來）：
- **OSTree**：有點像「檔案系統的 git」，以內容雜湊（content-addressed）管理整棵系統樹，部署是 atomic 的。
- **rpm-ostree**：在 OSTree 的基礎上，讓你還能跟 RPM 世界對接（layer packages、組成新的系統版本）。
- **bootc**：用 **OCI container images** 當作「可開機 OS」的運輸格式，做交易式（transactional）的升級/切換。

重點是：你的 OS 不是跑在 container 裡。
它只是把 container image 當成 delivery format。
這個差別很細，但很重要。

## 我腦中反覆出現的五個角度

1) **這其實是把 ops 的思維，正式搬到筆電上。**
server 世界早就知道 immutable 不是宗教，是風險管理：漂移變數少、回滾快、半夜少爆炸。
我一直覺得 desktop 早晚也要走到這一步，只是沒想到會是這種「像出貨一樣部署 OS」的路線。

2) **變更單位從『套件』變成『整個系統』。**
傳統 Linux 升級是很多小突變堆起來。
出事時你在 debug 一段時間線。
OSTree 這種部署比較像：你在 debug 一個 snapshot。
問題從「哪個 post-install script 把我開機搞壞」變成「我現在 boot 的是哪個 deployment hash」。
failure mode 直接換一種。

3) **用 OCI 當 transport format 真的很…務實（甚至有點討厭的合理）。**
你如果已經有：
- registry
- 簽章/驗證
- mirror
- cache
- CI pipeline

bootc 就是在說：「那這些拿來送 OS 也行。」
不炫，但很省事。

4) **回滾會變成日常習慣，而不是一年用一次的逃生按鈕。**
當 rollback 是預設流程，整個系統就會自然長出一些行為：
- 會保留舊 deployment
- 切換成本很低
- 把『升級失敗』當成正常事件

然後你升級就不會那麼怕。
你不會因為「可能會壞」就拖著不 patch。

5) **DX 的取捨從『隨便裝』變成『把變更關起來』。**
`/usr` 只讀時，你沒辦法再隨手 `dnf install whatever`。
一開始聽起來很煩，但它會逼你把東西分層：
- base OS image（穩定、無聊）
- layered packages（顯式、可追蹤）
- 專案工具鏈（toolbox / containers）

我不是說它完美。
我是在說：這個工作流跟我們現在部署其他東西的方式，突然變得一致。

## 真正讓我「喔靠原來如此」的心智模型

把你的 OS 想成一個 Git repo。
但不是「我把 dotfiles 放 Git」那種。
是「整棵 root filesystem 都有 commit」那種。

你不是在「升級某個檔案」。
你是在 **deploy 一棵新的系統樹**。

用 rpm-ostree 裝套件，也不是當下把 running system 改掉。
它更像是在準備下一次 reboot 要用的新 deployment。

所以以前代表「立刻改」的指令，在這個世界裡更像「先把下一次開機的狀態排好」。

用幾行文字描述大概是這個感覺：

```text
rpm-ostree install <package>
# => 生成新的 deployment，下次重開機才生效

rpm-ostree rollback
# => 回到上一個 deployment
```

然後 bootc 直接把範圍拉到「整個 base system」：

```text
bootc switch <registry>/<image>:<tag>
# => 把整個系統切到另一個 image
```

如果你曾經有過「這台機器被詛咒了」的感覺，你應該懂這件事為什麼吸引人。

## 我目前還會懷疑的地方

- **layer 太多就會自己打臉。**
  如果你那台「immutable OS」最後疊了 80 個套件、再加上一堆手改 config glue，你只是把可變 Linux 重新包一層，還多了流程成本。

- **state 才是硬仗。**
  OS 可以 atomic，但你的 state 不會。
  DB、secrets、磁碟分割、driver、firmware…現實問題都在這裡。

- **逃生門一定要好用。**
  開發者永遠會需要做怪事。
  如果正規路線太難走，人就會自己搞漂移，然後再反過來怪工具。

但我喜歡這個方向。
它像是把「container delivery 的經驗」搬回 OS 世界，去解決那個一直卡在「手動安裝精靈 + 長年累積」的老問題。

## 如果明天要我採用

我會給自己三條規則：
- base image 保持無聊
- 變更保持顯式
- 實驗丟到 toolbox/container

真要在 base system 上「先 hack 一把」？
可以。
但我希望我隨時能把機器 reset 回某個已知良好的 deployment，而不是重裝一個週末。

這才是我覺得最重要的點。
不是 immutability。
是 **recoverability（可復原性）**。

---

**References:**
- [Bootc and OSTree: Modernizing Linux System Deployment（原始文章）](https://a-cup-of.coffee/blog/ostree-bootc/)
- [bootc 專案（用 container images 做 OS 升級/切換）](https://github.com/bootc-dev/bootc)
- [libostree / OSTree 文件（git-like 的系統樹與部署）](https://ostreedev.github.io/ostree/)
- [rpm-ostree 文件（image + package 的混合系統）](https://coreos.github.io/rpm-ostree/)
- [Fedora Silverblue 介紹（atomic desktop 概念）](https://fedoraproject.org/atomic-desktops/silverblue/)
