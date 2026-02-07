---
layout: post
title: "能 pin 的都 pin 起來，不然你根本沒辦法 debug"
date: 2026-02-07 05:00:00 +0000
categories: AI
tags: AI
author: Tommy
lang: zh
image: /img/posts/pin-everything-debug-nothing.webp
---

![把環境 pin 起來，其實是在留證據](/img/posts/pin-everything-debug-nothing.webp)

很多團隊嘴上說要 reliability。

但實際上交付的是：每次你按下「run」，環境就悄悄換了一點。

然後你 debug 起來像在追煙。

如果你只想記住這篇的一句話，那就記這句：

> **你 pin 不住關鍵變數，你就 debug 不動真問題。**

## 真正的敵人不是 bug，是 drift

Bug 很正常。

可怕的是 drift：它把正常 bug 變成一週的鬼故事。

同一個命令，週一跑跟週五跑，結果不一樣，常見原因其實很無聊：

- 依賴套件悄悄升了 minor
- OS package 更新
- base image tag 指到新東西
- model endpoint 行為改了
- tool schema 被改了但沒人講
- 資料源刷新、feature store 變動

每一個單獨看都不算「大錯」。

但如果你沒有把當下的版本記下來，你等於把案發現場清乾淨。

## 一個很無聊、但讓 debug 變可行的 checklist

我會把下面這些當成 production-ish 的最低配。

### 1) 依賴（lockfile）

不用 lockfile 的話，你其實是在做「盡力可重現」。

換句話說：不可重現。

至少要有：
- `package-lock.json` / `pnpm-lock.yaml`
- `poetry.lock`
- `Gemfile.lock`

重點不是崇拜 lockfile。

重點是讓「我這邊可以」變成可解決的工程問題。

### 2) 執行環境（container digest）

Tag 很方便。

Digest 才穩。

你用 `my-image:latest` 部署，就是選擇驚喜。

你用 `my-image@sha256:...` 部署，就是選擇證據。

Docker 的 pull 語法本來就支援：

```text
docker image pull NAME[:TAG|@DIGEST]
```

### 3) 工具介面（contract + 版本）

這是我覺得 AI/agent 團隊最容易踩雷的地方。

大家會記 prompt，但不記 tool contract。

大家會改 schema，但不 bump version。

大家會「修正回傳格式」但假裝它向下相容。

如果 tool 是 execution 的一部分，它就該長這樣：

```text
tool(request, contract_version) -> response
```

contract 變了，你要嘛：
- 做 migration，或
- 保留舊版本

不然你講 replay 只是自我安慰。

### 4) 資料（snapshot / version）

只要你的結果依賴可變的資料源，你就要有一個能指回去的把手。

可能是 dataset version。

可能是資料表 snapshot。

可能是「那份 CSV 的 hash」。

反正要能寫下來、能找回來。

### 5) 模型（pin model，不要只寫 vendor）

「我們用 GPT」不是設定。

那是 vibe。

我會 pin：
- model id / snapshot
- temperature / top_p
- system prompt 版本
- tool schema 版本

如果供應商不給你穩定的 snapshot，那至少記下：
- request id
- 完整參數
- tool call transcript

你才能解釋為什麼今天跟上週答案不一樣。

## 我的直覺：把 production 當成鑑識

東西壞掉時，你不是靠「感覺」去修。

你是在重建時間線。

鑑識需要 artefact。

artefact 需要你先把環境 pin 下來。

所以對，pinning 一點都不浪漫。

但它決定你最後得到的是：
- 「我們修好了」
- 還是「我們剛好運氣好，它不再發作」

## References

- [Reproducible Builds（為什麼可重現能帶來信任與 debug 優勢）](https://reproducible-builds.org/)
- [SLSA v1.0 規格（供應鏈安全等級與 provenance 概念）](https://slsa.dev/spec/v1.0/)
- [Docker 文件：`docker image pull` 語法（tag 與 digest）](https://docs.docker.com/reference/cli/docker/image/pull/)
