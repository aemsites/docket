import { loadArea, getConfig } from '../../scripts/nx.js';

function replaceDotMedia(path, doc) {
  const resetAttributeBase = (tag, attr) => {
    doc.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((el) => {
      el[attr] = new URL(el.getAttribute(attr), new URL(path, window.location)).href;
    });
  };
  resetAttributeBase('img', 'src');
  resetAttributeBase('source', 'srcset');
}

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  const { decorateArea } = getConfig();

  const resp = await fetch(`${path}.plain.html`);
  if (!resp.ok) throw Error(`Couldn't fetch ${path}.plain.html`);

  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Make embeded images cacheable
  replaceDotMedia(path, doc);

  const sections = doc.querySelectorAll('body > div');
  const fragment = document.createElement('div');
  fragment.classList.add('fragment-content');
  fragment.append(...sections);

  // Hydrate like a normal page
  if (decorateArea) decorateArea({ area: fragment });
  loadArea({ area: fragment });

  return fragment;
}

export default async function init(a) {
  const path = a.getAttribute('href');
  const fragment = await loadFragment(path);

  if (fragment) {
    const defaultParent = a.closest('.default-content > *');
    const defElToReplace = defaultParent || a;

    const sections = fragment.querySelectorAll(':scope > section');
    const content = sections.length > 1 ? fragment : fragment.querySelector('.section-content');

    defElToReplace.parentElement.replaceChild(content, defElToReplace);
  }
}
