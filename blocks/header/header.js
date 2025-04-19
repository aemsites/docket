import { getConfig, getMetadata } from '../../scripts/nx.js';
import { loadFragment } from '../fragment/fragment.js';

const HEADER_PATH = '/fragments/nav/header';

function decorateBrand(el) {
  el.classList.add('brand-section');
}

function decorateMainNav(el) {
  el.classList.add('main-nav-section');
}

function decorateActions(el) {
  el.classList.add('actions-section');
}

function decorateHeader(fragment) {
  const link = fragment.querySelector('a');
  const brand = link.closest('.section');
  decorateBrand(brand);

  const ul = fragment.querySelector('ul');
  const mainNav = ul.closest('.section');
  decorateMainNav(mainNav);

  const actions = fragment.querySelector('.section:last-child');
  console.log(actions.classList.length);
  if (actions && actions.classList.length > 0) decorateActions(actions);
}

/**
 * loads and decorates the header
 * @param {Element} el The header element
 */
export default async function init(el) {
  const { locale } = getConfig();
  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;
  try {
    const fragment = await loadFragment(`${locale.base}${path}`);
    fragment.classList.add('header-content');
    decorateHeader(fragment);
    el.append(fragment);
  } catch (e) {
    throw Error(e);
  }
}
