#!/usr/bin/env node
'use strict';

// Use the pinned local CLI and bridge its Claude-era starter to Codex.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const kit = path.join(root, 'fslides/styles/brightward');
process.env.PUPPETEER_CACHE_DIR ||= path.join(root, 'node_modules/.cache/puppeteer');

let args = process.argv.slice(2);
let cwd = process.cwd();
if (args[0] === '--deck') {
  if (!args[1]) throw new Error('--deck requires a directory.');
  cwd = path.resolve(cwd, args[1]);
  args = args.slice(2);
}
const cli = path.join(path.dirname(require.resolve('fslides/package.json')), 'bin/cli.js');
const skillNames = [
  'fslides-deck', 'fslides-style', 'fslides-density', 'fslides-clean-deck',
  'fslides-export', 'fslides-live-demo', 'fslides-verify', 'fslides-style-brightward',
];

function useCodexSkill(deckDir) {
  const oldSkill = path.join(deckDir, '.claude/skills/fslides-style-brightward');
  const newSkill = path.join(deckDir, '.agents/skills/fslides-style-brightward');
  if (!fs.existsSync(oldSkill)) return;
  if (!fs.existsSync(newSkill)) fs.cpSync(kit, newSkill, { recursive: true });
  // Only remove the brief that the upstream style application just generated.
  fs.rmSync(oldSkill, { recursive: true });
  for (const dir of [path.dirname(oldSkill), path.dirname(path.dirname(oldSkill))]) {
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  }
  console.log('Brightward guide available to Codex at .agents/skills/fslides-style-brightward.');
}

function fixStarter(deckDir) {
  const file = path.join(deckDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  pkg.name = path.basename(deckDir).toLowerCase().replace(/[^a-z0-9-]/g, '-');
  pkg.devDependencies ||= {};
  delete pkg.devDependencies['fuck-slides'];
  pkg.devDependencies.fslides = require('fslides/package.json').version;
  pkg.scripts = Object.fromEntries(Object.entries(pkg.scripts || {}).map(([key, value]) =>
    [key, value.replace(/\bfuckslides\b/g, 'fslides')]));
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
  useCodexSkill(deckDir);
}

function repairBrightwardExport(deckDir, outputName) {
  const cfgPath = ['fslides.config.js', 'fuckslides.config.js']
    .map(file => path.join(deckDir, file)).find(fs.existsSync);
  const config = require(cfgPath);
  if (config.style !== 'brightward') return;
  const out = path.join(deckDir, outputName || (config.name || 'presentation') + '.html');
  const html = fs.readFileSync(out, 'utf8');
  const marker = /^window\.FUCKSLIDES_CONTENTS\s*= (.*);$/m;
  const match = marker.exec(html);
  if (!match) throw new Error('Export contents could not be located.');
  const contents = JSON.parse(match[1]);
  for (const [file, content] of Object.entries(contents)) {
    contents[file] = content.replace(/url\(['"]?(fonts\/[A-Za-z0-9-]+\.ttf)['"]?\)/g, (original, font) => {
      const source = path.join(deckDir, config.slidesDir || 'slides', 'style', font);
      if (!fs.existsSync(source)) throw new Error('Missing export font: ' + font);
      return 'url("data:font/ttf;base64,' + fs.readFileSync(source).toString('base64') + '")';
    }).replace(/(<script\b[^>]*\bsrc=['"])data:application\/octet-stream;base64,/g, '$1data:text/javascript;base64,');
  }
  const json = JSON.stringify(contents).replace(/<\/(script)/gi, '<\\/$1');
  fs.writeFileSync(out, html.replace(marker, () => 'window.FUCKSLIDES_CONTENTS = ' + json + ';'));
  console.log('Brightward export: local fonts embedded and script MIME types corrected.');
}

async function doctor() {
  console.log('fslides ' + require('fslides/package.json').version + ' (project-local)');
  for (const name of skillNames) {
    const file = path.join(root, '.agents/skills', name, 'SKILL.md');
    if (!fs.existsSync(file)) throw new Error('Missing Codex skill: ' + name);
  }
  console.log(skillNames.length + ' Codex skills installed.');
  const meta = JSON.parse(fs.readFileSync(path.join(kit, 'style.json'), 'utf8'));
  if (meta.name !== 'brightward') throw new Error('Invalid Brightward style kit.');
  for (const file of ['brightward.css', 'brightward.js', 'fonts/Sora-500.ttf',
    'fonts/Inter-400.ttf', 'fonts/Inter-500.ttf', 'fonts/Inter-600.ttf', 'fonts/IBM-Plex-Mono-400.ttf']) {
    if (!fs.existsSync(path.join(kit, 'assets', file))) throw new Error('Missing style asset: ' + file);
  }
  console.log('Brightward style assets and local fonts available.');
  const puppeteer = require('puppeteer');
  const options = { headless: true };
  if (process.env.PUPPETEER_EXECUTABLE_PATH) options.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  const browser = await puppeteer.launch(options);
  console.log('Headless browser ready: ' + await browser.version());
  await browser.close();
  console.log('No project deck has been created by this check.');
}

async function main() {
  if (args[0] === 'doctor') return doctor();
  if (args[0] === 'browser' && args[1] === 'install') {
    const browserCli = path.join(path.dirname(require.resolve('puppeteer/package.json')), 'lib/cjs/puppeteer/node/cli.js');
    const result = spawnSync(process.execPath, [browserCli, 'browsers', 'install', 'chrome'], { env: process.env, stdio: 'inherit' });
    if (result.error) throw result.error;
    process.exitCode = result.status || 0;
    return;
  }
  if (!args.length || args[0] === '--help' || args[0] === '-h') {
    console.log('Project-local fslides: npm run slides -- [--deck DIRECTORY] COMMAND [ARGS]');
    console.log('Commands: create, style, serve, add-slide, export, pdf, pptx, build, doctor');
    console.log('Brightward kit: create NAME --style brightward, or --deck DIR style use brightward');
    console.log('Manual setup guide: fslides/README.md');
    return;
  }
  if (['style', 'kit'].includes(args[0]) && (!args[1] || args[1] === 'list')) {
    console.log('brightward  Aurora + Modern clarity with precise technical diagrams [project-local]');
    return;
  }
  const styleIndex = args.indexOf('--style');
  if (styleIndex >= 0 && args[styleIndex + 1] === 'brightward') args[styleIndex + 1] = kit;
  const applyingKit = ['style', 'kit'].includes(args[0]) && args[1] === 'use' && args[2] === 'brightward';
  if (applyingKit) args[2] = kit;
  const result = spawnSync(process.execPath, [cli, ...args], { cwd, env: process.env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) { process.exitCode = result.status || 1; return; }
  if (args[0] === 'create') fixStarter(path.resolve(cwd, args[1]));
  if (applyingKit) useCodexSkill(cwd);
  if (args[0] === 'export') repairBrightwardExport(cwd, args[1] && !args[1].startsWith('-') ? args[1] : undefined);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
