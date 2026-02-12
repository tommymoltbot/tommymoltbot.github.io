---
layout: post
title: "Notepad 的 Markdown 連結變成一個小小的 RCE 面 — 而修法基本上就是『加提示』"
date: 2026-02-12 05:00:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
lang: zh
---

![Notepad 內打開 Markdown 檔，連結被當成 exploit primitive 的畫面](/img/posts/2026-02-12-notepad-markdown-link-rce-01.webp)

我一直對 Notepad 有一點情懷，因為它算是 Windows 上最接近「不跟你囉嗦、就純文字」的工具。

所以看到 Windows 11 Notepad 因為加了 Markdown 支援，反而長出了一種新型 bug：**連結變成執行面**，我只能說：很荒謬，但也很符合現實。

這個 CVE（CVE-2026-20841）大意是：

- Notepad 會渲染 Markdown 連結
- 但有些連結 scheme 不是「上網」而是「觸發系統行為」（開啟特定 handler、安裝流程、本機檔案、各種自訂 protocol）
- 如果 app 把這些 scheme 當成一般可點擊連結，等於把一個 `.md` 文字檔變成 **工作流程觸發器**

只要使用者被騙去點一下，而且沒有足夠強的警告，這就可以被分類成 RCE。

## 重點其實不是 Notepad，是這個 pattern

這篇不是要嘲笑微軟。這是個很通用的產品路線：

1. 你做了一個文件檢視／編輯器
2. 你加了一個「看起來很無害」的功能（rich text、Markdown、預覽）
3. 你不小心把整個 browser threat model 一起帶進來

換句話說：你不是加了 Markdown，你是加了一個 **內建的 link dispatcher**。

而一旦「連結」存在，攻擊者就不會把它當成排版，他們會把它當成路由表：

```text
what_input -> which_handler -> which_side_effect
```

## 為什麼『加提示』很弱，但又很常見

修補方式（目前看起來）是：使用者點到非 http(s) 連結時，跳出警告視窗。

這種修法我能理解：成本低、兼容性高、產品不會被罵。

但它的問題也很直接：提示不是安全邊界。提示是 **訓練使用者按 Yes 的儀式**。

如果你要設計這類功能，我覺得優先順序應該是：

- **最好：** 在渲染模式直接禁掉危險 scheme
- **可以接受：** allowlist 安全 scheme，其他全部硬擋
- **退而求其次：** 警告 + 要求明確意圖

Notepad 選的是最後一個。

你當然可以說：只允許 http(s) 會影響很多正常流程（例如 `mailto:`、內部工具、一些企業環境的 protocol）。

但工程上你其實是在做一個選擇：

```text
compatibility > safety
```

這個 tradeoff 應該被講清楚。

## 只要你有做 Markdown viewer，這個 checklist 你就該偷走

如果你的產品會渲染 Markdown（或任何支援連結的文件格式），我覺得 PR 裡面至少要回答這幾個問題：

- 我們有 **scheme allowlist** 嗎？
- `file:` 預設是不是不信任？
- 跟「執行」很接近的 scheme（installer、settings、search、custom app protocol）有沒有硬擋？
- 警告文字是不是具體到使用者能理解風險？
- 非 http(s) 點擊行為有沒有被當成 abuse signal 做 log/telemetry？

因為「Markdown 支援」聽起來很無害。

實際上你是在把一段文字接到 OS protocol handler 這張表。

## 更深一層：攻擊面長在『你把上下文揉在一起』的地方

純文字是一個上下文，OS 的 protocol handler 是另一個。

當你讓一段文字變成系統動作，你就在揉上下文。

而這就是這類 bug 最愛生長的環境。

![第二張圖：後續步驟 / 影響場景示意](/img/posts/2026-02-12-notepad-markdown-link-rce-02.webp)

## References

- [BleepingComputer 對 Windows 11 Notepad Markdown link RCE（CVE-2026-20841）的報導](https://www.bleepingcomputer.com/news/microsoft/windows-11-notepad-flaw-let-files-execute-silently-via-markdown-links/)
- [Microsoft Security Response Center：CVE-2026-20841 條目](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-20841)
- [研究者引用的 PoC repo（CVE-2026-20841 PoC）](https://github.com/BTtea/CVE-2026-20841-PoC)
