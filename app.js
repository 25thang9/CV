import { projects } from './data.js';

const ul = document.querySelector(
  '#project-list');
const tpl = document.querySelector(
  '#project-card');

function render(list) {
  ul.textContent = '';
  for (const p of list) {
    const li = tpl.content
      .cloneNode(true);
    li.querySelector('h3')
      .textContent = p.title;
    li.querySelector('.project-tags')
      .textContent = p.tags.join(', ');
    ul.append(li);
  }
}
render(projects);

const tags = [...new Set(
  projects.flatMap((p) => p.tags),
)];
const bar = document.querySelector(
  '#filters');

for (const tag of ['all', ...tags]) {
  const b = document.createElement(
    'button');
  b.textContent = tag;
  b.dataset.tag = tag;
  bar.append(b);
}

bar.addEventListener('click', (e) => {
  const tag = e.target.dataset.tag;
  if (!tag) return;

  const filtered = tag === 'all'
    ? projects
    : projects.filter((p) =>
        p.tags.includes(tag));
  render(filtered);
});

const search = document.querySelector('#search');
search.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(q));
  render(filtered);
});
