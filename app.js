import { projects } from './data.js';

const ul = document.querySelector('#project-list');
const tpl = document.querySelector('#project-card');
const bar = document.querySelector('#filters');
const search = document.querySelector('#search');
const themeToggle = document.querySelector('#theme-toggle');
const form = document.querySelector('#contact-form');
const emailInput = document.querySelector('#email');
const formStatus = document.querySelector('#form-status');

let selectedTag = 'all';
let searchText = '';

function render(list) {
  ul.textContent = '';

  if (list.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'Không có dự án phù hợp';
    ul.append(empty);
    return;
  }

  for (const p of list) {
    const li = tpl.content.cloneNode(true);
    li.querySelector('h3').textContent = p.title;
    li.querySelector('.project-tags').textContent = p.tags.join(', ');
    ul.append(li);
  }
}

function updateProjects() {
  const filtered = projects.filter((p) => {
    const matchTag = selectedTag === 'all' || p.tags.includes(selectedTag);
    const matchSearch = p.title.toLowerCase().includes(searchText);
    return matchTag && matchSearch;
  });

  render(filtered);
}

const tags = [...new Set(
  projects.flatMap((p) => p.tags)
)];

for (const tag of ['all', ...tags]) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = tag === 'all' ? 'Tất cả' : tag;
  b.dataset.tag = tag;
  bar.append(b);
}

bar.addEventListener('click', (e) => {
  const tag = e.target.dataset.tag;
  if (!tag) return;

  selectedTag = tag;
  updateProjects();
});

search.addEventListener('input', (e) => {
  searchText = e.target.value.trim().toLowerCase();
  updateProjects();
});

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

function updateThemeButton() {
  const isDark = document.documentElement.classList.contains('dark');
  const label = isDark ? 'Bật chế độ sáng' : 'Bật chế độ tối';

  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
}

updateThemeButton();

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');

  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  updateThemeButton();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.elements.name.value.trim();
  const message = form.elements.message.value.trim();

  formStatus.className = 'form-status';

  if (!name || !message || !emailInput.value.trim()) {
    formStatus.textContent = 'Vui lòng điền đầy đủ thông tin.';
    formStatus.classList.add('error');
    return;
  }

  if (!emailInput.checkValidity()) {
    formStatus.textContent = 'Email không hợp lệ.';
    formStatus.classList.add('error');
    return;
  }

  formStatus.textContent = 'Gửi thông tin thành công.';
  formStatus.classList.add('success');
  form.reset();
});

render(projects);
