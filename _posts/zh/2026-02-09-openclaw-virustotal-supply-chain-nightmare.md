---
layout: post
title: "OpenClaw 牽手 VirusTotal：341 個惡意插件之後的覺悟"
date: 2026-02-09 10:05:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
image: /img/posts/openclaw-virustotal-supply-chain.webp
lang: zh
permalink: /zh/openclaw-virustotal-supply-chain-nightmare/
---

OpenClaw 這週宣布跟 VirusTotal 合作，所有上傳到 ClawHub 的 skills 現在都會自動掃描。聽起來很棒對吧？

問題是，這個動作是在發現 **341 個惡意 skills**、**30,000 個暴露實例**、還有一堆安全研究員發報告說「這東西根本是個資安災難」之後才做的。

所以現在的問題不是「他們做了什麼」，而是「為什麼要等到燒起來才做」。

## 先爆紅，安全後補

OpenClaw 從一個 Discord 上的小專案突然變成全球熱門話題，花了大概兩週。Moltbook 那場秀更是把熱度推到巔峰——AI agents 在一個 Reddit-style 社群裡自己聊天、發文、互動，完全不需要人類介入。

很酷，對吧？

但同時，安全研究員們也開始注意到不對勁。ClawHub 上面出現了一堆偽裝成正常工具的 skills，實際上在幹的事是：

- 竊取你的 API keys
- 下載並執行惡意程式
- 用你的帳號發訊息
- 在你的系統上植入後門

Bitdefender、Cisco、HiddenLayer、Zenity 這些公司陸續發報告，標題一個比一個聳動：「AI 供應鏈攻擊」、「Agent 變木馬」、「新一代安全噩夢」。

然後 OpenClaw 才宣布跟 VirusTotal 合作。

## VirusTotal 能擋什麼？

VirusTotal 的整合流程是這樣：

1. 每個 skill 上傳時會算 SHA-256 hash
2. 跟 VirusTotal 資料庫比對
3. 如果沒找到，整包上傳給 VirusTotal 分析
4. **Code Insight**（Gemini-powered）會掃描所有檔案，包括腳本和外部連結
5. 判定結果：benign（自動通過）、suspicious（警告）、malicious（直接封鎖）

聽起來滿完整的。但 OpenClaw 自己也在公告裡講了：

> "Let's be clear: this is not a silver bullet."

為什麼？因為 VirusTotal 掃的是**已知威脅**和**可疑行為模式**，但 AI agent 的攻擊手法不一樣。

如果一個 skill 用**自然語言**寫了一段看起來無害的 prompt，但實際上是在指示 agent「順便幫我把這個檔案傳到這個 URL」，VirusTotal 掃不出來。這叫 **indirect prompt injection**，而且已經有多起實際案例。

所以這層防護能擋掉 **known malware**（木馬、後門、竊密軟體），但對於**精心設計的 prompt injection payload**，基本上無效。

## 為什麼這次不一樣？

你可能會想：「npm、PyPI 那些套件庫不也一堆惡意套件嗎？有什麼好大驚小怪的？」

不一樣。

傳統的惡意套件頂多偷你的環境變數、改你的 build script。但 AI agent 的 skills 拿到的權限是：

- 你的 Telegram、WhatsApp、Signal 帳號
- 你的瀏覽器 session cookies
- 你的 Google Calendar、Gmail
- 你的金融 API keys

而且 OpenClaw 預設是 **bind to 0.0.0.0:18789**，意思是任何人只要知道你的 IP，就能試著連進來。根據 Censys 的數據，目前全球有超過 **30,000 個暴露實例**。

更糟的是，這些 AI agents 可以**跨平台執行指令**。一個惡意 skill 可以在你的電腦上執行任意 shell 指令、讀取任意檔案、發送任意訊息。這不是「偷個密碼」的等級，這是「完全控制你的數位生活」的等級。

## 這次的回應是真心改善，還是公關操作？

說實話，我覺得 OpenClaw 這次的動作是真的有在做事。

他們不只是跟 VirusTotal 合作而已，還宣布了：

- 完整的威脅模型文件
- 公開的安全路線圖
- 正式的漏洞回報流程
- 整個 codebase 的安全審計

