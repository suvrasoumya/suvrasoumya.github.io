---
layout: page
permalink: /repositories/
title: repositories
nav: true
nav_order: 4
---

<ul>
  {% for repo in site.data.repositories.github_repos %}
  <li><a href="https://github.com/{{ repo }}">{{ repo | split: '/' | last }}</a></li>
  {% endfor %}
</ul>
