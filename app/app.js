// Singapore in Numbers — the site itself.
//
// One page, seven views, reached by links: the hash route names the view
// (#/population, #/economy, ...) and every view is rendered from the
// numbers in data.js. Every control on the page does what it says:
// chart type and currency toggles re-draw their chart, table headers
// sort their table, and the data explorer filters as you type.

const NAV = [
  { route: 'overview', label: 'Overview' },
  { route: 'population', label: 'Population' },
  { route: 'economy', label: 'Economy' },
  { route: 'prices', label: 'Prices & incomes' },
  { route: 'housing', label: 'Housing' },
  { route: 'transport', label: 'Transport' },
  { route: 'data', label: 'Data explorer' },
];

const ui = {
  popRange: 'all',      // 'all' (2015–2025) or 'recent' (2020–2025)
  growthStyle: 'bar',   // 'bar' or 'line'
  gdpCurrency: 'sgd',   // 'sgd' or 'usd'
  incomeSort: { key: 'avg', dir: -1 },
  explorerQuery: '',
  explorerSort: { key: 'indicator', dir: 1 },
};

function el(id) { return document.getElementById(id); }
function src(key) { return SOURCES[key] || key; }
function sourceLine(key, extra) {
  return '<p class="source">Source: ' + src(key) + (extra ? ' · ' + extra : '') + '</p>';
}
function kpiCard(h) {
  return '<article class="kpi"><p class="kpi-label">' + h.label + '</p>'
    + '<p class="kpi-value">' + h.value + '</p>'
    + '<p class="kpi-change">' + h.change + '</p>'
    + '<p class="kpi-year">' + h.year + ' · ' + src(h.source) + '</p></article>';
}
function factRow(f) {
  return '<div class="fact"><span class="fact-label">' + f.label + '</span>'
    + '<span class="fact-value">' + f.value + '</span>'
    + '<span class="fact-year">' + f.year + (f.source ? ' · ' + src(f.source) : '') + '</span></div>';
}
function sectionHead(title, intro) {
  return '<h2>' + title + '</h2>' + (intro ? '<p class="lede">' + intro + '</p>' : '');
}
function chartCard(title, bodyHtml, sourceKey, note) {
  return '<section class="card chart-card"><h3>' + title + '</h3>' + bodyHtml
    + (note ? '<p class="note">' + note + '</p>' : '')
    + (sourceKey ? sourceLine(sourceKey) : '') + '</section>';
}

// --- Overview -------------------------------------------------------------
function viewOverview() {
  const pop = DATA.population.total;
  const shown = ui.popRange === 'recent'
    ? { years: pop.years.slice(5), values: pop.values.slice(5) }
    : pop;
  const rangeBtns = '<div class="toggle" role="group" aria-label="Years shown">'
    + '<button data-pop-range="all" class="' + (ui.popRange === 'all' ? 'on' : '') + '">2015–2025</button>'
    + '<button data-pop-range="recent" class="' + (ui.popRange === 'recent' ? 'on' : '') + '">2020–2025</button></div>';
  return '<section class="hero"><p class="eyebrow">National statistics · Singapore</p>'
    + '<h1>Singapore in Numbers</h1>'
    + '<p class="lede">One island, 6.11 million people, and the official record of how they live, '
    + 'work and move — population, economy, prices, homes and transport, each figure with its source and year.</p>'
    + '<p class="hero-meta">' + DATA.meta.updated + ' · Land area ' + DATA.meta.landAreaNote + '</p></section>'
    + '<section class="kpi-grid">' + DATA.headlines.map(kpiCard).join('') + '</section>'
    + '<div class="grid-2">'
    + chartCard('Total population, June of each year',
        rangeBtns + lineChart(shown, { unit: 'm', label: 'Total population of Singapore, 2015 to 2025' }), 'dos',
        'The dip in 2021 is the pandemic outflow of non-residents; the count passed 6 million for the first time in 2024.')
    + chartCard('Real GDP growth, % year on year',
        barChart(DATA.economy.growth, { unit: '%', label: 'Real GDP growth, 2020 to 2024' }), 'mti',
        '2024 grew 4.4%, more than twice 2023\u2019s 1.8%.')
    + '</div>'
    + '<section class="card"><h2>Explore the numbers</h2><div class="link-grid">'
    + NAV.slice(1).map((n) => '<a class="explore-link" href="#/' + n.route + '"><strong>' + n.label + '</strong>'
      + '<span>' + exploreBlurb(n.route) + '</span></a>').join('')
    + '</div></section>'
    + '<section class="card"><h2>At a glance: health &amp; daily life</h2><div class="fact-list">'
    + DATA.health.map(factRow).join('') + '</div>' + sourceLine('wb') + '</section>';
}

