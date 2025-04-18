import observe from '../../scripts/utils/intOb.js';

function decorate(el) {
  el.innerHTML = `<iframe src="${el.dataset.src}" class="youtube"
  webkitallowfullscreen mozallowfullscreen allowfullscreen
  allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"
  scrolling="no"
  title="Youtube Video">`;
}

export default function init(a) {
  const noCook = a.href.includes('nocookie.com');
  const div = document.createElement('div');
  div.className = 'nx-video';
  const searchParams = new URLSearchParams(a.search);
  const id = searchParams.get('v') || a.pathname.split('/').pop();
  searchParams.delete('v');
  div.dataset.src = noCook ? a.href : `https://www.youtube.com/embed/${id}?${searchParams.toString()}`;
  a.parentElement.replaceChild(div, a);
  observe(div, decorate);
}
