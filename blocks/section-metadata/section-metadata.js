function handleBackground(content, section) {
  const pic = content.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    section.insertAdjacentElement('afterbegin', pic);
    return;
  }
  const color = content.textContent;
  if (color) {
    section.classList.add(`section-background-color-${color}`);
  }
}

async function handleStyle(text, section) {
  const styles = text.split(', ').map((style) => style.replaceAll(' ', '-'));
  section.classList.add(...styles);
}

async function handleLayout(text, section, type) {
  if (text === '0') return;
  section.classList.add(`${type}-${text}`);
}

function handleContainer(section) {
  const container = document.createElement('div');
  container.className = 'section-container';
  const children = section.childNodes;
  const filtered = [...children].filter((item) => !item.classList?.contains('section-metadata'));
  container.append(...filtered);
  section.insertAdjacentElement('afterbegin', container);
}

function handleTitle(section) {
  const heading = section.querySelector(':scope > .section-container > .content > h2');
  if (heading) section.classList.add('has-heading');
}

const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim().toLowerCase();
    const content = row.children[1];
    const text = content.textContent.trim().toLowerCase();
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

export default async function init(el) {
  const section = el.closest('.section');
  if (!section) return;
  handleContainer(section);
  if (!section.closest('footer')) handleTitle(section);
  const metadata = getMetadata(el);
  if (metadata.style?.text) await handleStyle(metadata.style.text, section);
  if (metadata.background?.content) handleBackground(metadata.background.content, section);
  if (metadata['background-color']?.content) handleBackground(metadata['background-color'].content, section);
  if (metadata['background-image']?.content) handleBackground(metadata['background-image'].content, section);
  if (metadata.grid?.text) handleLayout(metadata.grid.text, section, 'grid');
  if (metadata.gap?.text) handleLayout(metadata.gap.text, section, 'gap');
  if (metadata.spacing?.text) handleLayout(metadata.spacing.text, section, 'spacing');
  if (metadata['spacing-top']?.text) handleLayout(metadata['spacing-top'].text, section, 'spacing-top');
  if (metadata['spacing-bottom']?.text) handleLayout(metadata['spacing-bottom'].text, section, 'spacing-bottom');
  el.remove();
}