function exploreBlurb(route) {
  return {
    population: '6.11 million people: who they are, how the mix is changing, and why births stay low.',
    economy: 'S$731.4 billion of output in 2024, which sectors grew, and who is working.',
    prices: 'Prices rose 2.4% in 2024 while the median household earned S$12,446 a month in 2025.',
    housing: '77.2% of resident households live in HDB flats; 91.2% own their home.',
    transport: 'Changi handled 67.7 million passengers in 2024 — 99.1% of its pre-pandemic level.',
    data: 'Every indicator on this site in one searchable, sortable table, with its source.',
  }[route] || '';
}

// --- Population -----------------------------------------------------------
function viewPopulation() {
  const tfr = DATA.population.tfr;
  return sectionHead('Population',
    '6.11 million people called Singapore home in June 2025 — the most ever recorded. Growth is slowing among citizens and is driven, year to year, by non-residents who come to build, care and study.')
    + '<div class="grid-2">'
    + chartCard('Total population, 2015–2025',
        lineChart(DATA.population.total, { unit: 'm', label: 'Total population, 2015 to 2025' }), 'dos',
        'June figure each year. The 2021 dip (−4.1%) is the pandemic outflow; the rebound since is the fastest in the series.')
    + chartCard('Who makes up the 6.11 million? June 2025',
        donutChart(DATA.population.composition2025, { centerLabel: 'people', label: 'Population composition, June 2025' }), 'nptd',
        DATA.population.compositionNote)
    + '</div>'
    + '<div class="grid-2">'
    + chartCard('Total fertility rate, births per woman',
        barChart(tfr, { label: 'Total fertility rate' }), 'nptd',
        'The rate has sat below the replacement level of 2.1 since 1977, and at 0.97 in both 2023 and 2024 — the lowest on record.')
    + '<section class="card chart-card"><h3>An ageing resident population</h3>'
    + hbarChart(DATA.population.ageing.map((a) => ({ name: 'Residents aged 65+ in ' + a.year, value: a.share65, color: '#d7263d' })),
        { unit: '%', label: 'Share of residents aged 65 and over' })
    + '<p class="note">One in five residents was 65 or older in 2025, up from about one in eight a decade earlier.</p>'
    + sourceLine('nptd') + '</section></div>'
    + '<section class="card"><h3>Births, marriages and new residents</h3><div class="fact-list">'
    + DATA.population.births.map((b) => factRow({ label: b.label, value: b.value, year: b.year })).join('')
    + '</div>' + sourceLine('nptd') + '</section>'
    + '<section class="card"><h3>Citizens by ethnic group, June 2025</h3>'
    + hbarChart(DATA.population.ethnicCitizens.map((e) => ({ name: e.group, value: e.value, color: '#0e7c7b' })),
        { unit: '%', label: 'Citizens by ethnic group' })
    + sourceLine('nptd') + '</section>';
}

