'use strict';
const $ = id => document.getElementById(id);
let ready = false, busy = false, currentSources = [], currentChangeIds = [], currentChanges = [], activeSource = null, docLoaded = false, activePassages = [];
let evidenceId = '', sourceVisit = 0, briefQuestion = ''; 
const relevanceCache = new Map();
function setBusy(value) {
  busy = value;
  document.querySelectorAll('[data-investigate]').forEach(button => { button.disabled = value; });
}
function showView() {
  const triage = location.hash === '#triage';
  $('monitoring-view').hidden = triage; $('triage-view').hidden = !triage;
  $('monitoring-link').toggleAttribute('aria-current', !triage);
  $('triage-link').toggleAttribute('aria-current', triage);
  (triage ? $('triage-link') : $('monitoring-link')).setAttribute('aria-current', 'page');
  document.title = `Brightward · ${triage ? 'Incident triage' : 'Operations overview'}`;
}
window.addEventListener('hashchange', showView);
showView();
async function investigateAlert(scenario) {
  if (busy) return;
  $('scenario').value = scenario;
  location.hash = 'triage'; showView();
  await loadSample();
  if (!$('triage-view').hidden) {
    $('incident').focus(); $('incident').setSelectionRange(0, 0); $('incident').scrollTop = 0;
  }
}
async function api(path, options = {}) {
  const response = await fetch(path, options);
  const value = await response.json();
  if (!response.ok) throw new Error(typeof value.detail === 'string' ? value.detail : 'Check the incident and question, then try again.');
  return value;
}
function message(text = '', error = false) {
  $('message').textContent = text; $('message').classList.toggle('error', error);
}
async function checkSetup() {
  try {
    const status = await api('/api/status'); ready = status.ready;
    if (Number.isInteger(status.knowledge_count)) $('knowledge-count').textContent = `${status.knowledge_count} operational documents`;
    $('status').textContent = status.label; $('status').classList.toggle('ready', ready);
    $('setup-note').hidden = ready; $('generate').disabled = !ready || busy;
  } catch (error) { $('status').textContent = 'Connection unavailable'; message(error.message, true); }
}
function resetBrief() {
  $('source-dialog').close(); sourceVisit++; activeSource = null; docLoaded = false;
  evidenceId = ''; relevanceCache.clear(); activePassages = [];
  $('brief').replaceChildren(); $('source-list').replaceChildren();
  $('brief').hidden = $('evidence').hidden = true; $('empty').hidden = false;
  $('result-label').textContent = 'Awaiting context'; currentSources = [];
}
async function loadSample() {
  if (busy || !$('scenario').value) return;
  setBusy(true); resetBrief();
  currentChangeIds = []; currentChanges = [];
  $('incident').value = $('question').value = '';
  $('incident').disabled = $('question').disabled = true;
  message('Loading incident context…');
  $('load-sample').disabled = $('scenario').disabled = $('generate').disabled = true;
  try {
    const sample = await api(`/api/sample?scenario=${encodeURIComponent($('scenario').value)}`);
    $('incident').value = sample.incident; $('question').value = sample.question;
    // Retain candidate metadata for the synthetic source pills after generation.
    currentChanges = (sample.changes || []).filter(change => change.relevance === 'Possible contributor');
    currentChangeIds = currentChanges.map(change => change.id);
    message();
  } catch (error) { message(error.message, true); }
  finally { setBusy(false); $('load-sample').disabled = $('scenario').disabled = $('incident').disabled = $('question').disabled = false; $('generate').disabled = !ready; }
}
$('load-sample').addEventListener('click', loadSample);
$('scenario').addEventListener('change', loadSample);
function citeButton(number, statement = '') {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'cite';
  button.textContent = number; button.setAttribute('aria-label', `Inspect source ${number}`);
  button.addEventListener('click', () => openSource(number, statement)); return button;
}
function plainText(text) { return text.replace(/filecite[^]*/g, '').replace(/\*\*/g, '').trim(); }
function render(result) {
  currentSources = result.sources; evidenceId = result.evidence_id || ''; briefQuestion = $('question').value; let offset = 0;
  const annotations = result.annotations || [];
  // Offsets remain in the original model text; only visible text loses markup.
  for (const line of result.text.split('\n')) {
    const start = offset, end = offset + line.length; offset = end + 1;
    const heading = /^##\s+/.test(line), bullet = /^\s*[-*]\s/.test(line);
    const content = plainText(line.replace(/^##\s+/, '').replace(/^\s*[-*]\s/, ''));
    if (!content) continue;
    const node = document.createElement(heading ? 'h3' : 'p'); node.textContent = content;
    if (heading && content.toLowerCase() === 'possible reasons' && currentChangeIds.length) {
      const source = document.createElement('span'); source.className = 'github-source-tag';
      source.textContent = 'GitHub PRs'; node.append(' ', source);
    }
    if (heading && content.toLowerCase() === 'resolution path') node.className = 'resolution';
    if (bullet) node.className = 'bullet';
    const cited = [...new Set(annotations.filter(a => a.index >= start && a.index <= end).map(a => a.source))];
    cited.forEach(number => node.append(' ', citeButton(number, content))); $('brief').append(node);
  }
  for (const source of currentSources) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'source-button';
    const number = document.createElement('span'); number.textContent = `[${source.number}]`;
    button.append(number, source.title); button.addEventListener('click', () => openSource(source.number));
    $('source-list').append(button);
  }
  for (const change of currentChanges) {
    const pill = document.createElement('a'); pill.className = 'source-button pr-source';
    pill.setAttribute('role', 'link'); pill.setAttribute('aria-disabled', 'true'); pill.tabIndex = 0;
    pill.title = change.repository;
    pill.setAttribute('aria-label', `GitHub PR #${change.number}: ${change.title}. ${pill.title}`);
    const number = document.createElement('span'); number.textContent = `PR #${change.number}`;
    const arrow = document.createElement('span'); arrow.className = 'pr-source-arrow';
    arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
    pill.append(number, change.title, ' ', arrow);
    $('source-list').append(pill);
  }
  $('brief').hidden = $('evidence').hidden = false; $('empty').hidden = true;
  $('result-label').textContent = 'Ready for review';
}
async function openSource(number, statement = '') {
  const source = currentSources.find(item => item.number === number); if (!source) return;
  const visit = ++sourceVisit;
  activeSource = source; docLoaded = false; $('full-document').open = false; $('document-content').textContent = '';
  activePassages = []; $('document-highlight-note').hidden = true;
  $('source-title').textContent = source.title;
  $('source-meta').textContent = `${source.document_id} · v${source.version} · ${source.filename}`;
  $('source-excerpts').replaceChildren();
  for (const excerpt of source.excerpts) { const node = document.createElement('div'); node.className = 'excerpt markdown-body'; NorthstarMarkdown.render(node, excerpt); $('source-excerpts').append(node); }
  $('source-statement').textContent = statement || briefQuestion;
  $('source-relevance-title').textContent = 'Why this passage is relevant';
  const spinner = document.createElement('span'); spinner.className = 'source-loading-spinner'; spinner.setAttribute('aria-hidden', 'true');
  const loadingLabel = document.createElement('span'); loadingLabel.className = 'sr-only'; loadingLabel.textContent = 'Loading passage explanation';
  $('source-highlight-note').replaceChildren(spinner, loadingLabel);
  $('source-dialog').showModal(); $('source-dialog').scrollTop = 0;
  if (!evidenceId) {
    $('source-highlight-note').textContent = 'Generate a new brief to enable passage explanations. The retrieved excerpts are available below.';
    return;
  }
  const key = JSON.stringify([evidenceId, number, statement]);
  try {
    if (!relevanceCache.has(key)) {
      const pending = api('/api/source-relevance', {method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({evidence_id:evidenceId, source:number, statement})});
      relevanceCache.set(key, pending);
      pending.catch(() => relevanceCache.delete(key));
    }
    const relevance = await relevanceCache.get(key);
    if (visit !== sourceVisit || !$('source-dialog').open) return;
    // Verify against the displayed returned excerpts as well as the server's evidence.
    if (relevance.relevant && (!relevance.quote || !source.excerpts.some(excerpt => excerpt.includes(relevance.quote)))) {
      throw new Error('No verified supporting passage was returned. Review the excerpts below.');
    }
    $('source-relevance-title').textContent = relevance.relevant ? 'Why this passage is relevant' : 'Evidence gap';
    $('source-highlight-note').textContent = relevance.explanation;
    activePassages = relevance.relevant ? [relevance.quote] : [];
    const matches = NorthstarHighlights.documentMatches($('source-excerpts'), activePassages);
    if (relevance.relevant && !matches) $('source-highlight-note').textContent += ' The passage could not be highlighted in the formatted view; review the excerpts below.';
    if (docLoaded) highlightDocument();
  } catch (error) {
    if (visit === sourceVisit && $('source-dialog').open) $('source-highlight-note').textContent = error.message;
  }
}
function highlightDocument() {
  const matches = NorthstarHighlights.documentMatches($('document-content'), activePassages);
  $('document-highlight-note').hidden = !activePassages.length;
  $('document-highlight-note').textContent = matches ? 'Highlighted passage from the retrieved evidence.' : 'The retrieved passage could not be matched to this local document. Refer to the excerpts above.';
  if ($('source-dialog').open && $('full-document').open) NorthstarHighlights.scrollToMatch($('document-content'));
}
$('source-dialog').addEventListener('close', () => { if (!$('source-dialog').open) sourceVisit++; });
$('close-source').addEventListener('click', () => $('source-dialog').close());
$('source-dialog').addEventListener('click', event => { if (event.target === $('source-dialog')) { const r = event.target.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.target.close(); } });
$('full-document').addEventListener('toggle', async () => {
  if (!$('full-document').open || docLoaded || !activeSource) return;
  const visit = sourceVisit; $('document-content').textContent = 'Loading document…';
  try { const document = await api(`/api/documents/${encodeURIComponent(activeSource.document_id)}`); if (visit === sourceVisit) {
      NorthstarMarkdown.render($('document-content'), document.content, {fullDocument:true});
      docLoaded = true; highlightDocument();
    } }
  catch (error) { if (visit === sourceVisit) $('document-content').textContent = error.message; }
});
$('triage-form').addEventListener('submit', async event => {
  event.preventDefault(); if (!ready || busy) return;
  setBusy(true); resetBrief(); $('empty').hidden = true; $('generate').disabled = true; $('load-sample').disabled = true;
  $('scenario').disabled = $('incident').disabled = $('question').disabled = true; document.querySelector('.output').setAttribute('aria-busy', 'true');
  $('result-label').textContent = 'Working'; const start = Date.now();
  const tick = () => message(`Generating a cited brief… ${Math.floor((Date.now() - start) / 1000)}s`);
  tick(); const timer = setInterval(tick, 1000);
  try {
    const result = await api('/api/triage', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({incident:$('incident').value, question:$('question').value, scenario:$('scenario').value || null, change_ids:currentChangeIds})});
    clearInterval(timer); message(); render(result);
  } catch (error) { clearInterval(timer); message(error.message, true); $('empty').hidden = false; $('result-label').textContent = 'Needs attention'; }
  finally { setBusy(false); $('generate').disabled = !ready; $('load-sample').disabled = !$('scenario').value; $('scenario').disabled = $('incident').disabled = $('question').disabled = false; document.querySelector('.output').setAttribute('aria-busy', 'false'); }
});
checkSetup();
