// UI-only model mocks. Backend tests prove no fabricated RDS context is injected.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1050}});
    const errors = [], requests = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('https://fonts.googleapis.com/**', r => r.abort());
    await page.route('**/api/status', r => r.fulfill({json:{ready:true,label:'UI TEST · NOT LIVE'}}));
    await page.route('**/api/triage', async r => {
      const body = r.request().postDataJSON(); requests.push(body);
      await r.fulfill({json:{text:'## Resolution path\nUI TEST: verify current configuration before a change.\n## Missing evidence\nEffective pool settings, session state, memory and impact remain unknown.',sources:[],annotations:[]}});
    });
    const output = path.join(__dirname,'../test-results'); fs.mkdirSync(output,{recursive:true});
    await page.goto((process.env.BASE_URL || 'http://127.0.0.1:8000')+'/#triage');
    const load = async scenario => {
      await page.locator('#scenario').selectOption(scenario);
      await page.waitForFunction(() => !document.getElementById('scenario').disabled && document.getElementById('incident').value);
    };
    const generate = async () => {
      await page.getByRole('button',{name:/Generate triage brief/}).click();
      await page.getByText('Ready for review',{exact:true}).waitFor();
    };
    await load('database');
    assert.equal(await page.locator('#followup-panel, #collect-evidence').count(),0);
    assert.equal(await page.getByText('Find the missing evidence').count(),0);
    assert.equal(requests.length,0);
    await generate();
    assert.equal(requests[0].scenario,'database');
    assert(!('followup_evidence_id' in requests[0]));
    assert.deepEqual(requests[0].change_ids,['database-318','database-311']);
    assert.equal(await page.locator('#brief-evidence-note').count(),0);
    await page.screenshot({path:path.join(output,'rds-default-desktop.png'),fullPage:true});
    await page.setViewportSize({width:390,height:844});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({path:path.join(output,'rds-default-mobile.png'),fullPage:true});
    await page.locator('#load-sample').click();
    await page.waitForFunction(() => !document.getElementById('scenario').disabled);
    assert.equal(await page.locator('#brief-evidence-note').count(),0);
    await generate();
    assert.equal(await page.locator('#brief-evidence-note').count(),0);
    await load('compute');
    assert.equal(await page.locator('#brief-evidence-note').count(),0);
    await generate();
    assert.equal(await page.locator('#brief-evidence-note').count(),0);
    await load('database');
    await generate();
    assert.equal(await page.locator('#brief-evidence-note').count(),0);
    assert.deepEqual(errors,[]);
    console.log('PASS: original RDS flow without injected evidence or approval note, explicit generation, reload/switch isolation and mobile layout.');
  } finally { await browser.close(); }
})().catch(e => {console.error(e);process.exit(1)});
