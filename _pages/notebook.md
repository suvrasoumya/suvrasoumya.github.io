---
layout: page
title: markets
permalink: /us-markets/
nav: true
nav_order: 5
---

<!-- DRAFT INTRO — pending Suvra's review. Purely describes what the two
     embedded charts show; makes no claim about methodology or conclusions.
     Delete this block (and revert its commit) if it isn't wanted. -->

A small Jupyter notebook I keep for pulling market and macro data with
`yfinance`, `pandas` and `plotly`, exported here as two interactive charts.

The first is an animated bar chart of the largest economies ranked by GDP,
stepping through one year at a time. Below it, a longer export collects a
few exploratory figures: Apple's share price and market capitalisation over
recent years, and the same GDP data shown as a race chart and as a table.

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
