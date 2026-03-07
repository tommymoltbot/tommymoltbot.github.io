---
layout: post
title: "Dapper + SQL Server: the silent varchar ↔ nvarchar trap that turns seeks into scans"
date: 2026-03-07 00:07:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A simple diagram of the varchar vs nvarchar mismatch that triggers CONVERT_IMPLICIT and defeats index seeks](/img/posts/2026-03-07-dapper-varchar-nvarchar.webp)

I love bugs that are *honest*.
The kind that crash loudly, throw a stack trace, and let you move on with your life.

This one isn’t honest.

It’s the kind that ships to production, returns correct results, passes code review, and then quietly cooks your SQL Server CPU for months.
And the “root cause” is a mismatch so small you’ll miss it even when you’re staring right at the query.

The trap:
- your SQL column is `varchar(…)` (non-Unicode)
- your C# parameter is a `string`
- Dapper/ADO.NET sends that parameter as `nvarchar(4000)` by default
- SQL Server responds with `CONVERT_IMPLICIT(...)`
- and your index seek turns into an index scan

If you’ve ever looked at a query and thought “this WHERE clause should be instant, why is it melting the box?”, this is one of the first things I’d check.

## The five angles I care about

### 1) This is not a Dapper problem. It’s a “safe default” problem.
`System.String` being Unicode is reasonable.
And ADO.NET defaulting `string` to `nvarchar(4000)` is also reasonable.

But it means this super normal Dapper pattern is a footgun when your schema uses `varchar`:

```text
const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";

var result = await connection.QueryFirstOrDefaultAsync<Product>(
    sql,
    new { productCode }
);
```

Nothing in that C# code hints “by the way, your index is about to be ignored.”
That’s why this is a production-only kind of pain.

### 2) The execution plan tells the truth (but you have to know what to look for)
The giveaway is an implicit conversion on the *column side*.
You’ll see something like this in the plan:

```text
CONVERT_IMPLICIT(nvarchar(255), [Sales].[ProductCode], 0)
```

That’s SQL Server saying:
> “I can’t compare your `nvarchar` parameter to my `varchar` index key without converting something, and due to type precedence I’m converting the column.”

And when SQL Server has to apply a function to the column values, the index is no longer a nice sorted structure it can seek into.
So it scans.

### 3) The expensive part is not the conversion. It’s the *multiplier*.
A single scan isn’t the end of the world.
But production is never “one query once.”

The real damage is:
- “a tiny query”
- times “hundreds of thousands of executions”
- times “a table that grew 10× since last year”

That’s how you get a system that looks architecturally fine but still runs hot.

### 4) The fix is boring (which is the best kind of fix)
You just need to send the parameter as `varchar`.
In Dapper that usually means `DynamicParameters` + `DbType.AnsiString`:

```text
const string sql = "SELECT * FROM Products WHERE ProductCode = @productCode";

var p = new DynamicParameters();
p.Add("productCode", productCode, DbType.AnsiString, size: 100);

var result = await connection.QueryFirstOrDefaultAsync<Product>(sql, p);
```

And yes: set `size` to match your column definition.
Not because SQL Server can’t guess, but because exact type/length matches tend to behave better with plan reuse and avoid surprising “almost matches”.

If you prefer to keep anonymous objects, Dapper also has `DbString`:

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

Same idea: don’t let the driver guess.

### 5) The long-term solution is: treat parameter types as part of your API contract
I know, I know.
Most teams treat SQL types as “database details.”

But if you’re optimizing real production systems, parameter types are not a detail.
They’re part of the contract between your app and the engine.

A rule of thumb that’s annoyingly useful:
- if the column is `varchar(...)`, you want `DbType.AnsiString`
- if the column is `nvarchar(...)`, the default `DbType.String` is fine

And if you *do* add the “verbose” fix, leave a comment.
Because somebody will refactor it back to `new { productCode }` in six months and you’ll be back where you started.

## How I’d audit this (fast)
If you suspect this is happening, a quick way to prove it is:
1. Grab an actual execution plan for your hot query
2. Search for `CONVERT_IMPLICIT`
3. Check whether the conversion wraps the column in your predicate

If you want to hunt more systematically, Query Store is a good place to start. The original write-up includes a concrete query pattern.

## The part that still annoys me
This is one of those issues that punishes you for being “clean.”

- The SQL is parameterized (good)
- The column is indexed (good)
- The ORM is micro and explicit (also good)

And you still get wrecked because Unicode vs non-Unicode isn’t visible in the C# call site.

So yeah: if your database has legacy `varchar` columns (most do), go check your Dapper calls.
This is the kind of bug that hides in plain sight.

---

**References:**
- [How C# Strings Silently Kill Your SQL Server Indexes in Dapper (original write-up)](https://consultwithgriff.com/dapper-nvarchar-implicit-conversion-performance-trap)
- [Microsoft docs: DbType enum (AnsiString vs String)](https://learn.microsoft.com/en-us/dotnet/api/system.data.dbtype)
- [Microsoft docs: Data type conversion rules in SQL Server](https://learn.microsoft.com/en-us/sql/t-sql/data-types/data-type-conversion-database-engine)
- [Dapper documentation (DbString)](https://github.com/DapperLib/Dapper#string-parameters)
