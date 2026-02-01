---
layout: post
title: "Dictionary + FSST: The Most Practical String Compression Trick I've Seen in a While"
date: 2026-02-01 21:30:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: en
image: /img/posts/2026-02-01-dict-fsst-compression.webp
---

![Dictionary + FSST layout sketch](/img/posts/2026-02-01-dict-fsst-compression.webp)

I've always had this annoying feeling about "compression" discussions in databases.

On paper it's easy: compress more, save space, go faster.

In real systems it's messier: you compress, then you pay for decompression, and suddenly your hot queries are *slower* even though you saved disk.

So I liked this CedarDB write-up because it's unusually honest about the trade-off — and it shows a trick that feels very "engineer-brain": **use dictionary compression for queryability, then use FSST to compress the dictionary itself**.

## Why strings matter (and why they hurt)
If you work with real datasets, you already know the punchline: strings are everywhere.

You can preach "use enums" all you want. People still store statuses as text. People store UUIDs as text. People store URLs as text. Sometimes that's the right call. Sometimes it's just laziness.

Either way, strings create two problems:

1) **Storage**: they eat space (and money if you pay per GB).

2) **Query performance**: filtering on strings is expensive. Variable length, hard to SIMD, cache-unfriendly.

That's why database people keep trying to turn strings into something closer to "integers you can compare fast".

## Dictionary compression is great… until it isn’t
Dictionary compression is the classic move:

- build a dictionary of unique strings
- store small integer keys in the column
- do filters on the keys when possible

If your dictionary is ordered, you get nice properties:

- you can binary search the dictionary once per block to find the key for a predicate like `url = '...'`
- then the scan is just integer comparisons (SIMD-friendly)

So far so good.

The problem: dictionaries only shine when the number of distinct strings is modest.

Once the cardinality blows up (think user-generated text, long URLs, lots of unique IDs), you end up storing a giant dictionary of raw strings.

You still get queryable keys, but the dictionary itself becomes the new space hog.

## FSST: tokenization, but for byte strings
FSST (Fast Static Symbol Table) is basically "tokenize frequent substrings into 1-byte codes".

- find up to 255 frequent substrings ("symbols", up to 8 bytes each)
- replace them with 1-byte codes
- reserve one code as ESC for literal bytes

I know, it sounds like a cousin of LLM tokenization. Conceptually it is.

The reason it works well in practice is hardware reality: **a 256-entry symbol table fits in L1 cache**.

But there's a catch: FSST-compressed strings are still *strings* (variable-length byte sequences).

So equality comparisons can be done, but ordering comparisons don't map cleanly.
And even for equality, you often end up decompressing a lot.

## The neat trick: DICT + FSST (compress the dictionary, not the column)
Here's the part I actually want to steal.

Instead of FSST-compressing the entire column:

- build a dictionary
- store integer keys in the column (so queries can filter on keys)
- **FSST-compress the dictionary strings**

That way you keep the best property of dictionary compression — *queryability* — while shrinking the dictionary storage by exploiting repeated patterns inside the dictionary strings.

It's one extra indirection, but if you're already in a columnar / block-oriented setup, that's a pretty reasonable price.

This also explains why systems like DuckDB shipped something similar (`DICT_FSST`).

## The uncomfortable truth: compression can hurt hot queries
The CedarDB benchmarks section is the most relatable part.

When the workload is "cold" (reading from disk), compression helps because you reduce IO.

When the workload is "hot" (everything is in memory), compression can hurt because decompression becomes the bottleneck.

Their concrete observation (paraphrased): for queries that have to decompress almost everything (LIKE predicates, etc.), FSST can make hot runs *much* slower.

This is the part people conveniently skip when they talk about compression like it's free.

So CedarDB adds a rule of thumb: **FSST must be meaningfully smaller than the next-best scheme** to be chosen (they mention a penalty threshold).

That's not sexy, but it's what you do when you care about production behavior.

## My takeaway
If you work on analytics systems (or anything that stores lots of text-ish fields), "compress the dictionary" is a very practical idea.

It doesn't try to be clever about query execution. It doesn't change your predicate logic.
It just attacks the biggest waste: storing the same patterns over and over.

And it comes with the right mindset: **compression is a performance feature only when you measure the whole pipeline** (IO + cache + CPU).

---

**References:**
- [CedarDB blog: Efficient String Compression for Modern Database Systems](https://cedardb.com/blog/string_compression/)
- [FSST paper: Fast Static Symbol Table compression (VLDB)](https://www.vldb.org/pvldb/vol13/p2649-boncz.pdf)
- [DuckDB documentation mentioning DICT_FSST](https://duckdb.org/docs/stable/sql/functions/compression.html)
