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
    brand.textContent = 'BRIGHTWARD';
    const tag = document.createElement('span');
    tag.className = 'bw-tag';
    tag.textContent = document.body.dataset.foot || 'Fictional customer · Synthetic incidents';
    el.append(brand, tag);
    document.body.append(el);
  }
  function start() {
    if (navigator.webdriver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('bw-static');
    }
    footer();
    fit();
    window.addEventListener('resize', fit);
  }
  window.BW = { fit, footer };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
