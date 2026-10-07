#!/usr/bin/env node
'use strict';
// Count visible words per slide at a density level.
// Usage (deck dir, `fslides serve` running): node words.js [slide.html ...] [--density 3] [--over 100] [--url URL]
const { deck, args, launch, base, slides, savedDensity, load } = require('./lib');
const { cwd, config, puppeteer } = deck(), o = args();
const url = base(config, o), list = slides(config, o);
(async () => {
  const b = await launch(puppeteer), p = await b.newPage();
  await p.setViewport({ width: 1280, height: 720 });
  const rows = []; let total = 0;
  for (const f of list) {
    const level = o.density || savedDensity(cwd, config, f);
    await load(p, `${url}/${f}?density=${level}`);
    await new Promise(r => setTimeout(r, +(process.env.WAIT || 1800)));
    const n = await p.evaluate(() => (document.body.innerText || '').split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length);
    rows.push([f, n]); total += n;
  }
  rows.sort((a, c) => c[1] - a[1]);
  for (const [f, n] of rows) if (!o.over || n > o.over) console.log(String(n).padStart(5), ' ', f);
  console.log(`\n${rows.length} slides · ${total} words at density ${o.density || 'saved levels'} · avg ${Math.round(total / (rows.length || 1))}`);
  await b.close();
})().catch(error => { console.error(error.message); process.exit(1); });
