/* eslint-disable */
import {contentTypeFacetController, allFacetController, facetBreadcrumb } from "../controller/controllers.js";
import { i18n } from "../../translation.js";

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

function facetAccordion(values, facetElement, facetItemsContainer) {
  if (values.length !== 0) {
    facetElement.appendChild(facetItemsContainer);

    const facetHeader = facetElement.querySelector(".facet-header");
    facetHeader.setAttribute("aria-expanded", "false");

    facetHeader.addEventListener("click", () => {
      const isVisible = facetItemsContainer.style.display === "none";
      const icon = facetHeader.querySelector("span");
      facetItemsContainer.style.display = isVisible ? "flex" : "none";
      const parentElement = facetItemsContainer.parentElement;
      const inputElement = Array.from(parentElement.children).find(child => child.tagName.toLowerCase() === 'input');
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

      facetHeader.setAttribute("aria-expanded", !isVisible);
    });
  } else {
    facetElement.innerHTML = "";
  }
}

function createToggleButtons(facetItemsContainer, facetController) {
  const buttonContainer = document.createElement("div"); // Container for buttons
  buttonContainer.classList.add("facet-toggle-buttons"); // Optional class for styling

  const buttons = {
    showMore: createButton(strings.showMore, "show-more-btn", () =>
      toggleValues(true)
    ),
    showLess: createButton(strings.showLess, "show-less-btn", () =>
      toggleValues(false)
    ),
  };

  function createButton(text, className, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener("click", onClick);
    const icon = document.createElement("span");
    const svg =
      className === "show-more-btn"
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/><path d="M6 0L6 12" stroke="#0068FA"/></svg>'
        : ' <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg>';
    icon.innerHTML = svg;
    button.appendChild(icon);
    return button;
  }

  function toggleValues(isShowMore) {
    // Toggle the visibility of the buttons
    buttons.showMore.style.display = isShowMore ? "none" : "inline";
    buttons.showLess.style.display = isShowMore ? "inline" : "none";
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
    buttons.showMore.style.display = "flex";
  } else {
    buttons.showMore.style.display = "none";
  }

  if (facetController.state.canShowLessValues) {
    buttons.showLess.style.display = "flex";
  } else {
    buttons.showLess.style.display = "none";
  }
}

