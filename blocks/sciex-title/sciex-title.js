import { getMetadata } from '../../scripts/aem.js';
import { getfavoriteAllData, removeFavoriteSearchEngine, addToFavorite} from '../../scripts/favorite-all/favorite-allDocEngine.js';


/**
 * Fetches current user login status
 * Returns isLoggedIn boolean - false if API fails
 */
async function checkLoginStatus() {
  try {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    return user?.loggedIn === true;
  } catch (e) {
    console.warn('User login check failed:', e);
    return false;
  }
}

async function initializeFavorite(favIcon) {
  try {
    // Get current page URL
    const pageUrl = window.location.href;
    // Get list of favorited pages
    const favoritesList = await getfavoriteAllData();
    const isfavoritedUrl  = !!favoritesList?.some(fav =>
            fav?.pageData?.some(
              page => page?.path === pageUrl
            )
          );
    // Check if current page is in favorites
    if (isfavoritedUrl) {
      favIcon.classList.add('favorited');
      favIcon.setAttribute('title', 'Remove from favorites');
    } else {
      favIcon.setAttribute('title', 'Save to favorites');
    }
    // Add click handler for favorite toggle
    favIcon.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const isFavorited = favIcon.classList.contains('favorited');
        if (isFavorited) {
          // Remove from favorites
          favIcon.classList.remove('favorited');
          favIcon.setAttribute('title', 'Save to favorites');
          const res = await removeFavoriteSearchEngine(pageUrl);
          if (res?.message !== 'The operation went successfully') {
            // Restore on failure
            favIcon.classList.add('favorited');
            favIcon.setAttribute('title', 'Remove from favorites');
          }
        } else {
          // Add to favorites
          favIcon.classList.add('favorited');
          favIcon.setAttribute('title', 'Remove from favorites');
          const res = await addToFavorite(pageUrl);
          if (res?.message !== 'The operation went successfully') {
            // Restore on failure
            favIcon.classList.remove('favorited');
            favIcon.setAttribute('title', 'Save to favorites');
          }
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    });
  } catch (error) {
    console.warn('Failed to initialize favorites:', error);
  }
}

export default async function decorate(block) {
  // Create main container div
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('.sciex-hero-title');
  const titleId = block.children[0].textContent;
  const heading = block.children[1].textContent;
  const headingDiv = document.createElement('div');
  if (titleId && titleId.trim() !== '') {
    block.id = `${titleId.trim()}-content`;
  }

  headingDiv.classList.add('hero-heading');
  const pageTitle = getMetadata('og:title');
  if (heading && heading.trim() !== '') {
    headingDiv.append(heading.trim());
  } else {
    headingDiv.append(pageTitle);
  }

  // Check user login status
  const isLoggedIn = await checkLoginStatus();

  // Check if it's a /tech-notes page
  const pathName = window.location.pathname;
  const isTechNotesPage = pathName.includes('/tech-notes');

  // Create favorite button and icon only for tech-notes pages AND logged-in users
  if (isTechNotesPage && isLoggedIn) {
    const titleContentWrapper = document.createElement('div');
    titleContentWrapper.classList.add('title-content-wrapper');
    const favIcon = document.createElement('span');
    favIcon.classList.add('favorite-icon');    
    favIcon.innerHTML = `    
       <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 30 30" fill="none">
          <path d="M22.75 4.5V24.7344L15.3652 16.8584L15 16.4688L14.6348 16.8584L7.25 24.7344V4.5H22.75Z" />
       </svg>
    `;
    titleContentWrapper.appendChild(headingDiv);
    titleContentWrapper.appendChild(favIcon);
    blockDiv.append(titleContentWrapper);
    // Initialize favorite functionality
    await initializeFavorite(favIcon);
  } else {
    blockDiv.append(headingDiv);
  }

  block.textContent = '';
  block.parentElement.classList.add('tabs-container-wrapper');
  block.append(blockDiv);
}
