import { loadArea } from './nx.js';

// What locales do you wish to support
const locales = { '': { ietf: 'en', tk: 'cks7hcz.css' } };

// Widget link patterns to look for
const widgets = [
  { fragment: '/fragments/' },
  { youtube: 'https://www.youtube' },
];

// How to decorate an area before loading it
const decorateArea = (area = document) => {
  const eagerLoad = (parent, selector) => {
    const img = parent.querySelector(selector);
    img?.removeAttribute('loading');
  };

  eagerLoad(area, 'img');
};

const config = { locales, widgets, decorateArea };
loadArea({ config });
