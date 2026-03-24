export default function decorate(block) {
  const children = Array.from(block.children);

  const borderWidth = children[0]?.textContent?.trim() || '1px';
  const borderStyle = children[1]?.textContent?.trim() || 'solid';
  const borderColorClass = children[2]?.textContent?.trim() || 'border-black';

  block.className = `sciex-border ${borderColorClass}`;

  block.style.setProperty('--border-width', borderWidth);
  block.style.setProperty('--border-style', borderStyle);

  block.textContent = '';
}