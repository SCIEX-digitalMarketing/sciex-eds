/* eslint-disable */


import getFavoriteResultsList from '../../scripts/favorite-all/favorite-all-controller/favorite-allDocController.js';
import { renderCommonFacet } from '../../scripts/common-components/favorite-all-facets.js';
import renderfavoriteSearchResultList from '../../scripts/common-components/favoriteSearchResultList.js';
import renderFavoriteQuerySummary from '../../scripts/common-components/favoriteQuerySummary.js';
import renderFavoriteFacetBreadcrumb from '../../scripts/common-components/favoriteFacetBreadcrumb.js';
import initializefavoriteSearchInterface from '../../scripts/common-components/favoriteResourceUi.js';
import { renderLoggedOut } from '../../scripts/favorite-all/favorite-all-controller/sortiingUtils.js';
import { resetPagination } from '../../scripts/common-components/favoritePagination.js';

const USER_API = '/bin/sciex/currentuserdetails';

const LOGIN_URL = '/bin/sciex/login';
const CREATE_ACCOUNT_URL = '/support/create-account';

const LOGOUT_TEXT =
  'Please log in or create an account to view and manage your favorites.';


async function checkLoginStatus() {
  try {
    const userResp = await fetch(USER_API, { credentials: 'include' });

    if (!userResp.ok) {
      throw new Error(`User API failed: ${userResp.status}`);
    }

    const user = await userResp.json();
    return user?.loggedIn === true;
  } catch (e) {
    console.warn('Favorites block: treating user as logged out', e);
    return false;
  }
}

/* ======================================================
   BLOCK CONTENT (banner + no results)
====================================================== */
async function readBlockProperties(block) {
  const noResultsDiv = document.createElement('div');
  noResultsDiv.id = 'coveo-no-results';
  noResultsDiv.style.display = 'none';

  const noResultsText = document.createElement('div');
  noResultsText.className = 'no-result-text';
  noResultsDiv.appendChild(noResultsText);
  document.body.appendChild(noResultsDiv);

  const bannerWrapper = document.createElement('div');
  bannerWrapper.id = 'banner';

  const resp = await fetch(`${window.location.pathname}.plain.html`);
  if (!resp.ok) return;

  const main = document.createElement('main');
  main.innerHTML = await resp.text();

  const sections = Array.from(
    main.querySelector('.favorite-all')?.children || []
  );

  block.textContent = '';

  sections.forEach((section, index) => {
    const div = section.querySelector('div');
    if (!div) return;

    switch (index) {
      case 0:
        div.className = 'favorite-banner-title';
        bannerWrapper.appendChild(div);
        block.appendChild(bannerWrapper);
        break;

      case 1:
        div.className = 'favorite-banner-description';
        bannerWrapper.appendChild(div);
        break;

      case 2: {
        const picture = main.querySelector('picture');
        if (picture) noResultsDiv.appendChild(picture);
        break;
      }

      case 3:
        div.id = 'noresults-text1';
        div.dataset.text1 = div.textContent;
        noResultsDiv.appendChild(div);
        break;

      case 4:
        div.classList.add('noresults-text2');
        noResultsDiv.appendChild(div);
        break;

      default:
        break;
    }
  });
}


/* ======================================================
   RENDER HELPERS
====================================================== */
async function renderUi() {
  let list = window.favoriteResultsList || [];
  const hasPageData = list.some(item => item.pageData?.length > 0);

  if (!hasPageData) {
    list = [];
  }
  resetPagination();
  renderfavoriteSearchResultList(list,renderUi);
  renderCommonFacet(list, toggleAssetType, toggleTag);
  renderFavoriteQuerySummary(list);
  renderFavoriteFacetBreadcrumb(
    list,
    toggleAssetType,
    toggleTag,
    renderUi
  );
}


/* ======================================================
   TOGGLE HANDLERS
====================================================== */
function toggleTag(tagItem) {
  tagItem.state = tagItem.state === 'selected' ? 'idle' : 'selected';
  renderUi();
}


function toggleAssetType(asset) {
  const wasSelected = asset.state === 'selected';
  asset.state = wasSelected ? 'idle' : 'selected';

  if (!wasSelected) {
    // apply already-selected tags to newly selected asset
    window.favoriteResultsList.forEach(a => {
      if (a === asset) return;

      a.tags?.forEach(group => {
        group.value?.forEach(tag => {
          if (tag.state === 'selected') {
            const targetGroup = asset.tags?.find(g => g.key === group.key);
            const targetTag = targetGroup?.value?.find(v => v.key === tag.key);
            if (targetTag) targetTag.state = 'selected';
          }
        });
      });
    });
  } else {
    // clear tags when asset is unselected
    asset.tags?.forEach(group =>
      group.value?.forEach(tag => (tag.state = 'idle'))
    );
  }

  renderUi();
}

export function showResourceHubButton(block) {
  const resourceHubButton = document.createElement('a');
  resourceHubButton.className = 'resource-hub-button';
  resourceHubButton.textContent = 'Back to resource hub';
  resourceHubButton.style.cursor = 'pointer';
  resourceHubButton.href = '/resource-hub';
  resourceHubButton.target = '_blank';
  resourceHubButton.innerHTML = `
    <span>Back to resource hub</span>
    <img src="/icons/right-arrow.svg" alt="arrow" />
  `;

  block.appendChild(resourceHubButton);
}

/* ======================================================
   DECORATE
====================================================== */
export default async function decorate(block) {
  try {
    await readBlockProperties(block);   

    const isLoggedIn = await checkLoginStatus();

    if (!isLoggedIn) {
      renderLoggedOut(
        block,
        LOGOUT_TEXT,
        LOGIN_URL,
        CREATE_ACCOUNT_URL
      );
      return; // ⛔ stop execution
    }

    // ✅ Logged-in flow continues
    await initializefavoriteSearchInterface(block, 'favorite-all');
    showResourceHubButton(block);

     const data = await getFavoriteResultsList();
     
      const allowedAssetTypes = ['User guide', 'Regulatory documents'];

      const favoriteResultsList = data.map(item => {
        const normalize = (str) =>
          str.replace(/\s+/g, '').toLowerCase();

        const isAllowedType = allowedAssetTypes.includes(item.assetType);

        // 1️⃣ Find Asset Type tag
        const assetTypeTag = item.tags.find(tag =>
          normalize(tag.key) === 'assettype'
        );

        const assetTypeIds = assetTypeTag
          ? assetTypeTag.value.flatMap(v => v.value)
          : [];

        const otherTagIds = item.tags
          .filter(tag => normalize(tag.key) !== 'assettype')
          .flatMap(tag => tag.value.flatMap(v => v.value));

        const otherTagIdSet = new Set(otherTagIds);

        // 2️⃣ Apply filteredPageData ONLY for NOT allowed types
        const filteredPageData = isAllowedType
          ? item.pageData
          : item.pageData.filter(page =>
              !assetTypeIds.includes(page.id) || otherTagIdSet.has(page.id)
            );

        // 3️⃣ Keep Asset Type tag ONLY for allowed types
        const filteredTags = item.tags.filter(tag => {
          if (normalize(tag.key) !== 'assettype') return true;
          return isAllowedType;
        });

        return {
          ...item,
          pageData: filteredPageData,
          tags: filteredTags
        };
      });

    window.favoriteResultsList = favoriteResultsList;
    renderUi();

  } catch (err) {
    console.error(err);
  }
}
