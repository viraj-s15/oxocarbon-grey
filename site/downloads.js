import { createDownloadCounter } from './downloads.mjs';

let storage;
try { storage = window.localStorage; } catch {}
const counter = createDownloadCounter({ storage });
const formatter = new Intl.NumberFormat();

for (const registry of ['openvsx', 'marketplace']) {
  const element = document.querySelector(`[data-downloads="${registry}"]`);
  if (!element) continue;
  counter.getCount(registry).then((count) => {
    if (count === null) {
      element.hidden = true;
      return;
    }
    element.textContent = ` · ${formatter.format(count)} downloads`;
    element.hidden = false;
  });
}