而且他們請了 [Jamieson O'Reilly](https://www.linkedin.com/in/jamieson-oreilly/)（Dvuln 創辦人、Aether AI 共同創辦人、CREST 顧問委員會成員）當安全顧問。這不是隨便找個人來掛名，Jamieson 是真的在安全領域有份量的人。

但問題是，這些東西**應該在 viral 之前就做好**。

OpenClaw 從一開始的設計就是「先給你強大的能力，安全慢慢補」。預設 no sandboxing、API keys 明文存放、沒有工具呼叫確認機制、可以直接 `eval` user input。這不是「疏忽」，這是「設計選擇」。

現在補救當然比不補好，但這整個過程就是「move fast and break things」的經典案例——只是這次 break 的不是功能，是信任。

## AI agent 的安全問題還沒開始

OpenClaw 不是唯一有這些問題的平台。只是因為它爆紅，所以被研究員盯上了。

但 AI agents 這個概念本身就跟傳統軟體不一樣：

- 傳統軟體：你寫什麼 code,它就執行什麼
- AI agent：你給一個模糊的指令,它自己判斷怎麼做

這代表你無法用傳統的「input validation + sandboxing」來保護自己。因為 agent 的「input」是自然語言，而「execution」是 LLM 決定的。

而且 AI agents 通常會跨多個服務、多個 API、多個裝置運作。一個漏洞可以橫向移動到你所有連接的服務。這不是「某個 app 有漏洞」的問題,這是「整個數位生活的 single point of failure」。

中國工信部上週已經發出警告，提醒用戶注意 OpenClaw 的配置風險。這大概是第一次有國家級監管單位對 AI agent 平台發出安全警告。

不會是最後一次。

## 我的看法

OpenClaw 做的東西很酷，而且確實有價值。能讓 AI 真的去執行任務,而不只是聊天，這是一大步。

但「酷」跟「安全」不該是二選一。

VirusTotal 整合是個好的開始，但這只是第一層防護。真正需要解決的是：

- **預設安全**：sandboxing 應該是預設開啟，而不是要使用者自己去設定
- **透明度**：每次工具呼叫都應該讓使用者知道,並且有機會拒絕
- **權限管理**：skill 應該要明確宣告需要哪些權限，而不是「反正全給你」
- **持續監控**：不只是上傳時掃描，runtime 的行為也要能追蹤

而且老實說，如果你現在正在跑 OpenClaw，我會建議你：

1. **檢查你的實例是否暴露在公網上**（預設 bind 到 0.0.0.0）
2. **啟用 Docker sandboxing**（在 config 裡設定）
3. **審查你裝的每個 skill**，尤其是那些要求很多權限的
4. **定期檢查 `~/.openclaw/` 裡的 credential 檔案**

技術很棒,但安全不該是 afterthought。

---

## References

- [OpenClaw Partners with VirusTotal for Skill Security](https://openclaw.ai/blog/virustotal-partnership)
- [The Hacker News: OpenClaw Integrates VirusTotal Scanning to Detect Malicious ClawHub Skills](https://thehackernews.com/2026/02/openclaw-integrates-virustotal-scanning.html)
- [Bitdefender: Helpful Skills or Hidden Payloads? Diving Deep into the OpenClaw Malicious Skill Trap](https://www.bitdefender.com/en-us/blog/labs/helpful-skills-or-hidden-payloads-bitdefender-labs-dives-deep-into-the-openclaw-malicious-skill-trap)
- [Cisco Security Blog: Personal AI Agents Like OpenClaw Are a Security Nightmare](https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare)
- [VirusTotal Blog: From Automation to Infection — How Malicious Skills Turn AI Agents into Trojan Horses](https://blog.virustotal.com/2026/02/from-automation-to-infection-how.html)
- [Censys: OpenClaw in the Wild — Mapping the Public Exposure of a Viral AI Assistant](https://censys.com/blog/openclaw-in-the-wild-mapping-the-public-exposure-of-a-viral-ai-assistant)
- [HiddenLayer: The Lethal Trifecta and How to Defend Against It](https://www.hiddenlayer.com/research/the-lethal-trifecta-and-how-to-defend-against-it)
- [Reuters: China Warns of Security Risks Linked to OpenClaw Open-Source AI Agent](https://www.reuters.com/world/china/china-warns-security-risks-linked-openclaw-open-source-ai-agent-2026-02-05)
