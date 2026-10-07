'use strict';
// Shared helpers: resolve puppeteer and the deck config from the current directory.
const path = require('path'), fs = require('fs');
const { createRequire } = require('module');

exports.deck = function () {
  const cwd = process.cwd();
  const cfgPath = ['fslides.config.js', 'fuckslides.config.js'].map(f => path.join(cwd, f)).find(fs.existsSync);
  if (!cfgPath) { console.error('Run this from a deck directory (fslides.config.js not found).'); process.exit(1); }
  const config = require(cfgPath);
  const req = createRequire(path.join(cwd, 'package.json'));
  const packageRoot = path.dirname(require.resolve('fslides/package.json', { paths: [cwd, __dirname] }));
  process.env.PUPPETEER_CACHE_DIR ||= path.join(packageRoot, '..', '.cache', 'puppeteer');
  const engineRequire = createRequire(path.join(packageRoot, 'package.json'));
  const puppeteer = engineRequire('puppeteer');
  return { cwd, config, puppeteer };
};

exports.savedDensity = function (cwd, config, file) {
  const html = fs.readFileSync(path.join(cwd, config.slidesDir || 'slides', file), 'utf8');
  const saved = /<html[^>]*data-density=["']([1-5])["']/i.exec(html);
  const def = typeof config.density === 'object' ? config.density.default : typeof config.density === 'number' ? config.density : 3;
  return saved ? +saved[1] : (def || 3);
};

exports.load = async function (page, url) {
  const response = await page.goto(url, { waitUntil: 'load', timeout: 20000 });
  if (response && !response.ok()) throw new Error('Slide load failed: HTTP ' + response.status() + ' at ' + url);
};

exports.args = function () {
  const a = process.argv.slice(2), o = { files: [] };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--density') o.density = +a[++i];
    else if (a[i] === '--over') o.over = +a[++i];
    else if (a[i] === '--out') o.out = a[++i];
    else if (a[i] === '--url') o.url = a[++i];
    else o.files.push(a[i]);
  }
  return o;
};

exports.launch = function (puppeteer) {
  const opts = { headless: true };
  if (process.env.PUPPETEER_EXECUTABLE_PATH) opts.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  return puppeteer.launch(opts);
};

exports.base = (config, o) => (o.url || `http://localhost:${config.port || 3000}`).replace(/\/$/, '');
exports.slides = (config, o) => o.files.length ? o.files : config.slides.filter(s => !(config.disabled || []).includes(s));
