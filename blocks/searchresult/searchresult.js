import {} from '../../scripts/aem.js';
import { searchEngine } from '../../scripts/searchresult/engine.js';
import renderSearchBox from '../../scripts/searchresult/components/renderSearchBox.js';
import renderSearchResults from '../../scripts/searchresult/components/searchResult.js';
import { renderSourceFacet, renderFiletypeFacet, renderTagsFacet } from '../../scripts/searchresult/components/categoryFacets.js';
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
  searchWrapperDiv.classList.add('search-wrapper', 'tw-flex', 'tw-gap-5', 'tw-flex-wrap', 'tw-mx-auto');

  // Create facets div
  const facetsDiv = document.createElement('div');
  facetsDiv.id = 'facets';
  facetsDiv.classList.add('facet-section', 'tw-bg-white', 'tw-p-5', 'tw-rounded-lg', 'tw-w-1/4');

  // Create source facet div
  const sourceFacetDiv = document.createElement('div');
  sourceFacetDiv.id = 'source-facet';

  // Create source input box
  const sourceInput = document.createElement('input');
  sourceInput.type = 'text';
  sourceInput.id = 'source-input';
  sourceInput.classList.add('tw-border', 'tw-p-2', 'tw-rounded-lg', 'tw-mt-2', 'facet-search-box');
  sourceInput.placeholder = 'Enter source...';

  // Create suggestion box
  const sourceSuggestionBox = document.createElement('div');
  sourceSuggestionBox.id = 'suggestion-box';
  sourceSuggestionBox.classList.add('tw-hidden', 'tw-mt-2', 'tw-border', 'tw-border-gray-300', 'tw-rounded-md', 'tw-bg-white');
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
  tagSuggestionBox.classList.add('tw-hidden', 'tw-mt-2', 'tw-border', 'tw-border-gray-300', 'tw-rounded-md', 'tw-bg-white');
  tagSuggestionBox.style.position = 'absolute';

  // Create tags input box
  const tagsInput = document.createElement('input');
  tagsInput.type = 'text';
  tagsInput.id = 'tags-input';
  tagsInput.classList.add('tw-border', 'tw-p-2', 'tw-rounded-lg', 'tw-mt-2', 'facet-search-box');
  tagsInput.placeholder = 'Enter tags...';

  // Append facet divs and input boxes
  facetsDiv.appendChild(sourceFacetDiv);
  facetsDiv.appendChild(sourceInput);
  facetsDiv.appendChild(sourceSuggestionBox);
  facetsDiv.appendChild(tagSuggestionBox);
  facetsDiv.appendChild(document.createElement('br')); // Add <br />
  facetsDiv.appendChild(filetypeFacetDiv);
  facetsDiv.appendChild(document.createElement('br')); // Add <br />
  facetsDiv.appendChild(tagsFacetDiv);
  facetsDiv.appendChild(tagsInput); // Add input under tags facet

  // Create search result section div
  const searchResultSectionDiv = document.createElement('div');
  searchResultSectionDiv.classList.add('search-result-section', 'tw-flex-1');

  // Create search container div
  const searchContainerDiv = document.createElement('div');
  searchContainerDiv.classList.add('search-container', 'tw-p-5', 'tw-bg-white', 'tw-rounded-lg');

  // Create search input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'coveo-query';
  searchInput.placeholder = 'Search...';
  searchInput.classList.add('search-box', 'tw-w-full', 'tw-py-3', 'tw-px-4', 'tw-border', 'tw-border-gray-300', 'tw-rounded-md');

  // Append search input to search container
  const coveoSearchComponentDiv = document.createElement('div');
  coveoSearchComponentDiv.classList.add('coveo-search-component', 'tw-flex', 'tw-gap-2');
  coveoSearchComponentDiv.appendChild(searchInput);
  searchContainerDiv.appendChild(coveoSearchComponentDiv);

  // Create query sort section div
  const querySortSectionDiv = document.createElement('div');
  querySortSectionDiv.classList.add('query-sort-section', 'tw-flex', 'tw-justify-between', 'tw-items-center', 'tw-py-3', 'tw-px-5');

  // Create query summary div
  const querySummaryDiv = document.createElement('div');
  querySummaryDiv.id = 'query-summary';
  querySummaryDiv.classList.add('tw-text-sm');

  // Create sort div
  const sortDiv = document.createElement('div');
  sortDiv.id = 'sort';
  sortDiv.classList.add('tw-flex', 'tw-justify-center');

  // Append query summary and sort divs to query sort section
  querySortSectionDiv.appendChild(querySummaryDiv);
  querySortSectionDiv.appendChild(sortDiv);

  // Create facet breadcrumb div
  const facetBreadcrumbDiv = document.createElement('div');
  facetBreadcrumbDiv.id = 'facet-readcrumb';

  // Create results section div
  const coveoResultsDiv = document.createElement('div');
  coveoResultsDiv.id = 'coveo-results';
  coveoResultsDiv.classList.add('result-section');

  // Create pagination div
  const paginationDiv = document.createElement('div');
  paginationDiv.id = 'pagination';
  paginationDiv.classList.add('pagination', 'tw-flex', 'tw-justify-center', 'tw-gap-1', 'tw-mt-6');

  // Append all sections to the search result section div
  searchResultSectionDiv.appendChild(searchContainerDiv);
  searchResultSectionDiv.appendChild(querySortSectionDiv);
  searchResultSectionDiv.appendChild(facetBreadcrumbDiv);
  searchResultSectionDiv.appendChild(coveoResultsDiv);
  searchResultSectionDiv.appendChild(paginationDiv);

  // Append facets and search result sections to search wrapper
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
      renderSourceFacet();
      renderFiletypeFacet();
      renderTagsFacet();
      renderFacetBreadcurm();
    });

    await searchEngine.executeFirstSearch().catch((error) => {
      console.error('Error executing the first search:', error);
    });
  } catch (error) {
    console.error('Error initializing search engine:', error);
  }
}
