import observe from '../../scripts/utils/intOb.js';

const prism = import('prismjs');
const languages = {
  javascript: { name: 'javascript' },
  curl: { name: 'bash' },
  css: { name: 'css' },
};

function decorateTabs(tabsRow, panels) {
  tabsRow.classList.add('code-tabs-container');

  const tabsList = tabsRow.querySelector('ul');
  tabsList.classList.add('code-tabs-list');

  const tabs = [...tabsList.querySelectorAll('li')];
  return tabs.map((tab, index) => {
    if (index === 0) tab.classList.add('is-active');
    tab.addEventListener('click', () => {
      tabs.forEach((offTab, idx) => {
        offTab.classList.remove('is-active');
        panels[idx].classList.remove('is-active');
      });
      tab.classList.add('is-active');
      panels[index].classList.add('is-active');
    });

    return tab.textContent.toLowerCase().trim();
  });
}

async function decorate(el) {
  await prism;

  const rows = [...el.querySelectorAll(':scope > div')];

  const tabsRow = rows.shift();
  const tabsArr = decorateTabs(tabsRow, rows);

  const tabPanel = document.createElement('div');
  tabPanel.classList.add('code-tabs-panel-container');
  el.append(tabPanel);

  const highlights = rows.map(async (row, idx) => {
    if (idx === 0) row.classList.add('is-active');

    tabPanel.append(row);
    row.classList.add('code-tabs-panel');
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
