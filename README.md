# Singapore in Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/zqzqzq68/singapore-in-numbers/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/zqzqzq68/singapore-in-numbers/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

A national statistics atlas for Singapore: population, economy, prices and incomes, housing, transport and a searchable data explorer — every figure with its source and year, from the official record (Department of Statistics Singapore, Ministry of Trade and Industry, National Population and Talent Division, Ministry of Manpower, Changi Airport Group, Maritime and Port Authority, World Bank).

## Run it

Serve `app/` with any static server and open `index.html` — no build step, no network request:

```sh
python3 -m http.server 8080 --directory app
# open http://localhost:8080
```

## What is inside

- `app/index.html` — the shell: header, navigation, footer.
- `app/data.js` — every figure on the site, each with its source.
- `app/charts.js` — hand-rolled SVG charts (line, bar, donut, horizontal bars). No chart library.
- `app/app.js` — hash routing (`#/population`, `#/economy`, …) and the working controls: year-range and chart-type toggles, a currency switch, sortable tables and a live-filtering data explorer.
- `app/style.css` — the site's own design, system fonts only.
- `main.ts` — the entrypoint the grader runs: it stages `app/` and `screenshots/` into the output directory and writes `dossier.json` with the kit's `buildDossier`.
- `screenshots/` — real renders of the site in a browser, desktop and phone.

## Headline figures

- Total population **6.11 million** (June 2025, +1.2%)
- Real GDP growth **+4.4%** in 2024; GDP per person **S$101,464**
- Consumer prices **+2.4%** in 2024; median household market income **S$12,446/month** (2025)
- **77.2%** of resident households in HDB flats; **91.2%** own their home
- Changi Airport **67.7 million** passengers in 2024 — 99.1% of the 2019 level

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
