import { } from '../../scripts/aem.js';

export default function decorate(block) {
  let blockId = 'sciex-text';
  let alignment = 'text-left';
  let content;
  const children = Array.from(block.children);
  const [first, second, third] = children;
  if (children.length === 3) {
    blockId = first?.textContent?.trim() || 'sciex-text';
    alignment = second?.textContent?.trim() || 'text-left';
    content = third;
  } else if (children.length === 2) {
    const maybeAlignment = first?.textContent?.trim();
    if (maybeAlignment === 'text-left' || maybeAlignment === 'text-right' || maybeAlignment === 'text-center') {
      alignment = maybeAlignment;
    } else {
      blockId = first?.textContent?.trim() || 'sciex-text';
    }
    content = second;
  } else if (children.length === 1) {
    const singleChild = first;
    const text = singleChild?.textContent?.trim();
    if (singleChild.querySelector('h3')) {
      content = singleChild;
    } else if (['text-left', 'text-right', 'text-center'].includes(text)) {
      alignment = text;
    } else if (
      singleChild.querySelectorAll('*').length === 1
      && singleChild.querySelector('p')
    ) {
      blockId = text || 'sciex-text';
    } else {
      content = singleChild;
    }
  }

  block.id = `${blockId}-content`;
  block.className = 'sciex-text';
  //  block.parentElement.classList.add('tabs-container-wrapper');
  if (content) {
    if (alignment) {
      content.className = alignment;
    } else {
      content.className = 'text-left';
    }
    block.textContent = '';
    block.append(content);
  }
}
