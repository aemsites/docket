import { getConfig } from '../../scripts/nx.js';
import getSvg from '../../scripts/utils/svg.js';

export default async function init(el) {
  const { codeBase } = getConfig();
  const link = document.createElement('a');
  link.href = '/';
  link.className = 'docket-brand-logo';
  link.setAttribute('aria-label', 'Home');

  const svg = await getSvg({ paths: [`${codeBase}/img/logos/site.svg`] });
  link.append(svg[0]);

  el.append(link);
}
