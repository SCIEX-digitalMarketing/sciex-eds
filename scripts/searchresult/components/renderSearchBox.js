import { searchBoxController } from '../controller/controllers.js';

const renderSearchBox = () => {
  const searchComponentHTML = `
  <div class="tw search-result tw-bg-white">
    <div class="search-wrapper tw-flex tw-gap-5 tw-flex-wrap tw-mx-auto">
      <div id="facets" class="facet-section tw-bg-white tw-p-5 tw-rounded-lg tw-w-1/4">
        <div id="source-facet"></div>
        <br />
        <div id="filetype-facet"></div>
        <br />
        <div id="tags-facet"></div>
      </div>
      <div class="search-result-section tw-flex-1">
        <div class="search-container tw-p-5 tw-bg-white tw-rounded-lg">
          <div class="coveo-search-component tw-flex tw-gap-2">
            <input type="text" id="coveo-query" placeholder="Search..." class="search-box tw-w-full tw-py-3 tw-px-4 tw-border tw-border-gray-300 tw-rounded-md">
          </div>
        </div>
        <div class="query-sort-section tw-flex tw-justify-between tw-items-center tw-py-3 tw-px-5"> 
          <div id="query-summary" class="tw-text-sm"></div>
          <div id="sort" class="tw-flex tw-justify-center"></div>
        </div>
        <div id="facet-readcrumb"> </div>
        <div id="coveo-results" class="result-section"></div>
        <div id="pagination" class="pagination tw-flex tw-justify-center tw-gap-1 tw-mt-6"></div>
      </div>
    </div>
  </div>
  <div id="suggestion-popup" style="position: absolute; top: 100%; left: 0; width: 738px; background: #fff; border: 1px solid #ddd; max-height: 200px; overflow-y: auto; z-index: 10; display: none; padding: 5px; box-sizing: border-box; margin-top: 5px;"></div>
  `;

  document.body.innerHTML += searchComponentHTML;

  const queryInput = document.getElementById('coveo-query');
  const suggestionPopup = document.getElementById('suggestion-popup');
  const coveoResults = document.getElementById('coveo-results');

  const showSuggestions = () => {
    const searchBox = document.getElementById('coveo-query');
    const suggestions = searchBoxController.state.suggestions || [];

    const rect = searchBox.getBoundingClientRect();
    suggestionPopup.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionPopup.style.left = `${rect.left + window.scrollX}px`;

    if (suggestions.length > 0) {
      suggestionPopup.innerHTML = suggestions
        .map((suggestion) => `<div class="suggestion-item" style="padding: 8px; cursor: pointer;" data-raw-value="${suggestion.rawValue}">
            ${suggestion.highlightedValue}
          </div>`)
        .join('');
      suggestionPopup.style.display = 'block';
    } else {
      suggestionPopup.style.display = 'none';
    }
  };

  const showResults = () => {
    coveoResults.style.display = 'block';
    suggestionPopup.style.display = 'none';
    coveoResults.innerHTML = '<h3>Search Results go here...</h3>';
  };

  queryInput.addEventListener('input', (event) => {
    const query = event.target.value;
    if (query.length > 0) {
      searchBoxController.updateText(query);
      searchBoxController.showSuggestions();
      showSuggestions();
    } else {
      suggestionPopup.style.display = 'none';
    }
  });

  queryInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      searchBoxController.submit();
      showResults();
    }
  });

  document.addEventListener('click', (event) => {
    if (!document.querySelector('.coveo-search-component').contains(event.target)) {
      suggestionPopup.style.display = 'none';
    }
  });
};
export default renderSearchBox;
