---
layout: post
title: "Normal Delta vs SABR Delta: A 1y10y Straddle Example"
date: 2026-09-07 00:00:00-0400
related_posts: false
---

Two traders can hold the same USD swaption and disagree completely on what their delta is. Not because one of them is wrong, but because delta isn't a property of the option — it's a property of the option *plus an assumption about how the vol surface moves when rates move*.

Here's the cleanest way to see it.

## The position

A 1y10y ATM straddle, quoted in forward premium terms at 520c per 100 notional.

Back out the vol from the Bachelier straddle formula:

```
Premium = Annuity × 0.798 × σ_N × √T
520 = 8.1 × 0.798 × σ_N × 1
σ_N ≈ 80bp
```

So: 80 normal vol, vega ≈ 6.5c per vol bp (≈ $65k per vol bp on $100mm).

## Normal delta = 0

Normal delta is the Bachelier partial derivative — bump the forward, hold the normal vol *at your strike* fixed:

```
Δ_N = N(d),  d = (F − K) / (σ_N √T)
```

At the money, d = 0. The call is +0.5, the put is −0.5, they cancel. **Delta is zero. No hedge.**

The assumption buried in that zero is sticky strike: the σ_N(K) curve is nailed to strike space. Move the forward 10bp and the vol marked on your strike doesn't budge, so the only P&L is gamma.

## SABR delta ≈ −0.7c per bp

SABR drops the pretence that vol and rates are independent. With β = 0, ρ = −0.30, ν = 0.35:

```
dσ_N/dF = ρν = −0.105 vol bp per rate bp
```

Rates +10bp → vol −1.05bp → you lose 6.5 × 1.05 ≈ 6.8c through vega.

```
Δ_SABR = Vega_N × dσ_N/dF = 6.5 × (−0.105) ≈ −0.7c per bp
```

That's **−$6,800 per bp on $100mm**. Negative: you lose as rates rise. You're effectively long duration, and you hedge by paying fixed in roughly $8.4mm of 10y.

## Where the difference comes from

| Component | ATM straddle |
|---|---|
| Price-curve term (∂V/∂F) | 0 |
| Vol-surface term (Vega × dσ/dF) | −0.7c per bp |

An ATM straddle is the extreme case: the price-curve piece is exactly zero, so *100% of the SABR delta is the vol-rate correlation term*. Nothing else is left.

Away from the money both terms are live, and the gap between the two deltas scales roughly as `Vega × dσ/dF` — negligible near ATM, dominant on the wings.

## The assumption ladder

Every "delta" you can compute is a choice about how much of ∂σ_N/∂F you're willing to own:

- **Normal / Bachelier** — sticky strike. No backbone. dσ/dF = 0.
- **Sticky-ATM** — surface translates with the forward. dσ/dF = −skew. Adds one vanna-ish term, `Vega × skew`.
- **SABR** — backbone set by β, correlation by ρν. Lands between the two for most USD marks.
- **Bartlett** — SABR plus the correlated α move: `+ (∂V/∂α) × ρν F^(−β)`. Hagan's original delta ignores that dα and dF move together; Bartlett puts it back.

Black delta belongs on this ladder too, and it's worth naming why nobody uses it here: it holds *lognormal* vol fixed, which implies normal vol scales proportionally with the forward. On a 4% forward, +10bp of rates implies +2.5% of normal vol. USD hasn't respected that at these levels, which is exactly why the market quotes and hedges in normal space.

## Why it matters on the desk

Hedge the straddle above on normal delta and you run flat, feel hedged, and still bleed $6.8k a basis point in a selloff. The loss doesn't disappear — it just gets reclassified. It shows up in attribution as vanna instead of delta, which is the least useful place for it to live.

SABR delta pre-hedges that term. That's the entire argument for it.

One honest caveat: which assumption is *right* is an empirical question, not a modelling one, and the answer is regime-dependent. The USD backbone flattens out in high-rate regimes and looks more lognormal when rates are pinned near zero. β isn't a constant of nature; it's a view.
