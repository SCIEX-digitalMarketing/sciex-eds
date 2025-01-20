import { headlessResultsList } from '../controller/controllers.js';
export const renderSearchResults = () => {
    const resultsElement = document.getElementById('coveo-results');
    
    resultsElement.innerHTML = '';
    const results = headlessResultsList.state.results || [];
    if (results.length > 0) {
      results.forEach((result) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
          <h3>${result.title || 'No Title Available'}</h3>  <!-- Optional fallback for missing title -->
          <p>${result.uri || 'No description available.'}</p>  <!-- Optional fallback for missing description -->
        `;
        resultsElement.appendChild(resultItem);
      });
    } else {
      resultsElement.innerHTML = `<h3>No Results Found</h3>`;
    }
  };
  