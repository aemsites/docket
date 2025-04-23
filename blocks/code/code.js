import observe from '../../scripts/utils/intOb.js';

const prism = import('prismjs');
const languages = {
  javascript: { name: 'javascript' },
  curl: { name: 'bash' },
  css: { name: 'css' },
};

function decorateTabs(tabsRow) {
  tabsRow.classList.add('code-tabs-container');

  const tabsList = tabsRow.querySelector('ul');
  tabsList.classList.add('code-tabs-list');

  const tabs = [...tabsList.querySelectorAll('li')];
  return tabs.map((tab) => tab.textContent.toLowerCase().trim());
}

async function decorate(el) {
  await prism;

  const rows = [...el.querySelectorAll(':scope > div')];

  const tabsRow = rows.shift();
  const tabsArr = decorateTabs(tabsRow);

  const highlights = rows.map(async (row, idx) => {
    const type = tabsArr[idx];
    const lang = languages[type];
    if (!lang) throw Error('Language not supported');

    if (!lang.module) lang.module = import(`/deps/prismjs/components/prism-${lang.name}.min.js`);
    await lang.module;

    const code = row.querySelector('code');
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
