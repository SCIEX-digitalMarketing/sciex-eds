import { handleMobileFilters } from './commonFacets.js';
import { i18n } from '../translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

// Helper function for creating DOM elements
function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  Object.entries(options).forEach(([key, value]) => {
    if (key === 'classList') el.classList.add(...value);
    else if (key === 'text') el.textContent = value;
    else if (key === 'html') el.innerHTML = value;
    else if (key === 'append') el.append(...value);
    else if (key === 'addEventListener') el.addEventListener(...value);
    else el.setAttribute(key, value);
  });
  return el;
}

async function initializefavoriteSearchInterface(block, blockName) {
  // Create main container div
  const courseCatalogDiv = createElement('div', { classList: ['tw', blockName, 'tw-bg-white'] });

  // Create search wrapper div
  const searchWrapperDiv = createElement('div', {
    classList: ['search-wrapper', 'tw-flex', 'tw-gap-5', 'tw-flex-wrap', 'tw-mx-auto'],
  });

  // Create facets div
  const facetsDiv = createElement('div', {
    id: 'facets',
    classList: ['facet-section', 'tw-bg-white', 'tw-p-5', 'tw-rounded-lg', 'tw-w-1/4'],
  });

  // Create mobile filter section
  const mobileFilterButton = createElement('div', { id: 'mobile-filters' });
  const mobileFilterButtonspan = createElement('span');
  const mobileFilterButtonIcon = createElement('span');
  mobileFilterButtonspan.textContent = strings.filter;
  mobileFilterButtonIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M5 2L9.87202e-08 2" stroke="#0068FA"/><path d="M11 10L16 10" stroke="#0068FA"/><path d="M16 2L10 2" stroke="#0068FA"/><path d="M0 10H6" stroke="#0068FA"/><circle cx="6" cy="2" r="1.5" stroke="#0068FA"/><circle cx="2" cy="2" r="1.5" transform="matrix(-1 0 0 1 12 8)" stroke="#0068FA"/></svg>';
  mobileFilterButton.append(mobileFilterButtonspan);
  mobileFilterButton.append(mobileFilterButtonIcon);
  mobileFilterButton.addEventListener('click', handleMobileFilters);

  // Mobile filter header
  const mobileFilterHeader = createElement('div', {
    id: 'mobile-filter-header',
    classList: ['tw-hidden', 'tw-flex', 'tw-py-20', 'tw-px-24', 'tw-justify-between', 'tw-border-b-2', 'tw-border-gray-500', 'tw-bg-white'],
  });
  const mobileFilterHeaderText = createElement('span', { text: strings.filter });
  const mobileFilterHeaderIcon = createElement('span', {
    html: '<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 13.5L3.0001 3.5001" stroke="#141414"/><path d="M13 3.5L3.0001 13.4999" stroke="#141414"/></svg>',
  });
  mobileFilterHeader.append(mobileFilterHeaderText, mobileFilterHeaderIcon);
  mobileFilterHeaderIcon.addEventListener('click', handleMobileFilters);

  // Mobile filter footer
  const mobileFilterFooter = createElement('div', {
    id: 'mobile-filter-footer',
    classList: ['tw-hidden', 'tw-flex', 'tw-py-20', 'tw-px-24', 'tw-justify-between', 'tw-border-b-2', 'tw-border-gray-500', 'tw-bg-white'],
  });
  const mobileFilterFooterClearButton = createElement('button', {
    text: strings.clearAll,
    id: 'mobile-filter-footer-clear-all',
  });
  const mobileFilterFooterResultsButton = createElement('button', {
    id: 'mobile-filter-footer-results',
    addEventListener: ['click', handleMobileFilters],
  });
  mobileFilterFooter.append(mobileFilterFooterClearButton, mobileFilterFooterResultsButton);

  // Search term
  const searchTermDiv = createElement('div', { classList: ['search-term-container'], id: 'searchTermContainer' });
  const searchTermLabel = createElement('div', { classList: ['search-term-label'], text: strings.searchTerm });
  const searchTermValue = createElement('div', { classList: ['search-term-value'], id: 'searchTermValue' });
  searchTermDiv.append(searchTermLabel, searchTermValue);

  // Search validation
  const searchTermValidation = createElement('div', { classList: ['search-term-validation'], id: 'searchTermValidation' });
  const validationText = createElement('div', { classList: ['search-validation-text'], id: 'validationText', text: strings.limitText });
  const validationCount = createElement('div', { classList: ['search-validation-count'], id: 'validationCount' });
  const validationError = createElement('div', { classList: ['search-validation-error'], id: 'validationError', text: strings.validationText });

  searchTermValidation.appendChild(validationText);
  searchTermValidation.appendChild(validationError);
  searchTermValidation.appendChild(validationCount);

  // Create query sort section div
  const querySortSectionDiv = createElement('div', {
    id: 'query-sort-section',
    classList: ['query-sort-section', 'tw-flex', 'tw-justify-between', 'tw-items-center'],
  });

  // Create query summary div
  const querySummaryDiv = createElement('div', { id: 'query-summary', classList: ['tw-text-sm'] });

  // Create sort div
  const sortDiv = createElement('div', {
    id: 'sort',
    classList: ['tw-flex', 'tw-justify-center'],
  });

  // Append query summary and sort divs to query sort section
  querySortSectionDiv.append(querySummaryDiv, mobileFilterButton, sortDiv);

  // Create pagination div
  const paginationDiv = createElement('div', {
    id: 'pagination',
    classList: ['pagination', 'tw-flex', 'tw-justify-center', 'tw-gap-1', 'tw-mt-6'],
  });

  // Create facets breadcrumb div
  const facetBreadcrumbDiv = createElement('div', { id: 'facet-readcrumb' });

  // Create results section div
  const coveoResultsDiv = createElement('div', { id: 'coveo-results', classList: ['result-section'] });

  // Create loading results div
  const coveoResultsLoading = createElement('div', {
    id: 'coveo-results-loading',
    className: 'result-loading-section tw-text-center tw-text-2xl',
    text: strings.loading,
  });

  // Append all sections to the search result section div
  const searchResultSectionDiv = createElement('div', {
    classList: ['search-result-section', 'tw-flex-1'],
    append: [
      querySortSectionDiv,
      facetBreadcrumbDiv,
      coveoResultsLoading,
      coveoResultsDiv,
      paginationDiv,
    ],
  });

  // Append facets and search result sections to search
  searchWrapperDiv.appendChild(mobileFilterHeader);
  searchWrapperDiv.appendChild(facetsDiv);
  searchWrapperDiv.appendChild(mobileFilterFooter);
  searchWrapperDiv.appendChild(searchResultSectionDiv);

  // Append the main search result div to the body or any specific container
  courseCatalogDiv.appendChild(searchWrapperDiv);
  block.append(courseCatalogDiv);
}

export default initializefavoriteSearchInterface;
