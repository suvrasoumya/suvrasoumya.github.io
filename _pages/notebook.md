---
layout: page
title: markets
permalink: /us-markets/
nav: true
nav_order: 5
---

<div class="notebook">

  <iframe
    id="nb-gdp-animation"
    title="Animated bar chart: GDP of the top economies, year by year"
    src="{{ '/assets/jupyter/us_markets_animation.html' | relative_url }}"
    width="100%"
    height="600px"
    frameborder="0"
    loading="lazy"
  ></iframe>

  <iframe
    id="nb-us-markets"
    title="Notebook export: US equity data and World Bank GDP charts"
    src="{{ '/assets/jupyter/us_markets.html' | relative_url }}"
    width="100%"
    height="5200px"
    frameborder="0"
    loading="lazy"
  ></iframe>

</div>

<script>
  // Size the notebook iframe to its content instead of a hard-coded height, so
  // nothing is trapped in a nested scroll. The export posts its scrollHeight.
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.ns !== "us-markets-nb" || typeof e.data.h !== "number") return;
    var frame = document.getElementById("nb-us-markets");
    if (frame) frame.style.height = e.data.h + 24 + "px";
  });
</script>
