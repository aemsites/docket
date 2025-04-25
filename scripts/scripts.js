import { loadArea, setConfig } from './nx.js';

// What locales do you wish to support
const locales = { '': { ietf: 'en', tk: 'cks7hcz.css' } };

// Widget patterns to look for
const widgets = [
  { fragment: '/fragments/' },
  { youtube: 'https://www.youtube' },
];

// How to decorate an area before loading it
const decorateArea = ({ area = document }) => {
  const eagerLoad = (parent, selector) => {
    const img = parent.querySelector(selector);
    img?.removeAttribute('loading');
  };

  eagerLoad(area, 'img');
};

const loadNavs = async () => {
  const main = document.body.querySelector('main');

  const createSiteNav = (await import('../blocks/sitenav/sitenav.js')).default;
  const siteNav = createSiteNav();
  main.insertAdjacentElement('beforebegin', siteNav);

  const createPageNav = (await import('../blocks/pagenav/pagenav.js')).default;
  const pageNav = createPageNav();
  main.insertAdjacentElement('afterend', pageNav);
};

setConfig({ locales, widgets, decorateArea });
await loadArea({ area: document });
if (!document.body.classList.contains('landing-template')) loadNavs();
