import { } from '../../scripts/aem.js';

export default function decorate(block) {
  console.log("length>>>"+block.children.length);
  let blockId = 'sciex-text';
  let alignment = 'text-left';
  let content;
   if (block.children.length === 3) {
    blockId = block.children[0]?.textContent?.trim() || 'sciex-text';
    alignment = block.children[1]?.textContent?.trim() || 'text-left';
    content = block.children[2];
  } else if (block.children.length === 2) {
    const maybeAlignment = block.children[0]?.textContent?.trim();
    if (maybeAlignment === 'text-left' || maybeAlignment === 'text-right' || maybeAlignment === 'text-center') {
      alignment = maybeAlignment;
    }else{
       blockId = block.children[0]?.textContent?.trim() || 'sciex-text';
    }
    content = block.children[1];
  } else if (block.children.length === 1) {
    const singleChild = block.children[0];
    const text = singleChild?.textContent?.trim();
    if (singleChild.querySelector('h3')) {
      content = singleChild;
    } else if (['text-left', 'text-right', 'text-center'].includes(text)) {
      alignment = text;
    } else if (
      singleChild.querySelectorAll('*').length === 1 &&
      singleChild.querySelector('p')
    ) {
      blockId = text || 'sciex-text';
    }
  }

  block.id = `${blockId}-content`;
  block.className = 'sciex-text';
  block.parentElement.classList.add('tabs-container-wrapper');
  content.className = alignment;

  block.textContent = '';
  block.append(content);
}
