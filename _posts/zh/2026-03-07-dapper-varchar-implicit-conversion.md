---
layout: post
title: "Dapper + SQL Server：varchar / nvarchar 兩個字母的差別，讓 index seek 變 index scan"
date: 2026-03-07 06:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Dapper varchar vs nvarchar implicit conversion](/img/posts/2026-03-07-dapper-varchar-01.webp)

這種效能坑我很愛（也很恨），因為它完全符合 production 的恐怖故事模板：

- query 看起來超正常
- index 也建了
- 結果 CPU 爆、延遲飄、你開始懷疑人生

最後兇手是：**varchar vs nvarchar**。

不是什麼新 feature，也不是你寫錯 SQL。
就是一個「兩個字母」的型別不匹配，讓 SQL Server 在背後默默做 `CONVERT_IMPLICIT`，然後你那個本來該跑 seek 的查詢，變成掃整個 index。

## 發生了什麼事（而且 C# 端看不出來）

Dapper 最常見的寫法大概是這樣：

```csharp
const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";
var result = await connection.QueryFirstOrDefaultAsync<Product>(sql, new { productCode });
```

看起來沒毛病。

但 `System.String` 在 ADO.NET 的預設對應通常是 **`nvarchar`**，而且在匿名物件這種用法下，很容易就變成 **`nvarchar(4000)`**。

如果你的資料庫欄位是 **`varchar(100)`**（non‑Unicode），SQL Server 為了比較兩邊，就得做型別轉換。
更糟的是，它很多時候會選擇「轉欄位那邊」，在 execution plan 你會看到類似這種東西：

```text
CONVERT_IMPLICIT(nvarchar(255), [Sales].[ProductCode], 0)
```

看到 `CONVERT_IMPLICIT` 就要提高警覺：

> 你讓 SQL Server 需要把每一列都轉型後才能比對 → optimizer 很難用原本的 index seek → 你就開始掃。

## 為什麼這件事很致命

因為它是那種「看起來像點查詢，實際上在做掃描」的坑。

- 型別對 → index seek → 少量 logical reads
- 型別不對 + implicit conversion → index scan → 大量 reads + 大量 CPU

再乘上「每天跑幾十萬次」，就變成那種你一開始很難定位、但一定位就會很想翻桌的 production issue。

## 修法：強制送 varchar 參數

你要做的不是改 SQL，也不是加 index。
你要做的是：**讓參數型別跟欄位型別一致**。

### 方案 A：`DynamicParameters` + `DbType.AnsiString`

```csharp
const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";

var p = new DynamicParameters();
p.Add("productCode", productCode, DbType.AnsiString, size: 100);

var result = await connection.QueryFirstOrDefaultAsync<Product>(sql, p);
```

重點有兩個：

1) `DbType.AnsiString`（對應 `varchar`）
2) `size` 要跟欄位長度一致（例如 `varchar(100)` 就填 100）

我自己甚至會留一個有點「故意囉嗦」的註解，防止未來有人手癢把它改回匿名物件：

```text
parameters.Add(name, value, dbType, size)  // varchar 欄位要用 DbType.AnsiString
```

### 方案 B：用 Dapper 的 `DbString`

```csharp
var result = await connection.QueryFirstOrDefaultAsync<Product>(sql,
    new { productCode = new DbString { Value = productCode, IsAnsi = true, Length = 100 } });
```

目標一樣：不要讓你一個普通的 C# `string` 默默變成 `nvarchar(4000)`。

## 我會怎麼在專案裡抓這種坑

如果你覺得你家 DB 最近很喘，這幾個動作很實用：

1. 從 Query Store / APM 找 top CPU、top reads 的查詢
2. 對「理論上應該 seek」的查詢，看 actual execution plan
3. 搜 `CONVERT_IMPLICIT`（這個關鍵字真的很好用）
4. 回到 code，抓出所有 Dapper 透過匿名物件傳 `string` 的地方，對照資料表欄位是不是 `varchar`

我的土法則：

- 欄位是 `varchar` → 用 `DbType.AnsiString`（+ 正確 size）
- 欄位是 `nvarchar` → 預設 `DbType.String` 通常沒事

這不是「抖機靈的微調」。
這是 **seek vs scan** 的差別。

---

**References:**
- [原文：How C# Strings Silently Kill Your SQL Server Indexes in Dapper（Consult With Griff）](https://consultwithgriff.com/dapper-nvarchar-implicit-conversion-performance-trap)
- [Microsoft 文件：`DbType` 列舉（AnsiString vs String）](https://learn.microsoft.com/en-us/dotnet/api/system.data.dbtype)
- [Microsoft 文件：SQL Server 資料型別轉換規則（implicit / explicit）](https://learn.microsoft.com/en-us/sql/t-sql/data-types/data-type-conversion-database-engine)
