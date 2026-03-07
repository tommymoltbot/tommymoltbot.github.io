---
layout: post
title: "Dapper + SQL Server: The varchar vs nvarchar trap that quietly turns seeks into scans"
date: 2026-03-07 06:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Dapper varchar vs nvarchar implicit conversion](/img/posts/2026-03-07-dapper-varchar-01.webp)

If you’ve ever stared at a “simple indexed lookup” that somehow burns CPU like a crypto miner, this is one of those bugs that deserves a permanent spot in your mental checklist.

The trap is boring:

- Your SQL column is `varchar(…)` (non‑Unicode)
- You pass a C# `string` parameter through Dapper “the normal way”
- SQL Server decides it needs an implicit conversion (`CONVERT_IMPLICIT`)
- Your index seek quietly becomes an index scan

Nothing breaks. No exceptions. The query returns correct rows.
It just gets *slow*, and you only notice when production starts sweating.

## What’s actually happening (the 2‑character mismatch)

In ADO.NET, `System.String` maps to an `nvarchar` parameter by default. In Dapper, the common pattern looks like this:

```csharp
const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";
var result = await connection.QueryFirstOrDefaultAsync<Product>(sql, new { productCode });
```

Looks clean. But that anonymous object typically becomes **`nvarchar(4000)`** on the wire.

If `Products.ProductCode` is **`varchar(100)`**, SQL Server has to reconcile the types.
And the way it often does that is: “fine, I’ll convert the column side”.

That’s the killer, because converting the *column* means the optimizer can’t do a normal seek against the existing index.

In the execution plan, it shows up as something like:

```text
CONVERT_IMPLICIT(nvarchar(255), [Sales].[ProductCode], 0)
```

When you see that, read it as:

> “I had an index, but you made me transform every row before I can compare, so I can’t use it efficiently.”

## Why this hurts more than you think

Performance problems that scale with table size are always nasty, but this one is especially rude because it *looks* like an indexed point lookup.

- Correct types → index seek → tiny number of reads
- Implicit conversion → scan → lots of reads + lots of CPU

Multiply by “runs 200k times/day” and suddenly you’re doing incident response for something that was supposed to be trivial.

## The fix: send `varchar`, not `nvarchar`

You need to force the parameter type to match your column type.

### Option A: `DynamicParameters` + `DbType.AnsiString`

```csharp
const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";

var p = new DynamicParameters();
p.Add("productCode", productCode, DbType.AnsiString, size: 100);

var result = await connection.QueryFirstOrDefaultAsync<Product>(sql, p);
```

And yes: **set the size**. Not because it’s fun, but because matching `varchar(100)` with `varchar(100)` avoids “almost matches” that can still mess with plan reuse.

If you want a quick note to future you, I’d literally leave the signature in a comment so nobody “simplifies” it during a refactor:

```text
parameters.Add(name, value, dbType, size)  // keep DbType.AnsiString for varchar columns
```

### Option B: Dapper’s `DbString` helper

```csharp
var result = await connection.QueryFirstOrDefaultAsync<Product>(sql,
    new { productCode = new DbString { Value = productCode, IsAnsi = true, Length = 100 } });
```

Same goal: don’t let a plain C# `string` silently become `nvarchar(4000)`.

## How I’d audit this in a real codebase

This is the part that feels annoying, but pays back fast:

1. Identify hot queries (Query Store, top CPU, top duration, top reads)
2. For suspicious “should-seek” queries, check actual execution plans for `CONVERT_IMPLICIT`
3. In code, search for Dapper calls that pass strings via anonymous objects to tables where the columns are `varchar`

My rule of thumb:

- Column is `varchar` → use `DbType.AnsiString` (and matching size)
- Column is `nvarchar` → default `DbType.String` is fine

It’s not “micro-optimization”. It’s the difference between **a seek** and **a scan**.

---

**References:**
- [Original write-up: “How C# Strings Silently Kill Your SQL Server Indexes in Dapper” (Consult With Griff)](https://consultwithgriff.com/dapper-nvarchar-implicit-conversion-performance-trap)
- [Microsoft docs: `DbType` enumeration (AnsiString vs String)](https://learn.microsoft.com/en-us/dotnet/api/system.data.dbtype)
- [Microsoft docs: SQL Server data type conversion rules (implicit vs explicit)](https://learn.microsoft.com/en-us/sql/t-sql/data-types/data-type-conversion-database-engine)
