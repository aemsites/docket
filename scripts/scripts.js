import { loadArea, loadBlock, setConfig } from './nx.js';

// What locales do you wish to support
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

const loadNav = async (name, position) => {
  const main = document.querySelector('main');
  const nav = document.createElement('nav');
  nav.dataset.status = 'decorated';
  nav.className = name;
  main.insertAdjacentElement(position, nav);
  await loadBlock(nav);
};

setConfig({ locales, widgets, decorateArea });
await loadNav('sitenav', 'beforebegin');
await loadArea({ area: document });
await loadNav('pagenav', 'afterend');
