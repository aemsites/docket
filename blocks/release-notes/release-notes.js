export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  for (const row of rows) {
    row.classList.add('area');
  }

  const title = rows.shift();
  title.classList.add('title-area');

  const content = rows.shift();
  content.classList.add('content-area');

  for (const row of rows) {
    row.classList.add('details-area');
  }
}
