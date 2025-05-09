import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Create main container div
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('hero-title');

  const titleId = block.children[0].textContent;
  const heading = block.children[1].textContent;
  const headingDiv = document.createElement('div');

  if (titleId && titleId.trim() !== '') {
    block.id = titleId.trim();
  }

  headingDiv.classList.add('hero-heading');

  headingDiv.style.cssText = `
    align-self: stretch;
    color: #141414;
    font-size: 60px;
    font-style: normal;
    font-weight: 270;
    line-height: 75px;
    font-family: "Geogrotesque Sharp VF", sans-serif;
    min-height: 100px;
  `;

  if (window.innerWidth <= 768) {
    headingDiv.style.fontSize = '34px';
    headingDiv.style.fontWeight = '330';
    headingDiv.style.lineHeight = '42px';
    headingDiv.style.minHeight = '42px';
  }

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
