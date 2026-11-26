// Singapore in Numbers — the figures behind the site.
//
// Every number below comes from a published official source, and each
// view prints its source and year next to the figure. Figures were
// collected fresh for this build in November 2026 from the Department
// of Statistics Singapore (DOS), the Ministry of Trade and Industry
// (MTI) Economic Survey, the National Population and Talent Division
// (NPTD), the Ministry of Manpower (MOM), Changi Airport Group (CAG),
// the Maritime and Port Authority (MPA) and the World Bank's World
// Development Indicators. Where two publishers disagree, the label
// says which one the figure is from.

const SOURCES = {
  dos: 'Department of Statistics Singapore (DOS)',
  nptd: 'National Population and Talent Division (NPTD), Population in Brief 2025',
  mti: 'Ministry of Trade and Industry, Economic Survey of Singapore 2024',
  mom: 'Ministry of Manpower (MOM)',
  cag: 'Changi Airport Group (CAG)',
  mpa: 'Maritime and Port Authority of Singapore (MPA)',
  wb: 'World Bank, World Development Indicators',
  ghs: 'DOS, General Household Survey 2025',
  khit: 'DOS, Key Household Income Trends',
  uli: 'Urban Land Institute, Asia-Pacific Home Attainability Index 2025',
};

const DATA = {
  meta: {
    title: 'Singapore in Numbers',
    subtitle: 'A national statistics atlas — population, economy, prices, homes and movement, from the official record.',
    updated: 'Figures as published to November 2026',
    landAreaKm2: 735,
    landAreaNote: '735.2 sq km (DOS, 2024)',
  },

  // Headline cards on the overview page.
  headlines: [
    { label: 'Total population', value: '6.11m', change: '+1.2% on a year ago', year: 'June 2025', source: 'nptd' },
    { label: 'Real GDP growth', value: '+4.4%', change: 'after +1.8% in 2023', year: '2024', source: 'mti' },
    { label: 'GDP per person', value: 'S$101,464', change: 'US$90,674 at market prices', year: '2024', source: 'mti' },
    { label: 'Consumer prices', value: '+2.4%', change: 'after +4.8% in 2023', year: '2024', source: 'wb' },
    { label: 'Unemployment', value: '2.0%', change: 'overall, annual average', year: '2024', source: 'mom' },
    { label: 'Changi passengers', value: '67.7m', change: '99.1% of the 2019 level', year: '2024', source: 'cag' },
  ],

  population: {
    total: {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      // Millions, June of each year (DOS Population Trends / NPTD).
      values: [5.54, 5.61, 5.61, 5.64, 5.70, 5.69, 5.45, 5.64, 5.92, 6.04, 6.11],
      source: 'dos',
    },
    composition2025: [
      { group: 'Citizens', value: 3.66, note: '+0.7% on June 2024' },
      { group: 'Permanent residents', value: 0.54, note: 'flat on June 2024' },
      { group: 'Non-residents', value: 1.91, note: '+2.7% on June 2024' },
    ],
    compositionNote: 'Residents — citizens plus permanent residents — number 4.20 million of the 6.11 million total.',
    ethnicCitizens: [
      { group: 'Chinese', value: 75.5 },
      { group: 'Malay', value: 15.1 },
      { group: 'Indian', value: 7.6 },
      { group: 'Others', value: 1.8 },
    ],
    ageing: [
      { year: 2015, share65: 13.1 },
      { year: 2025, share65: 20.7 },
    ],
    births: [
      { label: 'Citizen births', value: '29,237', year: '2024' },
      { label: 'Total fertility rate', value: '0.97', year: '2024, births per woman' },
      { label: 'Citizen marriages', value: '22,955', year: '2024, −5.7% on 2023' },
      { label: 'New citizens', value: '22,766', year: '2024' },
      { label: 'New permanent residents', value: '35,264', year: '2024' },
    ],
    tfr: {
      years: [2015, 2020, 2023, 2024],
      values: [1.24, 1.10, 0.97, 0.97],
      source: 'nptd',
    },
  },

  economy: {
    growth: {
      years: [2020, 2021, 2022, 2023, 2024],
      // Real GDP growth, % year on year.
      values: [-3.8, 9.8, 4.1, 1.8, 4.4],
      source: 'mti',
    },
    gdpNominal: [
      { year: 2023, sgdBn: 678.7 },
      { year: 2024, sgdBn: 731.4 },
    ],
    gdpPerCapita: [
      { year: 2023, sgd: 93592, usd: 85247 },
      { year: 2024, sgd: 101464, usd: 90674 },
    ],
    gdpPerCapitaPppUsd2024: 150799,
    gniPerCapitaAtlasUsd2024: 74750,
    sectors2024: [
      { sector: 'Construction', growth: 4.4 },
      { sector: 'Information & communications', growth: 4.2 },
      { sector: 'Accommodation', growth: 4.2 },
      { sector: 'Transportation & storage', growth: 3.7 },
      { sector: 'Whole economy', growth: 4.4 },
    ],
    labour: [
      { label: 'Labour force', value: '3.6m', year: '2024' },
      { label: 'Labour-force participation', value: '69.2%', year: '2024, ages 15+' },
      { label: 'Unemployment (overall)', value: '2.0%', year: '2024, annual average' },
      { label: 'Unemployment (resident)', value: '2.8%', year: 'December 2024' },
    ],
    unemployment: {
      years: [2020, 2021, 2022, 2023, 2024],
      values: [3.0, 2.7, 2.1, 1.9, 2.0],
      source: 'mom',
    },
  },

  prices: {
    cpi: {
      years: [2020, 2021, 2022, 2023, 2024, 2025],
      values: [-0.2, 2.3, 6.1, 4.8, 2.4, 0.9],
      source: 'wb',
    },
    householdIncome: {
      // Median monthly household market income, resident employed households.
      years: [2023, 2024, 2025],
      values: [11130, 11558, 12446],
      source: 'khit',
    },
    householdIncomePerMember: [
      { year: 2024, value: 3621 },
      { year: 2025, value: 3909 },
    ],
    gini2024: 0.371,
    incomeByDwelling2024: [
      { dwelling: 'HDB 1- & 2-room flats', avg: 4084 },
      { dwelling: 'HDB 3-room flats', avg: 8094 },
      { dwelling: 'HDB 4-room flats', avg: 11676 },
      { dwelling: 'HDB 5-room & executive flats', avg: 15180 },
      { dwelling: 'Condominiums & other apartments', avg: 23366 },
      { dwelling: 'Landed properties', avg: 30050 },
    ],
  },

  housing: {
    hdbShare: [
      { year: 2020, share: 78.7 },
      { year: 2025, share: 77.2 },
    ],
    ownership: [
      { year: 2020, share: 87.9 },
      { year: 2025, share: 91.2 },
    ],
    facts: [
      { label: 'Resident households in HDB flats', value: '77.2%', year: '2025, of which 31.2% in 4-room flats', source: 'ghs' },
      { label: 'Owner-occupied households', value: '91.2%', year: '2025, up from 87.9% in 2020', source: 'ghs' },
      { label: 'Median HDB flat price', value: 'S$561,900', year: '2024', source: 'uli' },
      { label: 'HDB price-to-income ratio', value: '4.3', year: '2024, down from 4.7 in 2023', source: 'uli' },
      { label: 'HDB flats built to date', value: '1.2m+', year: 'cumulative', source: 'uli' },
      { label: 'Average private home price', value: 'US$1.7m', year: '2024, price-to-income 16.9', source: 'uli' },
    ],
  },

  transport: {
    changi: {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      // Million passenger movements (CAG).
      values: [68.3, 11.8, 3.1, 32.2, 58.9, 67.7],
      source: 'cag',
    },
    changiFacts: [
      { label: 'Passenger movements', value: '67.7m', year: '2024, +14.8% on 2023' },
      { label: 'Share of the 2019 level', value: '99.1%', year: '2019: 68.3m movements' },
      { label: 'Aircraft movements', value: '366,000', year: '2024, +11.5%' },
      { label: 'Airfreight throughput', value: '1.99m tonnes', year: '2024, +14.6%' },
      { label: 'Busiest day', value: '226,000', year: 'passengers, 21 December 2024' },
      { label: 'Busiest month', value: '6.4m', year: 'passengers, December 2024' },
    ],
    connectivity: [
      { label: 'Airlines at Changi', value: '100', year: 'January 2025' },
      { label: 'Cities linked', value: '163', year: 'in 49 countries & territories' },
      { label: 'Weekly scheduled flights', value: '7,400+', year: 'January 2025' },
      { label: 'Top passenger markets', value: 'China · Indonesia · Malaysia · Australia · Thailand', year: '2024' },
      { label: 'Busiest routes', value: 'Kuala Lumpur · Bangkok · Jakarta · Bali · Hong Kong', year: '2024' },
      { label: 'Container throughput', value: '41.12m TEUs', year: '2024, a record year', source: 'mpa' },
    ],
  },

  health: [
    { label: 'Life expectancy at birth', value: '83.3 years', year: '2024', source: 'wb' },
    { label: 'Infant mortality', value: '1.7', year: 'per 1,000 live births', source: 'wb' },
    { label: 'Adult literacy', value: '97.7%', year: '2021', source: 'wb' },
    { label: 'Urban population', value: '100%', year: '2024', source: 'wb' },
    { label: 'Population density', value: '≈8,300', year: 'people per sq km, 2025', source: 'dos' },
  ],

  // The searchable data explorer: every indicator on the site, one row each.
  explorer: [
    { indicator: 'Total population', value: '6.11 million', year: 'June 2025', source: 'National Population and Talent Division' },
    { indicator: 'Citizen population', value: '3.66 million', year: 'June 2025', source: 'National Population and Talent Division' },
    { indicator: 'Permanent resident population', value: '0.54 million', year: 'June 2025', source: 'National Population and Talent Division' },
    { indicator: 'Non-resident population', value: '1.91 million', year: 'June 2025', source: 'National Population and Talent Division' },
    { indicator: 'Residents aged 65 and over', value: '20.7% of residents', year: '2025', source: 'National Population and Talent Division' },
    { indicator: 'Total fertility rate', value: '0.97 births per woman', year: '2024', source: 'National Population and Talent Division' },
    { indicator: 'Citizen births', value: '29,237', year: '2024', source: 'National Population and Talent Division' },
    { indicator: 'Citizen marriages', value: '22,955', year: '2024', source: 'National Population and Talent Division' },
    { indicator: 'Nominal GDP', value: 'S$731.4 billion', year: '2024', source: 'Ministry of Trade and Industry' },
    { indicator: 'Real GDP growth', value: '+4.4%', year: '2024', source: 'Ministry of Trade and Industry' },
    { indicator: 'GDP per capita', value: 'S$101,464', year: '2024', source: 'Ministry of Trade and Industry' },
    { indicator: 'GDP per capita (US$)', value: 'US$90,674', year: '2024', source: 'World Bank' },
    { indicator: 'GDP per capita (PPP)', value: 'US$150,799', year: '2024', source: 'World Bank' },
    { indicator: 'GNI per capita (Atlas)', value: 'US$74,750', year: '2024', source: 'World Bank' },
    { indicator: 'Consumer price inflation', value: '+2.4%', year: '2024', source: 'World Bank' },
    { indicator: 'Unemployment rate (overall)', value: '2.0%', year: '2024', source: 'Ministry of Manpower' },
    { indicator: 'Labour force', value: '3.6 million', year: '2024', source: 'World Bank' },
    { indicator: 'Median monthly household market income', value: 'S$12,446', year: '2025', source: 'Dept. of Statistics Singapore' },
    { indicator: 'Gini coefficient (after taxes & transfers)', value: '0.371', year: '2024', source: 'Dept. of Statistics Singapore' },
    { indicator: 'Resident households in HDB flats', value: '77.2%', year: '2025', source: 'DOS General Household Survey 2025' },
    { indicator: 'Owner-occupied households', value: '91.2%', year: '2025', source: 'DOS General Household Survey 2025' },
    { indicator: 'Median HDB flat price', value: 'S$561,900', year: '2024', source: 'Urban Land Institute' },
    { indicator: 'Changi passenger movements', value: '67.7 million', year: '2024', source: 'Changi Airport Group' },
    { indicator: 'Changi airfreight throughput', value: '1.99 million tonnes', year: '2024', source: 'Changi Airport Group' },
    { indicator: 'Container throughput', value: '41.12 million TEUs', year: '2024', source: 'Maritime and Port Authority' },
    { indicator: 'Life expectancy at birth', value: '83.3 years', year: '2024', source: 'World Bank' },
    { indicator: 'Land area', value: '735.2 sq km', year: '2024', source: 'Dept. of Statistics Singapore' },
  ],
};
