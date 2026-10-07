const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const markdownit = require('../static/vendor/markdown-it.min.js');
const context = vm.createContext({window:{markdownit}});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../static/source-markdown.js'), 'utf8'), context);
const html = (text, options = {}) => {
  context.source = text; context.options = options;
  return vm.runInContext('NorthstarMarkdown.html(source, options)', context);
};
test('renders source structure, emphasis, tables and code', () => {
  const result = html('# Check\n\n**Evidence** and *hypothesis* with `disk_used`\n\n1. Inspect\n2. Compare\n\n> Historical only\n\n| Role | Owner |\n| --- | --- |\n| Compute | SRE |\n\n```text\n<literal>\n```');
  for (const tag of ['h1', 'strong', 'em', 'code', 'ol', 'blockquote', 'table', 'th', 'td', 'pre']) assert.match(result, new RegExp(`<${tag}[ >]`));
  assert.match(result, /&lt;literal&gt;/);
});
test('keeps full-file and excerpt provenance inspectable', () => {
  const text = '---\nid: NS-RB-004\ntitle: Runbook\nowner: <untrusted>\n---\n\n# Runbook';
  const result = html(text, {fullDocument:true});
  assert.match(result, /<summary>Document metadata<\/summary>/);
  assert.match(result, /owner: &lt;untrusted&gt;/);
  assert.match(result, /<h1>Runbook<\/h1>/);
  assert.match(html(text), /<summary>Excerpt metadata<\/summary>/);
  assert.match(html(text), /owner: &lt;untrusted&gt;/);
  assert.match(html('---\nordinary text\n---'), /<h2>ordinary text<\/h2>/);
});
test('does not activate HTML, unsafe links, embedded images or event handlers', () => {
  const result = html('<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert%281%29) [bad](data:text/html,test) [file](file:///etc/passwd)\n\n![tracking](https://example.com/pixel)\n\n[safe](https://example.com "reference")');
  assert.doesNotMatch(result, /<(script|img|iframe|svg)\b|href="(?:javascript|data|file):|<[^>]+\sonerror=/i);
  assert.match(result, /&lt;script&gt;/);
  assert.match(result, /href="https:\/\/example.com"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
});
