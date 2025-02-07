/* eslint-disable */
import {
  sourceFacetController,
  filetypeFacetController,
  tagsFacetController,
} from '../controller/controllers.js';

let debounceTimeout;
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

function createToggleButtons(facetItemsContainer, facetController) {
  const buttonContainer = document.createElement('div'); // Container for buttons
  buttonContainer.classList.add('facet-toggle-buttons'); // Optional class for styling

  const buttons = {
    showMore: createButton('Show More', 'show-more-btn', () => toggleValues(true)),
    showLess: createButton('Show Less', 'show-less-btn', () => toggleValues(false)),
  };

  function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener('click', onClick);
    return button;
  }

  function toggleValues(isShowMore) {
    // Toggle the visibility of the buttons
    buttons.showMore.style.display = isShowMore ? 'none' : 'inline';
    buttons.showLess.style.display = isShowMore ? 'inline' : 'none';
    isShowMore ? facetController.showMoreValues() : facetController.showLessValues();
  }

  // Append buttons to the container
  buttonContainer.appendChild(buttons.showMore);
  buttonContainer.appendChild(buttons.showLess);

  // Add the container to the facetItemsContainer
  facetItemsContainer.appendChild(buttonContainer);

  // Initially hide/show the buttons based on the controller's state
  if (facetController.state.canShowMoreValues) {
    buttons.showMore.style.display = 'inline';
  } else {
    buttons.showMore.style.display = 'none';
  }

  if (facetController.state.canShowLessValues) {
    buttons.showLess.style.display = 'inline';
  } else {
    buttons.showLess.style.display = 'none';
  }
}

function renderFacet(facetElementId, facetController, headerText) {
  const facetElement = document.getElementById(facetElementId);
  facetElement.innerHTML = `<h3 class="facet-header tw-text-gray-800 tw-text-lg tw-mb-2 tw-border-b tw-pb-1">${headerText}</h3>`;

  const { values } = facetController.state;
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
      facetController.toggleSelect(value);
    });

    facetItemsContainer.appendChild(facetItem);
  });

  facetAccordion(values, facetElement, facetItemsContainer);
  createToggleButtons(facetItemsContainer, facetController);
}

function createFacetRender(facetController, facetElementId, headerText) {
  renderFacet(facetElementId, facetController, headerText);
}

export const renderSourceFacet = () => createFacetRender(sourceFacetController, 'source-facet', 'Products');
export const renderFiletypeFacet = () => createFacetRender(filetypeFacetController, 'filetype-facet', 'Filetype');
export const renderTagsFacet = () => createFacetRender(tagsFacetController, 'tags-facet', 'Course Catalog');
