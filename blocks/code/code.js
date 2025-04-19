import observe from '../../scripts/utils/intOb.js';

async function decorate(el) {
  const { codeToHtml } = await import('https://esm.sh/shiki@3.2.2');

  const titleRows = el.querySelectorAll(':scope > div:nth-child(odd)');
  titleRows.forEach(async (row) => {
    const type = row.textContent.toLowerCase().trim();
    const lang = type === 'javascript' ? 'js' : 'bash';

    const pre = row.nextElementSibling.querySelector('pre');

    pre.parentElement.innerHTML = await codeToHtml(pre.innerText, {
      lang,
      theme: 'slack-dark',
    });
  });
}

export default async function init(el) {
  observe(el, decorate);
}
