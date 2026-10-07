// UI TEST ONLY: mocked model explanations exercise rendering, not model quality.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1280,height:1050}});
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const quote = 'HTTP 200 establishes that a response was served. It does not establish that the live timeline advanced or that every referenced segment is playable.';
  const paragraph = `${quote} A packager liveness check does not test the complete viewer path.`;
  const formatted = '**Origin advances; affected CDN copy does not:** investigate the effective cache behavior, policy, cache key, and recent configuration change.';
  const explanation = 'Successful requests can still return an old playlist. This passage connects frozen playback to checking timeline progression, rather than treating a success status as proof of recovery.';
  const statement = 'Viewers are stuck despite successful requests.';
  const text = `## Next checks\n- ${statement}\n- A merged pull request proves it reached production.\n- Compare the edge with the publishing service.\n`;
  const source = {number:1, document_id:'NS-RB-001', version:'2.1', title:'Live HLS playlist freshness', filename:'01-playlist-freshness.md', excerpts:[`UI TEST — not a live response.\n\n${paragraph}\n\n- ${formatted}\n\n<script>window.injected=true</script>`]};
  let calls = 0, resolveSlow, slowStarted;
  const started = new Promise(resolve => slowStarted = resolve);
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('**/api/status', route => route.fulfill({json:{ready:true,label:'UI TEST · NOT LIVE'}}));
  await page.route('**/api/triage', route => route.fulfill({json:{text, evidence_id:'ui-test-only', sources:[source], annotations:[
    {index:text.indexOf(statement) + statement.length,source:1},
    {index:text.indexOf('\n- Compare'),source:1}, {index:text.length - 1,source:1}
  ]}}));
  await page.route('**/api/source-relevance', async route => {
    calls++;
    const body = route.request().postDataJSON();
    assert.equal(body.evidence_id, 'ui-test-only');
    assert.equal(body.source, 1);
    if (body.statement.includes('merged')) return route.fulfill({json:{relevant:false,quote:'',explanation:'The runbook does not establish whether this change was deployed.'}});
    if (body.statement.includes('publishing')) {
      slowStarted(); await new Promise(resolve => resolveSlow = resolve);
      return route.fulfill({json:{relevant:true,quote:formatted,explanation:'Delayed UI TEST explanation.'}});
    }
    await route.fulfill({json:{relevant:true,quote,explanation}});
  });
  await page.goto(`${process.env.BASE_URL || 'http://127.0.0.1:8000'}/#triage`);
  await page.locator('#scenario').selectOption('streaming');
  await page.waitForFunction(() => document.getElementById('incident').value.includes('19:42'));
  await page.getByRole('button', {name:/Generate triage brief/}).click();
  const citations = page.getByRole('button', {name:'Inspect source 1',exact:true});
  await citations.nth(0).click();
  await page.getByText(explanation, {exact:true}).waitFor();
  assert.equal(await page.locator('#source-statement').innerText(), statement);
  assert.equal(await page.locator('#source-excerpts mark').innerText(), quote);
  assert.equal(await page.evaluate(() => window.injected), undefined);
  fs.mkdirSync('test-results', {recursive:true});
  await page.screenshot({path:'test-results/semantic-relevance-desktop.png'});
  await page.getByText('Read full knowledge document', {exact:true}).click();
  await page.locator('#document-content mark').waitFor();
  assert.equal(await page.locator('#document-content mark').innerText(), quote);
  await page.keyboard.press('Escape');
  await citations.nth(0).click();
  await page.getByText(explanation, {exact:true}).waitFor();
  assert.equal(calls, 1, 'same citation reuses its explanation');
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({path:'test-results/semantic-relevance-mobile.png'});
  await page.keyboard.press('Escape');
  await citations.nth(2).click(); await started;
  await page.keyboard.press('Escape');
  await citations.nth(1).click();
  await page.getByRole('heading', {name:'Evidence gap',exact:true}).waitFor();
  assert.equal(await page.locator('#source-excerpts mark').count(), 0);
  const oldResponse = page.waitForResponse(response => response.url().endsWith('/api/source-relevance') && response.request().postDataJSON().statement.includes('publishing'));
  resolveSlow(); await oldResponse;
  assert.equal(await page.locator('#source-relevance-title').innerText(), 'Evidence gap');
  await page.keyboard.press('Escape');
  await citations.nth(2).click();
  await page.getByText('Delayed UI TEST explanation.', {exact:true}).waitFor();
  assert((await page.locator('#source-excerpts mark').allTextContents()).join('').includes('Origin advances; affected CDN copy does not:'));
  await page.getByText('Read full knowledge document', {exact:true}).click();
  await page.locator('#document-content mark').first().waitFor();
  assert((await page.locator('#document-content mark').allTextContents()).join('').includes('investigate the effective cache behavior'));
  assert.equal(calls, 3, 'pending result is cached after closing');
  assert.deepEqual(errors, []);
  console.log('PASS: paraphrased statement, exact passage highlighting, full document, formatted quote, no-support state, stale response suppression, cache, Escape, mobile and safe HTML. Model output mocked.');
  await browser.close();
})().catch(error => {console.error(error);process.exit(1)});
