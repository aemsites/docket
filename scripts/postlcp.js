import { loadBlock } from './nx.js';

(async function loadPostLCP() {
  const header = document.querySelector('header');
  if (header) await loadBlock(header);
}());
