import { searchBoxController } from '../controller/controllers.js';

const renderSearchBox = () => {
  const searchComponentHTML = `
  <div class="search-result">
    <div class="search-wrapper">
      <div id="facets" class="facet-section">
        <div id="source-facet"></div>
        <br />
        <div id="filetype-facet"></div>
        <br />
        <div id="tags-facet"></div>
      </div>
      <div class="search-result-section">
        <div class="search-container">
          <div class="coveo-search-component">
            <input type="text" id="coveo-query" placeholder="Search..." class="search-box">
          </div>
        </div>
        <div class="query-sort-section"> 
          <div id="query-summary"></div>
          <div id="sort"></div>
        </div>
        <div id="coveo-results" class="result-section"></div>
        <div id="pagination" class="pagination"></div>
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
      coveoResults.style.display = 'none';
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
    console.log('queryInput', event);
    const query = event.target.value;
    if (query.length > 0) {
      searchBoxController.updateText(query);
      searchBoxController.showSuggestions();
      searchBoxController.facetSearch.search(query);
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
