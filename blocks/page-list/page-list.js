import { getConfig } from '../../scripts/nx.js';

const { codeBase } = getConfig();

async function fetchSiteData() {
  const resp = await fetch(`${codeBase}/query-index.json`);
  if (!resp.ok) throw Error('Could not fetch query index');
  const { data } = await resp.json();
  return data.sort((a, b) => {
    const segmentsA = a.path.split('/').length - 1;
    const segmentsB = b.path.split('/').length - 1;
    return segmentsA - segmentsB;
  });
}

function createCards(siteData) {
  const cards = Object.keys(siteData).reduce((acc, key) => {
    const isPage = siteData[key].path === window.location.pathname;
    const notDescendant = !siteData[key].path.startsWith(window.location.pathname);

    if (isPage || notDescendant) return acc;

    const card = document.createElement('li');
    card.classList.add('docket-page-list-card');

    const link = document.createElement('a');
    link.href = siteData[key].path;

    const title = document.createElement('p');
    title.classList.add('docket-page-list-card-title');
    title.innerText = siteData[key].title;

    const description = document.createElement('p');
    description.classList.add('docket-page-list-card-description');
    description.innerText = siteData[key].description;

    link.append(title, description);
    card.append(link);
    acc.push(card);

    return acc;
  }, []);
  const ul = document.createElement('ul');
  ul.classList.add('docket-page-list');
  ul.append(...cards);
  return ul;
}

export default async function init(el) {
  try {
    const siteData = await fetchSiteData();
    const cards = createCards(siteData);
    el.append(cards);
  } catch (err) {
    console.error(err);
  }
}
