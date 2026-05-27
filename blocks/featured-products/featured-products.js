import { getCookie } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const picture = block.querySelector('picture');
  const path = window.location.pathname;
  const trimmedPath = path.replace(/\.html$/, '');
  let response;
  const alt = block.children[2] && block.children[2].textContent ? block.children[2].textContent.trim() : 'Promotional image';

  block.textContent = '';
  try {
    if (getCookie('cq-authoring-mode') === 'TOUCH') {
      const queryPath = trimmedPath.replace(/^\/content\/sciex-eds/, '');
      response = await fetch(`${queryPath}/jcr:content.sciex.json`);
    } else {
      response = await fetch(`/content/sciex-eds${trimmedPath}/jcr:content.sciex.json`);
    }
    const data = await response.json();

    block.classList.add('featured-products');
    const dynamicElement = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = 'Featured products';
    dynamicElement.appendChild(title);

    const listContainer = document.createElement('ul');

    Object.entries(data).forEach(([key, value]) => {
      const listItem = document.createElement('li');
      const anchor = document.createElement('a');

      anchor.href = value && value.trim() !== '' ? `${value}.html` : '#';
      anchor.textContent = key;
      anchor.title = key.toLowerCase();
      anchor.target = '_blank';

      listItem.appendChild(anchor);
      listContainer.appendChild(listItem);
    });
    dynamicElement.appendChild(listContainer);
    block.appendChild(dynamicElement);
    if (picture) {
      const img = picture.querySelector('img');
      img.alt = alt;
      block.appendChild(picture);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
