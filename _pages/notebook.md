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
`yfinance`, `pandas` and `plotly`, exported here as two interactive charts:
Apple's share price against its market capitalisation, and an animated
ranking of 24 major economies by GDP from 1989 to 2023 (World Bank figures).

<div class="notebook">

  <iframe
    id="nb-us-markets"
    title="Notebook export: Apple share price and World Bank GDP charts"
    src="{{ '/assets/jupyter/us_markets.html' | relative_url }}"
    width="100%"
    height="1200"
    frameborder="0"
    loading="lazy"
  ></iframe>

</div>

<script>
  // Size the notebook iframe to the height its content reports, so the page ends
  // where the charts end and nothing is trapped in a nested scroll. Ignore
  // sub-pixel churn: resizing the frame reflows the charts inside it, which makes
  // them report again, and without this the two can chase each other.
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.ns !== "us-markets-nb" || typeof e.data.h !== "number") return;
    var frame = document.getElementById("nb-us-markets");
    if (!frame) return;
    var next = e.data.h + 4;
    if (Math.abs(parseInt(frame.style.height, 10) - next) <= 2) return;
    frame.style.height = next + "px";
  });
</script>
