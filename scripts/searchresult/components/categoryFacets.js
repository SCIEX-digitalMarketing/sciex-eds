import {
  sourceFacetController,
  filetypeFacetController,
  tagsFacetController,
} from '../controller/controllers.js';

function facetAccordion(values, facetElement, facetItemsContainer) {
  if (values.length !== 0) {
    facetElement.appendChild(facetItemsContainer);

    const facetHeader = facetElement.querySelector('.facet-header');
    facetHeader.setAttribute('aria-expanded', 'false');

    facetHeader.addEventListener('click', () => {
      const isVisible = facetItemsContainer.style.display === 'block';
      facetItemsContainer.style.display = isVisible ? 'none' : 'block';
      facetHeader.setAttribute('aria-expanded', !isVisible);
    });
  } else {
    facetElement.innerHTML = '';
  }
}

export const renderSourceFacet = () => {
  const facetElement = document.getElementById('source-facet');
  facetElement.innerHTML = '<h3 class="facet-header tw-text-gray-800 tw-text-lg tw-mb-2 tw-border-b tw-pb-1">Source</h3>';

  const { values } = sourceFacetController.state;
  const facetItemsContainer = document.createElement('div');
  facetItemsContainer.className = 'facet-items-container';
  values.forEach((value) => {
    const facetItem = document.createElement('div');
    facetItem.className = 'facet-item tw-flex tw-items-center tw-gap-2 tw-py-1';
    facetItem.innerHTML = `
      <input type="checkbox" id="${value.value}" ${value.state === 'selected' ? 'checked' : ''} class="tw-accent-blue-500 tw-w-4 tw-h-4">
      <label for="${value.value}">${value.value} (${value.numberOfResults})</label>
    `;

    facetItem.querySelector('input').addEventListener('change', () => {
      sourceFacetController.toggleSelect(value);
    });

    facetItemsContainer.appendChild(facetItem);
  });
  facetAccordion(values, facetElement, facetItemsContainer);
};

export const renderFiletypeFacet = () => {
  const facetElement = document.getElementById('filetype-facet');
  facetElement.innerHTML = '<h3 class="facet-header tw-text-gray-800 tw-text-lg tw-mb-2 tw-border-b tw-pb-1">Filetype</h3>';

  const { values } = filetypeFacetController.state;
  const facetItemsContainer = document.createElement('div');
  facetItemsContainer.className = 'facet-items-container';

  values.forEach((value) => {
    const facetItem = document.createElement('div');
    facetItem.className = 'facet-item tw-flex tw-items-center tw-gap-2 tw-py-1"';
    facetItem.innerHTML = `
      <input type="checkbox" id="${value.value}" ${value.state === 'selected' ? 'checked' : ''} class="tw-accent-blue-500 tw-w-4 tw-h-4">
      <label for="${value.value}">${value.value} (${value.numberOfResults})</label>
    `;

    facetItem.querySelector('input').addEventListener('change', () => {
      filetypeFacetController.toggleSelect(value);
    });

    facetItemsContainer.appendChild(facetItem);
  });

  facetAccordion(values, facetElement, facetItemsContainer);
};

export const renderTagsFacet = () => {
  const facetElement = document.getElementById('tags-facet');
  facetElement.innerHTML = '<h3 class="facet-header tw-text-gray-800 tw-text-lg tw-mb-2 tw-border-b tw-pb-1">Tags</h3>';

  const { values } = tagsFacetController.state;

  const facetItemsContainer = document.createElement('div');
  facetItemsContainer.className = 'facet-items-container';

  values.forEach((value) => {
    const facetItem = document.createElement('div');
    facetItem.className = 'facet-item tw-flex tw-items-center tw-gap-2 tw-py-1';
    facetItem.innerHTML = `
      <input type="checkbox" id="${value.value}" ${value.state === 'selected' ? 'checked' : ''} class="tw-accent-blue-500 tw-w-4 tw-h-4">
      <label for="${value.value}">${value.value.split('/').pop()} (${value.numberOfResults})</label>
    `;

    facetItem.querySelector('input').addEventListener('change', () => {
      tagsFacetController.toggleSelect(value);
    });

    facetItemsContainer.appendChild(facetItem);
  });

  facetAccordion(values, facetElement, facetItemsContainer);
};
