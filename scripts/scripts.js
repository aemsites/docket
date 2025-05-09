import { loadArea, loadStyle, loadBlock, setConfig } from './nx.js';

// Supported locales
const locales = { '': { ietf: 'en', tk: 'etj3wuq.css' } };

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
  const { codeBase } = setConfig({ locales, widgets, decorateArea });

  // Load fonts if returning
  const returning = localStorage.getItem('docket-visit');
  if (returning) loadStyle(`${codeBase}/styles/fonts.css`);

  loadNav('sitenav');
  await loadArea();
  await loadNav('pagenav');
}());
