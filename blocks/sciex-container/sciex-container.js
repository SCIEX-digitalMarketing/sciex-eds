import { decorateMain, moveInstrumentation } from '../../scripts/scripts.js';
import { loadSections } from '../../scripts/aem.js';

export async function loadFragment(rawPath) {
  if (rawPath && rawPath.startsWith('/')) {
    const cleanPath = rawPath.replace(/(\.plain)?\.html/, '');
    const resp = await fetch(`${cleanPath}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // Reset base for media URLs
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          const absolute = new URL(
            elem.getAttribute(attr),
            new URL(cleanPath, window.location),
          ).href;
          elem.setAttribute(attr, absolute);
        });
      };

      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const containedID = block.children[0]?.textContent?.trim();
  const rawColumnText = block.children[1]?.textContent?.trim();
  const columnSetting = Number(rawColumnText);
  const gridValueColumns = columnSetting > 0 ? columnSetting : 2;

  const firstChild = block.children[0] ?? null;
  const secondChild = block.children[1] ?? null;
  const links = Array.from(block.querySelectorAll('a'));

  if (links.length === 0) {
    return;
  }
  if (firstChild) firstChild.remove();
  if (secondChild) secondChild.remove();

  Array.from(block.querySelectorAll('a')).forEach((a) => a.remove());

  const container = document.createElement('div');
  container.classList.add('fragment-multi-container', `container-grid-${gridValueColumns}`);
 
  const fragments = await Promise.all(
    links.map((link) => loadFragment(link.getAttribute('href'))),
  );

  fragments.forEach((fragment) => {
    if (!fragment) return;
    const fragmentSection = fragment.querySelectorAll(':scope .section');

    if (fragmentSection) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('fragment-item');

      wrapper.append(...fragmentSection.childNodes);
      container.appendChild(wrapper);
    }
  });

  // Append container into block FIRST, then run instrumentation
  block.appendChild(container);
  block.parentElement.classList.add('tabs-container-wrapper');
  block.id = `${containedID}-content`;
  moveInstrumentation(container);
}
