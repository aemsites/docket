import { loadArea, loadStyle, loadBlock, setConfig } from './nx.js';

// Supported locales
const locales = {
  '': { ietf: 'en', tk: 'etj3wuq.css' },
  '/de': { ietf: 'de', tk: 'etj3wuq.css' },
};

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

const loadNav = async (name) => {
  const position = name === 'sitenav' ? 'beforebegin' : 'afterend';
  const main = document.querySelector('main');
  const nav = document.createElement('nav');
  nav.dataset.status = 'decorated';
  nav.className = name;
  main.insertAdjacentElement(position, nav);
  await loadBlock(nav);
};

(async function loadPage() {
  setConfig({ locales, widgets, decorateArea });

  loadNav('sitenav');
  await loadArea();
  await loadNav('pagenav');
}());
