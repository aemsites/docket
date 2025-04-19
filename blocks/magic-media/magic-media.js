function replaceText(el, svg) {
  const kvRows = [...el.querySelectorAll(':scope > div:has(div + div)')];
  const kv = kvRows.reduce((acc, row) => {
    const [keyEl, valEl] = row.querySelectorAll('div');
    const key = keyEl.textContent.toLowerCase().trim().replace(' ', '-');
    const value = valEl.textContent.trim();
    row.remove();
    acc[`{{${key}}}`] = value;
    return acc;
  }, {});

  const tspans = svg.querySelectorAll('text');
  tspans.forEach((text) => {
    const placeHolder = text.textContent.trim();
    if (!placeHolder.includes('{{')) return;

    const inGroup = text.closest('g');
    const sibling = text.nextElementSibling;
    if (inGroup && sibling.nodeName === 'line') {
      inGroup.removeAttribute('class');
      const lineStart = Number(sibling.getAttribute('x1'));
      const lineEnd = Number(sibling.getAttribute('x2'));
      const width = lineEnd - lineStart;
      const middle = width / 2;
      const x = lineStart + middle;

      sibling.remove();
      text.removeAttribute('transform');
      text.setAttribute('x', x);
      text.setAttribute('y', sibling.getAttribute('y1'));
      text.setAttribute('text-anchor', 'middle');
    }
    text.innerHTML = kv[placeHolder];
  });
}

async function fetchSvg(el, href) {
  const resp = await fetch(href);
  const text = await resp.text();
  const parser = new DOMParser();
  const parsedText = parser.parseFromString(text, 'image/svg+xml');
  const svg = parsedText.querySelector('svg');
  replaceText(el, svg);
  return svg;
}

function calcPath(src) {
  if (src.startsWith('./media')) {
    const { origin, pathname } = window.location;
    const parentPath = pathname.split('/').slice(0, -1).join('/');
    return `${origin}${parentPath}${src.replace('.', '')}`;
  }
  return src;
}

export default async function init(el) {
  const sourceEl = el.querySelector('[type="image/svg+xml"]');
  const href = calcPath(sourceEl.srcset);
  const svg = await fetchSvg(el, href);
  const pic = sourceEl.closest('picture');
  pic.parentElement.replaceChild(svg, pic);
}
