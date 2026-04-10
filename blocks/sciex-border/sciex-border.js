export default function decorate(block) {
  const children = Array.from(block.children);
  if (children.length < 5) {
    return;
  }
  const borderWidth = children[0]?.textContent?.trim() || '1px';
  const borderStyle = children[1]?.textContent?.trim() || 'solid';
  const borderColorClass = children[2]?.textContent?.trim() || 'border-black';
  const marginTop = children[3]?.textContent?.trim() || '20';
  const marginBottom = children[4]?.textContent?.trim() || '20';

  block.className = `sciex-border ${borderColorClass}`;

  block.style.borderWidth = borderWidth;
  block.style.borderStyle = borderStyle;
  block.style.marginTop = `${marginTop}px`;
  block.style.marginBottom = `${marginBottom}px`; 

  block.textContent = '';
}