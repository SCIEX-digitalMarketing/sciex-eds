import {} from '../../scripts/aem.js';
import { searchEngine } from '../../scripts/searchresult/engine.js';
import renderSearchBox from '../../scripts/searchresult/components/renderSearchBox.js';
import renderSearchResults from '../../scripts/searchresult/components/searchResult.js';
import {
  callCreateFacet, handleMobileFilters,
} from '../../scripts/searchresult/components/categoryFacets.js';
import renderPagination from '../../scripts/searchresult/components/pagination.js';
import renderQuerySummary from '../../scripts/searchresult/components/querySummary.js';
import renderSorting from '../../scripts/searchresult/components/sorting.js';
import renderFacetBreadcurm from '../../scripts/searchresult/components/facetBreadcrumb.js';
import renderFacetSearchResults from '../../scripts/searchresult/components/renderFacetSearchBox.js';

export default async function decorate(block) {
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

  // Create tags input box
  const tagsInput = document.createElement('input');
  tagsInput.type = 'text';
  tagsInput.id = 'tags-input';
  tagsInput.classList.add(
    'tw-border',
    'tw-p-2',
    'tw-rounded-lg',
    'tw-mt-2',
    'facet-search-box',
  );
  tagsInput.placeholder = 'Enter tags...';

  // Append facet divs and input boxes
  facetsDiv.appendChild(sourceInput);
  facetsDiv.appendChild(sourceSuggestionBox);
  facetsDiv.appendChild(tagsInput); // Add input under tags facet

  // Create search result section div
  const searchResultSectionDiv = document.createElement('div');
  searchResultSectionDiv.classList.add('search-result-section', 'tw-flex-1');

  // Create search container div
  const searchContainerDiv = document.createElement('div');
  searchContainerDiv.classList.add(
    'search-container',
    'tw-p-5',
    'tw-bg-white',
    'tw-rounded-lg',
  );

  // Create search input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'coveo-query';
  searchInput.placeholder = 'Search...';
  searchInput.classList.add(
    'search-box',
    'tw-w-full',
    'tw-py-3',
    'tw-px-4',
    'tw-border',
    'tw-border-gray-300',
    'tw-rounded-md',
  );

  // Append search input to search container
  const coveoSearchComponentDiv = document.createElement('div');
  coveoSearchComponentDiv.classList.add(
    'coveo-search-component',
    'tw-flex',
    'tw-gap-2',
  );
  coveoSearchComponentDiv.appendChild(searchInput);
  searchContainerDiv.appendChild(coveoSearchComponentDiv);

  // Create query sort section div
  const querySortSectionDiv = document.createElement('div');
  querySortSectionDiv.classList.add(
    'query-sort-section',
    'tw-flex',
    'tw-justify-between',
    'tw-items-center',
    'tw-py-3',
    'tw-px-5',
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

  // Create results section div
  const coveoNoResultsDiv = document.createElement('div');
  coveoNoResultsDiv.id = 'coveo-no-results';
  coveoNoResultsDiv.style.display = 'none';

  // Create life sciences div
  const lifeSciencesDiv = document.createElement('div');
  lifeSciencesDiv.id = 'coveo-life-sciences';
  const resp = await fetch('/search-results-eds.plain.html');
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
        coveoNoResultsDiv.appendChild(noResultsText1);
      } else if (iteration === 4) {
        const noResultsText2 = section.querySelector('div');
        noResultsText2.classList = 'noresults-text2';
        coveoNoResultsDiv.appendChild(noResultsText2);
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
  searchResultSectionDiv.appendChild(querySortSectionDiv);
  searchResultSectionDiv.appendChild(facetBreadcrumbDiv);
  searchResultSectionDiv.appendChild(coveoResultsDiv);
  searchResultSectionDiv.appendChild(coveoNoResultsDiv);
  searchResultSectionDiv.appendChild(paginationDiv);

  // Append facets and search result sections to search
  searchWrapperDiv.appendChild(mobileFilterHeader);
  searchWrapperDiv.appendChild(facetsDiv);
  searchWrapperDiv.appendChild(searchResultSectionDiv);

  // Append search wrapper to main container
  searchResultDiv.appendChild(searchWrapperDiv);

  // Append the main search result div to the body or any specific container
  block.append(searchResultDiv);

  // Create suggestion popup div
  const suggestionPopupDiv = document.createElement('div');
  suggestionPopupDiv.id = 'suggestion-popup';
  suggestionPopupDiv.style.position = 'absolute';
  suggestionPopupDiv.style.top = '100%';
  suggestionPopupDiv.style.left = '0';
  suggestionPopupDiv.style.width = '738px';
  suggestionPopupDiv.style.background = '#fff';
  suggestionPopupDiv.style.border = '1px solid #ddd';
  suggestionPopupDiv.style.maxHeight = '200px';
  suggestionPopupDiv.style.overflowY = 'auto';
  suggestionPopupDiv.style.zIndex = '10';
  suggestionPopupDiv.style.display = 'none';
  suggestionPopupDiv.style.padding = '5px';
  suggestionPopupDiv.style.boxSizing = 'border-box';
  suggestionPopupDiv.style.marginTop = '5px';

  document.body.appendChild(suggestionPopupDiv);

  try {
    renderSearchBox();
    renderSorting();
    renderFacetSearchResults();
    searchEngine.executeFirstSearch();
    searchEngine.subscribe(() => {
      renderSearchResults();
      renderQuerySummary();
      renderPagination();
      callCreateFacet();
      renderFacetBreadcurm();
    });

    await searchEngine.executeFirstSearch();
  } catch (error) {
    searchEngine.executeFirstSearch();
  }
}
