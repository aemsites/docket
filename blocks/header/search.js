import docsearch from 'https://cdn.jsdelivr.net/npm/@docsearch/js@4.0.1/+esm';

import { loadStyle } from '../../scripts/nx.js';

export default function decorateSearchPanel(div) {
  div.innerHTML = '';
  loadStyle("https://cdn.jsdelivr.net/npm/@docsearch/css@4.0.1");

  docsearch({
    container: div,
    appId: 'L1S1WHPEI8',
    apiKey: '03a5821387273b7a498fc9288b36b8f9',
    indexName: 'DA Docs',
  });
}
