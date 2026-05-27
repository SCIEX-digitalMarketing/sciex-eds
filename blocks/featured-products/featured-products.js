import { getCookie } from '../../scripts/scripts.js';

/**
 * Decorates the block by fetching featured product data
 * and rendering it dynamically.
 *
 * @param {HTMLElement} blockElement - The component root element
 */
export default async function decorate(blockElement) {
  const pictureElement = blockElement.querySelector('picture');
  const currentPath = window.location.pathname;
  const normalizedPath = currentPath.replace(/\.html$/, '');
  let fetchResponse;

  const imageAltText = blockElement.children[2]?.textContent?.trim()
    || 'Promotional image';

  blockElement.textContent = '';

  try {
    // Determine request path based on AEM authoring mode
    if (getCookie('cq-authoring-mode') === 'TOUCH') {
      const authorQueryPath = normalizedPath.replace(/^\/content\/sciex-eds/, '');
      fetchResponse = await fetch(`${authorQueryPath}/jcr:content.sciex.json`);
    } else {
      fetchResponse = await fetch(
        `/content/sciex-eds${normalizedPath}/jcr:content.sciex.json`,
      );
    }

    const featuredProductsData = await fetchResponse.json();

    blockElement.classList.add('featured-products');

    const contentWrapper = document.createElement('div');

    const sectionHeading = document.createElement('h2');
    sectionHeading.textContent = 'Featured products';
    contentWrapper.appendChild(sectionHeading);

    const productList = document.createElement('ul');

    // Build list items from JSON response
    Object.entries(featuredProductsData).forEach(([productName, productPath]) => {
      const listItem = document.createElement('li');
      const productLink = document.createElement('a');

      productLink.href = productPath?.trim()
        ? `${productPath}.html`
        : '#';

      productLink.textContent = productName;
      productLink.title = productName.toLowerCase();
      productLink.target = '_blank';

      listItem.appendChild(productLink);
      productList.appendChild(listItem);
    });

    contentWrapper.appendChild(productList);
    blockElement.appendChild(contentWrapper);

    if (pictureElement) {
      const imageElement = pictureElement.querySelector('img');
      imageElement.alt = imageAltText;
      blockElement.appendChild(pictureElement);
    }
  } catch (fetchError) {
    console.error('Error fetching featured products data:', fetchError);
  }
}
