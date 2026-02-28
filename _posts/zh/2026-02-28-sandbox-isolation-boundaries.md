---
layout: post
title: "Container 不是沙箱：你選的是邊界，不是信仰"
date: 2026-02-28 02:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張把 namespaces、seccomp、gVisor、microVM、WASM 串在一起的隔離層級示意圖](/img/posts/2026-02-28-sandbox-isolation-layers-01.webp)

大家最近很愛講一句話：「我們就把它丟到 sandbox 跑就好。」

我每次聽到都會想反問一個很煩的問題：

**你講的 sandbox，到底是哪一道邊界？**

因為 “sandbox” 這個詞在工程語境裡常常只是個 vibe，實際上它可能指的是五種完全不同的隔離手段：
- Linux namespaces（Docker 預設那套）
- seccomp syscall filter
- user-space kernel（像 gVisor）
- microVM（KVM / Firecracker 那類）
- WebAssembly 的 capability sandbox

它們不是「同一件事的強弱版本」，而是「邊界畫在不同地方」，失敗模式也完全不一樣。

這個念頭是我看完 Shayon 那篇隔離層級整理之後又被敲了一次：很多東西其實你踩過坑才會懂，但寫清楚對團隊討論很有用。

## 1) Namespaces：隔離的是視野，不是安全邊界

Namespaces 很強，它可以讓你：看不到別的 process、別的 mount、別的 network namespace。

但它沒改變最核心的事：你的 untrusted code 依然在做

```text
untrusted_code() -> syscalls() -> host_kernel
```

所以如果你的 threat model 包含「有人會嘗試逃逸」，Docker 預設的 container **不是 sandbox**。
它比較像一個方便的“隔間”。

## 2) Seccomp：把門變少，但房子還是同一棟

Seccomp 是第一個真的有「安全工程感」的東西。

概念很簡單：

```text
allowlist(syscalls) -> deny(the_rest)
```

你把 kernel attack surface 縮小，這確實有用。

但它的限制也很直白：你只是少開幾扇門，**不是把房子搬走**。

你還是得允許一堆“看起來很正常”的 syscall（檔案 I/O、網路、記憶體），而 kernel bug 往往就躲在這些正常路徑裡。

## 3) gVisor：它不是「更緊的 Docker」，它是在換邊界

gVisor 開始變得 qualitatively 不一樣。

untrusted code 先打到 user-space kernel（Sentry），host kernel 看到的是更小、更可控的一組介面。

我腦內的模型大概是：

```text
untrusted_code -> guest_syscalls -> userspace_kernel -> limited_host_syscalls
```

這代表：某些 host kernel 的 syscall 漏洞，不會那麼直接地變成 container escape。

代價就是性能（尤其 I/O-heavy workload）。

但如果你是在做「跑陌生程式碼」：agent 執行 snippet、CI 跑 untrusted PR、multi-tenant script runner，那個 trade 很常是划算的。

## 4) MicroVM：當你想讓硬體當最後的監工

MicroVM 的心態其實很簡單：

- container：共享 host kernel
- microVM：每個工作有自己的 guest kernel + 硬體虛擬化邊界

你想像一下，逃逸現在不是「找到 kernel bug」那麼直覺；它更偏向 hypervisor / VMM 的 attack surface。

你付出的成本是 cold start、資源 overhead。

如果你是在做平台（跑別人的 code），又想要“晚上睡得著”，microVM 很難反對。

## 5) WASM：不是通用沙箱（目前），但 capability 模型最乾淨

WASM 迷人的點在於：它不是「Linux 但我過濾一下」。

它比較像：

```text
module_can_do_only( imported_host_functions[] )
```

你沒有給它讀檔 API，它就真的讀不到。

限制比較現實：要跑“任意 Python”還是很麻煩（除非你接受 WASM 的工具鏈與限制）。

但就邊界概念來說，它是最清楚的。

## 我最在意的點：別再把 “sandbox” 當成規格

團隊講 “sandbox”，常常其實是在講其中一個（或全部混在一起）：
- 「不要把 host 弄掛」
- 「不要偷到 secrets」
- 「不要逃逸去打整台機器」
- 「不同 job 彼此不要干擾」
- 「不要讓 latency 爆炸」

這些是不同的要求，不可能靠一個 checkbox 全部解決。

所以我自己的實務規則是：**把邊界寫在設計文件裡**。

不要寫「我們用 sandbox」。

寫這種：

```text
execution_isolation = microvm(kvm) + egress_allowlist + readonly_rootfs
```

或這種：

```text
execution_isolation = gvisor(runsc) + per_job_namespaces + seccomp_profile
```

如果你寫不出這行，或寫出來覺得心虛，那你其實還沒做決定。

---

**References:**
- [Shayon 的 “Let’s discuss sandbox isolation”（逐層拆解隔離邊界）](https://www.shayon.dev/post/2026/52/lets-discuss-sandbox-isolation/)
- [gVisor 官方文件（以 user-space kernel 提升 container 隔離）](https://gvisor.dev/docs/)
- [runc CVE-2024-21626 說明（檔案描述符洩漏導致 container escape）](https://seclists.org/oss-sec/2024/q1/78)
