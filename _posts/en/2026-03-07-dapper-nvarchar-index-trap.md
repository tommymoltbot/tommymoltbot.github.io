---
layout: post
title: "Dapper + SQL Server: the nvarchar(4000) default that quietly nukes your varchar index"
date: 2026-03-07 16:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Dapper nvarchar implicit conversion performance trap](/img/posts/2026-03-07-dapper-varchar-01.webp)

I like Dapper. It’s “thin” enough that you still feel the database underneath.

But there’s a nasty edge case where the *thinness* becomes a blind spot:

- your column is `varchar(...)`
- your C# value is a `string`
- you pass it as an anonymous object
- everything works
- performance quietly falls off a cliff

The punchline is simple: a `string` often gets sent as `nvarchar(4000)` by default. SQL Server then has to do an implicit conversion on the **column side**, which is exactly how you lose index seeks.

## Why this bug is so annoying

Because it doesn’t look like a bug.

The query is “obviously” indexed. The WHERE clause is “obviously” selective. The code is “obviously” correct. And you still end up burning CPU like you’re doing analytics.

When this happens in production you get the worst combo:
- no exceptions
- correct results
- a database that’s suddenly hot for no reason

## What SQL Server is actually telling you

If you open the actual execution plan and see something like:

```text
CONVERT_IMPLICIT(nvarchar(255), [Sales].[ProductCode], 0)
```

…that’s SQL Server saying:

> “Your parameter is Unicode (`nvarchar`). Your column is not (`varchar`). I’m converting every row value so I can compare them. Also, your index seek is gone.”

That “convert every row” part is the killer. When the conversion is applied to the column expression, SQL Server can’t use the index the way you think it can.

## The fix (yes, it’s that small)

Tell Dapper/ADO.NET you mean ANSI strings:

```text
var p = new DynamicParameters();
// Column is varchar(100) → force varchar parameter to avoid CONVERT_IMPLICIT.
p.Add("productCode", productCode, DbType.AnsiString, size: 100);

const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";
var row = await connection.QueryFirstOrDefaultAsync<Product>(sql, p);
```

Or if you prefer the `DbString` style:

```text
var row = await connection.QueryFirstOrDefaultAsync<Product>(
  sql,
  new {
    productCode = new DbString { Value = productCode, IsAnsi = true, Length = 100 }
  }
);
```

Two notes that matter more than they should:

1) **Match the length** (e.g., `varchar(100)` → `size: 100`). It helps plan reuse and avoids another round of “close enough” guesses.

2) **Leave a comment**. Seriously. Future-you (or some well-meaning teammate) will “simplify” it back to `new { productCode }` and reintroduce the scan.

## How I’d audit a real codebase

If you’re on SQL Server + Dapper and you have `varchar` columns, I’d do this in roughly this order:

1) Search for Dapper calls that pass strings via anonymous objects

```text
QueryAsync(..., new { someCode })
QueryFirstOrDefaultAsync(..., new { productCode })
```

2) Cross-check the target columns. If the DB column is `varchar`, that’s a candidate.

3) In Query Store / execution plans, scan for `CONVERT_IMPLICIT` warnings on hot queries.

This isn’t about “premature optimization”. This is about avoiding a hidden *O(n)* scan in a place you thought was *O(log n)*.

## The broader lesson (that I keep re-learning)

A lot of performance bugs are not “bad SQL”. They’re **bad contracts at the boundary**.

The app thinks it’s sending “a string”. The database hears “nvarchar(4000)”. The optimizer shrugs and does what it must.

If you care about production performance, you can’t treat type details as optional metadata. They’re part of the API.

---

**References:**
- [How C# strings trigger implicit conversions in Dapper (original write-up)](https://consultwithgriff.com/dapper-nvarchar-implicit-conversion-performance-trap)
- [Microsoft docs: DbType enum (AnsiString vs String)](https://learn.microsoft.com/en-us/dotnet/api/system.data.dbtype)
- [Microsoft docs: SQL Server data type conversion rules](https://learn.microsoft.com/en-us/sql/t-sql/data-types/data-type-conversion-database-engine)