function renderFacet(facetElementId, facetController, headerText) {
  const facetId = facetController.state.facetId;
  const facetElement = document.getElementById(facetElementId);
  const shouldHaveInput = ['massspectrometerscategories', 'softwarecategories', 'language', 'instrumentfamily'].includes(facetId);

  let previousInputValue = '';
  let previousCaret = 0;
  let wasFocused = false;

  // Check if input exists and was focused before render
  const previousInput = document.getElementById(facetId + '-input');
  if (previousInput) {
    previousInputValue = previousInput.value;
    previousCaret = previousInput.selectionStart || previousInput.value.length;
    wasFocused = document.activeElement === previousInput;
  }

  // Clear everything inside facet element
  facetElement.innerHTML = '';

  // Build and add header
  const header = document.createElement('h3');
  header.className = 'facet-header tw-text-gray-800 tw-text-lg tw-mb-2 tw-pb-1';
  header.innerHTML = `${headerText}
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path d="M2 11L8 5L14 11" stroke="#0068FA" />
      </svg>
    </span>`;
  facetElement.appendChild(header);

  // Create and add input (for certain facetIds)
  let facetInputElement = null;
  if (shouldHaveInput) {
    facetInputElement = document.createElement('input');
    facetInputElement.type = 'text';
    facetInputElement.id = facetId + '-input';
    facetInputElement.classList.add('tw-border', 'tw-p-2', 'tw-rounded-lg', 'tw-mt-2', 'facet-search-box');
    facetInputElement.placeholder = strings.search;
    facetInputElement.value = previousInputValue;

    facetInputElement.addEventListener('input', function (event) {
      const query = event.target.value.toLowerCase();
      sessionStorage.setItem('focusedElement', facetInputElement.id);
      const scrollY = window.scrollY;
      const caret = facetInputElement.selectionStart;

      if (query.length > 0) {
        facetController.facetSearch.updateText(query);
        facetController.facetSearch.search();
      } else {
        sessionStorage.removeItem('focusedElement');
        const defaultValues = facetController.state.values;
        facetItemsContainer.innerHTML = '';
        renderSearchFacets(facetController, facetItemsContainer, facetElement, defaultValues);
      }

      // Restore caret + scroll after async update
      requestAnimationFrame(() => {
        const newInput = document.getElementById(facetId + '-input');
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(caret, caret);
          window.scrollTo(0, scrollY);
        }
      });
    });

    facetElement.appendChild(facetInputElement);
  }

  // Create and add container for facet items
  const facetItemsContainer = document.createElement('div');
  facetItemsContainer.className = 'facet-items-container';
  facetElement.appendChild(facetItemsContainer);

  const values = facetController.state.values;
  const searchValues = facetController.state.facetSearch?.values || [];

  let isSearch = false;

  if (shouldHaveInput && facetInputElement && facetInputElement.value.trim() !== '') {
    renderSearchFacets(facetController, facetItemsContainer, facetElement, searchValues.length ? searchValues : values);
    isSearch = true;
  }

  if (!isSearch) {
    values.forEach(value => {
      if (facetId === 'applications' && value.value === 'Application') return;

      const facetItem = document.createElement('div');
      facetItem.className = 'facet-item tw-flex tw-items-center tw-gap-2 tw-py-1';
      facetItem.innerHTML = `        
        <input type="checkbox" id="${value.value}" ${value.state === "selected" ? "checked" : ""} class="tw-accent-blue-500 tw-w-4 tw-h-4">
        <label for="${value.value}">${value.value} (${value.numberOfResults})</label>
      `;

      facetItem.querySelector("input").addEventListener("change", () => {
        sessionStorage.removeItem('focusedElement');
        if (facetInputElement) {
          facetInputElement.value = '';
        }
        facetController.toggleSelect(value);
      });

      facetItemsContainer.appendChild(facetItem);
    });

    if (facetId === 'contenttype') {
      const isOrderingExecuted = localStorage.getItem('isOrderingExecuted') === 'true';
      if(!facetBreadcrumb.state.facetBreadcrumbs.length){
        localStorage.setItem('isOrderingExecuted', 'false');
      }
      if (!isOrderingExecuted) {
        const selectedValues = facetController.state.values.filter(value => value.state === "selected");
        if (selectedValues.length > 0) {
          const selectedValue = selectedValues[0].value;
          orderFacetBasedOnSelection(selectedValue);
          localStorage.setItem('isOrderingExecuted', 'true');
        }
      }
    }
    
    clearFacetFilter(facetElement, facetController);
    orderContentTypeFacets(facetId, facetItemsContainer);
    facetAccordion(values, facetElement, facetItemsContainer);
    createToggleButtons(facetItemsContainer, facetController);
  }

  // Restore focus if it was active before re-render
  if (shouldHaveInput && wasFocused && facetInputElement) {
    requestAnimationFrame(() => {
      facetInputElement.focus();
      facetInputElement.setSelectionRange(previousCaret, previousCaret);
    });
  }
}


function clearFacetFilter(facetElement,facetController){
  const hasClearBtn = facetElement.querySelector('.clear-filter-btn');
  if(!hasClearBtn){
    const clearButtonContainer = document.createElement('div');
    clearButtonContainer.className = "clear-filter-btn";
    const clearButton = document.createElement('button');
    clearButton.style.marginLeft = '0';
    clearButton.style.marginRight = '10px';
    clearButton.textContent = strings.clearFilter;
  
    const clearIcon = document.createElement('span');
    clearIcon.innerHTML = '&#10005;';
    clearIcon.style.cursor = 'pointer';
  
    clearButtonContainer.appendChild(clearButton);
    clearButtonContainer.appendChild(clearIcon);
  
    const isSelected = facetController.state.values.some(value => value.state === 'selected');
    if(isSelected){
      facetElement.appendChild(clearButtonContainer)
      clearButtonContainer.addEventListener('click', () => {
        const focusedElementId = sessionStorage.getItem('focusedElement');
        if(focusedElementId){
          const focusElement = document.getElementById(focusedElementId);
          focusElement ? focusElement.value = '' : '';
          sessionStorage.removeItem('focusedElement');
        }
        facetController.deselectAll();
      });
    }
  }
}

