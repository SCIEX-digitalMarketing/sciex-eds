import { } from '../../scripts/aem.js';

export default async function decorate(block) {
  block.style.display = 'none';
  const rows = Array.from(block.children);
  const alignment = rows[0]?.querySelector('p')?.textContent?.trim() || 'left';

  const fragment = document.createDocumentFragment();

  const wrapper = document.createElement('div');
  wrapper.classList.add('button-block', `align-${alignment}`);

  rows.slice(1).forEach((row) => {
    const paragraphs = Array.from(row.querySelectorAll('p'));
    const picture = row.querySelector('picture');

    const cells = paragraphs.map((p) => p.textContent.trim());

    const [
      type = 'primary',
      text = '',
      link = '#',
      showSvgRaw = 'false',,
      target = '_self',
    ] = cells;

    const showSvg = showSvgRaw.toLowerCase() === 'true';

    const button = document.createElement('a');
    button.href = link;
    button.target = target;
    button.className = `button ${type}`;
    button.textContent = text;

    if (showSvg && picture) {
      const clonedPicture = picture.cloneNode(true);
      clonedPicture.classList.add('inline-icon');
      button.appendChild(clonedPicture);
    }

    wrapper.appendChild(button);
  });

  fragment.appendChild(wrapper);

  block.parentNode.insertBefore(fragment, block.nextSibling);
}
