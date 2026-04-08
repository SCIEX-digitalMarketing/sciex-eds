import { } from '../../scripts/aem.js';

export default function decorate(block) {
  const children = Array.from(block.children);

  // Map fields directly based on model
  const idEl = children[0];
  const alignmentEl = children[1];
  const contentEl = children[2];
  const paddingTopEl = children[3];
  const paddingBottomEl = children[4];

  // Extract values
  const blockId = idEl?.textContent?.trim() || 'sciex-text';
  const alignment = alignmentEl?.textContent?.trim() || 'text-left';
  const paddingTop = paddingTopEl?.textContent?.trim();
  const paddingBottom = paddingBottomEl?.textContent?.trim();

  // Set block properties
  block.id = `${blockId}-content`;
  block.classList.add('sciex-text');

  // Wrapper handling
  const wrapper = block.closest('.sciex-text-wrapper') || block;
  block.parentElement?.classList.add('tabs-container-wrapper');
  block.textContent = '';
  
  // Handle content
  if (contentEl) {
    contentEl.classList.add(alignment || 'text-left');
    block.append(contentEl);
  }

  // Apply padding
  if (paddingTop) {
    wrapper.style.paddingTop = `${paddingTop}px`;
  }

  if (paddingBottom) {
    wrapper.style.paddingBottom = `${paddingBottom}px`;
  }
}