function renderSearchFacets(facetController, facetItemsContainer,facetElement,searchresult){
  let isSearch=false;
    if (Array.isArray(searchresult) && searchresult.length > 0) {
      searchresult.forEach((value) => {
        const displayText = value.displayValue || value.value;
        const displaycount = value.count || value.numberOfResults;
        const item = document.createElement("div");
        item.className = "facet-item tw-flex tw-items-center tw-gap-2 tw-py-1";
        item.innerHTML = `
          <input type="checkbox" id="${displayText}" ${
          value.state === "selected" ? "checked" : ""
        } class="tw-accent-blue-500 tw-w-4 tw-h-4">
          <label for="${displayText}">${displayText} (${
            displaycount
        })</label>
        `;
        item.querySelector("input").addEventListener("change", () => {
          facetController.toggleSelect(value);
        });
        facetItemsContainer.appendChild(item);
      });
      isSearch=true;
      facetAccordion(searchresult, facetElement, facetItemsContainer);
     createToggleButtons(facetItemsContainer, facetController);
    } else {
      isSearch=false;
    }
    return isSearch
  }
  
  function orderFacetChildren(facetElementId, desiredOrder) {
    const facetElement = document.getElementById(facetElementId);
    if (!facetElement) {
      return;
    }
  
    requestAnimationFrame(() => {
      const facetChildren = Array.from(facetElement.children);
  
      if (facetChildren.length === 0) {
        return;
      }
  
      facetChildren.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.id);
        const indexB = desiredOrder.indexOf(b.id);
  
        // If the ID is not found in the desiredOrder, move it to the end of the list
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
  
        return indexA - indexB;
      });
  
  
      facetChildren.forEach(child => {
        facetElement.appendChild(child);
      });
    });
  }
  
  

function orderFacetBasedOnSelection(selectedValue) {
  let desiredOrder = [];

  if (selectedValue === 'Products and services') {
    desiredOrder = [
      'contenttype-facet',
      'massspectrometerscategories-facet',
      'capillaryelectrophoresiscategories-facet',
      'hplcandceproductscategories-facet',
      'integratedsolutionscategories-facet',
      'softwarecategories-facet',
      'standardsandreagentscategories-facet',
    ];
    orderFacetChildren('facets', desiredOrder);
  } else if (selectedValue === 'Regulatory documents') {
    desiredOrder = [
      'contenttype-facet',
      'technicaldocuments-facet',
      'instrumentfamily-facet',
      'languagecountry-facet',
      'year-facet'
    ];
    orderFacetChildren('facets', desiredOrder);
  } else if (selectedValue === 'Resource library') {
    desiredOrder = [
      'contenttype-facet',
      'assettypes-facet',
      'applications-facet',
      'massspectrometerscategories-facet',
      'capillaryelectrophoresiscategories-facet',
      'hplcandceproductscategories-facet',
      'integratedsolutionscategories-facet',
      'softwarecategories-facet',
      'standardsandreagentscategories-facet',
      'language-facet'
    ];
    orderFacetChildren('facets', desiredOrder);
  } else if (selectedValue === 'Training') {
    desiredOrder = [
      'contenttype-facet',
      'location-facet',
      'coursetypecategories-facet',
      'trainingtopiccategories-facet',
      'techniquescategories-facet',
      'trainingtypecategories-facet',
      'levelcategories-facet',
      'certificatetypecategories-facet',
      'language-facet',
      'massspectrometerscategories-facet',
      'capillaryelectrophoresiscategories-facet',
      'hplcandceproductscategories-facet',
      'integratedsolutionscategories-facet',
      'softwarecategories-facet',
      'standardsandreagentscategories-facet',
    ];
    orderFacetChildren('facets', desiredOrder);
  } else if (selectedValue === 'Customer documents') {
    desiredOrder = [
      'contenttype-facet',
      'assettypes-facet',
      'year-facet',
      'language-facet',
      'massspectrometerscategories-facet',
      'capillaryelectrophoresiscategories-facet',
      'hplcandceproductscategories-facet',
      'integratedsolutionscategories-facet',
      'softwarecategories-facet',
      'standardsandreagentscategories-facet',
    ];
    orderFacetChildren('facets', desiredOrder);
  }
}

