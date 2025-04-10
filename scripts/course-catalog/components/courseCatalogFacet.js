/* eslint-disable */
import { allFacetController } from '../course-catalog-controller/controllers.js';

function facetAccordion(values, facetElement, facetItemsContainer, facetId) {
  if (values.length !== 0) {
    facetElement.appendChild(facetItemsContainer);

    const facetHeader = facetElement.querySelector('.facet-header');
    facetHeader.setAttribute('aria-expanded', 'false');
    facetHeader.addEventListener('click', () => {
      const isVisible = facetItemsContainer.style.display === 'none';
      const icon = facetHeader.querySelector('span');
      facetItemsContainer.style.display = isVisible ? 'flex' : 'none';
      const { parentElement } = facetItemsContainer;
      const inputElement = Array.from(parentElement.children).find((child) => child.tagName.toLowerCase() === 'input');
      if (inputElement) {
        if (inputElement.style.display === 'none') {
          inputElement.style.display = 'block';
        } else {
          inputElement.style.display = 'none';
        }
      }
      icon.innerHTML = isVisible
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11L8 5L14 11" stroke="#0068FA"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 5L8 11L2 5" stroke="#0068FA"/></svg>';

      facetHeader.setAttribute('aria-expanded', !isVisible);
    });

    if (facetId === 'isnewcourse') {
      const h3Tag = facetElement.querySelector('h3.facet-header');
      if (h3Tag) {
        h3Tag.remove();
      }
    }
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
    const icon = document.createElement('span');
    const svg = className === 'show-more-btn'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/><path d="M6 0L6 12" stroke="#0068FA"/></svg>'
      : ' <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg>';
    icon.innerHTML = svg;
    button.appendChild(icon);
    return button;
  }

  function toggleValues(isShowMore) {
    // Toggle the visibility of the buttons
    buttons.showMore.style.display = isShowMore ? 'none' : 'inline';
    buttons.showLess.style.display = isShowMore ? 'inline' : 'none';
    isShowMore
      ? facetController.showMoreValues()
      : facetController.showLessValues();
  }

  // Append buttons to the container
  buttonContainer.appendChild(buttons.showMore);
  buttonContainer.appendChild(buttons.showLess);

  // Add the container to the facetItemsContainer
  facetItemsContainer.appendChild(buttonContainer);

  // Initially hide/show the buttons based on the controller's state
  if (facetController.state.canShowMoreValues) {
    buttons.showMore.style.display = 'flex';
  } else {
    buttons.showMore.style.display = 'none';
  }

  if (facetController.state.canShowLessValues) {
    buttons.showLess.style.display = 'flex';
  } else {
    buttons.showLess.style.display = 'none';
  }
}

function renderFacet(facetElementId, facetController, headerText) {
  const { facetId } = facetController.state;

  const facetElement = document.getElementById(facetElementId);

  let facetInputElement = null;
  if (facetId == 'massspectrometerscategories' || facetId == 'softwarecategories' || facetId == 'language' || facetId == 'instrumentfamily') {
    const element = document.getElementById(`${facetId}-input`);
    facetInputElement = element;
  }

  facetElement.innerHTML = `<h3 class="facet-header tw-text-gray-800 tw-text-lg tw-mb-2 tw-pb-1">${headerText}
    <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 11L8 5L14 11" stroke="#0068FA"/>
  </svg></span>
    </h3>`;

  const { values } = facetController.state;
  let facetItemsContainer = facetElement.querySelector('.facet-items-container');
  if (facetItemsContainer != null) {
    facetItemsContainer.remove();
  }
  facetItemsContainer = document.createElement('div');
  facetItemsContainer.className = 'facet-items-container';
  if (values.length) {
    facetElement.style.borderBottom = '1px solid #ececec';
  }
  let isSearch = false;
  if (facetId == 'massspectrometerscategories' || facetId == 'softwarecategories' || facetId == 'language' || facetId == 'instrumentfamily') {
    clearFacetFilter(facetElement, facetController);
    const facetInput = document.createElement('input');
    facetInput.type = 'text';
    facetInput.id = `${facetId}-input`;
    facetInput.maxLength = 20;
    facetInput.classList.add(
      'tw-border',
      'tw-p-2',
      'tw-rounded-lg',
      'tw-mt-2',
      'facet-search-box',
    );
    facetInput.placeholder = 'Search....';

    facetInput.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();
      if (query.length > 0) {
        sessionStorage.setItem('focusedElement', `${facetId}-input`);
        facetController.facetSearch.updateText(query);
        facetController.facetSearch.search();
      } else {
        isSearch = false;
        sessionStorage.removeItem('focusedElement');
        const searchresult = facetController.state.values;
        const itemContainer = facetElement.querySelector('.facet-items-container');
        itemContainer.innerHTML = '';
        isSearch = renderSearchFacets(facetController, itemContainer, facetElement, searchresult);
      }
    });

    if (facetInputElement == null) {
      facetElement.appendChild(facetInput);
    } else {
      facetElement.appendChild(facetInputElement);
      const focusedElementId = sessionStorage.getItem('focusedElement');
      const focusElement = document.getElementById(focusedElementId);
      if (focusedElementId) {
        setTimeout(() => {
          const currentScrollPosition = window.scrollY;
          focusElement.focus();
          window.scrollTo(0, currentScrollPosition);
        }, 0);
      }
      let searchresult = facetController.state.facetSearch.values;
      if (facetInputElement.value.trim() === '') {
        searchresult = facetController.state.values;
      }
      facetItemsContainer.innerHTML = '';
      isSearch = renderSearchFacets(facetController, facetItemsContainer, facetElement, searchresult);
    }
  }
  if (!isSearch) {
    values.forEach((value) => {
      if (facetId === 'applications' && value.value === 'Application') {
        return;
      }
      const facetItem = document.createElement('div');
      facetItem.className = 'facet-item tw-flex tw-items-center tw-gap-2 tw-py-1';
      facetItem.innerHTML = `
          <input type="checkbox" id="${value.value}" ${
  value.state === 'selected' ? 'checked' : ''
} class="tw-accent-blue-500 tw-w-4 tw-h-4">
          <label for="${value.value}">${value.value} (${
  value.numberOfResults
})</label>
        `;

      facetItem.querySelector('input').addEventListener('change', () => {
        const focusedElementId = sessionStorage.getItem('focusedElement');
        if (focusedElementId) {
          const focusElement = document.getElementById(focusedElementId);
          focusElement ? focusElement.value = '' : '';
          sessionStorage.removeItem('focusedElement');
        }
        facetController.toggleSelect(value);
      });

      facetItemsContainer.appendChild(facetItem);
    });

    clearFacetFilter(facetElement, facetController);
    orderContentTypeFacets(facetId, facetItemsContainer);
    createToggleButtons(facetItemsContainer, facetController);
    facetAccordion(values, facetElement, facetItemsContainer, facetId);
  }
}

