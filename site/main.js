const tabs = [...document.querySelectorAll('[role="tab"]')];
const codes = [...document.querySelectorAll('.code')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function sweep(code) {
  if (reduced.matches) return;
  code.classList.remove('sweep');
  code.classList.add('dim');
  code.getBoundingClientRect();
  code.classList.add('sweep');
  code.classList.remove('dim');
  const lines = code.querySelectorAll('.l').length;
  clearTimeout(code.sweepTimer);
  code.sweepTimer = setTimeout(() => code.classList.remove('sweep'), lines * 24 + 600);
}

function select(tab, focus) {
  for (const other of tabs) {
    const selected = other === tab;
    other.setAttribute('aria-selected', selected);
    other.tabIndex = selected ? 0 : -1;
    document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
  }
  if (focus) tab.focus();
  sweep(document.getElementById(tab.getAttribute('aria-controls')).querySelector('.code'));
}

for (const tab of tabs) {
  tab.addEventListener('click', () => select(tab, false));
  tab.addEventListener('keydown', (event) => {
    const i = tabs.indexOf(tab);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(tabs[(next + tabs.length) % tabs.length], true);
  });
}

const swatches = [...document.querySelectorAll('[data-colour]')];
let pinned = null;

function show(colour) {
  for (const code of codes) {
    if (colour) code.dataset.focus = colour;
    else delete code.dataset.focus;
  }
}

for (const button of swatches) {
  const colour = button.dataset.colour;
  button.addEventListener('pointerenter', (event) => event.pointerType === 'mouse' && show(colour));
  button.addEventListener('pointerleave', () => show(pinned));
  button.addEventListener('focus', () => show(colour));
  button.addEventListener('blur', () => show(pinned));
  button.addEventListener('click', () => {
    pinned = pinned === colour ? null : colour;
    for (const other of swatches) other.setAttribute('aria-pressed', other.dataset.colour === pinned);
    show(pinned);
  });
}

for (const button of document.querySelectorAll('.copy')) {
  button.addEventListener('click', async () => {
    const code = button.parentElement.querySelector('code');
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
    } catch {
      getSelection().selectAllChildren(code);
      button.textContent = 'Press Ctrl+C';
    }
    clearTimeout(button.resetTimer);
    button.resetTimer = setTimeout(() => (button.textContent = 'Copy'), 2000);
  });
}

sweep(codes[0]);
document.documentElement.classList.add('ready');
