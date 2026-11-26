// Singapore in Numbers — small hand-rolled SVG charts.
//
// No chart library is vendored: every chart on the site is drawn by the
// functions in this file, straight from the numbers in data.js. Each
// function returns an SVG string, so the page renders identically on a
// desktop and on a phone, with no network request.

function svgOpen(width, height, label) {
  return '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">';
}

// A line chart with labelled points. `series` is { years, values } and
// `unit` is the suffix printed next to each point ('%', 'm', ...).
function lineChart(series, opts) {
  const o = opts || {};
  const W = 640, H = 300, PL = 46, PR = 16, PT = 22, PB = 34;
  const ys = series.years, vs = series.values;
  // Pad the data range a little so the line's shape reads; the gridlines
  // carry the true values, so no baseline is implied.
  const rawMin = Math.min.apply(null, vs);
  const rawMax = Math.max.apply(null, vs);
  const pad = (rawMax - rawMin) * 0.15 || 1;
  const min = rawMin - pad;
  const max = rawMax + pad;
  const span = (max - min) || 1;
  const x = (i) => PL + (i * (W - PL - PR)) / Math.max(ys.length - 1, 1);
  const y = (v) => PT + (1 - (v - min) / span) * (H - PT - PB);
  const grid = [0.25, 0.5, 0.75].map((f) => {
    const gy = PT + f * (H - PT - PB);
    const gv = (max - (max - min) * f).toFixed(1);
    return '<line x1="' + PL + '" y1="' + gy + '" x2="' + (W - PR) + '" y2="' + gy + '" stroke="#e3ddd0" stroke-width="1"/>'
      + '<text x="' + (PL - 6) + '" y="' + (gy + 4) + '" text-anchor="end" font-size="11" fill="#6b6455">' + gv + '</text>';
  }).join('');
  const pts = vs.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ');
  // Label a point only when it has room: neighbouring points less than
  // ~52 px apart would print on top of each other.
  let lastLabelX = -100;
  const dots = vs.map((v, i) => {
    const label = (o.format ? o.format(v) : v) + (o.unit || '');
    const dot = '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="4.5" fill="#d7263d" stroke="#fff" stroke-width="1.5"/>';
    if (x(i) - lastLabelX < 52 && i !== vs.length - 1) return dot;
    lastLabelX = x(i);
    return dot + '<text x="' + x(i) + '" y="' + (y(v) - 10) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#0f2a43">' + label + '</text>';
  }).join('');
  const xlabels = ys.map((yr, i) => '<text x="' + x(i) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="11" fill="#6b6455">' + yr + '</text>').join('');
  return svgOpen(W, H, o.label || 'Line chart')
    + grid
    + '<polyline points="' + pts + '" fill="none" stroke="#0e7c7b" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'
    + dots + xlabels + '</svg>';
}

// A vertical bar chart. Bars above the baseline are teal, below it red.
function barChart(series, opts) {
  const o = opts || {};
  const W = 640, H = 300, PL = 46, PR = 16, PT = 26, PB = 34;
  const ys = series.years, vs = series.values;
  const lo = Math.min.apply(null, vs.concat([0]));
  const hi = Math.max.apply(null, vs.concat([0]));
  const span = (hi - lo) || 1;
  const zeroY = PT + (1 - (0 - lo) / span) * (H - PT - PB);
  const slot = (W - PL - PR) / ys.length;
  const bw = Math.min(46, slot * 0.62);
  const bars = vs.map((v, i) => {
    const bx = PL + i * slot + (slot - bw) / 2;
    const top = v >= 0 ? PT + (1 - (v - lo) / span) * (H - PT - PB) : zeroY;
    const bh = Math.max(2, Math.abs(PT + (1 - (v - lo) / span) * (H - PT - PB) - zeroY));
    const fill = v >= 0 ? '#0e7c7b' : '#d7263d';
    const label = (o.format ? o.format(v) : v) + (o.unit || '');
    return '<rect x="' + bx.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw + '" height="' + bh.toFixed(1) + '" rx="3" fill="' + fill + '"/>'
      + '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (top - 6).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#0f2a43">' + label + '</text>'
      + '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="11" fill="#6b6455">' + ys[i] + '</text>';
  }).join('');
  return svgOpen(W, H, o.label || 'Bar chart')
    + '<line x1="' + PL + '" y1="' + zeroY + '" x2="' + (W - PR) + '" y2="' + zeroY + '" stroke="#0f2a43" stroke-width="1.5"/>'
    + bars + '</svg>';
}

// A donut chart for a parts-of-a-whole split, with a legend underneath.
function donutChart(parts, opts) {
  const o = opts || {};
  const size = 260, cx = size / 2, cy = size / 2, r = 96, hole = 58;
  const total = parts.reduce((s, p) => s + p.value, 0);
  const colors = ['#d7263d', '#0e7c7b', '#e9a426', '#0f2a43', '#7a9cc6'];
  let a0 = -Math.PI / 2;
  const slices = parts.map((p, i) => {
    const frac = p.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const ix0 = cx + hole * Math.cos(a1), iy0 = cy + hole * Math.sin(a1);
    const ix1 = cx + hole * Math.cos(a0), iy1 = cy + hole * Math.sin(a0);
    const d = 'M ' + x0.toFixed(1) + ' ' + y0.toFixed(1)
      + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1)
      + ' L ' + ix0.toFixed(1) + ' ' + iy0.toFixed(1)
      + ' A ' + hole + ' ' + hole + ' 0 ' + large + ' 0 ' + ix1.toFixed(1) + ' ' + iy1.toFixed(1) + ' Z';
    a0 = a1;
    return '<path d="' + d + '" fill="' + colors[i % colors.length] + '"/>';
  }).join('');
  const legend = parts.map((p, i) => {
    const pct = (100 * p.value / total).toFixed(1);
    return '<div class="legend-row"><span class="swatch" style="background:' + colors[i % colors.length] + '"></span>'
      + '<span class="legend-name">' + p.group + '</span>'
      + '<span class="legend-value">' + p.value.toFixed(2) + 'm · ' + pct + '%</span>'
      + (p.note ? '<span class="legend-note">' + p.note + '</span>' : '') + '</div>';
  }).join('');
  return '<div class="donut-wrap">' + svgOpen(size, size, o.label || 'Donut chart')
    + slices
    + '<text x="' + cx + '" y="' + (cy - 6) + '" text-anchor="middle" font-size="26" font-weight="800" fill="#0f2a43">' + total.toFixed(2) + 'm</text>'
    + '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="12" fill="#6b6455">' + (o.centerLabel || 'total') + '</text>'
    + '</svg><div class="legend">' + legend + '</div></div>';
}

// Horizontal bars for comparing a few named values side by side.
function hbarChart(rows, opts) {
  const o = opts || {};
  const max = Math.max.apply(null, rows.map((r) => r.value));
  const bars = rows.map((r) => {
    const pct = (100 * r.value / max).toFixed(1);
    return '<div class="hbar-row"><span class="hbar-name">' + r.name + '</span>'
      + '<span class="hbar-track"><span class="hbar-fill" style="width:' + pct + '%;background:' + (r.color || '#0e7c7b') + '"></span></span>'
      + '<span class="hbar-value">' + (o.format ? o.format(r.value) : r.value) + (o.unit || '') + '</span></div>';
  }).join('');
  return '<div class="hbar-chart" role="img" aria-label="' + (o.label || 'Bar comparison') + '">' + bars + '</div>';
}
