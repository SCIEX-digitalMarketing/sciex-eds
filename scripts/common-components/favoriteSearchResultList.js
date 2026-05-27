/* eslint-disable */
import {
  removeFavoriteSearchEngine
} from '../favorite-all/favorite-allDocEngine.js';
import { i18n } from '../translation.js';
import renderFavoritePagination, {
  getCurrentPage
} from './favoritePagination.js';
const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

const MAX_RESULTS = 10;

/* ======================================================
   SORT STATE
====================================================== */
let currentSortType = 'relevancy';

/* ======================================================
   SORT HELPER
====================================================== */
function sortResults(results) {

  if (currentSortType === 'title') {
    return [...results].sort((a, b) =>
      (a.title || '').localeCompare(b.title || '')
    );
  }

  if (currentSortType === 'newest') {
    return [...results].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }

  return results; // relevancy
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
/* ======================================================
   SORT DROPDOWN
====================================================== */
function renderSortingDropdown(rerenderCallback) {

  const container = document.getElementById('sort');
 

  if (!container) return;

  container.innerHTML = '';

  const label = document.createElement('div');
  label.className = 'sort-by-label';
  label.innerHTML = `${strings.sortBy || 'Sort By'}:`;

  const select = document.createElement('select');
  select.id = 'sort-element';
  select.className =
    'tw-py-2 tw-px-3 tw-border tw-border-gray-300 tw-bg-white tw-text-sm';

  const options = [
    { label: strings.relevancy || 'Relevance', value: 'relevancy' },
    { label: strings.title || 'Title', value: 'title' },
    { label: strings.newest || 'Newest', value: 'newest' },
  ];

  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    select.appendChild(option);
  });

  select.value = currentSortType;

  select.addEventListener('change', e => {
    currentSortType = e.target.value;
    rerenderCallback?.();
  });

  container.appendChild(label);
  container.appendChild(select);
}


/* ======================================================
   MAIN RENDER FUNCTION
====================================================== */
const renderfavoriteSearchResultList = (
  data,
  renderUi
) => {
console.log('renderuiii',data)
  renderSortingDropdown(() =>
    renderfavoriteSearchResultList(data,renderUi)
  );

  const noResults = document.getElementById('coveo-no-results');
  const target = document.querySelector('.search-result-section');

  if (noResults && target) {
    target.appendChild(noResults);
  }

  const resultsElement = document.getElementById('coveo-results');
  const resultsLoading = document.getElementById('coveo-results-loading');
  const noResultsElement = document.getElementById('coveo-no-results');

  resultsElement.innerHTML = '';


  // ========================
  // SHOW LOADER
  // ========================
  resultsLoading?.classList.remove('tw-hidden');

  // ========================
  // FLATTEN RESULTS
  // ========================
  const allResults = Array.isArray(data)
    ? data.flatMap(group =>
      group.pageData?.map(item => ({
        ...item,
        assetType: group.assetType
      })) || []
    )
    : [];

  // ========================
  // SELECTED ASSET TYPES
  // ========================
  const selectedAssetTypes = data
    .filter(a => a.state === 'selected')
    .map(a => a.assetType);

  let filteredResults = allResults;

  // ========================
  // FILTER BY ASSET TYPE
  // ========================
  if (selectedAssetTypes.length > 0) {
    filteredResults = filteredResults.filter(item =>
      selectedAssetTypes.includes(item.assetType)
    );
  }

  // ========================
  // COLLECT SELECTED TAG IDS
  // ========================
  const selectedTagIds = data.flatMap(asset =>
    asset.tags?.flatMap(tag =>
      tag.value
        ?.filter(v => v.state === 'selected')
        .flatMap(v => v.value)
    ) || []
  );

  if (selectedTagIds.length > 0) {
    filteredResults = filteredResults.filter(item =>
      selectedTagIds.includes(item.id)
    );
  }

  /* ========================
     APPLY SORTING
  ======================== */
  filteredResults = sortResults(filteredResults);

  /* ========================
     LIMIT TO 10 RESULTS
  ======================== */
  const currentPage = getCurrentPage();
const startIndex = (currentPage - 1) * MAX_RESULTS;
const endIndex = startIndex + MAX_RESULTS;
const visibleResults = filteredResults.slice(startIndex, endIndex);
renderFavoritePagination(filteredResults.length,renderUi,data,renderfavoriteSearchResultList);

  /* ========================
     RENDER RESULTS
  ======================== */
  if (visibleResults.length > 0) {
    resultsLoading?.classList.add('tw-hidden');
    noResultsElement.style.display = 'none';

    visibleResults.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';     
      const cleanPrintableUri = result.path?.startsWith('https://training.sciex.com')
      ? getCleanPrintableUri(result?.path)
      : result.path;
      const relatedProductsHtml = Array.isArray(result.relatedProducts)
      ? result.relatedProducts
          .filter(product => product?.href && product?.title)
          .map(product =>
            `<a href="${product.href}" class="related-product-link">${product.title}</a>`
          )
          .join(' <span class="pipe-separator">|</span> ')
      : '';
    
      resultItem.innerHTML = `
        <div class="item-details">
          <h3>${result.title || ''}</h3>
          <div class="description">${result.description || ''}</div>
          <div class="related-products">
            ${
              relatedProductsHtml
                ? `<p class="related-products-label">Related Products :</p> ${relatedProductsHtml}`
                : ''
            }
          </div>
        </div>

        <div class="action-section">
          <span class="favorite-icon" aria-label="Favorite">
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 30 30" stroke="#1C7AFF" fill="#1C7AFF" >
              <path d="M22.75 4.5V24.7344L15.3652 16.8584L15 16.4688L14.6348 16.8584L7.25 24.7344V4.5H22.75Z" />
            </svg>
          </span>

          <a
            class="view-details-btn"
            target="_blank"
            href="${cleanPrintableUri || '#'}"
          >
            ${strings.view} details
          </a>
        </div>
      `;


      /* ========================
         REMOVE FAVORITE
      ======================== */
      resultItem
        .querySelector('.favorite-icon')
        ?.addEventListener('click', async () => {

          try {
            const response = await removeFavoriteSearchEngine(result.path);

            if (response?.message === 'The operation went successfully') {

              data.forEach(asset => {
                if (Array.isArray(asset.pageData)) {
                  asset.pageData = asset.pageData.filter(
                    item => item.path !== result.path
                  );
                }
              });
              renderUi()           

            }
          } catch (e) {
            console.error(e);
          }
        });

      resultsElement.appendChild(resultItem);
    });
  } else {
    resultsLoading?.classList.add('tw-hidden');
    noResultsElement.style.display = '';
  }
};

export default renderfavoriteSearchResultList;
