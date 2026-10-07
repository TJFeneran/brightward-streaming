'use strict';
// A local, scripted replay. No telemetry is fetched and no model call is made here.
(() => {
  const START = Date.parse('2026-10-06T20:10:00Z');
  const SPEED = 8, ALERT_AFTER = 15, DATABASE_AFTER = 45, REFRESH = 5, POINTS = 31;
  const metrics = [
    {id:'traffic', title:'CDN requests', service:'Live video delivery', unit:' / min', min:10000, max:15000, low:'10k', high:'15k', color:'teal'},
    {id:'segments', title:'Segment 404 rate', service:'Live video delivery', unit:'%', min:0, max:5, low:'0%', high:'5%', color:'rose'},
    {id:'latency', title:'Session API · p95', service:'Playback sessions', unit:' ms', min:0, max:1600, low:'0', high:'1.6k ms', color:'teal'},
    {id:'connections', title:'RDS connections', service:'PostgreSQL · bw-catalog-db', unit:' sessions', min:0, max:550, low:'0', high:'550', color:'rose'},
    {id:'poolwait', title:'DB pool wait · p95', service:'Catalog API · connection acquisition', unit:' ms', min:0, max:3200, low:'0', high:'3.2k ms', color:'teal'},
    {id:'disk', title:'Root filesystem', service:'EC2 · ns-session-42', unit:'%', min:60, max:100, low:'60%', high:'100%', color:'amber'},
  ];
  const scenarios = {
    streaming:{title:'Frozen live stream', service:'CloudFront · live video delivery', summary:'Playback freezes; playlists return 200, some segments 404.', observed:'19:42:00', severity:'Critical'},
    database:{title:'RDS connection pressure', service:'Catalog API · bw-catalog-db', summary:'Pool acquisition timeouts; 492 database connections; CPU 34%.', observed:'20:16:00', severity:'Critical'},
    compute:{title:'Unhealthy EC2 application', service:'Playback-session API · ns-session-42', summary:'Application health failing; root filesystem at 96%.', observed:'20:12:00', severity:'Warning'},
  };
  let elapsed = 0, paused = false, alerts = [], logs = [];
  const cards = new Map();
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function svgNode(tag, attributes) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }
  function clock(seconds) { return new Date(START + seconds * SPEED * 1000).toISOString().slice(11, 19); }
  function value(id, seconds) {
    const wave = Math.sin(seconds / 17) * .6 + Math.sin(seconds / 7) * .4;
    if (id === 'traffic') return 12800 + wave * 700;
    if (id === 'segments') return seconds < -210 ? .18 : 2.8 + wave * .35;
    if (id === 'latency') return seconds < ALERT_AFTER ? 230 + wave * 40 : 1140 + wave * 110;
    if (id === 'connections') return seconds < 30 ? 180 + wave * 8 : Math.round(180 + Math.min(1, (seconds - 30) / 15) * 312);
    if (id === 'poolwait') return seconds < 30 ? 40 + wave * 5 : Math.round(40 + Math.min(1, (seconds - 30) / 15) * 2560);
    // The existing compute fixture observes 72% -> 96% over 20 replay minutes.
    const minutesBeforeAlert = (ALERT_AFTER - seconds) * SPEED / 60;
    return Math.min(96, Math.max(72, 96 - minutesBeforeAlert * 1.2));
  }
  function formatted(metric, number) {
    return metric.id === 'traffic' ? (number / 1000).toFixed(1) + 'k' : metric.id === 'segments' ? number.toFixed(1) : Math.round(number).toString();
  }
  for (const metric of metrics) {
    const card = el('article', `panel metric-card metric-${metric.color}`);
    const title = el('h2', '', metric.title), number = el('strong', 'metric-value');
    const badge = el('span', 'metric-condition');
    const heading = el('div', 'metric-heading'); heading.append(title, badge);
    const reading = el('div', 'metric-reading'); reading.append(number, el('span', 'metric-unit', metric.unit));
    const svg = svgNode('svg', {viewBox:'0 0 300 92', role:'img', 'aria-label':`${metric.title} trend`});
    [8, 45, 82].forEach(y => svg.append(svgNode('line', {x1:0, x2:300, y1:y, y2:y, class:'chart-grid'})));
    const area = svgNode('path', {class:'chart-area'}), line = svgNode('path', {class:'chart-line'});
    svg.append(area, line);
    const range = el('div', 'chart-range'); range.append(el('span', '', metric.low), el('span', '', metric.high));
    const times = el('div', 'chart-times'); times.append(el('span'), el('span'));
    card.append(heading, reading, el('p', 'metric-service', metric.service), range, svg, times);
    $('metric-grid').append(card); cards.set(metric.id, {number, badge, svg, area, line, times});
  }
  function renderMetrics() {
    for (const metric of metrics) {
      const card = cards.get(metric.id), current = value(metric.id, elapsed);
      card.number.textContent = formatted(metric, current);
      const degraded = metric.id === 'segments' || (metric.id === 'latency' && elapsed >= ALERT_AFTER) || (['connections', 'poolwait'].includes(metric.id) && elapsed >= DATABASE_AFTER);
      const warning = metric.id === 'disk' && current >= 90;
      card.badge.textContent = degraded ? 'Elevated' : warning ? 'High usage' : 'In range';
      card.badge.className = `metric-condition ${degraded ? 'condition-error' : warning ? 'condition-warning' : ''}`;
      const points = Array.from({length:POINTS}, (_, i) => {
        const v = value(metric.id, elapsed - (POINTS - 1 - i) * REFRESH);
        return `${(i * 300 / (POINTS - 1)).toFixed(1)},${(82 - (v - metric.min) / (metric.max - metric.min) * 74).toFixed(1)}`;
      });
      const path = `M${points.join(' L')}`;
      card.line.setAttribute('d', path); card.area.setAttribute('d', `${path} L300,92 L0,92 Z`);
      card.svg.setAttribute('aria-label', `${metric.title}: ${formatted(metric, current)}${metric.unit}. Synthetic trend over 20 replay minutes.`);
      card.times.firstChild.textContent = clock(elapsed - 150).slice(0, 5);
      card.times.lastChild.textContent = `${clock(elapsed).slice(0, 5)} UTC`;
    }
  }
  function addAlert(scenario, announce = false) {
    const alert = scenarios[scenario]; alerts.push(scenario);
    const row = el('tr'); row.dataset.scenario = scenario;
    const severity = el('td'); severity.append(el('span', `severity severity-${scenario}`, alert.severity));
    const detail = el('td', 'alert-detail'); detail.append(el('strong', '', alert.title), el('span', '', alert.service), el('small', '', alert.summary));
    const state = el('td'); state.append(el('span', 'alert-open', 'Open'));
    const action = el('td'); const button = el('button', 'investigate-button', 'Investigate ↗');
    button.type = 'button'; button.dataset.investigate = scenario; button.disabled = busy;
    button.setAttribute('aria-label', `Investigate ${alert.title}`);
    button.addEventListener('click', () => investigateAlert(scenario)); action.append(button);
    row.append(severity, detail, el('td', 'alert-time', alert.observed), state, action);
    $('alert-rows').prepend(row); $('alert-count').textContent = alerts.length;
    if (announce) $('alert-announcement').textContent = `New simulated alert: ${alert.title}. ${alerts.length} open alerts.`;
  }
  function addLog(seconds, level, service, text) {
    logs.unshift({time:clock(seconds), level, service, text}); logs = logs.slice(0, 8);
  }
  function renderLogs() {
    $('log-list').replaceChildren(...logs.map(log => {
      const row = el('div', 'log-row'); row.setAttribute('role', 'listitem');
      row.append(el('time', 'log-time', log.time), el('span', `log-level log-${log.level.toLowerCase()}`, log.level), el('span', 'log-service', log.service), el('span', 'log-message', log.text));
      return row;
    }));
  }
  function nextLog() {
    const index = Math.floor(elapsed / REFRESH) % 7;
    const entries = [
      ['INFO', 'cloudfront', 'GET /live/main/index.m3u8 → 200 · playlist response'],
      ['WARN', 'cloudfront', 'GET /live/main/segment.ts → 404 · sampled segment unavailable'],
      ['INFO', 'packager', 'Health probe passed · playlist freshness not yet checked'],
      [elapsed >= DATABASE_AFTER ? 'ERROR' : 'INFO', 'catalog-api', elapsed >= DATABASE_AFTER ? 'Connection pool acquisition timeout · p95 2600 ms' : `Pool acquisition p95 ${Math.round(value('poolwait', elapsed))} ms`],
      [elapsed >= DATABASE_AFTER ? 'ERROR' : 'INFO', 'rds-postgres', elapsed >= DATABASE_AFTER ? 'FATAL: remaining connection slots are reserved · bw-catalog-db' : `DatabaseConnections ${Math.round(value('connections', elapsed))} · writer available`],
      [elapsed >= ALERT_AFTER ? 'ERROR' : 'INFO', 'session-api', elapsed >= ALERT_AFTER ? 'GET /health → 503 · application health check failed' : 'GET /health → 200 · application health check passed'],
      [value('disk', elapsed) >= 90 ? 'WARN' : 'INFO', 'ec2-host', `Root filesystem ${Math.round(value('disk', elapsed))}% used · system and instance checks passing`],
    ];
    addLog(elapsed, ...entries[index]); renderLogs();
  }
  function renderState() {
    const suspended = paused || document.hidden;
    $('simulation-state').textContent = suspended ? 'Simulation paused' : 'Simulation running';
    $('pause-simulation').textContent = paused ? 'Resume simulation' : 'Pause simulation';
    $('pause-simulation').setAttribute('aria-pressed', String(paused));
    $('replay-time').textContent = `${clock(elapsed)} UTC`;
    $('replay-time').dateTime = new Date(START + elapsed * SPEED * 1000).toISOString();
    const remaining = (elapsed < ALERT_AFTER ? ALERT_AFTER : DATABASE_AFTER) - elapsed;
    $('alert-schedule').textContent = remaining > 0 ? `Next alert in ${Math.floor(remaining / 60)}m ${String(remaining % 60).padStart(2, '0')}s${suspended ? ' · paused' : ''}` : 'All three demo alerts received';
  }
  function restart() {
    elapsed = 0; alerts = []; logs = []; paused = false;
    $('alert-rows').replaceChildren(); $('alert-announcement').textContent = '';
    addAlert('streaming');
    for (let i = 7; i >= 0; i--) {
      const entries = [
        ['INFO', 'cloudfront', 'GET /live/main/index.m3u8 → 200 · playlist response'],
        ['WARN', 'cloudfront', 'GET /live/main/segment.ts → 404 · sampled segment unavailable'],
        ['INFO', 'packager', 'Health probe passed · playlist freshness not yet checked'],
      ];
      addLog(-i * REFRESH, ...entries[i % entries.length]);
    }
    renderMetrics(); renderLogs(); renderState();
  }
  $('pause-simulation').addEventListener('click', () => { paused = !paused; renderState(); });
  $('restart-simulation').addEventListener('click', restart);
  document.addEventListener('visibilitychange', renderState);
  setInterval(() => {
    if (paused || document.hidden) return;
    elapsed++;
    if (elapsed === ALERT_AFTER) {
      addAlert('compute', true);
      addLog(elapsed, 'ERROR', 'session-api', 'Application health failing · root filesystem 96% · incident opened');
      renderLogs();
    }
    if (elapsed === 30) {
      addLog(elapsed, 'INFO', 'catalog-api', 'Replicas increased 12 → 24 · effective pool configuration unverified');
      renderLogs();
    }
    if (elapsed === DATABASE_AFTER) {
      addAlert('database', true);
      addLog(elapsed, 'ERROR', 'catalog-api', 'Connection pool acquisition timeout · p95 2600 ms · incident opened');
      addLog(elapsed, 'ERROR', 'rds-postgres', 'FATAL: remaining connection slots are reserved · DatabaseConnections 492 · CPU 34%');
      renderLogs();
    }
    if (elapsed % REFRESH === 0) { renderMetrics(); nextLog(); }
    renderState();
  }, 1000);
  restart();
})();
