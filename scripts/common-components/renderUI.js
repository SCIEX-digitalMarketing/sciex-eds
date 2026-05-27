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

async function initializeSerachInterface(block, blockName) {
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

  // Search input
  const searchInput = createElement('input', {
    type: 'text',
    id: 'coveo-query',
    placeholder: strings.search,
    maxLength: 200,
    classList: ['search-box', 'tw-w-full', 'tw-py-3', 'tw-px-4', 'tw-border', 'tw-border-gray-300', 'tw-rounded-md'],
  });

  // Search validation
  const searchTermValidation = createElement('div', { classList: ['search-term-validation'], id: 'searchTermValidation' });
  const validationText = createElement('div', { classList: ['search-validation-text'], id: 'validationText', text: strings.limitText });
  const validationCount = createElement('div', { classList: ['search-validation-count'], id: 'validationCount' });
  const validationError = createElement('div', { classList: ['search-validation-error'], id: 'validationError', text: strings.validationText });

  searchTermValidation.appendChild(validationText);
  searchTermValidation.appendChild(validationError);
  searchTermValidation.appendChild(validationCount);

  // Clear search input icon
  const clearSearchInput = createElement('span', {
    id: 'clear-search',
    className: 'clear-search',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 13L3.0001 3.0001" stroke="#141414"/><path d="M13 3L3.0001 12.9999" stroke="#141414"/></svg>',
  });

  // Search icon
  const searchIcon = createElement('span', {
    id: 'search-icon',
    className: 'search-icon',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0065 7.33324C12.0065 9.7264 10.0664 11.6665 7.67318 11.6665C5.27993 11.6665 3.33984 9.7264 3.33984 7.33324C3.33984 4.94007 5.27993 3 7.67318 3C10.0664 3 12.0065 4.94007 12.0065 7.33324ZM11.0743 11.4414C10.1512 12.2066 8.96589 12.6665 7.67318 12.6665C4.72766 12.6665 2.33984 10.2787 2.33984 7.33324C2.33984 4.38777 4.72766 2 7.67318 2C10.6187 2 13.0065 4.38777 13.0065 7.33324C13.0065 8.62593 12.5466 9.81119 11.7815 10.7343L14.0267 12.9796L14.3803 13.3331L13.6732 14.0402L13.3196 13.6867L11.0743 11.4414Z" fill="#707070"/></svg>',
  });

  // Append search input to search container
  const coveoSearchComponentDiv = createElement('div', {
    classList: ['coveo-search-component', 'tw-flex', 'tw-gap-2'],
    append: [searchIcon, searchInput, clearSearchInput],
  });

  // Create query sort section div
  const querySortSectionDiv = createElement('div', {
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
      coveoSearchComponentDiv,
      searchTermValidation,
      searchTermDiv,
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

export default initializeSerachInterface;
