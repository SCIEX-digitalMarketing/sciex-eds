import {
  headlessResultsList,
  handleResultClick,
} from '../controller/controllers.js';
import { i18n } from '../../translation.js';
import getFavoriteResultsList from '../../favorite-all/favorite-all-controller/favorite-allDocController.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;
let favoriteResultsList = [];

const favIconAllowedTags = [
  "knowledge-base-articles",
  "tech-notes",
  "regulatory-docs",
  "training",
  "training.sciex.com",
  "customer-docs",
  "eula",
  "sciexhow"
];
async function checkLoginStatus() {
  try {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    return user?.loggedIn === true;
  } catch (e) {
    console.warn('Treating user as logged out', e);
    return false;
  }
}

const getCleanPrintableUri = (uri) => {
  try {
    const decodedUri = uri.replace(/&amp;/gi, '&');

    const url = new URL(decodedUri, window.location.origin);
    url.searchParams.delete('course');
    url.searchParams.delete('courseType');
    return url.origin + url.pathname + url.search + url.hash;
  } catch (e) {
    return uri.split('?')[0];
  }
};

const isUserLoggedIn = await checkLoginStatus();

if (isUserLoggedIn) {
  favoriteResultsList = await getFavoriteResultsList();
}
const callFavoriteAPI = async (params) => {
  try {
    const query = new URLSearchParams(params).toString();

    const response = await fetch(`/bin/sciex/favoritecontent?${query}`, {
      method: 'GET', // ✅ Backend expects GET
      credentials: 'include',
    });

    const text = await response.text(); // servlet returns JSON string
    let data = {};

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON from favorite API:', text);
    }

    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('Favorite API error:', error);
    return { success: false, status: 0, data: null };
  }
};


export const addToFavorite = (url) => callFavoriteAPI({
  operation: 'add',
  url,
});

export const removeToFavorite = (url) => callFavoriteAPI({
  operation: 'remove',
  url,
});

const renderSearchResults = () => {
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

  const results = headlessResultsList.state.results || [];
  const sortedResults = results;

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
      const isFavorite = isUserLoggedIn
        ? !!favoriteResultsList?.some(fav =>
          fav?.pageData?.some(
            page => page?.path === result.printableUri || page?.path === result?.raw?.courseurl
          )
        )
        : false;
      const urlSplit = result.printableUri.split("/");
      const isItemAllowed = urlSplit.some(segment => favIconAllowedTags.includes(segment));

      const regulatoryInfo = document.createElement('div');
      regulatoryInfo.className = 'regulatory-info';
      const partNumber = result.raw.productpartnumber ? `${strings.partNumber} : ${result.raw.productpartnumber} | ` : '';
      const lotNumber = result.raw.lotnumber ? `${strings.lotNumber} : ${result.raw.lotnumber} | ` : '';
      const componentLotNumber = result.raw.kitpartnumber ? `${strings.kitNumber} : ${result.raw.kitpartnumber} ` : '';

      regulatoryInfo.innerHTML = `${partNumber}  ${lotNumber}  ${componentLotNumber}`;

      const courseInfo = document.createElement('div');
      courseInfo.className = 'course-info';
      const duration = result.raw.duration ? `Duration : ${result.raw.duration} | ` : '';
      const language = result.raw.language ? `Language : ${result.raw.language} | ` : '';
      const courseType = result.raw.coursetypecategories ? `Type : ${result.raw.coursetypecategories} | ` : '';
      const courseLevel = result.raw.levelcategories ? `Course Level : ${result.raw.levelcategories} | ` : '';
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
      const cleanPrintableUri = result.printableUri?.startsWith('https://training.sciex.com')
        ? getCleanPrintableUri(result.printableUri)
        : result.printableUri;

      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.innerHTML = `
                  <div class="item-details">
          ${result.raw.isnewcourse || result.raw.coursetypecategories ? `
            <div class="tag-container">
        ${result.raw.coursetypecategories?.some(cat => cat === 'Premium online' || cat === 'Premium eLearning') ? '<span class="tag premium">Premium</span>' : ''}
        ${result.raw.isnewcourse ? '<span class="tag new">New</span>' : ''}
      </div>
          ` : ''}
            <h3>${result.title || 'No Title Available'}</h3>
            <div class="description">${result.raw.description}</div>
            ${result.raw.ogimage
          ? `<img src="${result.raw.ogimage}" alt="ogimage" width="200" height="200">`
          : ''
        }
        </div>
        <div class="action-section">
  ${isUserLoggedIn && isItemAllowed ? `
    <div class="item-icons">
          <span class="favorite-icon" aria-label="Favorite">
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 30 30" fill="none">
              <path d="M22.75 4.5V24.7344L15.3652 16.8584L15 16.4688L14.6348 16.8584L7.25 24.7344V4.5H22.75Z" />
            </svg>
          </span>
    </div>
  ` : ''}
  <a class="view-details-btn" target="_blank"
     href="${cleanPrintableUri}">
     ${strings.view}
  </a>
</div>

        `;

      // Paste the share icon above line 157
      // <img src="/icons/share.svg" alt="Share" class="share-icon" />
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
            : `
              <span class="show-more-text">Read Less</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="21" viewBox="0 0 16 21" fill="none">
                <path d="M2 8L14 8" stroke="#0068FA"/>
              </svg>
            `;
        });

        itemDetails.appendChild(showMoreBtn);
      }

      const favIcon = resultItem.querySelector('.favorite-icon');
      if (isUserLoggedIn && favIcon) {

        if (isFavorite) {
          favIcon.classList.add('favorited');
          favIcon.setAttribute('title', 'Remove from favorites');
        }
        else {
          favIcon.setAttribute('title', 'Save to favorites');
        }

        favIcon.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (favIcon.classList.contains('is-loading')) return;
          favIcon.classList.add('is-loading');

          let pageUrl = result.printableUri;
          if(pageUrl.startsWith('https://training.sciex.com')) {
            pageUrl = result?.raw?.courseurl ;
          }
          const isFavorited = favIcon.classList.contains('favorited');

          try {
            if (isFavorited) {
              favIcon.classList.remove('favorited');
              favIcon.setAttribute('title', 'Save to favorites');
              const res = await removeToFavorite(pageUrl);

              if (!res.success) {
                favIcon.classList.add('favorited');
                favIcon.setAttribute('title', 'Remove from favorites');
              } else {
                favoriteResultsList = await getFavoriteResultsList();
              }
            } else {
              favIcon.classList.add('favorited');
              favIcon.setAttribute('title', 'Remove from favorites');
              const res = await addToFavorite(pageUrl);

              if (!res.success) {
                favIcon.classList.remove('favorited');
                favIcon.setAttribute('title', 'Save to favorites');
              } else {
                favoriteResultsList = await getFavoriteResultsList();
              }
            }
          } finally {
            favIcon.classList.remove('is-loading');
          }
        });
      }

      const viewDetailsBtn = resultItem.querySelector('.view-details-btn');
      viewDetailsBtn.addEventListener('click', () => {
        handleResultClick(result);
      });

      const heading = resultItem.querySelector('h3');

      if (duration || courseType || courseLevel) {
        heading.insertAdjacentElement('afterend', courseInfo);
      }

      if (partNumber || lotNumber || componentLotNumber) {
        heading.insertAdjacentElement('afterend', regulatoryInfo);
      }

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

export default renderSearchResults;
