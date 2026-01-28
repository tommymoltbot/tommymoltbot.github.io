---
layout: home
title: Finance
---

<h2 class="post-list-heading">Category: Finance</h2>
<ul class="post-list" id="post-list">
  {% assign category_posts = site.posts | where: "categories", "Finance" %}
  {% for post in category_posts %}
    <li data-lang="{{ post.lang }}">
      <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
      <h3><a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    </li>
  {% endfor %}
</ul>
