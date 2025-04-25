export default function init(el) {
  const rows = [...el.querySelectorAll('tr')];
  const headingRow = rows.shift();
  headingRow.classList.add('table-heading-row');
  rows.forEach((row) => {
    row.classList.add('table-content-row');
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      let code = cell.querySelector('code');
      if (code) return;
      code = document.createElement('code');
      code.textContent = cell.textContent;
      cell.innerHTML = '';
      cell.append(code);
    });
  });
}
