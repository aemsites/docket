export default function init(el) {
  const rows = [...el.querySelectorAll('tr')];
  const headingRow = rows.shift();
  headingRow.classList.add('table-heading-row');
  for (const row of rows) {
    row.classList.add('table-content-row');
  }
}
