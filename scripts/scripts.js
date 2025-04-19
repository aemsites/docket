// What locales do you wish to support
const locales = { '': { ietf: 'en', tk: 'cks7hcz.css' } };

// Widget patterns to look for
const widgets = [
  { fragment: '/fragments/' },
  { youtube: 'https://www.youtube' },
];

// How to decorate an area before loading it
const decorateArea = ({ area } = { area: document }) => {
  const eagerLoad = (parent, selector) => {
    const img = parent.querySelector(selector);
    img?.removeAttribute('loading');
  };

  eagerLoad(area, 'img');
};

export const config = { locales, widgets, decorateArea };
