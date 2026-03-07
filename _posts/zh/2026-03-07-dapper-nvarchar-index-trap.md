---
layout: post
title: "Dapper + SQL Server：預設 nvarchar(4000) 這件小事，怎麼把 varchar 索引打爛"
date: 2026-03-07 16:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Dapper nvarchar implicit conversion performance trap](/img/posts/2026-03-07-dapper-varchar-01.webp)

我其實滿喜歡 Dapper 的：薄、直接、你還感覺得到資料庫。

但它也有一種很煩的坑，是那種「功能完全正常、結果效能默默死掉」的坑：

- 資料庫欄位是 `varchar(...)`
- 你在 C# 這邊拿的是 `string`
- 參數用匿名物件丟進去
- 查得出來、也沒報錯
- 但 SQL Server 的 index seek 不見了，CPU 開始燒

核心原因一句話就講完：C# 的 `string` 很常被 ADO.NET 預設送成 **`nvarchar(4000)`**。然後 SQL Server 為了比較 `varchar` 欄位跟 `nvarchar` 參數，只好在執行計畫裡做 **implicit conversion**，而且常常是轉在「欄位那一側」——這就是索引被打到不能用的起點。

## 這個 bug 最討厭的地方

它一點都不像 bug。

WHERE 條件很乾淨，欄位也有索引，查詢結果也完全正確。你在 code review 看到大概只會說「OK」。

然後你會在 production 看到最糟的那種症狀組合：
- 沒 exception
- 沒錯誤 log
- 只有資料庫很熱、查詢突然變慢

## SQL Server 其實有跟你講，只是你沒看懂

如果你打開 actual execution plan，看到類似這種東西：

```text
CONVERT_IMPLICIT(nvarchar(255), [Sales].[ProductCode], 0)
```

我會把它翻譯成一句比較直白的話：

> 「你給我的參數是 Unicode（nvarchar），但欄位是 varchar。我只好把每一列都轉一次再比較。順便跟你說，index seek 掰了。」

重點是「**把每一列都轉一次**」。當 conversion 在欄位表達式上，最佳化器就很難用你期待的方式去做 seek，掃描就出現了。

## 修法（真的很小）

你要做的只是：明確告訴 Dapper/ADO.NET 這是 ANSI 字串（varchar）。

```text
var p = new DynamicParameters();
// 欄位是 varchar(100) → 強制送 varchar 參數，避免 CONVERT_IMPLICIT。
p.Add("productCode", productCode, DbType.AnsiString, size: 100);

const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";
var row = await connection.QueryFirstOrDefaultAsync<Product>(sql, p);
```

或用 `DbString`（語法比較短）：

```text
var row = await connection.QueryFirstOrDefaultAsync<Product>(
  sql,
  new {
    productCode = new DbString { Value = productCode, IsAnsi = true, Length = 100 }
  }
);
```

兩個我覺得「比想像中更重要」的小細節：

1) **長度要對**（`varchar(100)` 就 `size: 100`）。這會影響 plan reuse，也會少很多奇怪的「差一點點就不一樣」的問題。

2) **寫註解**。你不寫，下一次有人 refactor 想把它「簡化回匿名物件」，這個坑就會回來。

## 我會怎麼在真實專案裡抓這種雷

如果你是 SQL Server + Dapper，然後資料表裡有不少 `varchar` 欄位，我會這樣做：

1) 先從 code 搜：哪些地方用匿名物件傳 `string`

```text
QueryAsync(..., new { someCode })
QueryFirstOrDefaultAsync(..., new { productCode })
```

2) 對照 DB schema：目標欄位如果是 `varchar`，那就列入嫌疑名單。

3) 到 Query Store / execution plan 裡找熱點查詢，有沒有 `CONVERT_IMPLICIT` 的警告。

這不是什麼「提前優化」。這是避免你以為是 *O(log n)* 的查詢，在某天變成一個很安靜的 *O(n)* 掃描。

## 更大一點的結論：邊界型別就是 API

很多效能問題不是「SQL 寫得很爛」。而是 **邊界契約寫得很隨便**。

應用程式覺得自己送的是「一個 string」。資料庫收到的是「nvarchar(4000)」。最佳化器就只能照規則處理。

你要做 production 工程，就不能把型別當成可有可無的裝飾。它是 API 的一部分。

---

**References:**
- [Dapper 預設 nvarchar 導致 implicit conversion 的原始案例文章](https://consultwithgriff.com/dapper-nvarchar-implicit-conversion-performance-trap)
- [Microsoft 文件：DbType 列舉（AnsiString vs String）](https://learn.microsoft.com/en-us/dotnet/api/system.data.dbtype)
- [Microsoft 文件：SQL Server 資料型別轉換規則](https://learn.microsoft.com/en-us/sql/t-sql/data-types/data-type-conversion-database-engine)
