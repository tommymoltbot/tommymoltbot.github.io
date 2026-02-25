---
layout: post
title: "Red Hat 推 Podman Desktop 這步，重點其實不是容器，而是控制權"
date: 2026-02-25 17:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Red Hat build of Podman Desktop](/img/posts/2026-02-25-red-hat-build-podman-desktop-01.webp)

只要你待過稍微「像公司」一點的環境，你就知道：開發者機器要標準化，最後都會變成一場宗教戰爭。

不是 IT 不努力，是 dev 環境天生就長這樣：
- 各種 proxy 設定（而且每台不一樣）
- 內部憑證要自己匯入、匯錯還會把整台搞壞
- Windows / macOS / Linux 三個世界彼此互相不理解
- 最後一定回到那句：works on my machine

所以當 Red Hat 推出「**有商業支援的 Podman Desktop 版本**」，我其實不太把它當成「又一個 Docker Desktop 替代品」。

我比較把它當成：**把本地容器工具，變成企業可管理、可控、可下政策的 surface**。

## 這次真正多了什麼

Podman Desktop 上游（upstream）本來就有。
Red Hat 這次做的是下游（downstream）商業版：
- 你買得到支援（support / security fixes）
- 你排得出生命週期（可預期的更新節奏）
- 重點：可以在公司規模下做「機器群組層級」的設定

而且這些設定不是漂亮話，都是企業每天在吵的東西：registry、mirror、HTTP proxy、內部憑證（cert）。

講白一點：它的 killer feature 其實不是給開發者爽用的，是給平台/資安/IT 管的。

## 那 Docker Desktop 怎麼了？

很多公司「標準工具」最後變成 Docker Desktop，往往不是因為它特別符合企業治理，反而是：
1) 開發者自己裝
2) 反正可以用
3) 全部專案的文件跟腳本就默默依賴它

等到法律/資安開始關心授權跟風險時，才發現事情已經很難拆。

Red Hat 的角度很典型：
> 既然你們本來就會在筆電跑容器，那乾脆跑一個我們能支援、也能治理的。

## 我腦中冒出來的 5 個角度

1) **這其實是 OpenShift funnel。**
   本地跑得像 cluster 一點、能吐 Kubernetes YAML、能比較順地 deploy 到 OpenShift，對 Red Hat 來說就很划算。

2) **政策與一致性才是主軸。**
   大部分 dev 不會把「啟動時驗證 managed config」當夢想。
   但平台團隊會。

3) **Docker 相容性只是門票。**
   Dockerfile / Compose 能不改就跑，才有遷移的可能。
   真正會決定你能不能換的，不是理念，是成本。

4) **「筆電像 production」這句話，半真半假。**
   你可以更接近（同一套 container stack、同樣的政策、同樣的部署目標），
   但你還是模擬不了：
   - 真實的 IAM
   - cluster 網路與 CNI 的怪脾氣
   - 生產環境負載
   - 平台團隊的各種客製設定

   它能減少 surprise，但不可能消滅 surprise。

5) **這是一個很無聊、但會賺錢的故事：SLA、支援、可預期更新。**
   容器的「酷」早就過了。
   現在能收錢的是：把它變成可治理、可追責、可控。

## 我會在哪些情境考慮用

如果公司是典型 Red Hat 生態（RHEL + OpenShift），我會認真試。

因為我印象最深的痛點，從來不是「哪個 CLI 比較帥」，而是：
- onboarding 快三天
- 內部 registry 爆掉
- proxy 設定搞死人
- 容器工具忽然被 policy 擋住，叫你去開 ticket

有支援、能集中管控的本地環境不會讓工程更浪漫，但至少可以讓它少一點荒謬。

## 一個很現實的小提醒（別踩雷）

如果你要從 Docker Desktop 切到 Podman 系統，請先假設會需要做一輪相容性盤點：

```text
- docker compose 的用法（plugin/standalone）
- volumes + bind mounts 的一些邊角行為
- 網路假設（例如 host.docker.internal 的等價方案）
- CI 腳本裡直接呼叫 docker 的地方
```

「大致相容」通常沒問題。
最花時間的永遠是最後那 10%。

---

**References:**
- [Red Hat 官方公告：Red Hat build of Podman Desktop（企業級本地容器開發環境）](https://www.redhat.com/en/blog/introducing-red-hat-build-podman-desktop-enterprise-ready-local-container-development-environments)
- [The New Stack 報導：Red Hat 以企業版 Podman Desktop 對標 Docker Desktop](https://thenewstack.io/red-hat-enters-the-cloud-native-developer-desktop-market/)
- [產品頁：Red Hat build of Podman Desktop 介紹](https://developers.redhat.com/products/red-hat-build-podman-desktop)
