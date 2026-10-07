'use strict';
// No raw HTML, embedded images, plugins, or syntax-highlighter HTML. Only the
// parser's escaped output is inserted; source text is never assigned as HTML.
const NorthstarMarkdown = (() => {
  const md = window.markdownit({html:false, linkify:false, typographer:false});
  md.disable('image');
  const defaultValidateLink = md.validateLink.bind(md);
  md.validateLink = url => /^https?:\/\//i.test(url) && defaultValidateLink(url);
  const defaultLinkOpen = md.renderer.rules.link_open || ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    tokens[index].attrSet('target', '_blank');
    tokens[index].attrSet('rel', 'noopener noreferrer');
    return defaultLinkOpen(tokens, index, options, env, self);
  };
  function html(source, {fullDocument = false} = {}) {
    let body = String(source), metadata = '';
    // Complete YAML provenance can also appear inside a returned chunk.
    // Preserve every field in an inspectable disclosure, not a giant heading.
    {
      const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (match && /^id: /m.test(match[1]) && /^title: /m.test(match[1])) {
        metadata = `<details class="source-metadata"><summary>${fullDocument ? 'Document metadata' : 'Excerpt metadata'}</summary><pre>${md.utils.escapeHtml(match[1])}</pre></details>`;
        body = body.slice(match[0].length);
      }
    }
    return metadata + md.render(body);
  }
  function render(target, source, options) { target.innerHTML = html(source, options); }
  return {html, render};
})();
