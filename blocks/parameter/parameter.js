function getCodeEl(text, className, hasPre) {
  const code = document.createElement('code');
  code.innerText = text;
  if (className) code.className = className;
  if (!hasPre) return code;
  const pre = document.createElement('pre');
  if (className) pre.className = className;
  pre.append(code);
  return pre;
}

function decorateHeading(el) {
  // First row is the param name
  const nameEl = el.querySelector('p');
  const [name, type, required] = nameEl.innerText.trim().split(' ');
  nameEl.remove();

  // Name
  const nameCodeEl = getCodeEl(name, 'param-name');

  // Type
  const typeEl = getCodeEl(type, 'param-type');

  const headingArea = document.createElement('div');
  headingArea.className = 'param-heading-area';
  headingArea.append(nameCodeEl, typeEl);

  // Required
  if (required?.toLowerCase() === 'required') {
    const reqEl = getCodeEl('Required', 'param-required');
    headingArea.append(reqEl);
  }

  return headingArea;
}

function decorateExample(area) {
  area.className = 'param-example-area';

  const titleEl = document.createElement('p');
  titleEl.className = 'param-example-title';
  titleEl.innerText = 'Example';

  const example = area.innerText.trim();
  const exampleEl = getCodeEl(example, 'param-example', true);

  // Remove the col as it is not needed
  area.querySelector('div').remove();

  area.append(titleEl, exampleEl);
}

export default function init(el) {
  const headingArea = decorateHeading(el);
  el.insertAdjacentElement('afterbegin', headingArea);

  const detailsArea = el.querySelectorAll(':scope > div')[1];
  if (detailsArea) detailsArea.className = 'param-details-area';

  const exampleArea = el.querySelectorAll(':scope > div')[2];
  if (exampleArea) decorateExample(exampleArea);
}
