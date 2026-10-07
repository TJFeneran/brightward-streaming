'use strict';
// Relevance is assessed by the model. This only locates its verified quote in rendered text.
const NorthstarHighlights = (() => {
  function documentMatches(root, passages) {
    root.querySelectorAll('mark.source-match').forEach(mark => mark.replaceWith(...mark.childNodes));
    root.normalize();
    let matches = 0;
    for (const passage of passages) {
      const rendered = document.createElement('div');
      NorthstarMarkdown.render(rendered, passage);
      const quote = rendered.textContent.replace(/\s/g, '');
      if (!quote) continue;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: node => node.parentElement.closest('.source-metadata') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      });
      const positions = []; let text = '', node;
      while ((node = walker.nextNode())) {
        for (let i = 0; i < node.length; i++) {
          if (/\s/.test(node.data[i])) continue;
          text += node.data[i]; positions.push({node, offset:i});
        }
      }
      let start = text.indexOf(quote);
      const ranges = [];
      while (start !== -1) {
        const end = start + quote.length - 1;
        let first = start;
        for (let i = start; i <= end; i++) {
          if (i === end || positions[i + 1].node !== positions[i].node) {
            ranges.push({node:positions[first].node, start:positions[first].offset, end:positions[i].offset + 1});
            first = i + 1;
          }
        }
        matches++; start = text.indexOf(quote, end + 1);
      }
      // Work backward so text offsets stay valid when a text node is split.
      for (const part of ranges.reverse()) {
        const range = document.createRange(); range.setStart(part.node, part.start); range.setEnd(part.node, part.end);
        const mark = document.createElement('mark'); mark.className = 'source-match'; range.surroundContents(mark);
      }
    }
    return matches;
  }
  function scrollToMatch(root) {
    root.querySelector('.source-match')?.scrollIntoView({block:'center', behavior:'auto'});
  }
  return {documentMatches, scrollToMatch};
})();
