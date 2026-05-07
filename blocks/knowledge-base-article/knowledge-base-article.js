import '../../scripts/aem.js';
import {
  getfavoriteAllData,

} from '../../scripts/favorite-all/favorite-allDocEngine.js';

async function checkLoginStatus() {
  try {
    const USER_API = '/bin/sciex/currentuserdetails';
    const userResp = await fetch(USER_API, { credentials: 'include' });

    if (!userResp.ok) {
      throw new Error(`User API failed: ${userResp.status}`);
    }

    const user = await userResp.json();
    return user?.loggedIn === true;
  } catch (e) {
    console.warn('Treating user as logged out', e);
    return false;
  }
}
const isUserLoggedIn = await checkLoginStatus();
const callFavoriteAPI = async (operation, url) => {
  try {
    const query = new URLSearchParams({ operation, url }).toString();

    const res = await fetch(`/bin/sciex/favoritecontent?${query}`, {
      method: 'GET',
      credentials: 'include',
    });

    const text = await res.text();

    return {
      success: res.ok,
      data: text ? JSON.parse(text) : null,
    };
  } catch (e) {
    console.error('Favorite API error:', e);
    return { success: false };
  }
};
export default function decorate(block) {
  console.log(`Decorating Knowledge Base Article block${block.outerHTML}`);
  const children = Array.from(block.children);
  console.log('Knowledge Base Article block children:', children.length);
  const versionId = children[0];
  const articleId = children[1]?.textContent?.trim() || '';
  const body = children[6];
  const title = children[4];
  const tagNames = children[13];
  let voteAvg = children[14] || 0;
  console.log('voteAvg:', children[14]);
  const finalTags = [];

  // Ensure tagNames is a string
  let tagString = tagNames.textContent?.trim() || '';

  if (Array.isArray(tagNames)) {
    tagString = tagNames.join(','); // convert array → string
  } else if (typeof tagNames === 'string') {
    tagString = tagNames;
  }
  if (tagString) {
    tagString.split(';').forEach((group) => {
      const parts = group.split('-');

      if (parts.length === 2) {
        let parent = parts[0].trim();
        const part = parts[1].split('|');
        if (parent === 'Application') {
          parent = 'applications';
        } else if (parent === 'Mass spectrometry') {
          parent = 'massspectrometerscategories';
        } else if (parent === 'Liquid chromatography') {
          parent = 'hplcandceproductscategories';
        } else if (parent === 'Biomedical and omics research') {
          parent = 'lifescienceresearchcategories';
        } else if (parent === 'Training course type') {
          parent = 'trainingcoursetype';
        } else if (parent === 'Language') {
          parent = 'language';
        } else if (parent === 'Category') {
          parent = 'categories';
        } else if (parent === 'Sub category') {
          parent = 'subcategories';
        } else {
          parent = `${parent}categories`;
        }
        part.forEach((child) => {
          const childName = child.trim();
          // URL creation
          const url = `/search-results?contentType=Knowledge base articles&facetId=${encodeURIComponent(parent.toLowerCase())}&value=${encodeURIComponent(childName)}`;
          finalTags.push(`<a href="${url}">${childName}</a>`);
        });
      }
    });
  }
  let savedArticleRating = 0;
  // const currentUserHasVoted = children[15]?.textContent === 'true';
  const currentUserScore = children[16]?.textContent || 0;

  const blockId = versionId?.textContent?.trim() || 'knowledge-base-article';

  // Main container
  const container = document.createElement('div');
  container.className = 'kba-container';

  // Parse rich HTML body safely
  const bodyWrapper = document.createElement('div');
  bodyWrapper.innerHTML = body?.innerHTML || '';
  // const bodyText = bodyWrapper.querySelector('p')?.textContent || '';

  // =========================
  // Header
  // =========================
  const header = document.createElement('div');
  header.className = 'kba-header';

  // NEW: title row wrapper
  const titleRow = document.createElement('div');
  titleRow.className = 'title-row';

  const heading = document.createElement('h2');
  heading.textContent = title?.textContent || '';

  // icons wrapper
  const itemIcons = document.createElement('div');
  itemIcons.className = 'item-icons';

  // favorite icon span
  const favoriteIcon = document.createElement('span');
  favoriteIcon.className = 'favorite-icon';
  favoriteIcon.setAttribute('aria-label', 'Favorite');

  // svg icon
  favoriteIcon.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22">
    <path
      d="M21.1412 11.2293L11.7662 20.5143L2.39125 11.2293C1.77288 10.6275 1.2858 9.90428 0.96068 9.10505C0.635562 8.30583 0.479448 7.44795 0.502167 6.58543C0.524887 5.7229 0.725949 4.87443 1.09269 4.09343C1.45944 3.31243 1.98391 2.61583 2.6331 2.04748C3.28229 1.47914 4.04213 1.05137 4.86476 0.79111C5.68739 0.53085 6.555 0.443739 7.41296 0.535261C8.27091 0.626783 9.10062 0.894955 9.84984 1.32289C10.5991 1.75083 11.2516 2.32926 11.7662 3.02176C12.2832 2.33429 12.9364 1.76091 13.6851 1.33752C14.4338 0.91412 15.2619 0.649821 16.1174 0.561159C16.973 0.472497 17.8376 0.561382 18.6572 0.822249C19.4768 1.08312 20.2338 1.51035 20.8807 2.07721C21.5276 2.64408 22.0505 3.33836 22.4168 4.11662C22.783 4.89488 22.9847 5.74036 23.0091 6.60014C23.0336 7.45993 22.8803 8.3155 22.5589 9.11332C22.2375 9.91114 21.7549 10.634 21.1412 11.2368"
      fill="#ffffff"
      stroke="#333333"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"/>
  </svg>
`;
  if (favoriteIcon) {
    console.log('Favorite icon created successfully');
    const checkAndSetFavoriteStatus = async () => {
      try {
        const favoriteData = await getfavoriteAllData();
        console.log('Favorite data retrieved:', favoriteData);
        if (favoriteData) {
          const isFavorited = !!favoriteData?.some((fav) => fav?.pageData?.some(
            (page) => page?.path === window.location.pathname,
          ));
          console.log('Is article favorited by user?', isFavorited);
          if (isFavorited) {
            const path = favoriteIcon.querySelector('path');
            path.setAttribute('fill', '#acacac');
            path.setAttribute('stroke', '#e60023');
          }
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    checkAndSetFavoriteStatus();
  }
  favoriteIcon.addEventListener('click', () => {
    const path = favoriteIcon.querySelector('path');
    const isRed = path.getAttribute('fill') === '#e60023';
    const fullUrl = window.location.href;
    if (isRed) {
      path.setAttribute('fill', '#ffffff');
      path.setAttribute('stroke', '#333333');
      path.setAttribute('stroke-width', '1.5');
      callFavoriteAPI('remove', fullUrl);
    } else {
      path.setAttribute('fill', '#e60023');
      path.setAttribute('stroke', '#e60023');
      callFavoriteAPI('add', fullUrl);
    }
  });

  itemIcons.appendChild(favoriteIcon);

  // NEW: append heading + icon in same row
  titleRow.append(heading, itemIcons);

  const statusWrapper = document.createElement('div');
  statusWrapper.className = 'status-wrapper';

  // =========================
  // Salesforce request - average vote display
  // =========================

  async function getVotes(kbaarticleId) {
    const res = await fetch(`/bin/sciex/kba/rating?articleId=${kbaarticleId}`);
    return res.json();
  }

  const initialVotes = getVotes(articleId);

  console.log('Initial votes data:', initialVotes);

  voteAvg = initialVotes?.voteAvg || 0;
  savedArticleRating = initialVotes?.currentUserScore || 0;

  // =========================
  // Rating UI
  // =========================
  const ratingWrapper = document.createElement('div');
  ratingWrapper.className = 'rating-wrapper';

  const ratingLabel = document.createElement('span');
  ratingLabel.className = 'rating-label';
  ratingLabel.textContent = 'Rating';

  const starsContainer = document.createElement('div');
  starsContainer.className = 'stars-container';

  for (let i = 1; i <= 5; i += 1) {
    const star = document.createElement('span');
    star.className = 'star';
    star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
  <path d="M11.4141 0L14.1082 8.2918H22.8267L15.7733 13.4164L18.4675 21.7082L11.4141 16.5836L4.36064 21.7082L7.05481 13.4164L0.00138474 8.2918H8.71989L11.4141 0Z" fill="#F2C94C"/>
</svg>`;
    star.dataset.value = i;
    const path = star.querySelector('path');
    if (voteAvg && i <= voteAvg.textContent) {
      path.setAttribute('fill', '#F2C94C');
    } else {
      path.setAttribute('fill', '#8A8A8A');
    }
    starsContainer.appendChild(star);
  }

  ratingWrapper.append(ratingLabel, starsContainer);

  statusWrapper.append(ratingWrapper);

  // FINAL: append title row + status
  header.append(titleRow, statusWrapper);

  //= =========
  // Vote
  //= =========
  const articleRatingBar = document.createElement('div');
  articleRatingBar.className = 'voterating-bar';

  const articleRatingText = document.createElement('span');
  articleRatingText.className = 'voterating-label';
  articleRatingText.textContent = 'Rate the article';

  const articleStarsRow = document.createElement('div');
  articleStarsRow.className = 'votestars-container';

  function updateArticleStars(count) {
    const articleStars = articleStarsRow.querySelectorAll('.votestar');
    articleStars.forEach((star, index) => {
      const path = star.querySelector('path');
      if (!path) return;

      if (index < count) {
        path.setAttribute('fill', '#F2C94C');
        path.setAttribute('stroke', '#F2C94C');
        path.setAttribute('stroke-width', '2');
      } else {
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#8A8A8A');
        path.setAttribute('stroke-width', '2');
      }
    });
  }

  for (let i = 1; i <= 5; i += 1) {
    const articleStarItem = document.createElement('span');
    articleStarItem.className = 'votestar';
    articleStarItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
    <path d="M11.4141 0L14.1082 8.2918H22.8267L15.7733 13.4164L18.4675 21.7082L11.4141 16.5836L4.36064 21.7082L7.05481 13.4164L0.00138474 8.2918H8.71989L11.4141 0Z" stroke="#8A8A8A" stroke-width="2" fill="none"/>
  </svg>`;

    articleStarsRow.appendChild(articleStarItem);
  }
  async function getArticle(kbaarticleId, voteVal) {
    let path = window.location.pathname;
    if (!path.includes('/content/sciex-eds')) {
      path = `/content/sciex-eds${path}`;
    }
    if (path.endsWith('.html')) {
      path = path.replace('.html', '');
    }
    const res = await fetch(`/bin/sciex/knowledge?articleId=${kbaarticleId}&voteVal=${voteVal}&pagePath=${path}`);
    return res.json();
  }
  const voteStars = articleStarsRow.querySelectorAll('.votestar');

  voteStars.forEach((star, index) => {
    const ratingValue = index + 1;
    // ratingValue =currentUserScore;
    star.addEventListener('mouseenter', () => {
      updateArticleStars(ratingValue);
    });

    star.addEventListener('click', async () => {
      savedArticleRating = ratingValue;
      updateArticleStars(savedArticleRating);
      try {
        const response = await getArticle(articleId, ratingValue);

        savedArticleRating = response?.currentUserScore || ratingValue;
      } catch (e) {
        console.error('Vote failed:', e);
      }
      // 👉 Replace rating UI with thank you message
      articleRatingBar.innerHTML = '';

      const thankYouWrapper = document.createElement('div');
      thankYouWrapper.className = 'thank-you-message';

      const tickIcon = document.createElement('div');
      tickIcon.className = 'thank-you-tick';
      tickIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.8095L9.90091 18L20 5" stroke="white"/>
          </svg>
        `;

      const thankYouText = document.createElement('div');
      thankYouText.className = 'thank-you-message-text';
      thankYouText.textContent = 'Thank you for your feedback';

      thankYouWrapper.append(tickIcon, thankYouText);

      articleRatingBar.appendChild(thankYouWrapper);
      articleRatingBar.classList.add('success');
    });
  });
  updateArticleStars(currentUserScore);
  articleStarsRow.addEventListener('mouseleave', () => {
    updateArticleStars(savedArticleRating);
  });

  articleRatingBar.append(articleRatingText, articleStarsRow);
  // append wherever needed

  // =========================
  // Body
  // =========================
  const bodyContent = document.createElement('div');
  bodyContent.className = 'kba-body-content';

  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'kba-body';
  bodyDiv.innerHTML = bodyWrapper.innerHTML;

  bodyContent.append(bodyDiv);

  // =========================
  // Details section
  // =========================
  const details = document.createElement('div');
  details.className = 'kba-section';

  const detailsHeading = document.createElement('h3');
  detailsHeading.className = 'kba-details';
  detailsHeading.textContent = 'Details';
  const detailsRelatedText = document.createElement('p');
  detailsRelatedText.innerHTML = `<span class="kba-note">Related to : </span><span class="kba-tag">${finalTags.join(', ')}</span>  `;

  const detailsText = document.createElement('p');
  detailsText.innerHTML = '<span class="kba-note">Note : </span><span class="kba-text">For research use only. Not for use in diagnostic procedures.</span>';

  details.append(detailsHeading, detailsRelatedText, detailsText);
  if (!isUserLoggedIn) {
    articleRatingBar.style.display = 'none';
  }
  const exploreBtn = document.createElement('a');
  exploreBtn.href = '/search-results?contentType=Knowledge base articles';
  exploreBtn.target = '_blank';
  exploreBtn.className = 'btn secondary related-explore-btn';
  exploreBtn.textContent = 'Explore more articles';

  container.append(header, articleRatingBar, bodyContent, details);
  container.appendChild(exploreBtn);
  block.textContent = '';
  block.append(container);

  block.id = `${blockId}-content`;
  block.className = 'knowledge-base-article';
}
