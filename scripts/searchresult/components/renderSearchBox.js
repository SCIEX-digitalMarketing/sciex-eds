import { searchBoxController } from '../controller/controllers.js';

const renderSearchBox = () => {
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
