import { getConfig, loadBlock, loadStyle } from './nx.js';

const { codeBase } = getConfig();

(async function loadPostLCP() {
  const returning = localStorage.getItem('docket-visit');
  if (!returning) {
    loadStyle(`${codeBase}/styles/fonts.css`);
    localStorage.setItem('docket-visit', 'true');
  }
  const header = document.querySelector('header');
  if (header) await loadBlock(header);
}());
