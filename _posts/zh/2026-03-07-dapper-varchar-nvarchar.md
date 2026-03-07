---
layout: post
title: "Dapper + SQL Server：一個 varchar ↔ nvarchar 的小差異，讓 index seek 變成 scan"
date: 2026-03-07 00:07:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張簡單的示意圖：varchar 欄位 vs nvarchar 參數的不匹配，會觸發 CONVERT_IMPLICIT，讓索引 seek 變成 scan](/img/posts/2026-03-07-dapper-varchar-nvarchar.webp)

我其實很喜歡那種「很誠實」的 bug。
崩潰、噴 stack trace、你修掉就結束。

但這個問題完全不誠實。

它會：
- 正常回傳正確結果
- code review 看起來也沒毛病
- log 也不會報錯

然後在 production 讓 SQL Server CPU 長期偏高，你還會懷疑是不是索引沒建好、是不是 query 太爛、是不是資料量突然暴增。

結果根因可能只是：**varchar vs nvarchar**。

場景是這樣：
- 你的欄位是 `varchar(...)`（非 Unicode）
- 你的 C# 參數是 `string`
- Dapper/ADO.NET 預設把 `string` 送成 `nvarchar(4000)`
- SQL Server 為了比對，對欄位做 `CONVERT_IMPLICIT(...)`
- 最後你的 index seek 直接變成 index scan

這種東西最可怕的地方是：你看 C# code 完全看不出它在炸。

## 我在乎的五個角度

### 1) 這不是 Dapper 的錯，是「安全預設值」的副作用
`System.String` 是 Unicode 很合理。
ADO.NET 預設用 `nvarchar(4000)` 也很合理。

但如果你的 schema 還有大量 `varchar`（老系統幾乎都有），這段超常見的寫法就會變成地雷：

```text
const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";

var result = await connection.QueryFirstOrDefaultAsync<Product>(
    sql,
    new { productCode }
);
```

乾淨、簡單、也很「.NET」。
但它可能正在把你索引打廢。

### 2) Execution plan 會說實話（但你要知道看哪裡）
關鍵字是：`CONVERT_IMPLICIT`。
而且重點不是「有 conversion」而已，是 conversion 出現在欄位那邊。

你可能會在 plan 看到這種東西：

```text
CONVERT_IMPLICIT(nvarchar(255), [Sales].[ProductCode], 0)
```

這句話翻譯成白話就是：
> 「你丟進來的是 nvarchar，我這邊是 varchar。因為 type precedence，我只好把欄位轉成 nvarchar 來比對。」

欄位一旦被包了一層 function，索引就很難做 seek。
所以就掃。

### 3) 真正花錢的不是 conversion，是那個乘數
一次 scan 不一定會死人。
但 production 不是「跑一次」。

真正的災難長這樣：
- 一個看起來很小的查詢
- 每天跑幾十萬次
- 表一年長 10 倍

你會得到一個「架構看起來沒問題，但機器怎麼一直很熱」的系統。

### 4) 修法無聊到不行（好事）
你只要讓參數用 `varchar` 送出去。
在 Dapper 裡通常是 `DynamicParameters` + `DbType.AnsiString`：

```text
const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";

var p = new DynamicParameters();
p.Add("productCode", productCode, DbType.AnsiString, size: 100);

var result = await connection.QueryFirstOrDefaultAsync<Product>(sql, p);
```

`size` 也請你填。
不是因為 SQL Server 不會猜，是因為「型別 + 長度」越精準，越不容易出現 plan cache 跟隱性轉換的奇怪行為。

如果你想保留匿名物件寫法，Dapper 也有 `DbString`：

```text
var result = await connection.QueryFirstOrDefaultAsync<Product>(
    sql,
    new {
        productCode = new DbString {
            Value = productCode,
            IsAnsi = true,
            Length = 100
        }
    }
);
```

重點就是：不要讓 driver 幫你「猜」。

### 5) 長期解法：把參數型別當成 contract 的一部分
很多團隊會把 SQL type 當成 database 的細節。

但你如果真的在做 production perf，這不是細節。
這是你跟資料庫之間的 API contract。

我覺得很好用的一句話：
- 欄位是 `varchar(...)` → 參數用 `DbType.AnsiString`
- 欄位是 `nvarchar(...)` → 預設 `DbType.String` 就好

然後拜託：加個註解。
因為半年後一定有人會把它「簡化」回 `new { productCode }`，你就又回到地獄。

## 我會怎麼快速抓這個問題
如果你懷疑你踩到這個坑，我會這樣做：
1. 拉出那個 hot query 的「實際」 execution plan
2. 搜尋 `CONVERT_IMPLICIT`
3. 看 conversion 有沒有包住你 WHERE predicate 的欄位

如果要系統性掃一整個應用，Query Store 是個好起點。原文也給了具體的查法。

## 這件事最煩的地方
它會懲罰你做對的事。

- SQL 有 parameterize（對）
- 欄位有索引（對）
- ORM 又輕又明確（也對）

結果還是會因為 Unicode vs 非 Unicode 在 C# call site 看不出來，就被默默打爛。

所以如果你的 DB 還有 legacy `varchar` 欄位（幾乎一定有），真的去 audit 一下 Dapper 的 string 參數。
這種問題最擅長躲在「看起來最乾淨」的程式碼裡。

---

**References:**
- [原文：How C# Strings Silently Kill Your SQL Server Indexes in Dapper](https://consultwithgriff.com/dapper-nvarchar-implicit-conversion-performance-trap)
- [Microsoft 文件：DbType 列舉（AnsiString vs String）](https://learn.microsoft.com/en-us/dotnet/api/system.data.dbtype)
- [Microsoft 文件：SQL Server 的資料型別轉換規則](https://learn.microsoft.com/en-us/sql/t-sql/data-types/data-type-conversion-database-engine)
- [Dapper 文件：DbString 的用法](https://github.com/DapperLib/Dapper#string-parameters)
