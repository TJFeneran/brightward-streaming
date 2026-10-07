(function () {
  'use strict';
  function fit() {
    if (window !== window.top) return;
    const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    Object.assign(document.body.style, {
      transform: 'scale(' + scale + ')', transformOrigin: '0 0',
      left: ((window.innerWidth - 1280 * scale) / 2) + 'px',
      top: ((window.innerHeight - 720 * scale) / 2) + 'px',
    });
  }
  function footer() {
    if (document.body.dataset.foot === 'none' || document.querySelector('.bw-footer')) return;
    const el = document.createElement('footer');
    el.className = 'bw-footer';
    const brand = document.createElement('span');
    brand.className = 'bw-wordmark';
    const icon = document.querySelector('link[rel~="icon"][type="image/svg+xml"]');
    if (icon) {
      const logo = document.createElement('img');
      logo.className = 'bw-logo';
      logo.src = icon.href;
      logo.alt = '';
      logo.width = logo.height = 22;
      brand.append(logo);
    }
    brand.append(document.createTextNode('BRIGHTWARD'));
    const tag = document.createElement('span');
    tag.className = 'bw-tag';
    tag.textContent = document.body.dataset.foot || 'Media streaming · Synthetic incidents';
    el.append(brand, tag);
    document.body.append(el);
  }
  function favicon() {
    const icon = document.querySelector('link[rel~="icon"][type="image/svg+xml"]');
    if (!icon || window === window.parent) return;
    // The player owns the browser tab; use the slide's local icon there too.
    try {
      if (!Array.isArray(window.parent.FUCKSLIDES_SLIDES)) return;
      const head = window.parent.document.head;
      head.querySelectorAll('link[rel~="icon"]').forEach(link => link.remove());
      const link = icon.cloneNode(false);
      link.href = icon.href;
      head.append(link);
    } catch (_) { /* A slide embedded on another origin keeps its own icon. */ }
  }
  function start() {
    if (navigator.webdriver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('bw-static');
    }
    favicon();
    footer();
    fit();
    window.addEventListener('resize', fit);
  }
  window.BW = { fit, footer };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
