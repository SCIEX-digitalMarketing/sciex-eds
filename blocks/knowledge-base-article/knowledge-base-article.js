import '../../scripts/aem.js';
import {
  getfavoriteAllData,

} from '../../scripts/favorite-all/favorite-allDocEngine.js';

async function checkLoginStatus() {
  try {

    const user = JSON.parse(localStorage.getItem('userDetails'));
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
  const children = Array.from(block.children);
  const versionId = children[0];
  const articleId = children[1]?.textContent?.trim() || '';
  const body =children[6];
  const title = children[4];
  const tagNames = children[13];
  let voteAvg = children[14] || 0;
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
        } else if (parent === 'Liquid chromatography' || parent === 'NanoLC' || parent === 'MicroLC' || parent === 'Standard Flow LC') {
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
  let currentUserScore = children[16]?.textContent || 0;
  const videoSrc = children[17]?.textContent?.trim() || '';

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
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 30 30" fill="none">
          <path d="M22.75 4.5V24.7344L15.3652 16.8584L15 16.4688L14.6348 16.8584L7.25 24.7344V4.5H22.75Z" />
       </svg>`;
  if (favoriteIcon) {
    const checkAndSetFavoriteStatus = async () => {
      try {
        const favoriteData = await getfavoriteAllData();

        if (favoriteData) {
          const isFavorited = !!favoriteData?.some((fav) => fav?.pageData?.some((page) => {
            const path = page?.path || '';
            // Full URL
            if (path.startsWith('http')) {
              return path === window.location.href;
            }
            // Relative path
            return path === window.location.pathname;
          }));
          if (isFavorited) {
            const path = favoriteIcon.querySelector('path');
            path.setAttribute('fill', '#1C7AFF');
            path.setAttribute('stroke', '#1C7AFF');
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
    const isRed = path.getAttribute('fill') === '#1C7AFF';
    const fullUrl = window.location.href;
    if (isRed) {
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#000');
      path.setAttribute('transition', 'stroke 0.3s ease, fill 0.3s ease');
      callFavoriteAPI('remove', fullUrl);
    } else {
      path.setAttribute('fill', '#1C7AFF');
      path.setAttribute('stroke', '#1C7AFF');
      callFavoriteAPI('add', fullUrl);
    }
  });

  itemIcons.appendChild(favoriteIcon);
  if (!isUserLoggedIn) {
    favoriteIcon.style.display = 'none';
  }
  // NEW: append heading + icon in same row
  titleRow.append(heading, itemIcons);

  const statusWrapper = document.createElement('div');
  statusWrapper.className = 'status-wrapper';

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

  // =========================
  // Salesforce request - average vote display
  // =========================

  async function getVotes(kbaarticleId) {
    const res = await fetch(`/bin/sciex/kba/rating?articleId=${kbaarticleId}`);
    return res.json();
  }
  async function loadVotes() {
    try {
      const initialVotes = await getVotes(articleId);

      voteAvg = Number(initialVotes?.voteAvg) || 0;
      currentUserScore = Number(initialVotes?.currentUserScore) || 0;
      savedArticleRating = currentUserScore;

      // Update top rating stars
      const topStars = starsContainer.querySelectorAll('.star');

      topStars.forEach((star, index) => {
        const path = star.querySelector('path');

        if (index < voteAvg) {
          path.setAttribute('fill', '#F2C94C');
        } else {
          path.setAttribute('fill', '#8A8A8A');
        }
      });

      // Update user voting stars
      updateArticleStars(currentUserScore);
    } catch (e) {
      console.error('Failed loading votes:', e);
    }
  }

  loadVotes();
  /// =========================
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

  // Video before body
if (videoSrc) {
  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'kba-video';

  videoWrapper.innerHTML = `
    <iframe
      src="${videoSrc}"
      title="Knowledge Base Video"
      width="556"
      height="311"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `;

  bodyContent.appendChild(videoWrapper);
}
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
