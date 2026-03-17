import { } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export function canMobileActions() {
  return window.innerWidth <= 1024;
}

export function setImgsEager(root) {
  root.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.setAttribute('loading', 'eager');
  });
}

export function waitForImagesToDecode(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  if (!imgs.length) return Promise.resolve();

  const promises = imgs.map((img) => {
    if (img.complete && img.naturalWidth !== 0) return Promise.resolve();

    if (img.decode) {
      return img.decode().catch(() => Promise.resolve());
    }

    return new Promise((resolve) => {
      const onFinish = () => {
        img.removeEventListener('load', onFinish);
        img.removeEventListener('error', onFinish);
        resolve();
      };
      img.addEventListener('load', onFinish);
      img.addEventListener('error', onFinish);
    });
  });

  return Promise.all(promises);
}

export default async function decorate(block) {
  const parentDiv = document.createElement('div');
  parentDiv.className = 'speaker-container';
  const speakerDiv = document.createElement('div');
  speakerDiv.className = 'speaker-card';
  const rows = Array.from(block.children);

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];

    moveInstrumentation(row, speakerDiv);
    if (index === 0) {
      block.id = `${row.textContent.trim()}-content`;
      if (block.parentElement) {
        block.parentElement.classList.add('tabs-container-wrapper');
      }
    } else {
      const clonedRow = row.cloneNode(true);
      setImgsEager(clonedRow);
      waitForImagesToDecode(clonedRow);

      while (clonedRow.firstElementChild) {
        speakerDiv.append(clonedRow.firstElementChild);
      }
    }
  }

  const children = Array.from(speakerDiv.children);
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'speaker-content';

  children.forEach((child) => {
    if (child.matches('picture')) {
      child.className = 'speaker-image';
    } else {
      contentWrapper.appendChild(child);
    }
  });

  if (contentWrapper.children.length > 0) {
    speakerDiv.appendChild(contentWrapper);
  }

  const showMoreButton = document.createElement('div');
  showMoreButton.className = 'show-more';
  showMoreButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg> Show More';

  const showLessButton = document.createElement('div');
  showLessButton.className = 'show-less content-hidden';
  showLessButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg> Show Less';

  if (canMobileActions()) {
    const target = contentWrapper.querySelector('ul');

    if (target) {
      target.insertAdjacentElement('beforebegin', showMoreButton);
      target.insertAdjacentElement('afterend', showLessButton);
      target.classList.add('content-hidden');
    }
  }

  showMoreButton.addEventListener('click', (event) => {
    const btn = event.currentTarget;
    btn.classList.add('content-hidden');
    const parent = btn.parentElement;
    const ul = parent?.querySelector('ul');
    const showLess = parent?.querySelector('.show-less');
    if (ul) ul.classList.remove('content-hidden');
    if (showLess) showLess.classList.remove('content-hidden');
  });

  showLessButton.addEventListener('click', (event) => {
    const btn = event.currentTarget;
    btn.classList.add('content-hidden');
    const parent = btn.parentElement;
    const ul = parent?.querySelector('ul');
    const showMore = parent?.querySelector('.show-more');
    if (ul) ul.classList.add('content-hidden');
    if (showMore) showMore.classList.remove('content-hidden');
  });

  parentDiv.appendChild(speakerDiv);
  block.textContent = '';
  block.append(parentDiv);
}
