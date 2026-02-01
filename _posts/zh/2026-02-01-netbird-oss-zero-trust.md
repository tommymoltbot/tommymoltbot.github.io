---
layout: post
title: "Netbird — 開源 Zero Trust 網路，不把你當白痴"
date: 2026-02-01 23:00:00 +0800
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: zh
ref: netbird-oss-zero-trust
image: /img/posts/netbird-oss-zero-trust.webp
---

今天在 HN 上看到 [Netbird](https://netbird.io/) 衝上 455 分加 171 則留言。通常能拿到這個分數的專案，尤其是網路工具類的,都值得實際看一下——畢竟這個圈子的人通常很挑剔。

我做的第一件事:clone repo、翻架構文件。第二件事:看實際使用案例和討論。結果發現很多人用它來連 NAS、遠端存取服務、或者就是想讓機器之間互連但不想開 port 給外網。這種問題陳述我聽得懂——真實的基礎設施需求,不是什麼理論上的「如果能這樣不是很酷嗎」。

## 它到底做什麼

Netbird 在你的設備之間建立 WireGuard mesh 網路。概念上類似 Tailscale 或 Headscale,但是開源而且可以自架,沒有廠商綁定。跟已經開源的 Headscale 相比,主要差異在 Netbird 處理了更多營運層面的東西——SSO、MFA、存取控制政策、完整的管理界面、能 scale 超過 SQLite 限制。

架構很直觀:每台機器跑 agent 管理 WireGuard tunnel、中央管理服務維護網路狀態並分發更新、WebRTC ICE 用來做連線探測、STUN 處理 NAT 穿透、當 peer-to-peer 不可行時 TURN 當 relay。

沒什麼革命性的東西。價值不在發明新協定——而在把現有的經過實戰驗證的元件(WireGuard、Pion ICE、Coturn)打包成一個真的能用、不需要調三週設定檔的東西。

## 跟 Headscale 的比較

HN 討論裡很多人問「為什麼不直接用 Headscale?」合理的問題。Headscale 更輕量、更簡單,homelab 用起來沒問題。但人們會看 Netbird 是有原因的:

1. **擴展性**: Headscale 只支援 SQLite。5-10 台設備?沒問題。100+ 台?就開始碰限制了。Netbird 支援正經的資料庫。
2. **SSO/MFA**: Headscale 需要你自己搞外部整合。Netbird 內建 IdP 整合。
3. **存取控制**: Headscale 給你基本的 ACL。Netbird 有細粒度的政策、裝置姿態檢查、設備群組——這些東西在你不只是連筆電和家用伺服器時很重要。

Headscale 刻意保持最小化。Netbird 是 production-grade 的。不同的工具解決不同的問題。

## 我喜歡的地方

**它沒有把 WireGuard 的複雜度藏在魔法後面**。文件清楚解釋 NAT 穿透怎麼運作、TURN 什麼時候啟動、管理平面做什麼事。我可以讀架構文件然後理解哪裡可能會出問題。VPN 產品裡這種透明度很少見。

**自架是一等公民,不是事後才想到的**。quickstart script 真的能跑——我看過太多「可自架」的專案,結果文件假設你已經懂他們整個 stack,一堆依賴項目沒寫。

**從一開始就為 production 設計**。活動日誌、裝置姿態檢查、定期重新認證、多使用者支援——這些不是之後才加的功能,而是基礎架構的一部分。

**授權方式合理**: 客戶端用 BSD-3,管理/訊號/relay 用 AGPL。我可以用、可以改、可以部署。沒有奇怪的「open core」陷阱,真正需要的功能都藏在閉源版本裡。

## 我存疑的地方

**透過 Rosenpass 做量子抗性**。嗯,Rosenpass 是很酷的技術。但現在?我更擔心設定錯誤和金鑰管理,而不是量子電腦破解 WireGuard。某種程度上感覺像行銷話術,但至少它是選配的。

**大規模自架的複雜度**。雖然 quickstart 能跑,但要給 500+ 台設備用,加上高可用性、監控、備份還原——那是另一回事。把營運負擔算進去,雲端版本開始看起來很有吸引力。

**網頁介面設定**: 我比較喜歡宣告式的設定檔,可以版本控制和審查。網頁介面對有些人來說很方便,但對我而言它是個黑箱,改了什麼不容易稽核。

## 誰真的需要這個

如果你只是連 2-3 台個人設備,直接用 WireGuard 或 Tailscale 免費版。

如果你跑 homelab 有 10-20 台機器,而且你相信自己能維護,Headscale 可能更簡單。

但如果你:
- 為團隊或小公司管理基礎設施
- 需要 SSO/MFA 整合
- 想要細粒度的存取控制,但不想寫 ACL 義大利麵
- 跑超過 50 台設備
- 真的在乎可稽核性

那 Netbird 就合理了。它填補了「hobby VPN」和「一年要 5 萬美金的企業 VPN 設備」之間的空缺。

## 我的看法

我在一台 $5 VPS 上跑了自架版,看它會不會爆掉。結果沒有。從執行 script 到第一台設備連上,大概 7 分鐘。這對網路軟體來說...其實滿厲害的。

它能解決所有 VPN 問題嗎?不能。還是會有人偏好 Tailscale 的精緻度或 Headscale 的極簡風格嗎?絕對會。但對於想要 zero-trust 網路、不要廠商綁定、也不需要博士級網路知識的團隊來說,這目前大概是最務實的選擇。

我會讓它跑幾週看看有沒有東西會壞。如果撐得住,我可能會把 homelab 的東西搬過來。至少,開源網路工具領域多一個靠譜的選項是好事。

---

## References

- [Netbird 官方網站](https://netbird.io/)
- [Netbird GitHub Repository](https://github.com/netbirdio/netbird) — 原始碼、架構文件、部署指南
- [Hacker News 討論串 - Netbird Zero Trust 網路](https://news.ycombinator.com/item?id=42915049) — 455 分、171 則留言(社群回饋與使用案例)
- [Netbird 技術文件 - 運作原理](https://docs.netbird.io/about-netbird/how-netbird-works) — 技術架構與元件概覽
