import {} from '../../scripts/aem.js';

export default async function decorate(block) {
  // Create main container div
  const courseCatalogDiv = document.createElement('div');
  courseCatalogDiv.classList.add('tw', 'coursecatalog-search', 'tw-bg-white');
  block.append(courseCatalogDiv);
  
}
