---
layout: default
---

<div class="home">
  <h1>Debug: Posts count = {{ site.posts.size }}</h1>
  <ul>
    {% for post in site.posts %}
      <li>{{ post.title }} ({{ post.lang }}) - {{ post.date }}</li>
    {% endfor %}
  </ul>
</div>
