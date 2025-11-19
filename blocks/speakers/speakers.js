import { } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function canMobileActions() {
  return window.innerWidth <= 1024;
}

function setImgsEager(root) {
  // set loading="eager" for images inside given root node
  root.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.setAttribute('loading', 'eager');
  });
}

function waitForImagesToDecode(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  if (!imgs.length) return Promise.resolve();

  const promises = imgs.map((img) => {
    // If already complete, resolve immediately
    if (img.complete && img.naturalWidth !== 0) return Promise.resolve();

    // If decode available, use it
    if (img.decode) {
      return img.decode().catch(() => Promise.resolve());
    }

    // Fallback to load/error events
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

  // Wait for all to finish (or error)
  return Promise.all(promises);
}

export default async function decorate(block) {
  let headingText = '';
  const parentDiv = document.createElement('div');
  parentDiv.className = 'speaker-container';

  // iterate top-level rows (do not mutate block yet)
  const rows = Array.from(block.children);

  // Process rows sequentially to preserve DOM order; could be parallel too.
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];

    if (index === 0) {
      // keep original behavior
      block.id = `${row.textContent.trim()}-content`;
      if (block.parentElement) {
        block.parentElement.classList.add('tabs-container-wrapper');
      }
    } else if (index === 1) {
      headingText = row.textContent.trim();
    } else {
      // Clone row to prepare content without disturbing originals
      const clonedRow = row.cloneNode(true);

      // Make sure cloned images load eagerly and wait for them
      setImgsEager(clonedRow);

      // Wait for images in the clone to decode (so we won't lose any during DOM moves)
      // eslint-disable-next-line no-await-in-loop
      await waitForImagesToDecode(clonedRow);

      // Build speaker card and preserve instrumentation from original row
      const speakerDiv = document.createElement('div');
      speakerDiv.className = 'speaker-card';
      moveInstrumentation(row, speakerDiv);

      // Append cloned children into speakerDiv (these are safe and already loaded)
      while (clonedRow.firstElementChild) {
        speakerDiv.append(clonedRow.firstElementChild);
      }

      // Show more/less elements per speaker (create new ones for each card)
      const showMoreButton = document.createElement('div');
      showMoreButton.className = 'show-more';
      const showMoreSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg>';
      showMoreButton.innerHTML = `${showMoreSvg} Show More`;

      const showLessButton = document.createElement('div');
      showLessButton.className = 'show-less content-hidden';
      const showLessSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg>';
      showLessButton.innerHTML = `${showLessSvg} Show Less`;

      // Process children of speakerDiv to set classes and attach mobile expand/collapse
      Array.from(speakerDiv.children).forEach((div) => {
        if (div.querySelector('picture')) {
          div.className = 'speaker-image';
        } else {
          div.className = 'speaker-content';

          if (canMobileActions()) {
            const target = div.querySelector('ul');
            if (target) {
              // insert controls specifically relative to this target
              target.insertAdjacentElement('beforebegin', showMoreButton);
              target.insertAdjacentElement('afterend', showLessButton);
              target.classList.add('content-hidden');
            }
          }
        }
      });

      // Event listeners for the show more/less (use event delegation safety)
      showMoreButton.addEventListener('click', (event) => {
        const btn = event.currentTarget;
        btn.classList.add('content-hidden');
        const parent = btn.parentElement;
        const ul = parent ? parent.querySelector('ul') : null;
        const showLess = parent ? parent.querySelector('.show-less') : null;
        if (ul) ul.classList.remove('content-hidden');
        if (showLess) showLess.classList.remove('content-hidden');
      });

      showLessButton.addEventListener('click', (event) => {
        const btn = event.currentTarget;
        btn.classList.add('content-hidden');
        const parent = btn.parentElement;
        const ul = parent ? parent.querySelector('ul') : null;
        const showMore = parent ? parent.querySelector('.show-more') : null;
        if (ul) ul.classList.add('content-hidden');
        if (showMore) showMore.classList.remove('content-hidden');
      });

      parentDiv.appendChild(speakerDiv);
    }
  }

  const headingEl = document.createElement('h2');
  headingEl.textContent = headingText;
  headingEl.className = 'heading';

  // Replace original block content (safe now — clones were prepared and images decoded)
  block.textContent = '';
  block.append(headingEl);
  block.append(parentDiv);
}
