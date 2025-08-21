import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Create main container div
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('.sciex-hero-title');
  const titleId = block.children[0].textContent;
  const heading = block.children[1].textContent;
  const headingDiv = document.createElement('div');
  if (titleId && titleId.trim() !== '') {
    block.id = titleId.trim();
  }
  headingDiv.classList.add('hero-heading');
  const pageTitle = getMetadata('og:title');
  if (heading && heading.trim() !== '') {
    headingDiv.append(heading.trim());
  } else {
    headingDiv.append(pageTitle);
  }
  blockDiv.append(headingDiv);

  block.textContent = '';
  block.append(blockDiv);
}
