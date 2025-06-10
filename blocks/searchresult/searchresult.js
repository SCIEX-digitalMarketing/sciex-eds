import {} from '../../scripts/aem.js';
// eslint-disable-next-line
import { loadQueryActions, loadFacetSetActions } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';
import { searchEngine } from '../../scripts/searchresult/engine.js';
import renderSearchBox from '../../scripts/searchresult/components/renderSearchBox.js';
import renderSearchResults from '../../scripts/searchresult/components/renderSearchResult.js';
import {
  callCreateFacet,
  handleMobileFilters,
} from '../../scripts/searchresult/components/categoryFacets.js';
import renderPagination from '../../scripts/searchresult/components/pagination.js';
import renderQuerySummary from '../../scripts/searchresult/components/querySummary.js';
import renderSorting from '../../scripts/searchresult/components/sorting.js';
import { renderFacetBreadcurm, handleClearMobileFilters } from '../../scripts/searchresult/components/facetBreadcrumb.js';
import { contentTypeFacetController } from '../../scripts/searchresult/controller/controllers.js';
import { i18n } from '../../scripts/translation.js';

export default async function decorate(block) {
  const lang = document.documentElement.lang || 'en';
  const strings = i18n[lang] || i18n.en;

  // Create main container div
  const searchResultDiv = document.createElement('div');
  searchResultDiv.classList.add('tw', 'search-result', 'tw-bg-white');

  // Create search wrapper div
  const searchWrapperDiv = document.createElement('div');
  searchWrapperDiv.classList.add(
    'search-wrapper',
    'tw-flex',
    'tw-gap-5',
    'tw-flex-wrap',
    'tw-mx-auto',
  );

  // Create facets div
  const facetsDiv = document.createElement('div');
  facetsDiv.id = 'facets';
  facetsDiv.classList.add(
    'facet-section',
    'tw-bg-white',
    'tw-p-5',
    'tw-rounded-lg',
    'tw-w-1/4',
  );

  // Create mobile filter header
  const mobileFilterHeader = document.createElement('div');
  mobileFilterHeader.id = 'mobile-filter-header';
  mobileFilterHeader.classList.add(
    'tw-hidden',
    'tw-flex',
    'tw-py-20',
    'tw-px-24',
    'tw-justify-between',
    'tw-border-b-2',
    'tw-border-gray-500',
    'tw-bg-white',
  );
  // mobile filter header text
  const mobileFilterHeaderText = document.createElement('span');
  mobileFilterHeaderText.textContent = 'Filter';
  // mobile filter header icon
  const mobileFilterHeaderIcon = document.createElement('span');
  mobileFilterHeaderIcon.innerHTML = '<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 13.5L3.0001 3.5001" stroke="#141414"/><path d="M13 3.5L3.0001 13.4999" stroke="#141414"/></svg>';

  mobileFilterHeader.append(mobileFilterHeaderText);
  mobileFilterHeader.append(mobileFilterHeaderIcon);
  // add  [ handle mobile filter ]  function on click
  mobileFilterHeaderIcon.addEventListener('click', handleMobileFilters);

  // Create mobile filter footer
  const mobileFilterFooter = document.createElement('div');
  mobileFilterFooter.id = 'mobile-filter-footer';
  mobileFilterFooter.classList.add(
    'tw-hidden',
    'tw-flex',
    'tw-py-20',
    'tw-px-24',
    'tw-justify-between',
    'tw-border-b-2',
    'tw-border-gray-500',
    'tw-bg-white',
  );
  // mobile filter clear Button
  const mobileFilterFooterClearButton = document.createElement('button');
  mobileFilterFooterClearButton.textContent = strings.clearAll;
  mobileFilterFooterClearButton.id = 'mobile-filter-footer-clear-all';
  mobileFilterFooterClearButton.addEventListener('click', handleClearMobileFilters);

  // mobile filter results Button
  const mobileFilterFooterResultsButton = document.createElement('button');
  mobileFilterFooterResultsButton.id = 'mobile-filter-footer-results';
  mobileFilterFooterResultsButton.addEventListener('click', handleMobileFilters);

  mobileFilterFooter.append(mobileFilterFooterClearButton);
  mobileFilterFooter.append(mobileFilterFooterResultsButton);

  // Create source facet div
  const sourceFacetDiv = document.createElement('div');
  sourceFacetDiv.id = 'source-facet';

  // Create software facet div
  const softwareFacetDiv = document.createElement('div');
  softwareFacetDiv.id = 'software-facet';

  // Create techniques facet div
  const techniquesFacetDiv = document.createElement('div');
  techniquesFacetDiv.id = 'techniques-facet';

  // Create diagnostics facet div
  const diagnosticsFacetDiv = document.createElement('div');
  diagnosticsFacetDiv.id = 'diagnostics-facet';

  // Create training facet div
  const trainingFacetDiv = document.createElement('div');
  trainingFacetDiv.id = 'training-facet';

  // Create hplc facet div
  const hplcFacetDiv = document.createElement('div');
  hplcFacetDiv.id = 'hplc-facet';

  // Create source input box
  const sourceInput = document.createElement('input');
  sourceInput.type = 'text';
  sourceInput.id = 'source-input';
  sourceInput.classList.add(
    'tw-border',
    'tw-p-2',
    'tw-rounded-lg',
    'tw-mt-2',
    'facet-search-box',
  );
  sourceInput.placeholder = 'Enter source...';

  // Create suggestion box
  const sourceSuggestionBox = document.createElement('div');
  sourceSuggestionBox.id = 'suggestion-box';
  sourceSuggestionBox.classList.add(
    'tw-hidden',
    'tw-mt-2',
    'tw-border',
    'tw-border-gray-300',
    'tw-rounded-md',
    'tw-bg-white',
  );
  sourceSuggestionBox.style.position = 'absolute';
  // Create filetype facet div
  const filetypeFacetDiv = document.createElement('div');
  filetypeFacetDiv.id = 'filetype-facet';

  // Create tags facet div
  const tagsFacetDiv = document.createElement('div');
  tagsFacetDiv.id = 'tags-facet';
  // Create suggestion box
  const tagSuggestionBox = document.createElement('div');
  tagSuggestionBox.id = 'tag-suggestion-box';
  tagSuggestionBox.classList.add(
    'tw-hidden',
    'tw-mt-2',
    'tw-border',
    'tw-border-gray-300',
    'tw-rounded-md',
    'tw-bg-white',
  );
  tagSuggestionBox.style.position = 'absolute';

  // Create search result section div
  const searchResultSectionDiv = document.createElement('div');
  searchResultSectionDiv.classList.add('search-result-section', 'tw-flex-1');

  // Create search container div
  const searchContainerDiv = document.createElement('div');
  searchContainerDiv.classList.add(
    'search-container',
    'tw-p-5',
    'tw-rounded-lg',
  );

  // Create search term
  const searchTermDiv = document.createElement('div');
  searchTermDiv.className = 'search-term-container';
  searchTermDiv.id = 'searchTermContainer';
  const searchTermLabel = document.createElement('div');
  searchTermLabel.className = 'search-term-label';
  searchTermLabel.innerHTML = 'Search term';
  const searchTermValue = document.createElement('div');
  searchTermValue.className = 'search-term-value';
  searchTermValue.id = 'searchTermValue';
  searchTermDiv.appendChild(searchTermLabel);
  searchTermDiv.appendChild(searchTermValue);

  // Function to create an element with specific classes and text content
  function createElement(tag, className, id, textContent = '') {
    const element = document.createElement(tag);
    element.className = className;
    element.id = id;
    if (textContent) {
      element.textContent = textContent;
    }
    return element;
  }

  const searchTermValidation = createElement('div', 'search-term-validation', 'searchTermValidation');

  const validationText = createElement('div', 'search-validation-text', 'validationText', strings.limitText);
  const validationCount = createElement('div', 'search-validation-count', 'validationCount');
  const validationError = createElement('div', 'search-validation-error', 'validationError', strings.validationText);

  searchTermValidation.appendChild(validationText);
  searchTermValidation.appendChild(validationError);
  searchTermValidation.appendChild(validationCount);

  // Create search input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'coveo-query';
  searchInput.placeholder = strings.search;
  searchInput.maxLength = 20;
  searchInput.classList.add(
    'search-box',
    'tw-w-full',
    'tw-py-3',
    'tw-px-4',
    'tw-border',
    'tw-border-gray-300',
    'tw-rounded-md',
  );

  const clearSearchInput = document.createElement('span');
  clearSearchInput.id = 'clear-search';
  clearSearchInput.className = 'clear-search';
  clearSearchInput.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M13 13L3.0001 3.0001" stroke="#141414"/>
    <path d="M13 3L3.0001 12.9999" stroke="#141414"/>
  </svg>`;

  const searchIcon = document.createElement('span');
  searchIcon.id = 'search-icon';
  searchIcon.className = 'search-icon';
  searchIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0065 7.33324C12.0065 9.7264 10.0664 11.6665 7.67318 11.6665C5.27993 11.6665 3.33984 9.7264 3.33984 7.33324C3.33984 4.94007 5.27993 3 7.67318 3C10.0664 3 12.0065 4.94007 12.0065 7.33324ZM11.0743 11.4414C10.1512 12.2066 8.96589 12.6665 7.67318 12.6665C4.72766 12.6665 2.33984 10.2787 2.33984 7.33324C2.33984 4.38777 4.72766 2 7.67318 2C10.6187 2 13.0065 4.38777 13.0065 7.33324C13.0065 8.62593 12.5466 9.81119 11.7815 10.7343L14.0267 12.9796L14.3803 13.3331L13.6732 14.0402L13.3196 13.6867L11.0743 11.4414Z" fill="#707070"/>
  </svg>`;

  // Append search input to search container
  const coveoSearchComponentDiv = document.createElement('div');
  coveoSearchComponentDiv.classList.add(
    'coveo-search-component',
    'tw-flex',
    'tw-gap-2',
  );
  coveoSearchComponentDiv.appendChild(searchIcon);
  coveoSearchComponentDiv.appendChild(searchInput);
  coveoSearchComponentDiv.appendChild(clearSearchInput);
  searchContainerDiv.appendChild(coveoSearchComponentDiv);

  // Create query sort section div
  const querySortSectionDiv = document.createElement('div');
  querySortSectionDiv.classList.add(
    'query-sort-section',
    'tw-flex',
    'tw-justify-between',
    'tw-items-center',
  );

  // Create query summary div
  const querySummaryDiv = document.createElement('div');
  querySummaryDiv.id = 'query-summary';
  querySummaryDiv.classList.add('tw-text-sm');

  // Create mobile filter section
  const mobileFilterButton = document.createElement('div');
  const mobileFilterButtonspan = document.createElement('span');
  const mobileFilterButtonIcon = document.createElement('span');
  mobileFilterButton.id = 'mobile-filters';
  mobileFilterButtonspan.textContent = 'Filter';
  mobileFilterButtonIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M5 2L9.87202e-08 2" stroke="#0068FA"/><path d="M11 10L16 10" stroke="#0068FA"/><path d="M16 2L10 2" stroke="#0068FA"/><path d="M0 10H6" stroke="#0068FA"/><circle cx="6" cy="2" r="1.5" stroke="#0068FA"/><circle cx="2" cy="2" r="1.5" transform="matrix(-1 0 0 1 12 8)" stroke="#0068FA"/></svg>';
  mobileFilterButton.id = 'mobile-filters';
  mobileFilterButton.append(mobileFilterButtonspan);
  mobileFilterButton.append(mobileFilterButtonIcon);
  mobileFilterButton.addEventListener('click', handleMobileFilters);
  // Create sort div
  const sortDiv = document.createElement('div');
  sortDiv.id = 'sort';
  sortDiv.classList.add('tw-flex', 'tw-justify-center');

  // Append query summary and sort divs to query sort section
  querySortSectionDiv.appendChild(querySummaryDiv);
  querySortSectionDiv.appendChild(mobileFilterButton);
  querySortSectionDiv.appendChild(sortDiv);

  // Create facet breadcrumb div
  const facetBreadcrumbDiv = document.createElement('div');
  facetBreadcrumbDiv.id = 'facet-readcrumb';

  // Create results section div
  const coveoResultsDiv = document.createElement('div');
  coveoResultsDiv.id = 'coveo-results';
  coveoResultsDiv.classList.add('result-section');

  // Create loading results div
  const coveoResultsLoading = document.createElement('div');
  coveoResultsLoading.id = 'coveo-results-loading';
  coveoResultsLoading.className = 'result-loading-section tw-text-center tw-text-2xl';
  coveoResultsLoading.textContent = strings.loading;

  // Create results section div
  const coveoNoResultsDiv = document.createElement('div');
  const noResultsText = document.createElement('div');
  noResultsText.className = 'no-result-text';
  coveoNoResultsDiv.id = 'coveo-no-results';
  coveoNoResultsDiv.style.display = 'none';

  // Create life sciences div
  const lifeSciencesDiv = document.createElement('div');
  lifeSciencesDiv.id = 'coveo-life-sciences';
  const path = window.location.pathname;
  const resp = await fetch(`${path}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const main = document.createElement('main');
    main.innerHTML = html;
    const sections = main.querySelector('.searchresult').children;
    block.textContent = '';
    Array.from(sections).forEach((section, index) => {
      const iteration = index + 1;
      if (iteration === 1) {
        lifeSciencesDiv.appendChild(section.querySelector('div'));
        block.append(lifeSciencesDiv);
      } else if (iteration === 2) {
        if (main.querySelector('picture')) {
          coveoNoResultsDiv.appendChild(main.querySelector('picture'));
        }
      } else if (iteration === 3) {
        const noResultsText1 = section.querySelector('div');
        noResultsText1.id = 'noresults-text1';
        noResultsText1.setAttribute('data-text1', noResultsText1.textContent);
        noResultsText.appendChild(noResultsText1);
        coveoNoResultsDiv.appendChild(noResultsText);
      } else if (iteration === 4) {
        const noResultsText2 = section.querySelector('div');
        noResultsText2.classList = 'noresults-text2';
        noResultsText.appendChild(noResultsText2);
        coveoNoResultsDiv.appendChild(noResultsText);
      }
    });
  }

  // Create pagination div
  const paginationDiv = document.createElement('div');
  paginationDiv.id = 'pagination';
  paginationDiv.classList.add(
    'pagination',
    'tw-flex',
    'tw-justify-center',
    'tw-gap-1',
    'tw-mt-6',
  );

  // Append all sections to the search result section div
  searchResultSectionDiv.appendChild(searchContainerDiv);
  searchResultSectionDiv.appendChild(searchTermDiv);
  searchResultSectionDiv.appendChild(searchTermValidation);
  searchResultSectionDiv.appendChild(querySortSectionDiv);
  searchResultSectionDiv.appendChild(facetBreadcrumbDiv);
  searchResultSectionDiv.appendChild(coveoResultsLoading);
  searchResultSectionDiv.appendChild(coveoResultsDiv);
  searchResultSectionDiv.appendChild(coveoNoResultsDiv);
  searchResultSectionDiv.appendChild(paginationDiv);

  // Append facets and search result sections to search
  searchWrapperDiv.appendChild(mobileFilterHeader);
  searchWrapperDiv.appendChild(facetsDiv);
  searchWrapperDiv.appendChild(mobileFilterFooter);
  searchWrapperDiv.appendChild(searchResultSectionDiv);

  // Append search wrapper to main container
  searchResultDiv.appendChild(searchWrapperDiv);

  // Append the main search result div to the body or any specific container
  block.append(searchResultDiv);

  // Create suggestion popup divgit

  const suggestionPopupDiv = document.createElement('div');
  suggestionPopupDiv.id = 'suggestion-popup';

  document.body.appendChild(suggestionPopupDiv);

  const pageUrl = new URL(window.location.href);
  let query;

  try {
    if (pageUrl.search) {
      const params = new URLSearchParams(pageUrl.search);
      query = params.get('term');
      const contentType = params.get('contentType');
      const { updateQuery } = loadQueryActions(searchEngine);
      const { toggleSelectFacetValue } = loadFacetSetActions(searchEngine);
      searchEngine.dispatch(updateQuery({
        q: query,
      }));
      if (contentType !== 'All') {
        searchEngine.dispatch(toggleSelectFacetValue({
          facetId: 'contenttype',
          selection: { value: contentType, state: 'selected' },
        }));
        contentTypeFacetController.showMoreValues();
      }
    }
    renderSearchBox(query);
    renderSorting();
    searchEngine.executeFirstSearch();
    searchEngine.subscribe(() => {
      renderSearchResults();
      renderQuerySummary();
      renderPagination();
      callCreateFacet();
      renderFacetBreadcurm();
    });
  } catch (error) {
    searchEngine.executeFirstSearch();
  }
}
