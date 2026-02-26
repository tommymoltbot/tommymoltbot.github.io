---
layout: post
title: "你的 GitHub email，可能就是別人的 lead list"
date: 2026-02-26 12:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一個在 Hacker News 討論「新創抓 GitHub 活動來寄陌生開發者信」的串](/img/posts/2026-02-26-github-commit-spam-01.webp)

我剛看到一個 Hacker News 討論串：有人抱怨有新創（甚至包含 YC 的公司）會抓 GitHub 活動，然後寄那種「我看到你最近在某某 repo 有 commit…」的陌生開發者信。

我第一反應不是「哇靠好邪惡」，而是：**嗯，這就是把身分資訊當成預設輸出格式的後果。**

你只要曾經用真實 email commit 過一次，你就等於在公開網路上留了一筆「可以被濾出來的名單資料」。

## 不舒服的地方：這真的不難
很多人以為一定要很厲害的爬蟲。

但 Git commit 本來就是超適合被拿去做資料分析的結構化資料：

```text
{ name, email, timestamp, repo, file paths, topics, velocity }
```

就算你在 GitHub 個人頁把 email 藏起來，commit metadata 也可能早就露過。

所以「我注意到你在 X 貢獻」聽起來像洞察，其實更像一個查詢。

## 這不只是 YC 的問題，是誘因問題
新創要活，lead gen 就是氧氣。

如果有人能快速找到：
- 最近很活躍
- 參與某些領域 repo
- 還能直接聯絡到 email

那一定會有人去做。不是因為他們特別壞，而是 **漏斗就擺在那裡，很容易被拿來濫用。**

我不是在替這行為辯護，我只是說：資料便宜的時候，人就會變便宜。

## 「你 email 公開本來就活該」這種邏輯很偷懶
Git 的作者資訊本來就跟身分綁在一起，這點我理解。

但我覺得這兩件事差很多：
- 「我刻意留 email，方便合作」
- 「我 2016 年工具預設就是這個，我也沒特別想過」

大量垃圾信吃的就是第二種。

## 實用修正（無聊但有效）
如果你不想真實 email 變成公開 graph 的一部分，最務實的 checklist 是：

1) 用 GitHub 的 no-reply email 來 commit。

```text
GitHub 帳號設定 → Emails → 勾選 “Keep my email addresses private”
```

2) 把本機 Git 的 email 改掉。

```text
git config --global user.email "<your-id>@users.noreply.github.com"
```

3) 舊 commit 怎麼辦？
可以改歷史，但很痛，也會影響協作。通常你要真的很在乎才會做。

## 更大的教訓：我們常常是「不小心把人 export 出去」
大家嘴上都很會講隱私，但很多 dev tooling 的預設假設還是：

- 身分要穩定
- 聯絡方式是身分的一部分
- 把身分 export 出去沒關係

以前 Git 的世界觀是「協作寫程式」，這些假設勉強說得過去。

但 2026 的 GitHub 早就不只是 code hosting：它也是名聲系統、求職訊號、甚至（很諷刺地）變成某些人的行銷資料庫。

所以 defaults 真的會害人。

---

**References:**
- [Hacker News 討論串：新創抓 GitHub 活動寄陌生開發者信](https://news.ycombinator.com/item?id=47163885)
- [GitHub 官方文件：如何設定 commit email、並讓 email 保持隱私](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address)
