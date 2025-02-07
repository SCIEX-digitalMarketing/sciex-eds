import { sourceFacetController, tagsFacetController } from '../controller/controllers.js';

const renderFacetSearchResults = () => {
  // Get the input element
  const sourceInputElement = document.querySelector('#source-input');
  const sourceSuggestionBox = document.querySelector('#suggestion-box');
  const tagInputElement = document.querySelector('#tags-input');

  // Function for performing the facet search
  function performFacetSearch(facetController, query) {
    facetController.facetSearch.updateText(query);
    facetController.facetSearch.search();
  }

  sourceInputElement.addEventListener('input', (event) => {
    const newInputValue = event.target.value.toLowerCase();
    if (newInputValue.length > 0) {
      performFacetSearch(sourceFacetController, newInputValue);
    }
  });

  tagInputElement.addEventListener('input', (event) => {
    const newInputValue = event.target.value.toLowerCase();
    if (newInputValue.length > 0) {
      performFacetSearch(tagsFacetController, newInputValue);
    }
  });

  sourceFacetController.subscribe(() => {
    console.log('facetController', sourceFacetController.state.facetSearch.values);
    const suggestionItem = document.createElement('div');
    if (sourceFacetController.state.facetSearch.values.length > 0) {
      sourceFacetController.state.facetSearch.values.forEach((suggestion) => {
        suggestionItem.textContent = suggestion.displayValue;
        suggestionItem.classList.add('tw-px-4', 'tw-py-2', 'hover:tw-bg-gray-200');
        sourceSuggestionBox.appendChild(suggestionItem);
      });
      sourceSuggestionBox.classList.remove('tw-hidden');
    } else {
      suggestionItem.innerHTML = '';
      sourceSuggestionBox.classList.add('tw-hidden');
    }
  });
};

export default renderFacetSearchResults;
