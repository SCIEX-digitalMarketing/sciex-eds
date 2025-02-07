import { sourceFacetController, tagsFacetController } from '../controller/controllers.js';

// Function to handle facet search input
const handleFacetSearchInput = (inputElement, facetController, suggestionBox) => {
  inputElement.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    if (query.length > 0) {
      facetController.facetSearch.updateText(query);
      facetController.facetSearch.search();
    } else {
      // If input is cleared, hide the suggestion box
      suggestionBox.classList.add('tw-hidden');
    }
  });
};

// Function to create and append suggestion items
const renderSuggestionItems = (facetController, suggestionBox) => {
  const values = facetController.state.facetSearch.values;
  suggestionBox.innerHTML = ''; // Clear previous suggestions

  if (values.length > 0) {
    values.forEach((suggestion) => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = suggestion.displayValue;
      suggestionItem.classList.add('tw-px-4', 'tw-py-2', 'hover:tw-bg-gray-200');
      suggestionBox.appendChild(suggestionItem);
    });
    suggestionBox.classList.remove('tw-hidden');
  } else {
    suggestionBox.classList.add('tw-hidden');
  }
};

// Function to handle facet search subscription and render suggestions
const subscribeToFacetController = (facetController, suggestionBox) => {
  facetController.subscribe(() => renderSuggestionItems(facetController, suggestionBox));
};

const renderFacetSearchResults = () => {
  // Get input and suggestion box elements
  const sourceInputElement = document.querySelector('#source-input');
  const sourceSuggestionBox = document.querySelector('#suggestion-box');
  const tagInputElement = document.querySelector('#tags-input');
  const tagSuggestionBox = document.querySelector('#tag-suggestion-box');

  // Set up input event listeners for source and tag inputs
  handleFacetSearchInput(sourceInputElement, sourceFacetController, sourceSuggestionBox);
  handleFacetSearchInput(tagInputElement, tagsFacetController, tagSuggestionBox);

  // Set up subscriptions to update suggestion boxes
  subscribeToFacetController(sourceFacetController, sourceSuggestionBox);
};

export default renderFacetSearchResults;
