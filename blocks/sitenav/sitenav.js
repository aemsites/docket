import { getConfig } from '../../scripts/nx.js';
import getSvg from '../../scripts/utils/svg.js';

const EXP_ICON = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.30103 6C9.30103 5.95117 9.28101 5.90479 9.2732 5.85657C9.26246 5.78931 9.26026 5.72071 9.23426 5.65686C9.1897 5.54712 9.12305 5.44434 9.03419 5.35547L4.34277 0.663087C3.9873 0.307617 3.40918 0.307617 3.05371 0.663087C2.69824 1.01856 2.69726 1.59571 3.05371 1.95215L7.10071 6L3.05371 10.0478C2.69726 10.4043 2.69824 10.9814 3.05371 11.3369C3.23144 11.5146 3.46484 11.6035 3.69824 11.6035C3.93164 11.6035 4.16504 11.5146 4.34277 11.3369L9.03418 6.64453C9.12305 6.55566 9.1897 6.45288 9.23425 6.34314C9.26025 6.2793 9.26245 6.21069 9.27319 6.14343C9.281 6.09521 9.30103 6.04883 9.30103 6Z" fill="currentColor"/>
</svg>`;

const { codeBase } = getConfig();

function generateSiteList(siteData, pathname) {
  return Object.keys(siteData).map((key) => {
    const ul = document.createElement('ul');

    const inPath = pathname.startsWith(siteData[key].path);
    if (inPath) ul.classList.add('is-open');

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.innerText = siteData[key].title;
    a.href = siteData[key].path;
    li.append(a);

    if (Object.keys(siteData[key].children).length > 0) {
      const btn = document.createElement('button');
      btn.className = 'expand-tree';
      btn.setAttribute('aria-label', 'Expand');
      btn.innerHTML = EXP_ICON;
      btn.addEventListener('click', () => {
        btn.closest('ul').classList.toggle('is-open');
      });
      const children = generateSiteList(siteData[key].children, pathname);
      li.append(btn, ...children);
    }
    ul.append(li);
    return ul;
  });
}

function formatSiteData(pageData) {
  const root = pageData.reduce((acc, item) => {
    const segments = item.path.substring(1).split('/');

    let currentNode = acc;

    segments.forEach((segment, index) => {
      // Create node if it doesn't exist
      if (!currentNode[segment]) {
        currentNode[segment] = {
          children: {},
          title: segment,
          path: segments.reduce((segAcc, seg, idx) => {
            if (idx <= index) return `${segAcc}/${seg}`;
            return segAcc;
          }, ''),
        };
      }

      // If this is the last segment, mark as endpoint and set title
      if (index === segments.length - 1) {
        currentNode[segment].title = item.title;
        currentNode[segment].path = item.path;
      }

      currentNode = currentNode[segment].children;
    });

    return acc;
  }, {});
  return root;
}

async function fetchSiteData() {
  const resp = await fetch(`${codeBase}/query-index.json`);
  if (!resp.ok) throw Error('Could not fetch query index');
  const { data } = await resp.json();
  return data;
}

export default async function init(el) {
  const link = document.createElement('a');
  link.href = '/';
  link.className = 'docket-brand-logo';
  link.setAttribute('aria-label', 'Home');

  const svg = await getSvg({ paths: [`${codeBase}/img/logos/site.svg`] });
  link.append(svg[0]);

  el.append(link);

  try {
    const { pathname } = window.location;
    const siteData = await fetchSiteData();
    const formatted = formatSiteData(siteData);
    const siteList = generateSiteList(formatted, pathname);
    el.append(...siteList);
  } catch (e) {
    throw Error(e);
  }
}
