import { } from '../../scripts/aem.js';

export default function decorate(block) {
  let blockId = 'sciex-text';
  let alignment = 'text-left';
  let content;
  let paddingTop = 0;
  let paddingBottom = 0;
  const children = Array.from(block.children);
  const [first, second, third] = children;
  if (children.length === 5) {
    blockId = first?.textContent?.trim() || 'sciex-text';
    alignment = second?.textContent?.trim() || 'text-left';
    content = third;
  } else if (children.length === 4) {
    const maybeAlignment = first?.textContent?.trim();
    if (maybeAlignment === 'text-left' || maybeAlignment === 'text-right' || maybeAlignment === 'text-center') {
      alignment = maybeAlignment;
    } else {
      blockId = first?.textContent?.trim() || 'sciex-text';
    }
    content = second;
  } else if (children.length === 3) {
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
    // Get padding values and remove the elements from the DOM
  const paddingTopEl = children[3];
  const paddingBottomEl = children[4];

   paddingTop = paddingTopEl?.textContent?.trim();
   paddingBottom = paddingBottomEl?.textContent?.trim();

  if (paddingTopEl) paddingTopEl.remove();        // Remove from UI
  if (paddingBottomEl) paddingBottomEl.remove();  
  block.id = `${blockId}-content`;
  block.className = 'sciex-text';
  block.parentElement.classList.add('tabs-container-wrapper');
  if (content) {
    if (alignment) {
      content.className = alignment;
    } else {
      content.className = 'text-left';
    }
    block.textContent = '';
    block.append(content);
  }
  const wrapper = block.closest('.sciex-text-wrapper') || block;
  if (paddingTop) {
    wrapper.style.paddingTop = `${paddingTop}px`;
  }

  if (paddingBottom) {
    wrapper.style.paddingBottom = `${paddingBottom}px`;
  }
}
