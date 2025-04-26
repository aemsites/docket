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
  const theme = el.querySelector('[href*="/tools/widgets/theme"]');
  if (!theme) return;
  theme.addEventListener('click', (e) => {
    e.preventDefault();
    const { matches: preferDark } = window.matchMedia('(prefers-color-scheme: dark)');
    const styleTheme = preferDark ? 'light-theme' : 'dark-theme';
    document.body.classList.toggle(styleTheme);
  });
}

function decorateHeader(fragment) {
  const img = fragment.querySelector('.section:first-child img');
  if (img) {
    const brand = img.closest('.section');
    decorateBrand(brand);
  }

  const ul = fragment.querySelector('ul');
  const mainNav = ul.closest('.section');
  decorateMainNav(mainNav);

  const actions = fragment.querySelector('.section:last-child');

  // Only decorate the action area if it has not been decorated
  if (actions?.classList.length < 2) decorateActions(actions);
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
