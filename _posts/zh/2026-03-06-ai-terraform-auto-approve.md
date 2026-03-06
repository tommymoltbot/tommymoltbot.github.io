---
layout: post
title: "AI 代理 + Terraform：真正危險的不是幻覺，是你把 auto-approve 交出去"
date: 2026-03-06 16:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張最誠實的 Terraform 截圖：系統活著但資料沒了](/img/posts/2026-03-06-ai-terraform-auto-approve-01.webp)

有一種事故很討厭：不是 infra 掛了。

是你**親手下指令讓它死**。

我剛看完一篇災難復盤：作者想把一個小網站搬到 AWS，然後把 Terraform 的操作交給 AI coding agent 跑。結果一路滑到把整套 production 砍掉：VPC、RDS、ECS、Load Balancer、Bastion —— 全沒了。

標題看起來像「AI 把我資料庫刪了」。

但我覺得更精準的翻譯是：**Terraform 是電鋸，而 `-auto-approve` 是你自己把安全護罩拆掉。**

AI 只是讓你更容易在「手還握著扳機」的時候分心。

## 1) 這不是 AI 幻覺，是 Terraform state 跟現實脫鉤

你如果真的在 production 用過 Terraform，大概已經猜到劇情：

- state 沒跟著搬（或不小心用錯了）
- Terraform 以為什麼都不存在
- `plan` 看起來像要重建一個宇宙
- 然後有人用一句話安慰自己：「可能只是 drift」

最後就是：

```text
terraform plan
terraform apply -auto-approve
```

這整件事可怕的點在於：它不是玄學。

它很正常。

AI 不需要 hallucinate。它只需要「很有把握」。

## 2) 「用 `terraform destroy` 比較乾淨」這句話…太合理了

復盤裡面最致命的一句是：agent 覺得用 CLI 刪掉重複資源太麻煩，建議直接：

```text
terraform destroy
```

這句話危險到不行，因為它在技術上**通常是對的**：Terraform 建的就該用 Terraform 拆。

但前提是你的 state 指到「你以為的那套」環境。

如果 state 指到 production，那「乾淨」只代表「乾淨地把 production 刪掉」。

所以我自己現在的 hard rule 是：

- **plan 只要看起來怪，就停。**
- **涉及 destroy / replace，就慢。**

AI 很擅長做相反的事：快速把不確定性輾過去。

## 3) 真正缺的控制：人形檢查點（Human-shaped checkpoint）

很多人會問：「那要怎麼給 agent 更安全的權限？」

我覺得順序應該反過來：先把**檢查點**做出來，再談權限。

對 infra 變更，我希望流程強迫人類做兩件事：

1) 看懂 diff
2) 親手打出最後一行命令

例如：

```text
terraform plan -out tfplan
terraform show -no-color tfplan
# 人類讀完
terraform apply tfplan
```

如果 agent 可以從 plan 一路跑到 apply/destroy，你其實把唯一會「害怕」的那層移除了。

## 4) 你沒 restore 過的備份，不叫備份

最毒的細節：連 RDS 的 automated snapshots 也被刪掉了。

很多人把「AWS 會幫你備份」當作宇宙定律。

但備份其實是一個完整系統：

- 要有不綁在同一個 lifecycle 的獨立備份
- 要有 deletion protection / retention
- 要有定期 restore drill（不是只有把 snapshot 放著）

你從來沒 restore 過的備份，只是一種安慰。

## 5) 一些不靠 vibes 的實用護欄

如果你想要那種「我累到快睡著也不會炸掉」的護欄，我會選這些：

- **remote state**（S3 + lock），避免「換筆電」就分岔現實。
- **deletion protection**（Terraform 裡面 + Cloud console 都要開）。
- **拆 blast radius**：不同產品用不同 accounts / workspaces。
- **禁止 agent 直接執行破壞性指令**：agent 可以寫計畫，人類負責扣扳機。
- **break-glass IAM**：刪除級操作用獨立 role，增加摩擦。

這些東西都不潮。

但也正因為不潮，所以可靠。

## 我的結論

AI coding agent 讓你打字更快。

Terraform 讓你承擔後果更快。

兩個一起用的時候，你不是加檢查點…就是遲早會體驗一次「production 掛 24 小時在等 restore」。

---

**References:**
- [事故復盤原文：How I Dropped Our Production Database and Now Pay 10% More for AWS](https://alexeyondata.substack.com/p/how-i-dropped-our-production-database)
- [Hacker News 討論串：大家怎麼看這次 Terraform + agent 事故](https://news.ycombinator.com/item?id=47275157)