function orderContentTypeFacets(facetId,facetItemsContainer){
  if (facetId == 'contenttype') {
    const desiredOrder = [
        "Products and services",
        "Applications",
        "Regulatory documents",
        "Customer documents",
        "Resource library",
        "Training"
    ];

    const facetContainer = facetItemsContainer;

    const facetItems = facetContainer.querySelectorAll('.facet-item');

    const facetItemsArray = Array.from(facetItems).map(item => {
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

    facetItemsArray.forEach(facet => {
        facetContainer.appendChild(facet.item);
    });
  }
}

function createFacetRender(facetController, facetElementId, headerText) {
  let isValues = false;
  const { values } = facetController.state;
  if(values.length > 0) {
    isValues = true;
  }
  const id= facetElementId+"-facet";
  const ele= document.getElementById( id);
  if(ele !== null && !isValues) {
    ele.remove();
  }
  createFacetDiv(facetElementId);
  renderFacet(id, facetController, headerText); 
}

function createFacetDiv(id) {
  const ele= document.getElementById( id+'-facet');
  const facetsElement = document.getElementById('facets');
  if(ele == null) {
    const mainFacetDiv = document.createElement('div');
    mainFacetDiv.id = id+'-facet';
    facetsElement.appendChild(mainFacetDiv);
  } 
}

export function callCreateFacet(){
  createFacetRender(contentTypeFacetController, "contenttype", strings.contentType);
  const facetController = allFacetController;
  const facetsId = {
    'coursetypecategories': strings.courseType,
    'certificatetypecategories': strings.certificateType,
    'capillaryelectrophoresiscategories': strings.capillaryElectrophoresis,
    'hplcandceproductscategories': strings.liquidChromoatography,
    'integratedsolutionscategories': strings.integratedSolutions,
    'levelcategories': strings.level,
    'massspectrometerscategories': strings.massSpectrometry,
    'softwarecategories': strings.software,
    'standardsandreagentscategories': strings.standardsAndReagentKits,
    'techniquescategories': strings.techniques,
    'trainingtopiccategories': strings.trainingTopic,
    'trainingtypecategories': strings.trainingType,
    'assettypes': strings.assetType,
    'languagecountry': strings.languageCountry,
    'language' : strings.language,
    'year': strings.year,
    'location': strings.trainingLocation,
    'applications': strings.applications,
    'technicaldocuments': strings.technicalDocuments,
    'instrumentfamily': strings.instrumentFamily,
    'productcategories': strings.products
  };

  for (let item in facetsId) {
    const val = facetController.get(item);
    if (val.state.values.length === 0) {
      const elementToRemove = document.querySelector(`#${val.state.facetId}-facet`);
      if (elementToRemove) {
        elementToRemove.remove();
      }
    }
    if(val.state.values.length){
      createFacetRender(val,item,facetsId[item]);
    }
  };
}

export const handleMobileFilters = () => {
  const facets = document.querySelector("#facets");
  const mobileFilterHeader = document.querySelector("#mobile-filter-header");
  const mobileFilterFooter = document.querySelector("#mobile-filter-footer");
  const resultSection = document.getElementById('coveo-results');
  const footerWrapper = document.querySelector('.footer-wrapper');
  const body = document.querySelector(".generic-page-template");
  if (facets) {
    facets.style.display =
      facets.style.display === "" || facets.style.display === "none"
        ? "block"
        : "none";
  }
  if (mobileFilterHeader) {
    if (mobileFilterHeader.classList.contains("tw-hidden")) {
      if (body) {
        body.classList.add("body-no-scroll");
      }
      mobileFilterHeader.classList.remove("tw-hidden");
      resultSection.style.display = 'none';
      footerWrapper.style.display = 'none';
    } else {
      if (body && body.classList.contains("body-no-scroll")) {
        body.classList.remove("body-no-scroll");
      }
      mobileFilterHeader.classList.add("tw-hidden");
      resultSection.style.display = 'block';
      footerWrapper.style.display = 'block';
    }
  }
  if (mobileFilterFooter) {
    if (mobileFilterFooter.classList.contains("tw-hidden")) {
      mobileFilterFooter.style.display='flex'
      mobileFilterFooter.classList.remove("tw-hidden");
    } else {
      mobileFilterFooter.style.display='none'
      mobileFilterFooter.classList.add("tw-hidden");
    }
  }
};
      