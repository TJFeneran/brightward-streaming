(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const faces = {
    teal: ['#B8F9ED', '#5EEAD4', '#11796C'],
    slate: ['#D4DFE8', '#8296A7', '#40566B'],
    navy: ['#2B4359', '#20364B', '#122438'],
    amber: ['#FFE7A3', '#FBBF24', '#927022'],
    white: ['#EEF4FA', '#B3C3D3', '#6A8096'],
  };
  function el(tag, attrs, parent) {
    const node = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    parent.appendChild(node);
    return node;
  }
  function poly(points, fill, parent, extra = {}) {
    return el('polygon', { points: points.map(p => p.join(',')).join(' '), fill, ...extra }, parent);
  }
  function box(parent, x, y, w, d, h, tone, delay = 0) {
    const g = el('g', { class: 'assembled', style: '--delay:' + delay + 's' }, parent);
    const A = [x, y - h], B = [x + w * .866, y + w * .5 - h];
    const C = [x + (w - d) * .866, y + (w + d) * .5 - h], D = [x - d * .866, y + d * .5 - h];
    const down = p => [p[0], p[1] + h];
    const [top, front, side] = faces[tone];
    poly([D, C, down(C), down(D)], front, g);
    poly([B, C, down(C), down(B)], side, g);
    poly([A, B, C, D], top, g);
    return g;
  }
  function line(parent, d, color = '#657F91', delay = .25, dashed = false) {
    return el('path', { d, fill: 'none', stroke: color, 'stroke-width': 1.3,
      class: dashed ? '' : 'draw', ...(dashed ? {} : { pathLength: 1 }),
      ...(dashed ? { 'stroke-dasharray': '4 6' } : {}), style: '--delay:' + delay + 's' }, parent);
  }
  function flow(parent, d) {
    el('path', { d, fill: 'none', stroke: '#5EEAD4', 'stroke-width': 2.2, class: 'flow' }, parent);
  }
  function dots(svg, id, width, height) {
    const defs = el('defs', {}, svg);
    const pattern = el('pattern', { id, width: 14, height: 14, patternUnits: 'userSpaceOnUse' }, defs);
    el('circle', { cx: 2, cy: 2, r: .9, fill: '#A9B9CF', opacity: .22 }, pattern);
    el('rect', { x: 35, y: 75, width, height, fill: 'url(#' + id + ')', opacity: .45 }, svg);
  }
  function shadow(svg, x, y, rx, ry) {
    el('ellipse', { cx: x, cy: y, rx, ry, fill: '#020714', opacity: .48 }, svg);
  }
  function incident(svg) {
    dots(svg, 'incident-dots', 525, 286);
    shadow(svg, 304, 263, 140, 46);
    // The incident stays unresolved. The amber block is an alert, not a result.
    box(svg, 295, 145, 146, 107, 24, 'navy', .08);
    box(svg, 296, 137, 94, 94, 89, 'amber', .2);
    const pause = el('g', { class: 'assembled', style: '--delay:.2s' }, svg);
    poly([[243,123],[251,127],[251,158],[243,154]], '#0B1220', pause);
    poly([[258,130],[266,134],[266,165],[258,161]], '#0B1220', pause);
    line(svg, 'M206 61H266L300 88', '#FBBF24', .32);
    shadow(svg, 151, 284, 62, 21);
    box(svg, 140, 234, 74, 62, 14, 'navy', .2);
    box(svg, 140, 221, 63, 55, 17, 'slate', .38);
    box(svg, 140, 204, 63, 55, 17, 'teal', .52);
    line(svg, 'M101 258H59V278', '#657F91', .72);
    shadow(svg, 471, 306, 63, 22);
    box(svg, 467, 261, 92, 70, 13, 'navy', .28);
    box(svg, 467, 248, 83, 61, 13, 'white', .48);
    box(svg, 467, 235, 83, 61, 13, 'slate', .62);
    box(svg, 467, 222, 83, 61, 13, 'white', .76);
    line(svg, 'M500 296V311H486', '#657F91', .9);
    line(svg, 'M183 266L284 326L399 284', '#40566B', .82);
    flow(svg, 'M183 266L284 326L399 284');
    line(svg, 'M325 269L284 326', '#657F91', .88);
    el('circle', { cx: 284, cy: 338, r: 20, fill: '#162235', stroke: '#5EEAD4', 'stroke-width': 1.4 }, svg);
    el('circle', { cx: 284, cy: 332, r: 4.5, fill: 'none', stroke: '#B8F9ED', 'stroke-width': 1.5 }, svg);
    el('path', { d: 'M275 346a9 9 0 0 1 18 0', fill: 'none', stroke: '#B8F9ED', 'stroke-width': 1.5 }, svg);
  }
  function platform(svg) {
    dots(svg, 'platform-dots', 530, 225);
    shadow(svg, 228, 269, 147, 38);
    // The knowledge foundation draws before its document slabs.
    box(svg, 196, 195, 175, 105, 21, 'navy', .05);
    box(svg, 195, 197, 118, 85, 17, 'slate', .2);
    box(svg, 195, 179, 118, 85, 17, 'white', .35);
    box(svg, 195, 161, 118, 85, 17, 'white', .5);
    box(svg, 195, 143, 118, 85, 17, 'teal', .65);
    shadow(svg, 447, 280, 63, 16);
    box(svg, 447, 174, 87, 87, 75, 'teal', .55);
    line(svg, 'M350 120H365L386 134', '#5EEAD4', .7);
    line(svg, 'M163 75H172L194 106', '#657F91', .5);
    const route = 'M259 220L329 260L399 219';
    line(svg, route, '#40566B', .85);
    flow(svg, route);
    const output = 'M524 190L574 219H650';
    line(svg, output, '#40566B', 1.0);
    flow(svg, output);
    // Retrieved passage tiles explain the handoff from knowledge to a cited plan.
    const passage = box(svg, 333, 251, 25, 20, 12, 'white', .9);
    passage.setAttribute('opacity', '.9');
  }
  function roadmap(svg) {
    line(svg, 'M265 144L475 109M620 107L863 81', '#657F91', .25, true);
    shadow(svg, 165, 214, 96, 16);
    shadow(svg, 548, 203, 96, 16);
    shadow(svg, 932, 187, 96, 16);
    box(svg, 160, 88, 150, 95, 18, 'navy', .08);
    box(svg, 541, 75, 150, 95, 32, 'navy', .32);
    box(svg, 925, 58, 150, 95, 45, 'navy', .55);
    for (let row = 0; row < 2; row++) for (let col = 0; col < 3; col++) {
      box(svg, 150 + col * 24 - row * 21, 86 + col * 14 + row * 12, 20, 20, 20, col === 0 ? 'teal' : 'white', .25 + col * .08 + row * .05);
    }
    box(svg, 537, 73, 53, 53, 49, 'teal', .58);
    box(svg, 600, 109, 20, 20, 19, 'white', .73);
    box(svg, 624, 122, 20, 20, 19, 'white', .82);
    // Future steps are amber and unmarked: no completed-pilot checkmarks.
    box(svg, 926, 45, 58, 58, 52, 'amber', .84);
    box(svg, 990, 80, 25, 25, 27, 'slate', 1.0);
  }
  function start() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const preview = new URLSearchParams(window.location.search).get('motion') === 'preview';
    if (reduced || (navigator.webdriver && !preview)) document.documentElement.classList.add('bw-static');
    else if (preview) document.documentElement.classList.remove('bw-static');
    const renderers = { incident, platform, roadmap };
    document.querySelectorAll('svg[data-scene]').forEach(svg => renderers[svg.dataset.scene](svg));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
