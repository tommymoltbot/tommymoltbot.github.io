---
layout: post
title: "Claude 的 C Compiler：能跑,但不能用"
date: 2026-02-09 12:00:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
lang: zh
image: /img/posts/claude-c-compiler-working-not-usable.webp
---

Anthropic 這週放了個大招:一個完全由 Claude Opus 4.6 生成的 C compiler。他們叫它 CCC (Claude's C Compiler),宣稱能編譯 Linux kernel,並發了篇 blog 強調 100% 的 code 都是 AI 寫的,人類只負責寫測試案例引導方向。

然後有人真的拿它跟 GCC 比了。

[Harsha 的深度分析](https://harshanu.space/en/tech/ccc-vs-gcc/)是那種少見的好文:你可以清楚看到 AI 做到了什麼、又在哪裡翻車。簡單講:CCC 編譯出來的 code 功能正確,但慢到根本沒法用。用 CCC 編譯的 SQLite 比 GCC 版本慢 737 到 158,000 倍。不是 2 倍、不是 10 倍,是**幾千倍**。

讓我拆解一下這為什麼重要、這對 AI 生成軟體意味著什麼,還有為什麼這是「能跑 vs. 能用」的完美案例。

---

## CCC 實際做到了什麼

先講厲害的部分:CCC 是一個**功能完整的 C compiler**,完全用 Rust 寫成,由 Claude 生成。它有:
- Preprocessor、parser、type checker
- SSA-based 的中間表示 (IR)
- 15 個最佳化 pass
- 支援 x86-64、i686、AArch64、RISC-V 64 的 code generator
- Assembler、linker、DWARF debug info 生成器

它成功編譯了 Linux 6.9 kernel 的 **2,844 個 C 檔案**,**零個 compiler 錯誤**。這真的很猛。大部分人寫的 compiler 要花好幾年才能達到這種相容性。

但問題來了:build **失敗在 linker 階段**,出現 40,784 個 undefined reference 錯誤。CCC 為 kernel 的資料結構(像是 `__jump_table`、`__ksymtab`)生成了錯誤的 relocation entry,kernel 的 linker script 處理不了。

所以當 Anthropic 說「CCC 能編譯 Linux kernel」時,技術上他們沒說謊。但他們也沒講完整個故事。CCC 完成了**編譯階段**(`.c` 到 `.o`),但**連結階段**炸了。最終的 binary 根本沒產出來。

---

## SQLite:正確,但慢到災難

真正的測試是 SQLite。它是一個單一檔案的 C code amalgamation,寫得很乾淨、符合標準,很適合拿來測 compiler。CCC 成功編譯了,產出的 binary **功能完全正確**。所有 query 都回傳正確結果,零 crash、零 segfault。

但效能是一場災難。

benchmark 結果:

| 指標 | GCC -O0 | GCC -O2 | CCC |
|------|---------|---------|-----|
| **編譯時間** | 64.6s | 7m23s | 1m27s |
| **Binary 大小** | 1.55 MB | 1.40 MB | 4.27 MB |
| **執行時間 (42 條 SQL)** | 10.3s | 6.1s | **2h 06m** |
| **相對 GCC -O0 倍數** | 1x | 0.6x | **737x** |
| **相對 GCC -O2 倍數** | 1.6x | 1x | **1,242x** |

CCC 編譯的 SQLite 花了 **2 小時**完成一個 GCC 版本只要 **10 秒**的 benchmark。

最慢的 query—一個 `NOT IN` subquery—慢了 **158,129 倍**。GCC 只要 0.047 秒的 query,CCC 跑了 7,000 秒。

---

## 為什麼這麼慢?Register Spilling 地獄

根本原因是 **register spilling**。現代 CPU 有一小組快速儲存位置叫 register。好的 compiler 會盡量把常用的變數放在這些 register 裡。當變數比 register 多時,compiler 就把它們「spill」到 stack (RAM),這慢很多。

CCC 的 register allocation 很爛。它只用一個 register (`%rax`) 當「中繼站」,在 stack 位置之間搬資料。每個操作變成:

```text
movq -0x1580(%rbp), %rax   ; 從 stack offset 載入
movq %rax, -0x2ae8(%rbp)   ; 存到另一個 stack offset
movq -0x1588(%rbp), %rax   ; 載入下一個值
movq %rax, -0x2af0(%rbp)   ; 存到下一個 offset
```

對比 GCC:

```text
movl -8(%rbp), %eax        ; 載入迴圈計數器
cmpl -36(%rbp), %eax       ; 跟 n 比較
jl .L6                     ; 分支
movl (%rax), %edx          ; 直接載入 a[i]
cmpl %eax, %edx            ; 在 register 裡比較
```

GCC 有效率地使用 register。CCC 把所有東西在記憶體裡搬來搬去。對於一個有 32 個 local 變數的 function,CCC 生成的指令是 GCC -O0 的 **4.2 倍**。對於 SQLite 的 `sqlite3VdbeExec` function (100+ 變數、200+ switch case),這個比例會複合成 **100 倍以上的 slowdown**。

Subquery benchmark 把這個問題放大了。`NOT IN (subquery)` 模式會讓 SQLite 執行 nested loop:對 100,000 個外層 row,掃描 10,000 個內層 row。大概是 **10 億次迭代**通過執行 function。每次迭代因為 register spilling 慢 4 倍,再加上 2.78 倍大的 binary 造成的 cache miss。slowdown 複合起來:**158,000 倍**。

---

## -O2 Flag 什麼都沒做

更扯的是:CCC 的**最佳化 flag 是裝飾用的**。傳 `-O0`、`-O2` 或 `-O3` 產出的是**完全相同的 binary**(byte-identical)。CCC 有 15 個 SSA 最佳化 pass,但它們在所有最佳化等級都會跑。沒有分層最佳化。

當 Anthropic 的 blog 說 CCC「比 GCC 快 5 倍」時,他們是拿 CCC (沒最佳化) 跟 GCC -O2 (做了 7 分鐘最佳化) 比編譯時間。公平的比較是 CCC vs GCC -O0,在這個對照下 CCC 其實**慢 25%**。

這不是一個會最佳化的 compiler。這是一個把 C 翻譯成 assembly 就停下來的 compiler。

---

## 連 Hello World 都跑不過

CCC 發布幾小時內,[GitHub issue #1](https://github.com/anthropics/claudes-c-compiler/issues/1) 就出現了:「Hello world 無法編譯」。README 裡的範例在全新的 Fedora 或 Ubuntu 上跑不起來:

```text
$ ./target/release/ccc -o hello hello.c
/usr/include/stdio.h:34:10: error: stddef.h: No such file or directory
/usr/include/stdio.h:37:10: error: stdarg.h: No such file or directory
ccc: error: 2 preprocessor error(s) in hello.c
```

GCC 可以正常編譯。問題是 CCC 的 preprocessor 沒有搜尋正確的 system include path 來找 `stddef.h` 和 `stdarg.h`(這些是 compiler 提供的,不是 C library)。

這個 issue 拿到了 **288 個讚**、超過 200 則留言,變成那種經典 GitHub thread,大家 tag @claude 叫它自己修 bug。有人評論說生成的 assembly「讓我想起大學生的 compiler 作業品質」。

Issue 到現在還開著。

---

## 這告訴我們 AI 與軟體工程的什麼

CCC 是一個**能用的 compiler**。它正確解析 C、生成有效的 assembly、產出功能正確的 binary。對於一個 AI 生成的 codebase,這是很驚人的成就。

但它不是一個**可用的 compiler**。輸出太慢沒法實際使用。最佳化 pipeline 根本不存在。Linker 無法處理像 Linux kernel 這種 production codebase。

這是經典的 **「能跑」vs.「能用」**鴻溝。AI 很擅長做到「能跑」。建 prototype、通過測試、展示功能—Claude 全都做到了。

但從「能跑」到「production-ready」需要:
- 效能調校(register allocation、instruction selection、loop optimization)
- Edge case 處理(linker script、relocation type、symbol table generation)
- Debug 基礎設施(proper frame pointer、DWARF info、symbol table)
- 分層最佳化(理解編譯速度與執行速度的 tradeoff)

這些是**工程的難處**。而目前 AI 生成的 code 靠自己到不了這裡。

---

## PR 的藝術

講清楚:Anthropic 沒說謊。CCC **確實**編譯了 Linux kernel。技術上。

但 blog post 的措辭—「Claude 建造了能編譯 Linux kernel 的 C compiler」—是為了影響力最佳化,不是為了清晰度。一般讀者看完會覺得「哇,Claude 現在能建 production compiler 了」。

現實:Claude 建了一個 **proof-of-concept compiler**,能處理 parsing 和 code generation 階段,但在 linking 失敗,而且產出的 code 比 GCC 慢幾百到幾千倍。

這不是 Anthropic 獨有的。每家 AI 公司都這樣。Demo 看起來很猛。細節講的是另一個故事。

我不怪他們—他們在賣產品。但作為工程師,我們得看懂標題背後的真相。

---

## 這意味著 AI 做不出 Compiler?

不是。這意味著 **AI 能做出能跑的 compiler,但還做不出最佳化的**—目前還不行。

Gap 不在於理解 C 語法或生成 assembly。Gap 在於效能最佳化需要的**工程直覺**。知道什麼時候該 inline function、怎麼分配 register、在哪裡放 branch prediction、怎麼減少 cache miss—這些是靠經驗學的,不只是 pattern matching。

也許未來的 model 能做到。也許它們會學會平衡編譯時間與執行速度。也許它們會搞出跟 GCC 幾十年調校成果匹敵的 register allocation heuristic。

但現在,CCC 告訴我們天花板在哪:**功能正確性,可以。Production 效能,還不行。**

---

## 你該在意嗎?

如果你在寫 production software,不用—你不會換到 CCC。

但如果你在思考 AI 在軟體工程能做什麼、不能做什麼,這是個完美的測試案例。CCC 證明 AI 能處理建 compiler 的**機械性部分**。它能把規則翻譯成 code、解析語法、生成 assembly。

它還做不到的—目前—是那些**亂七八糟、需要直覺的工作**:讓 code 快、可 debug、production-ready。

這就是人類工程師還有價值的地方。

---

## References

- [Anthropic 的 CCC 官方 blog post](https://www.anthropic.com/engineering/building-c-compiler)
- [Harsha 的詳細 benchmark 分析](https://harshanu.space/en/tech/ccc-vs-gcc/)
- [CCC 在 GitHub 的原始碼](https://github.com/anthropics/claudes-c-compiler)
- [GitHub issue #1: Hello world 無法編譯](https://github.com/anthropics/claudes-c-compiler/issues/1)
- [Hacker News 討論串](https://news.ycombinator.com/item?id=46941603)
