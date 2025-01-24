import { headlessResultsList } from '../controller/controllers.js';

const renderSearchResults = () => {
  const resultsElement = document.getElementById('coveo-results');

  resultsElement.innerHTML = '';
  const results = headlessResultsList.state.results || [];
  if (results.length > 0) {
    results.forEach((result) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.innerHTML = `
          <a href="${result.printableUri}">
            <h3>${result.title || 'No Title Available'}</h3>
          </a>
          <p class="source-type">${result.raw.sourcetype}</p>
          <h3>Source name</h3>
          <p>${result.raw.source || 'No Source name available.'}</p>
          <h3>Description</h3>
          <p>${result.Excerpt || 'No description available.'}</p>
          <h3>Indexed</h3>
          <p>${new Date(result.raw.indexeddate).toLocaleDateString()}</p>
        `;
      resultsElement.appendChild(resultItem);
    });
  } else {
    resultsElement.innerHTML = '<h3>No Results Found</h3>';
  }
};
export default renderSearchResults;
