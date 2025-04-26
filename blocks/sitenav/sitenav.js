export default function init(el) {
  const link = document.createElement('a');
  link.href = '/';
  link.className = 'docket-brand-logo';
  const img = document.createElement('img');
  img.src = '/img/main-logo-white.svg';
  link.append(img);

  el.append(link);
}
