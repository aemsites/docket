import { loadStyle } from '../../scripts/nx.js';
import observe from '../../scripts/utils/intOb.js';

let prism;
const languages = {
  javascript: { name: 'javascript' },
  curl: { name: 'bash' },
};

async function decorate(el) {
  if (!prism) prism = import('prismjs');
  await prism;

  const titleRows = [...el.querySelectorAll(':scope > div:nth-child(odd)')];
  const highlights = titleRows.map(async (row) => {
    const type = row.textContent.toLowerCase().trim();
    const lang = languages[type];
    if (!lang) throw Error('Language not supported');

    if (!lang.module) lang.module = import(`/deps/prismjs/components/prism-${lang.name}.js`);
    await lang.module;

    const pre = row.nextElementSibling.querySelector('pre');
    const code = pre.querySelector('code');
    code.classList.add(`language-${lang.name}`);

    return new Promise((resolve) => {
      window.Prism.highlightElement(code, false, () => { resolve(); });
    });
  });

  await Promise.all(highlights);
  el.classList.add('is-highlighted');
}

export default async function init(el) {
  observe(el, decorate);
}
