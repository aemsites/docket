// eslint-disable-next-line import/no-cycle
import { loadPage } from '../scripts.js';

async function loadModule(origin, payload) {
  document.body.classList.add('quick-edit');
  const { default: loadQuickEdit } = await import(`${origin}/nx/public/plugins/quick-edit/quick-edit.js`);
  loadQuickEdit(payload, loadPage);
}

export default function init(payload) {
  loadModule('https://da.live', payload);
}
