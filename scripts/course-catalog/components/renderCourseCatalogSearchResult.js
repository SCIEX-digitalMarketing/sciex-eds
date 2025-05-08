/* eslint-disable */
import { courseCatalogResultsList, courseCatalogResultClick } from '../course-catalog-controller/controllers.js';

const renderCourseCatalogSearchResults = () => {
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

  const results = courseCatalogResultsList.state.results || [];
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

      const courseInfo = document.createElement('div');
      courseInfo.className = 'course-info';
      let duration = result.raw.duration ? `Duration : ${result.raw.duration} | ` : '';
      let language = result.raw.language ? `Language : ${result.raw.language} | ` : '';
      let courseType = result.raw.coursetypecategories ? `Type : ${result.raw.coursetypecategories} | ` : '';
      let courseLevel = result.raw.levelcategories ? `Course Level : ${result.raw.levelcategories} | ` : '';
      courseInfo.innerHTML = `${duration}  ${language}  ${courseType}  ${courseLevel}  Rating : `;

      const ratingContainer = document.createElement('span');
      ratingContainer.className = 'rating';

      [1, 2, 3, 4, 5].forEach((i) => {
        const star = document.createElement('span');
        star.className = 'star';
        star.innerHTML = '&#9733;';
        star.setAttribute('data-value', i);
        ratingContainer.appendChild(star);
      });

      courseInfo.appendChild(ratingContainer);
      const stars = ratingContainer.querySelectorAll('.star');

      const rating = result?.raw?.rating ?? 0;
      Array.from(stars).slice(0, rating).forEach((star) => star.classList.add('filled'));

      const resultMarkup = `
        <div class="item-details"> 
          ${ result.raw.isnewcourse || result.raw.coursetypecategories ?  
            `<div class="tag-container">
              ${ result.raw.coursetypecategories.toString() === 'Premium online' ? `<span class="tag premium">Premium</span>` : ''}
              ${ result.raw.isnewcourse ? `<span class="tag new">New</span>` : ''}
            </div> ` : ''
          }
          <h3>${result.title || 'No Title Available'}</h3>
          <div class="description"> ${descriptionHtml} </div>
          ${
  result.raw.ogimage
    ? `<img src="${result.raw.ogimage}" alt="ogimage" width="200" height="200">`
    : ''
}
        </div>
        <a class="view-details-btn" target="_blank" href="${result.printableUri}">View Course</a>
      `;

      resultItem.innerHTML = resultMarkup;

      const heading = resultItem.querySelector('h3');

      heading.insertAdjacentElement('afterend', courseInfo);

      const descriptionElement = resultItem.querySelector('.description');
      const itemDetails = resultItem.querySelector('.item-details');

      if (descriptionElement) {
        descriptionElement.style.maxHeight = '3em';
        descriptionElement.style.overflow = 'hidden';
        descriptionElement.style.textOverflow = 'ellipsis';
        descriptionElement.style.display = '-webkit-box';
        descriptionElement.style.webkitBoxOrient = 'vertical';

        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'show-more-btn-des';

        const showMoreText = '<span class="show-more-text">Read More</span>';
        showMoreBtn.innerHTML = showMoreText;
        showMoreBtn.style.display = 'none';

        const showMoreIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L14 8" stroke="#0068FA"/>
            <path d="M8 2L8 14" stroke="#0068FA"/>
          </svg>
        `;
        showMoreBtn.innerHTML += showMoreIcon;

        const checkOverflow = () => {
          if (descriptionElement.scrollHeight > descriptionElement.clientHeight) {
            showMoreBtn.style.display = 'inline-flex';
          }
        };

        const resizeObserver = new ResizeObserver(() => {
          checkOverflow();
        });
        resizeObserver.observe(descriptionElement);

        checkOverflow();
        showMoreBtn.addEventListener('click', () => {
          
          const isExpanded = descriptionElement.style.maxHeight === 'none';
          descriptionElement.style.maxHeight = isExpanded ? '3em' : 'none';
          descriptionElement.style.webkitLineClamp = isExpanded ? '3' : 'none';
          showMoreBtn.innerHTML = isExpanded
            ? `<span class="show-more-text">Read More</span>${showMoreIcon}`
            : '<span class="show-more-text">Read Less</span> ' + `        
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="21" viewBox="0 0 16 21" fill="none">
                  <path d="M2 8L14 8" stroke="#0068FA"/>
                </svg>`;
        });

        itemDetails.appendChild(showMoreBtn);
      }

      const viewDetailsBtn = resultItem.querySelector('.view-details-btn');
      viewDetailsBtn.addEventListener('click', () => {
        courseCatalogResultClick(result);
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

export default renderCourseCatalogSearchResults;
