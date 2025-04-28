import { getConfig, getMetadata } from '../../scripts/nx.js';
import getSvg from '../../scripts/utils/svg.js';
import { loadFragment } from '../fragment/fragment.js';

const { locale, codeBase } = getConfig();

const HEADER_PATH = '/fragments/nav/header';

function decorateBrand(el) {
  el.classList.add('brand-section');
}

function decorateMainNav(el) {
  el.classList.add('main-nav-section');
}

async function decorateLink(section, pattern, name) {
  const link = section.querySelector(`[href*="${pattern}"]`);
  if (!link) return;

  link.setAttribute('aria-label', link.textContent);
  const svg = await getSvg({ paths: [`${codeBase}/img/logos/${name}.svg`] });
  link.innerHTML = '';
  link.append(svg[0]);
  link.target = '_blank';
  link.classList.add('decorated');

  if (name === 'color') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const { body } = document;

      let currPref = localStorage.getItem('docket-theme');
      if (!currPref) {
        currPref = matchMedia('(prefers-color-scheme: dark)')
          .matches ? 'dark-theme' : 'light-theme';
      }

      const theme = currPref === 'dark-theme'
        ? { add: 'light-theme', remove: 'dark-theme' }
        : { add: 'dark-theme', remove: 'light-theme' };

      body.classList.remove(theme.remove);
      body.classList.add(theme.add);
      localStorage.setItem('docket-theme', theme.add);
    });
  }
}

async function decorateActions(section) {
  section.classList.add('actions-section');
  const color = decorateLink(section, '/tools/widgets/theme', 'color');
  const discord = decorateLink(section, 'discord.com', 'discord');
  const github = decorateLink(section, 'github.com', 'github');
  await Promise.all([color, discord, github]);
}

async function decorateHeader(fragment) {
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
  if (actions?.classList.length < 2) await decorateActions(actions);
}

/**
 * loads and decorates the header
 * @param {Element} el The header element
 */
export default async function init(el) {
  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;
  try {
    const fragment = await loadFragment(`${locale.base}${path}`);
    fragment.classList.add('header-content');
    await decorateHeader(fragment);
    el.append(fragment);
  } catch (e) {
    throw Error(e);
  }
}
