/* eslint-disable */
const renderRegulatorySearchResultList = (customerDocResultsList, customerDocResultClick) => {

    const noResults = document.getElementById('coveo-no-results');
    const target = document.querySelector('.search-result-section');
    if (noResults && target) {
      target.appendChild(noResults);
    }
  
    const resultsElement = document.getElementById('coveo-results');
  
    // loader div
    const resultsLoading = document.getElementById('coveo-results-loading');
  
    // show loader
    if (resultsLoading) {
      if (resultsLoading.classList.contains('tw-hidden')) {
        resultsLoading.classList.remove('tw-hidden');
      }
    }
  
    const noResultsElement = document.getElementById('coveo-no-results');
    const sortElement = document.getElementById('sort');
  
    const querySortElement = document.getElementsByClassName('query-sort-section')[0];
    const querySortSection = document.querySelector('.query-sort-section');
    resultsElement.innerHTML = '';
  
    const results = customerDocResultsList.state.results || [];
    let sortedResults = results;
   
  
    if (sortedResults.length > 0) {
      // hide loader
      if (resultsLoading) {
        resultsLoading.classList.add('tw-hidden');
      }
      const facets = document.getElementById('facets');
      if (facets) {
        if (facets.classList.contains('tw-hidden')) {
          facets.classList.remove('tw-hidden');
        }
      }
      sortElement.removeAttribute('style');
      noResultsElement.style.display = 'none';
      querySortElement.style.display = '';
      if (querySortSection) {
        querySortSection.removeAttribute('style');
      }
      sortedResults.forEach((result) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
  
        let descriptionHtml = '';
        if (result.raw.description) {
          descriptionHtml = `${result.raw.description}`;
        } else {
          descriptionHtml = `${result.Excerpt}`;
        }

        const regulatoryInfo = document.createElement('div');
        regulatoryInfo.className = 'regulatory-info';
        let partNumber = result.raw.productpartnumber ? `Part Number : ${result.raw.productpartnumber } | `: '';
        let lotNumber = result.raw.lotnumber ? `Lot Number : ${result.raw.lotnumber } | `: '';
        let componentLotNumber = result.raw.kitpartnumber ?`Kit Number : ${result.raw.kitpartnumber } `: '';

        regulatoryInfo.innerHTML = `${partNumber}  ${lotNumber}  ${componentLotNumber}`;
  
        const resultMarkup = `
          <div class="item-details"> 
            <h3>${result.title || 'No Title Available'}</h3>
            <div class="description"> ${descriptionHtml} </div>
            ${
    result.raw.ogimage
      ? `<img src="${result.raw.ogimage}" alt="ogimage" width="200" height="200">`
      : ''
  }
          </div>
          <a class="view-details-btn" target="_blank" href="${result.printableUri}">View</a>
        `;
  
        resultItem.innerHTML = resultMarkup;

        const heading = resultItem.querySelector('h3');
        heading.insertAdjacentElement('afterend', regulatoryInfo);
  
        const viewDetailsBtn = resultItem.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', () => {
          customerDocResultClick(result);
        });
  
        resultsElement.appendChild(resultItem);
      });
    } else {
      // hide loader
      if (resultsLoading) {
        resultsLoading.classList.add('tw-hidden');
      }
      const divElement = document.getElementById('noresults-text1');
      const facets = document.getElementById('facets');
      if (facets) {
        if (!facets.classList.contains('tw-hidden')) {
          facets.classList.add('tw-hidden');
        }
      }
  
      // Access the data attribute 'data-example' using dataset
      const { text1 } = divElement.dataset;
      const inputText = document.getElementById('coveo-query').value;
      if (inputText.trim() !== '') {
        const updatedtext1 = `${text1} "${inputText}"`;
        document.getElementById('noresults-text1').innerText = updatedtext1;
      }
      noResultsElement.style.display = '';
      querySortElement.style.display = 'none';
      if (querySortSection) {
        querySortSection.style.setProperty('display', 'none', 'important');
      }
    }
  
    const searchWrapper = document.querySelectorAll('.search-wrapper')[0];
    if (noResultsElement && noResultsElement.style.display === 'none') {
      searchWrapper.style.width = 'auto';
    } else {
      searchWrapper.style.width = 'fit-content';
    }
  };
  
  export default renderRegulatorySearchResultList;
  