function orderFacetChildren(facetElementId, desiredOrder) {
  const facetElement = document.getElementById(facetElementId);
  const facetChildren = Array.from(facetElement.children);

  facetChildren.sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.id);
    const indexB = desiredOrder.indexOf(b.id);
    return indexA - indexB;
  });

  facetChildren.forEach((child) => {
    facetElement.appendChild(child);
  });
}

function clearFacetFilter(facetElement, facetController) {
  const hasClearBtn = facetElement.querySelector('.clear-filter-btn');
  if (!hasClearBtn) {
    const clearButtonContainer = document.createElement('div');
    clearButtonContainer.className = 'clear-filter-btn';
    const clearButton = document.createElement('button');
    clearButton.style.marginLeft = '0';
    clearButton.style.marginRight = '10px';
    clearButton.textContent = 'Clear Filter';

    const clearIcon = document.createElement('span');
    clearIcon.innerHTML = '&#10005;';
    clearIcon.style.cursor = 'pointer';

    clearButtonContainer.appendChild(clearButton);
    clearButtonContainer.appendChild(clearIcon);

    const isSelected = facetController.state.values.some((value) => value.state === 'selected');
    if (isSelected) {
      facetElement.appendChild(clearButtonContainer);
      clearButtonContainer.addEventListener('click', () => {
        const focusedElementId = sessionStorage.getItem('focusedElement');
        if (focusedElementId) {
          const focusElement = document.getElementById(focusedElementId);
          focusElement.value = '';
          sessionStorage.removeItem('focusedElement');
        }
        facetController.deselectAll();
      });
    }
  }
}

function orderContentTypeFacets(facetId, facetItemsContainer) {
  if (facetId == 'contenttype') {
    const desiredOrder = [
      'Products and services',
      'Applications',
      'Regulatory documents',
      'Customer documents',
      'Resource library',
      'Training',
    ];

    const facetContainer = facetItemsContainer;

    const facetItems = facetContainer.querySelectorAll('.facet-item');

    const facetItemsArray = Array.from(facetItems).map((item) => {
      const label = item.querySelector('label').innerText.replace(/\s\(\d+\)$/, '');
      return { label, item };
    });

    facetItemsArray.sort((a, b) => {
      const aIndex = desiredOrder.indexOf(a.label);
      const bIndex = desiredOrder.indexOf(b.label);
      if (aIndex === -1 && bIndex === -1) {
        return 0;
      }
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }
      return aIndex - bIndex;
    });

    facetItemsArray.forEach((facet) => {
      facetContainer.appendChild(facet.item);
    });
  }
}

function createFacetRender(facetController, facetElementId, headerText) {
  let isValues = false;
  const { values } = facetController.state;
  if (values.length > 0) {
    isValues = true;
  }
  if (facetElementId.indexOf('product') != -1) {
    const startIndex = facetElementId.indexOf('product') + 'product'.length;
    facetElementId = facetElementId.substring(startIndex, facetElementId.length);
  }
  if (facetElementId.indexOf('course') != -1) {
    const startIndex = facetElementId.indexOf('course') + 'course'.length;
    facetElementId = facetElementId.substring(startIndex, facetElementId.length);
  }
  const id = `${facetElementId}-facet`;
  const ele = document.getElementById(id);
  if (ele !== null && !isValues) {
    ele.remove();
  }
  createFacetDiv(facetElementId);
  renderFacet(id, facetController, headerText);
}

