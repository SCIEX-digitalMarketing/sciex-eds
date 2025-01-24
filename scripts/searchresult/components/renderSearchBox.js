import { searchBoxController } from '../controller/controllers.js';

const renderSearchBox = () => {
  const searchComponentHTML = `
    <div class="search-container">
      <div class="coveo-search-component">
        <input type="text" id="coveo-query" placeholder="Search..." class="search-box">
        <button id="coveo-search-btn" class="search-btn">Search</button>
      </div>
    </div>

    <!-- Facets and Results Section -->
    <div id="query-summary" style="text-align: center"></div>
    <div id="sort" style="border: 1px solid;width: 10%;"></div>
    <div class="search-wrapper">
      <div id="facets" class="facet-section">
        <div id="source-facet"></div>
        <br />
        <div id="filetype-facet"></div>
        <br />
        <div id="tags-facet"></div>
      </div>
      <div id="coveo-results" class="result-section">
      </div>
      </div>
      <div id="pagination" class="pagination"></div>

    <!-- Suggestion Popup -->
    <div id="suggestion-popup" style="position: absolute; top: 100%; left: 0; width: 738px; background: #fff; border: 1px solid #ddd; max-height: 200px; overflow-y: auto; z-index: 10; display: none; padding: 5px; box-sizing: border-box; margin-top: 5px;"></div>

  `;

  document.body.innerHTML += searchComponentHTML;

  const searchBtn = document.getElementById('coveo-search-btn');
  const queryInput = document.getElementById('coveo-query');
  const suggestionPopup = document.getElementById('suggestion-popup');
  const coveoResults = document.getElementById('coveo-results');

  const showSuggestions = () => {
    const searchBox = document.getElementById('coveo-query');
    const suggestions = searchBoxController.state.suggestions || [];

    // Debugging suggestions data
    console.log(suggestions);

    // Dynamically position the suggestion popup
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
    const query = event.target.value;
    if (query.length > 0) {
      searchBoxController.updateText(query);
      searchBoxController.showSuggestions();
      searchBoxController.facetSearch.search(query);
      showSuggestions();
    } else {
      suggestionPopup.style.display = 'none';
      coveoResults.style.display = 'none';
    }
  });

  searchBtn.addEventListener('click', () => {
    searchBoxController.submit();
    showResults();
  });

  document.addEventListener('click', (event) => {
    if (!document.querySelector('.coveo-search-component').contains(event.target)) {
      suggestionPopup.style.display = 'none';
    }
  });
};
export default renderSearchBox;
