import { headlessResultsList, handleResultClick } from '../controller/controllers.js';

const renderSearchResults = () => {
  const resultsElement = document.getElementById('coveo-results');

  resultsElement.innerHTML = '';

  const results = headlessResultsList.state.results || [];

  if (results.length > 0) {
    results.forEach((result) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.innerHTML = `
          <div class="item-details"> 
            <h3>${result.title || 'No Title Available'}</h3>
            <p>${result.Excerpt || 'No description available.'}</p>
            <p class="source-type">${result.raw.sourcetype}</p>
            ${result.raw.ogimage
    ? `<img src="${result.raw.ogimage}" alt="ogimage" width="200" height="200">`
    : ''}
          </div>
          <a class="view-details-btn" href="${result.printableUri}">View</a>
        `;

      resultItem.addEventListener('click', () => {
        handleResultClick(result);
      });

      resultsElement.appendChild(resultItem);
    });
  } else {
    resultsElement.innerHTML = '<h3>No Results Found</h3>';
  }
};

export default renderSearchResults;