// --- Economy --------------------------------------------------------------
function viewEconomy() {
  const perCap = DATA.economy.gdpPerCapita;
  const capRows = perCap.map((r) => ({
    name: String(r.year),
    value: ui.gdpCurrency === 'sgd' ? r.sgd : r.usd,
    color: '#0e7c7b',
  }));
  const fmt = (v) => ui.gdpCurrency === 'sgd' ? 'S$' + v.toLocaleString('en-SG') : 'US$' + v.toLocaleString('en-SG');
  const growthChart = ui.growthStyle === 'bar'
    ? barChart(DATA.economy.growth, { unit: '%', label: 'Real GDP growth, 2020 to 2024' })
    : lineChart(DATA.economy.growth, { unit: '%', label: 'Real GDP growth, 2020 to 2024' });
  return sectionHead('Economy',
    'Singapore produced S$731.4 billion in 2024 and grew 4.4% in real terms — the fastest since the post-pandemic rebound of 2021. Output per person passed S$100,000 for the first time.')
    + '<div class="grid-2">'
    + chartCard('Real GDP growth, % year on year',
        '<div class="toggle" role="group" aria-label="Chart style">'
        + '<button data-growth-style="bar" class="' + (ui.growthStyle === 'bar' ? 'on' : '') + '">Bars</button>'
        + '<button data-growth-style="line" class="' + (ui.growthStyle === 'line' ? 'on' : '') + '">Line</button></div>'
        + growthChart, 'mti', '2020 is the pandemic contraction (−3.8%); 2021 is the rebound (+9.8%).')
    + chartCard('GDP per person, at current prices',
        '<div class="toggle" role="group" aria-label="Currency">'
        + '<button data-gdp-currency="sgd" class="' + (ui.gdpCurrency === 'sgd' ? 'on' : '') + '">Singapore dollars</button>'
        + '<button data-gdp-currency="usd" class="' + (ui.gdpCurrency === 'usd' ? 'on' : '') + '">US dollars</button></div>'
        + hbarChart(capRows, { format: fmt, label: 'GDP per person' })
        + '<p class="note">At purchasing power parity the 2024 figure is US$' + DATA.economy.gdpPerCapitaPppUsd2024.toLocaleString('en-SG')
        + '; GNI per person on the World Bank Atlas method is US$' + DATA.economy.gniPerCapitaAtlasUsd2024.toLocaleString('en-SG') + '.</p>', 'mti')
    + '</div>'
    + '<section class="card"><h3>Which sectors grew in 2024?</h3>'
    + hbarChart(DATA.economy.sectors2024.map((s) => ({
        name: s.sector, value: s.growth, color: s.sector === 'Whole economy' ? '#d7263d' : '#0e7c7b',
      })), { unit: '%', label: 'Sector growth in 2024' })
    + sourceLine('mti') + '</section>'
    + '<section class="card"><h3>Work</h3><div class="fact-list">'
    + DATA.economy.labour.map(factRow).join('') + '</div>'
    + chartCard('Unemployment, overall, % of labour force',
        lineChart(DATA.economy.unemployment, { unit: '%', label: 'Unemployment rate, 2020 to 2024' }), 'mom')
    + '</section>';
}