function createFacetDiv(id) {
  const ele = document.getElementById(`${id}-facet`);
  const facetsElement = document.getElementById('facets');
  if (ele == null) {
    const mainFacetDiv = document.createElement('div');
    mainFacetDiv.id = `${id}-facet`;
    facetsElement.appendChild(mainFacetDiv);
  }
}

function renderSearchFacets(facetController, facetItemsContainer, facetElement, searchresult) {
  let isSearch = false;
  if (Array.isArray(searchresult) && searchresult.length > 0) {
    searchresult.forEach((value) => {
      const displayText = value.displayValue || value.value;
      const displaycount = value.count || value.numberOfResults;
      const item = document.createElement('div');
      item.className = 'facet-item tw-flex tw-items-center tw-gap-2 tw-py-1';
      item.innerHTML = `
          <input type="checkbox" id="${displayText}" ${
  value.state === 'selected' ? 'checked' : ''
} class="tw-accent-blue-500 tw-w-4 tw-h-4">
          <label for="${displayText}">${displayText} (${
  displaycount
})</label>
        `;
      item.querySelector('input').addEventListener('change', () => {
        facetController.toggleSelect(value);
      });
      facetItemsContainer.appendChild(item);
    });
    isSearch = true;
    facetAccordion(searchresult, facetElement, facetItemsContainer);
    createToggleButtons(facetItemsContainer, facetController);
  } else {
    isSearch = false;
  }
  return isSearch;
}

export function renderCourseCatalogFacet() {
  const facetController = allFacetController;
  const facetsId = {
    isnewcourse: '',
    coursetypecategories: 'Course type',
    trainingtopiccategories: 'Training topic',
    techniquescategories: 'Training Techniques',
    trainingtypecategories: 'Training type',
    levelcategories: 'Training Level',
    certificatetypecategories: 'Certificate type',
    massspectrometerscategories: 'Mass spectrometry',
    hplcandceproductscategories: 'Liquid chromoatography',
    integratedsolutionscategories: 'Integrated solutions',
    softwarecategories: 'Software',
    region: 'Training location',
    capillaryelectrophoresiscategories: 'Capillary electrophoresis',
    language : 'Language',
    applications: 'Applications',
  };

  for (const item in facetsId) {
    const val = facetController.get(item);
    if (val.state.values.length === 0) {
      const elementToRemove = document.querySelector(`#${val.state.facetId}-facet`);
      if (elementToRemove) {
        elementToRemove.remove();
      }
    }
    if (val.state.values.length) {
      createFacetRender(val, item, facetsId[item]);
    }
  }
  const desiredOrder = [
    'language-facet',
    'region-facet',
    'trainingtopiccategories-facet',
    'techniquescategories-facet',
    'trainingtypecategories-facet',
    'typecategories-facet',
    'levelcategories-facet',
    'certificatetypecategories-facet',
    'massspectrometerscategories-facet',
    'capillaryelectrophoresiscategories-facet',
    'scategories-facet',
    'softwarecategories-facet',
    'integratedsolutionscategories-facet',
    'applications-facet'
  ];
  orderFacetChildren('facets', desiredOrder);
}

export const handleMobileFilters = () => {
  const facets = document.querySelector('#facets');
  const mobileFilterHeader = document.querySelector('#mobile-filter-header');
  const mobileFilterFooter = document.querySelector('#mobile-filter-footer');
  const resultSection = document.getElementById('coveo-results');
  const footerWrapper = document.querySelector('.footer-wrapper');
  const body = document.querySelector('.generic-page-template');
  if (facets) {
    facets.style.display = facets.style.display === '' || facets.style.display === 'none'
      ? 'block'
      : 'none';
  }
  if (mobileFilterHeader) {
    if (mobileFilterHeader.classList.contains('tw-hidden')) {
      if (body) {
        body.classList.add('body-no-scroll');
      }
      mobileFilterHeader.classList.remove('tw-hidden');
      resultSection.style.display = 'none';
      footerWrapper.style.display = 'none';
    } else {
      if (body && body.classList.contains('body-no-scroll')) {
        body.classList.remove('body-no-scroll');
      }
      mobileFilterHeader.classList.add('tw-hidden');
      resultSection.style.display = 'block';
      footerWrapper.style.display = 'block';
    }
  }
  if (mobileFilterFooter) {
    if (mobileFilterFooter.classList.contains('tw-hidden')) {
      mobileFilterFooter.style.display = 'flex';
      mobileFilterFooter.classList.remove('tw-hidden');
    } else {
      mobileFilterFooter.style.display = 'none';
      mobileFilterFooter.classList.add('tw-hidden');
    }
  }
};
