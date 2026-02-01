---
layout: post
title: "Netbird 在 HN 上 455 分 — Zero Trust 到底在紅什麼？"
date: 2026-02-01 17:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: zh
permalink: /zh/netbird-open-source-zero-trust-networking/
image: /img/posts/2026-02-01-netbird-mesh-network.webp
---

![零信任網狀網路概念圖](/img/posts/2026-02-01-netbird-mesh-network.webp)

今天早上看到 [Netbird](https://netbird.io/) 在 HN 首頁 — 455 分，171 則留言。這不是那種「喔還不錯又一個工具」的等級，這是「工程師真的在用而且有想法」的等級。

所以這是什麼？簡單講：開源零信任網路。如果聽起來像buzzword，等等 — 這裡面有些實際的東西。

## 到底解決什麼問題？

先從實際的東西開始。你有機器散落各地 — 家裡的伺服器、VPS、可能某個角落有個樹莓派、你的筆電。你希望它們能安全地互相通訊，但不想在防火牆上打洞或把服務暴露到公網。

傳統做法？VPN。架 OpenVPN 或 WireGuard，設定路由，管理金鑰，然後祈禱你在三個時區外時不要出問題。

Netbird（還有像 Tailscale/Headscale 這類工具）說：如果讓所有裝置成為私有 mesh 網路的一部分呢？不需要中心伺服器來轉發，不需要複雜的防火牆規則，就是點對點的加密連線。

我一年前第一次聽到這種做法時其實有點懷疑。「直接用 WireGuard 就好了啊」是我當時的反應。但看到這麼多人在 production 環境跑這個 — 不只是 homelab，是真的工作用的設定 — 我開始認真看了。

## Zero Trust：L3/L4 vs L7 的混淆

「零信任」這個詞被到處亂用。把兩種都自稱「零信任」的架構分開會比較清楚：

**L3/L4（網路層）**：這是 Netbird/Tailscale/Headscale 做的事。裝置之間還是有 IP 可達性，但註冊和存取控制是由身份/裝置狀態驅動。算是「零信任風」— 沒有東西是預設信任的，你做微分段，但一旦進入 mesh，你就是在做網路層級的存取。

**L7（應用層）**：這是 Cloudflare Access / Teleport 那種。完全沒有原始網路存取。每個請求都要按應用/服務/session 做身份驗證/授權。比較接近嚴格的 BeyondCorp 定義。

兩種都有用。它們解決不同問題。很多團隊最後會組合使用：mesh VPN 給 ops/workloads，L7 gateway 給面向使用者的應用，那邊你真的需要每個請求都檢查身份。

Netbird 堅定地屬於 L3/L4 陣營。底層是 WireGuard。它加的是管理層 — 自動 peer 探索、金鑰交換、ACL，不用你手動設定每個裝置。

## 實際使用場景（從 HN 討論串來的）

HN 的留言總是比 landing page 有趣。以下是人們實際在用這個做什麼：

**內部服務躲在 VPN 後面**：有人提到他們有伺服器用 Netbird 把 Telegraf metrics 送到家裡的伺服器，而不是開 port。合理 — 如果只有兩台機器需要通訊，為什麼要暴露到網路上？

**遠端存取 homelab**：多人在跑 Coolify、把舊筆電當開發伺服器、家庭影院控制 — 全部透過 mesh 遠端存取。不用 ngrok，不用動態 DNS，就是一個跟著你走的內部網路。

**便宜的 NAS**：有個人把舊 Mac 接外接硬碟，透過 Netbird 存取，備份到 Hetzner。不是企業級，但個人用？為什麼不呢。

**Mullvad VPN exit node**：Tailscale 現在有 UI 做這個 — 用你 mesh 裡的一個節點當 VPN 出口。不用信任第三方 VPN 供應商的隱私保護。

我覺得有意思的是這些使用案例有多實際。這不是「如果能這樣不是很酷嗎」的領域。這些是人們今天就有的問題，用已經能用的工具解決。

## 開源生態：Tailscale vs Headscale vs Netbird

如果你在看這個領域，主要有三個選擇：

**Tailscale（商業版）**：原創。精緻、支援完善、到處都能跑。免費額度很大方，但如果你要 scale up 或要某些功能，就得付錢。

**Headscale（開源 Tailscale 控制平面）**：社群專案。跟 Tailscale client 相容，自己架。但 — 而且這很重要 — 維護者非常坦白地說這*不是*什麼。從他們的 FAQ：

> 「Headscale 不是企業軟體，我們的焦點是 homelabber 和自架者。[...] 我們專注在正確性和與 Tailscale SaaS 的功能對齊。」

他們已經棄用 Postgres 支援，只推薦 SQLite。為什麼？因為支援分散式資料庫會增加他們不想維護的複雜度。合理。但這告訴你目標受眾是誰。

HN 討論串裡有些人對此不爽。「為什麼拿掉 Postgres？」答案是：因為他們是為特定使用案例設計，而且很誠實。如果你要企業級 HA，用 Tailscale 的付費版。

**Netbird**：也是開源，但看起來目標是更廣泛的部署範圍。跟 Tailscale/Headscale 比還算年輕。它能在 HN 上得到這麼多關注，代表它做對了什麼。

## 所以... 我會用嗎？

是這樣的：我沒有 homelab（還沒）。我的設定很簡單 — 筆電、幾個 VPS 節點，沒有太多需要持續安全存取的東西。

但如果我在建更複雜的東西？嗯，我大概會試試這個。替代方案是手動管理 WireGuard 設定檔或處理傳統 VPN 的開銷。兩個都不太吸引人。

我喜歡這整個類別（基於身份的 mesh VPN）的地方是它優雅地解決了真實問題。你不用是網路專家就能設定。你不用維護複雜的防火牆規則。它就是能用。

我還在謹慎的地方：成熟度。Tailscale 存在更久，資源更多。Headscale 明確說自己是 homelab 工具。Netbird 在兩者之間。個人專案我會用任何一個。Production？我會想看到更多實戰測試。

## 底層趨勢

這整個領域 — 基於 WireGuard 的 mesh 網路 — 是一個更廣泛趨勢的一部分，我覺得很有意思：基礎設施層對個人和小團隊變得更容易接觸。

十年前，在多個地點設定私有網路是企業才做的事。現在？裝一個執行檔，跑一個指令，完成。跟容器一樣，跟 serverless 一樣，跟很多以前需要專門 ops 團隊的東西一樣。

這既令人興奮又有點令人擔憂。興奮是因為它降低了建東西的門檻。擔憂是因為當出問題時，你需要理解底下實際發生什麼事。而很多人... 不懂。

但這是更廣的話題了。

## References

- [Netbird 官方網站](https://netbird.io/)
- [HN 討論串：Netbird – Open Source Zero Trust Networking](https://news.ycombinator.com/item?id=46844870)
- [Headscale 官方文件](https://headscale.net/)
- [Tailscale：NAT Traversal 如何運作](https://tailscale.com/blog/how-nat-traversal-works/)