// --- Prices & incomes -------------------------------------------------------
function viewPrices() {
  const rows = DATA.prices.incomeByDwelling2024.slice().sort((a, b) => {
    const k = ui.incomeSort.key;
    return (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * ui.incomeSort.dir;
  });
  const arrow = (k) => ui.incomeSort.key === k ? (ui.incomeSort.dir === 1 ? ' ▲' : ' ▼') : '';
  return sectionHead('Prices & incomes',
    'Prices rose 2.4% in 2024 — half the pace of 2023 — while household incomes kept climbing. The median resident household earned S$12,446 a month in 2025.')
    + '<div class="grid-2">'
    + chartCard('Consumer prices, % change on a year ago',
        lineChart(DATA.prices.cpi, { unit: '%', label: 'Consumer price inflation, 2020 to 2025' }), 'wb',
        'Inflation peaked at 6.1% in 2022, the highest in over a decade, and eased to 0.9% in 2025.')
    + chartCard('Median monthly household market income, S$',
        lineChart(DATA.prices.householdIncome, { unit: '', format: (v) => 'S$' + v.toLocaleString('en-SG'), label: 'Median household income' }), 'khit',
        'Resident employed households. Per household member, the 2025 median is S$3,909 a month, up from S$3,621 in 2024.')
    + '</div>'
    + '<section class="card"><h3>What households earn, by where they live — 2024</h3>'
    + '<p class="lede">Average monthly household income from work. Click a column heading to sort.</p>'
    + '<table class="data-table"><thead><tr>'
    + '<th><button data-sort-income="dwelling">Type of dwelling' + arrow('dwelling') + '</button></th>'
    + '<th class="num"><button data-sort-income="avg">Average income (S$/month)' + arrow('avg') + '</button></th>'
    + '</tr></thead><tbody>'
    + rows.map((r) => '<tr><td>' + r.dwelling + '</td><td class="num">S$' + r.avg.toLocaleString('en-SG') + '</td></tr>').join('')
    + '</tbody></table>' + sourceLine('dos', 'Key Household Income Trends') + '</section>'
    + '<section class="card"><h3>Inequality</h3><div class="fact-list">'
    + factRow({ label: 'Gini coefficient, after taxes & transfers', value: String(DATA.prices.gini2024), year: '2024 — the lowest on record', source: 'dos' })
    + '</div><p class="note">The Gini runs from 0 (everyone earns the same) to 1 (one household earns everything). '
    + 'Government transfers and taxes pulled Singapore\u2019s 2024 reading to 0.371, its lowest ever.</p></section>';
}

// --- Housing ---------------------------------------------------------------
function viewHousing() {
  return sectionHead('Housing',
    'More than three in four resident households live in a public flat built by the Housing & Development Board, and nine in ten own their home — the foundation of Singapore\u2019s housing story.')
    + '<div class="grid-2">'
    + '<section class="card chart-card"><h3>Resident households in HDB flats</h3>'
    + hbarChart(DATA.housing.hdbShare.map((r) => ({ name: String(r.year), value: r.share, color: '#0e7c7b' })),
        { unit: '%', label: 'Share of households in HDB flats' })
    + '<p class="note">The share eased from 78.7% in 2020 to 77.2% in 2025 as more households moved into private homes; 31.2% live in 4-room flats, the most common type.</p>'
    + sourceLine('ghs') + '</section>'
    + '<section class="card chart-card"><h3>Owner-occupied households</h3>'
    + hbarChart(DATA.housing.ownership.map((r) => ({ name: String(r.year), value: r.share, color: '#d7263d' })),
        { unit: '%', label: 'Share of owner-occupied households' })
    + '<p class="note">Home ownership rose from 87.9% in 2020 to 91.2% in 2025 — among the highest rates in the world.</p>'
    + sourceLine('ghs') + '</section></div>'
    + '<section class="card"><h3>Housing in numbers</h3><div class="fact-list">'
    + DATA.housing.facts.map(factRow).join('') + '</div>'
    + '<p class="note">The Urban Land Institute counts a home as attainable when its price is under five times the median annual household income. '
    + 'HDB flats scored 4.3 in 2024; the average private home scored 16.9.</p></section>';
}

// --- Transport -------------------------------------------------------------
function viewTransport() {
  return sectionHead('Transport',
    'Singapore is an island that lives by its connections: Changi Airport and one of the world\u2019s busiest container ports move its people and its goods.')
    + '<div class="grid-2">'
    + chartCard('Changi Airport passenger movements, millions',
        lineChart(DATA.transport.changi, { unit: 'm', label: 'Changi passenger movements, 2019 to 2024' }), 'cag',
        'Traffic collapsed to 3.1 million in 2021, then recovered in three years to 99.1% of the 2019 level.')
    + '<section class="card chart-card"><h3>Changi in 2024</h3><div class="fact-list">'
    + DATA.transport.changiFacts.map(factRow).join('') + '</div>' + sourceLine('cag') + '</section></div>'
    + '<section class="card"><h3>Connected to the world</h3><div class="fact-list">'
    + DATA.transport.connectivity.map((c) => factRow({ label: c.label, value: c.value, year: c.year, source: c.source || 'cag' })).join('')
    + '</div><p class="note">The container figure is the Maritime and Port Authority\u2019s count for 2024 — a record year for the port.</p></section>'
    + '<section class="card"><h3>Getting around the island</h3>'
    + '<p class="lede">Six MRT lines carry the daily commute, alongside buses and the island\u2019s expressways. '
    + 'Changi\u2019s Terminal 5, now under construction, will roughly double the airport\u2019s capacity when it opens in the 2030s.</p></section>';
}

// --- Data explorer ----------------------------------------------------------
function viewData() {
  const q = ui.explorerQuery.trim().toLowerCase();
  let rows = DATA.explorer.filter((r) => !q
    || r.indicator.toLowerCase().includes(q)
    || r.value.toLowerCase().includes(q)
    || r.source.toLowerCase().includes(q));
  const k = ui.explorerSort.key;
  rows = rows.slice().sort((a, b) => (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * ui.explorerSort.dir);
  const arrow = (key) => ui.explorerSort.key === key ? (ui.explorerSort.dir === 1 ? ' ▲' : ' ▼') : '';
  return sectionHead('Data explorer',
    'Every indicator on this site in one table. Type to filter, click a heading to sort — and check any figure against its source.')
    + '<section class="card"><label class="search-label" for="explorer-search">Search ' + DATA.explorer.length + ' indicators</label>'
    + '<input id="explorer-search" type="search" placeholder="Try “population”, “GDP” or “Changi”… " value="' + ui.explorerQuery.replace(/"/g, '&quot;') + '">'
    + '<p class="result-count">' + rows.length + ' of ' + DATA.explorer.length + ' indicators shown</p>'
    + '<div class="table-wrap"><table class="data-table"><thead><tr>'
    + '<th><button data-sort-explorer="indicator">Indicator' + arrow('indicator') + '</button></th>'
    + '<th><button data-sort-explorer="value">Value' + arrow('value') + '</button></th>'
    + '<th><button data-sort-explorer="year">Year' + arrow('year') + '</button></th>'
    + '<th><button data-sort-explorer="source">Source' + arrow('source') + '</button></th>'
    + '</tr></thead><tbody>'
    + (rows.length ? rows.map((r) => '<tr><td>' + r.indicator + '</td><td>' + r.value + '</td><td>' + r.year + '</td><td>' + r.source + '</td></tr>').join('')
      : '<tr><td colspan="4" class="empty">No indicator matches “' + ui.explorerQuery + '”. Try a shorter word.</td></tr>')
    + '</tbody></table></div></section>'
    + '<section class="card"><h3>Sources used on this site</h3><ul class="source-list">'
    + Object.keys(SOURCES).map((k) => '<li><strong>' + SOURCES[k] + '</strong></li>').join('')
    + '</ul><p class="note">Figures are reproduced as published; where a publisher later revises a series, the revised figure replaces the one shown here. '
    + 'This site is an independent atlas and is not affiliated with any of the publishers above.</p></section>';
}

const VIEWS = {
  overview: viewOverview,
  population: viewPopulation,
  economy: viewEconomy,
  prices: viewPrices,
  housing: viewHousing,
  transport: viewTransport,
  data: viewData,
};

function currentRoute() {
  const hash = (window.location.hash || '#/overview').replace(/^#\//, '');
  return VIEWS[hash] ? hash : 'overview';
}

function render(keepScroll) {
  const route = currentRoute();
  const view = el('view');
  view.innerHTML = VIEWS[route]();
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + route);
    if (a.classList.contains('active')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (!keepScroll) window.scrollTo(0, 0);
  wireControls();
}

function wireControls() {
  document.querySelectorAll('[data-pop-range]').forEach((b) => {
    b.addEventListener('click', () => { ui.popRange = b.getAttribute('data-pop-range'); render(); });
  });
  document.querySelectorAll('[data-growth-style]').forEach((b) => {
    b.addEventListener('click', () => { ui.growthStyle = b.getAttribute('data-growth-style'); render(); });
  });
  document.querySelectorAll('[data-gdp-currency]').forEach((b) => {
    b.addEventListener('click', () => { ui.gdpCurrency = b.getAttribute('data-gdp-currency'); render(); });
  });
  document.querySelectorAll('[data-sort-income]').forEach((b) => {
    b.addEventListener('click', () => {
      const key = b.getAttribute('data-sort-income');
      ui.incomeSort.dir = ui.incomeSort.key === key ? -ui.incomeSort.dir : (key === 'avg' ? -1 : 1);
      ui.incomeSort.key = key;
      render();
    });
  });
  document.querySelectorAll('[data-sort-explorer]').forEach((b) => {
    b.addEventListener('click', () => {
      const key = b.getAttribute('data-sort-explorer');
      ui.explorerSort.dir = ui.explorerSort.key === key ? -ui.explorerSort.dir : 1;
      ui.explorerSort.key = key;
      render();
    });
  });
  const search = el('explorer-search');
  if (search) {
    search.addEventListener('input', () => {
      ui.explorerQuery = search.value;
      render(true);
      const again = el('explorer-search');
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    });
  }
}

window.addEventListener('hashchange', render);
render();
