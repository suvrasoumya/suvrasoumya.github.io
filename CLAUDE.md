# suvrasoumya.github.io

Personal site of Suvrasoumya Mohanty (interest rates options trader). Jekyll +
the [al-folio](https://github.com/alshedivat/al-folio) theme, deployed to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

Live: https://suvrasoumya.github.io

## Layout

- `_pages/` — about (homepage), blog listing (`/blog/`, titled "writing"), news, notebook, repositories.
- `_posts/YYYY-MM-DD-slug.md` — blog posts. Front matter: `layout: post`, `title`, `date` with a timezone offset, `related_posts: false`. Add a per-post `description:` — without it OG/Twitter previews fall back to the generic `site.description`.
- `assets/jupyter/*.ipynb` — notebooks are kept in the repo but **excluded** from the build (they'd otherwise be published with all source cells). Pages embed their own `--no-input` HTML export instead.
- `_includes/metadata.liquid`, `_includes/header.liquid`, `_layouts/about.liquid` — where `site.title`/`page.title` are consumed. See "Theme quirks".
- `bin/build-local` — local build wrapper (see below). `bin/cibuild`, `bin/deploy`, `bin/entry_point.sh` are upstream al-folio scripts, not used here.
- `Claude outputs/` — untracked scratch folder, not part of the site.

## Building locally

Always use `bin/build-local` — never a bare `bundle install`.

```bash
bin/build-local            # bundle install if needed, then jekyll build -> _site/
bin/build-local serve      # jekyll serve on http://127.0.0.1:4000
bin/build-local --verbose  # show the full jekyll log
bin/build-local --future   # include future-dated posts (CI does NOT do this)
```

Why: this Mac runs Homebrew Ruby 4.0.x, which dropped gems al-folio's plugins
need (`csv observer ostruct mutex_m base64 bigdecimal logger benchmark drb
getoptlong rexml`). CI builds on Ruby 3.3.5 and is fine. The script appends
those gems to a throwaway Gemfile under `vendor/` (gitignored) so the tracked
`Gemfile` and `Gemfile.lock` stay untouched — **do not edit either to make a
local build work**. Do not pass `--without other_plugins`; `_plugins/external-posts.rb` needs `feedjira`.

Local-only noise that is safe to ignore (appears on a clean checkout, absent on
CI): Sass `@import`/`unquote` deprecation warnings and
`Terser Exception: "\xE2" on US-ASCII`. The script filters these; the full log
is at `vendor/build-local.log`.

Ruby `-e` cannot hold UTF-8 literals on this machine — write a `.rb` file with
`# coding: utf-8` when checking rendered unicode (σ Δ ρ ν β ∂ …).

## Publishing traps

- **Future-dated posts are silently skipped.** `_config.yml` does not set
  `future:` and CI runs a bare `jekyll build`. A post whose `date:` is even
  slightly ahead of the runner's clock (UTC) produces no page and no error.
  When dating a post "today", use a time already safely in the past in UTC.
- `CLAUDE.md` is in `_config.yml`'s `exclude:` list so it isn't published. Any
  new root-level `.md` that isn't site content must be added there too.
- `og_image` must be an absolute URL (al-folio doesn't run it through `absolute_url`).

## Theme quirks (al-folio)

- `site.title` is not just the browser `<title>`: it is also the navbar brand
  text, the about-page `<h1>`, and the "journal" field in post citation
  exports. Don't repurpose it for a tagline. The homepage tab title gets its
  role suffix from the custom `role:` key in `_config.yml`, consumed only in
  the homepage branch of `_includes/metadata.liquid`.
- On the homepage `page.title` is `"about"`. Anything that uses `page.title`
  for metadata must guard with `page.url != '/'` (see commit `37aa1a2`).
- schema.org `sameAs` is built from `site.github_username` etc. in
  `_config.yml`, not from `_data/socials.yml` (which drives the visible icons).
  Those keys are unset, so `sameAs` is simply omitted.

## Git and deploy workflow

Standing instruction from the owner: **branch, commit, verify the build, then
merge and push without asking** — they review the live site, not diffs.

1. Work on a branch; keep commits self-contained.
2. `bin/build-local` must succeed before merging.
3. Merge into `main` with `--no-ff` (matches history), push, delete the branch.
4. Watch the "Deploy site" workflow (`gh run list --workflow deploy.yml`),
   then verify the live URL(s) with `curl`.
5. Report `git log origin/main -1` and the live URLs.

CI note: the push-triggered "Check for broken links" workflow has failed on
every commit for months (upstream al-folio doc links) — ignore it. "Check for
broken links on site" is the meaningful one.

"Prettier code formatter" **is** meaningful and is expected green. It runs
`npx prettier . --check` with `@shopify/prettier-plugin-liquid` over the whole
repo, `.claude/agents/*.md` included. Before pushing, run `npm install` once
then `npx prettier . --write`. Two gotchas: `npm install` rewrites the `name`
field in `package-lock.json` — revert that, it isn't a formatting change; and
prettier rewrites markdown `*italic*` to `_italic_` and adds Liquid whitespace
trim markers (`{{ x -}}`), both of which render identically.

Prose rule: don't invent new bio/marketing copy. If a page needs text that
doesn't exist yet, ask.

## Subagents

Defined in `.claude/agents/`:

- `site-builder` — runs `bin/build-local`, returns only errors/warnings that matter and the rendered HTML of any page you name. Use it so build noise stays out of the main context.
- `post-reviewer` — read-only review of a draft post: front matter, date/UTC trap, math/code rendering, al-folio conventions.
- `deploy-verifier` — after a push: waits on the Deploy workflow, curls the live pages, reports what changed.
