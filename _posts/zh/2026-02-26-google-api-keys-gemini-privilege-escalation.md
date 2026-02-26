---
layout: post
title: "Google API key 本來不是祕密，直到 Gemini 讓它變得像憑證一樣"
date: 2026-02-26 10:11:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Google API keys 與 Gemini 權限升級問題](/img/posts/2026-02-26-google-api-keys-gemini-01.webp)

這幾年 Google 一直在傳遞一個很一致的訊息：前端常看到的 `AIza...` 這種 Google API key 不是「祕密」。它比較像是專案識別 + 計費掛勾，用法就是照文件把它放進網頁，然後用 referer 限制、API scope 之類的方式降低濫用。

但 Gemini 出來之後，這件事的語意變了，而且變得很危險。

Truffle Security 的文章講得很直白：當你在同一個 GCP project 裡啟用 Gemini（Generative Language）API，**原本存在於該 project 的 API key 可能會「默默」獲得可用於 Gemini 的權限**。

問題在於：很多 key 是照著舊文件的建議，放在前端公開環境裡的（例如 Maps widget）。在這個前提下，權限一旦被升級，那就不是「你把憑證洩漏了」——而是平台把一個本來允許公開的 token，改造成可以當憑證用的東西。

## 我在意的點：這不是單一 bug，是架構問題
這類事故通常不是少寫一個 if，而是「key 的角色定義錯了」。

Google 讓同一種 key 形狀同時承擔兩件不同的事：
- 類似 publishable key：設計上就是會出現在瀏覽器裡
- 類似 secret credential：應該只存在 server-side

做過金流整合的人其實很熟：
- publishable key 可以曝光在前端
- secret key 不能離開後端

把兩者混在一起，遲早出事。

## 這其實是「平台語意變動」的警訊
就算你不在意 Gemini，你也應該在意這種模式：平台在既有 API surface 上「加掛 AI」後，舊 credential 的權限語意可能被重新定義。

最可怕的是順序：
- 2023 年：你照文件做，把 key 放在前端（當時被認為安全）
- 2026 年：團隊某個人啟用 Gemini API
- 同一把 key：突然可以打到 Gemini 相關端點、讀資料、燒錢

安全假設不是一次性的，它會隨著平台演進而腐爛。

## 攻擊者怎麼做？真的超直覺
概念上就是兩步：
1) 從公開網頁 source 抓到 `AIza...` key
2) 直接試 Gemini 端點

文章裡給的例子基本像這樣：

```text
curl "https://generativelanguage.googleapis.com/v1beta/files?key=$API_KEY"
```

如果拿到 `200 OK`，那就不是「可能有風險」，是「已經中獎」。

依照該 project 實際使用情況，風險可能包含：
- 讀到上傳檔案或 cached contents
- 直接燒掉 Gemini usage / quota / 帳單
- 把你正常服務擠爆（quota 被打滿）

## 我會怎麼處理（務實版）
我會把它當成「key lifecycle 管理」問題，而不是單點補設定。

簡短 checklist：
- 盤點哪些 GCP project 有啟用 Gemini / Generative Language API
- 針對這些 project 的所有 API key 做全面 audit
- 把 key scope 到最小（限制 API + 限制使用情境）
- 任何曾經曝光在前端或公開 repo 的 key：直接 rotate

然後老實說，如果你現在還把「HTTP referer 限制」當主防線，那我會預設它可繞過，只是成本高低的問題。

---

**References:**
- [Truffle Security 原文：Google API key 不再是非祕密，因為 Gemini 改了規則](https://trufflesecurity.com/blog/google-api-keys-werent-secrets-but-then-gemini-changed-the-rules)
- [Firebase 安全清單：API keys 不是祕密（過往官方指引）](https://firebase.google.com/support/guides/security-checklist#api-keys-not-secret)
- [Google Maps JavaScript 文件：前端使用 API key 的方式](https://developers.google.com/maps/documentation/javascript/get-api-key?setupProd=configure#make_request)
- [Gemini API 文件：Google 對 leaked keys 的安全措施說明](https://ai.google.dev/gemini-api/docs/troubleshooting#googles_security_measures_for_leaked_keys)
