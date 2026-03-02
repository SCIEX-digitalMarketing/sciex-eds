import {
  div, span, ul, li, a, p,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/aem.js';
import { standaloneSearchBoxController } from '../../scripts/header-search/headerSearchController.js';
// import { login } from '../../scripts/auth.js';

const menuLinks = {};
// Keep dropdown references per anchor without mutating DOM nodes
const dropdownMap = new WeakMap();
/* function handleSignInClick(e) {
  e.preventDefault();
  login();
} */
/** ********
     *
     *
     *
      function to check if mobile actions can be performed
     *
     *
     *
     *  */
function canMobileActions() {
  const screenWidth = window.innerWidth;
  if (screenWidth > 1024) {
    return false;
  }
  return true;
}
async function getUserDetails() {
  try {
    const response = await fetch('/bin/sciex/currentuserdetails', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}
const HISTORY_KEY = 'searchHistory';
function getSearchHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

function saveQueryToLocalHistory(query) {
  let history = getSearchHistory();
  if (!history.includes(query)) {
    history.unshift(query);
    history = history.slice(0, 5); // Keep max 5 items
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}
const showSuggestions = (selectedContentType, showHistoryOnly = false) => {
  const suggestionPopup = document.getElementById('global-suggestion-popup');
  const searchBox = document.getElementById('standalone-search-box');
  const suggestions = standaloneSearchBoxController.state.suggestions || [];
  const history = getSearchHistory();

  const rect = searchBox.getBoundingClientRect();
  suggestionPopup.style.top = `${rect.bottom + window.scrollY}px`;
  suggestionPopup.style.left = `${rect.left + window.scrollX}px`;

  const shouldShowSuggestions = showHistoryOnly && suggestions.length > 0;
  const shouldShowHistory = history.length > 0;

  if (shouldShowSuggestions || shouldShowHistory) {
    let html = '';

    if (shouldShowHistory) {
      html += '<div style="padding: 8px; font-weight: 330; font-size: 14px; color: #8A8A8A;">Search History</div>';
      html += history
        .map((query) => `
          <div class="global-history-item" style="padding: 8px; cursor: pointer;" data-query="${query}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_746_95421)">
              <path d="M8 16C12.4107 16 16 12.4107 16 8C16 3.58934 12.4107 0 8 0C3.5893 0 0 3.58934 0 8C0 12.4107 3.58934 16 8 16ZM8 1.06665C11.824 1.06665 14.9334 4.17597 14.9334 8C14.9334 11.824 11.824 14.9334 8 14.9334C4.17597 14.9334 1.06665 11.824 1.06665 8C1.06665 4.17597 4.17602 1.06665 8 1.06665Z" fill="#707070"/>
              <path d="M10.3335 10.5494C10.4321 10.6294 10.5494 10.6667 10.6668 10.6667C10.8241 10.6667 10.9788 10.5974 11.0828 10.4667C11.2668 10.2374 11.2294 9.90138 11.0001 9.71737L8.53345 7.74403V3.73337C8.53345 3.44003 8.29346 3.20004 8.00012 3.20004C7.70678 3.20004 7.4668 3.44003 7.4668 3.73337V8.00005C7.4668 8.16273 7.54148 8.31472 7.66679 8.41603L10.3335 10.5494Z" fill="#707070"/>
            </g>
            <defs>
              <clipPath id="clip0_746_95421">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg> ${query}
          </div>`)
        .join('');
    }

    if (shouldShowSuggestions) {
      html += '<div style="padding: 8px; font-weight: 330; font-size: 14px; color: #8A8A8A;">Trending Search</div>';
      html += suggestions
        .map((suggestion) => `
          <div class="global-suggestion-item" style="padding: 8px; cursor: pointer;" data-raw-value="${suggestion.rawValue}">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0065 7.33324C12.0065 9.7264 10.0664 11.6665 7.67318 11.6665C5.27993 11.6665 3.33984 9.7264 3.33984 7.33324C3.33984 4.94007 5.27993 3 7.67318 3C10.0664 3 12.0065 4.94007 12.0065 7.33324ZM11.0743 11.4414C10.1512 12.2066 8.96589 12.6665 7.67318 12.6665C4.72766 12.6665 2.33984 10.2787 2.33984 7.33324C2.33984 4.38777 4.72766 2 7.67318 2C10.6187 2 13.0065 4.38777 13.0065 7.33324C13.0065 8.62593 12.5466 9.81119 11.7815 10.7343L14.0267 12.9796L14.3803 13.3331L13.6732 14.0402L13.3196 13.6867L11.0743 11.4414Z" fill="#707070"/>
          </svg> ${suggestion.highlightedValue}
          </div>`)
        .join('');
    }

    suggestionPopup.innerHTML = html;
    suggestionPopup.style.display = 'block';

    // Event bindings
    if (shouldShowSuggestions) {
      suggestions.forEach((suggestion, index) => {
        const item = suggestionPopup.querySelectorAll('.global-suggestion-item')[index];
        item.addEventListener('click', () => {
          const { rawValue } = suggestion;
          searchBox.value = rawValue;
          saveQueryToLocalHistory(rawValue);
          standaloneSearchBoxController.updateRedirectUrl(`/search-results?term=${rawValue}&contentType=${selectedContentType}`);
          standaloneSearchBoxController.selectSuggestion(rawValue);
          suggestionPopup.style.display = 'none';
        });
      });
    }

    if (shouldShowHistory) {
      const historyItems = suggestionPopup.querySelectorAll('.global-history-item');
      historyItems.forEach((item) => {
        item.addEventListener('click', () => {
          const rawValue = item.getAttribute('data-query');
          searchBox.value = rawValue;
          saveQueryToLocalHistory(rawValue);
          standaloneSearchBoxController.updateRedirectUrl(`/search-results?term=${rawValue}&contentType=${selectedContentType}`);
          standaloneSearchBoxController.submit();
          suggestionPopup.style.display = 'none';
        });
      });
    }
  } else {
    suggestionPopup.style.display = 'none';
  }
};
function registerDropdown(dropdown) {
  if (!dropdown) return;
  const btn = dropdown.querySelector('.dropbtn');
  const content = dropdown.querySelector('.dropdown-content');
  if (!btn || !content) return;
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = content.style.display === 'block';
    // close other dropdowns
    this.querySelectorAll('.dropdown-content').forEach((c) => {
      if (c !== content) c.style.display = 'none';
    });
    content.style.display = isOpen ? 'none' : 'block';
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
  content.addEventListener('click', (e) => e.stopPropagation());
}

function createGlobalSearch() {
  const suggestionPopup = document.getElementById('global-suggestion-popup');
  const searchContainer = document.createElement('div');
  searchContainer.className = 'standalone-search-container';
  // hide by default on mobile; will be toggled by the search button
  if (canMobileActions()) {
    // searchContainer.classList.add('tw-hidden');
  }

  const searchBox = document.createElement('input');
  searchBox.type = 'text';
  searchBox.placeholder = 'Search';
  searchBox.className = 'standalone-search-box';
  searchBox.id = 'standalone-search-box';
  searchBox.maxLength = 200;

  const tooltip = document.createElement('div');
  tooltip.id = 'char-limit-tooltip';
  tooltip.className = 'char-limit-tooltip';
  tooltip.textContent = 'Input exceeds the limit. Please search within 200 characters';
  tooltip.style.display = 'none';

  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown';

  const dropbtn = document.createElement('button');
  dropbtn.className = 'dropbtn';
  const downArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
  <path d="M14.7344 5L8.73437 11L2.73438 5" stroke="#141414"/>
  </svg>`;
  dropbtn.innerHTML = `All ${downArrow}`;

  const dropdownContent = document.createElement('div');
  dropdownContent.className = 'dropdown-content search-type-dropdown-content';
  dropdownContent.style.display = 'none';

  const menuItems = {
    All: 'All',
    "Applications":"Applications",
    "Customer documents":"Customer documents",
    "eCommerce":"eCommerce",
    "Knowledge base articles":"Knowledge base articles",
    "Products and services":"Products and services",
    "Regulatory documents":"Regulatory documents",
    "SCIEX How":"SCIEX How",
    "Technical Notes":"Technical Notes",
    "Training":"Training"
  };

  let selectedContentType = 'All';

  standaloneSearchBoxController.subscribe(() => {
    const suggestions = standaloneSearchBoxController.state.suggestions || [];
    if (suggestions.length > 0 && searchBox.value) {
      showSuggestions(selectedContentType, true);
    }
  });

  searchBox.addEventListener('focus', () => {
    showSuggestions(selectedContentType, true);
  });

  searchBox.addEventListener('blur', () => {
    setTimeout(() => {
      suggestionPopup.style.display = 'none';
    }, 150);
  });

  Object.keys(menuItems).forEach((key) => {
    const value = menuItems[key];
    const anchorElement = document.createElement('a');
    anchorElement.href = '#';
    if (key === 'All') anchorElement.className = 'drodown-content-all';
    anchorElement.textContent = value;
    anchorElement.addEventListener('click', (event) => {
      event.preventDefault();
      dropbtn.innerHTML = value + downArrow;
      dropdownContent.style.display = 'none';
      selectedContentType = value;
    });
    dropdownContent.appendChild(anchorElement);
  });

  dropdown.appendChild(dropbtn);
  dropdown.appendChild(dropdownContent);
  searchContainer.appendChild(searchBox);
  searchContainer.appendChild(tooltip);
  searchContainer.appendChild(dropdown);

  // Register dropdown behaviour (click to toggle, click outside to close)
  registerDropdown(dropdown);

  const searchBtn = document.createElement('button');
  searchBtn.className = 'global-search-btn';
  const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M9.50977 2.50879C13.0322 2.68736 15.833 5.60023 15.833 9.16699L15.8242 9.50977C15.7468 11.0363 15.1548 12.4264 14.2197 13.5127L17.374 16.667L16.667 17.374L13.5127 14.2197C12.3457 15.2244 10.8278 15.8329 9.16699 15.833L8.82324 15.8242C5.41465 15.6513 2.68168 12.9183 2.50879 9.50977L2.5 9.16699C2.5 5.48516 5.48509 2.5 9.16699 2.5L9.50977 2.50879ZM9.16699 3.5C6.03736 3.5 3.5 6.03746 3.5 9.16699C3.50026 12.2963 6.03753 14.833 9.16699 14.833C12.2963 14.8328 14.8327 12.2962 14.833 9.16699C14.833 6.03757 12.2965 3.50018 9.16699 3.5Z" fill="#141414"/>
</svg>`;
  searchBtn.innerHTML = searchIcon;
  searchContainer.appendChild(searchBtn);

  // Prevent clicks inside search container from closing dropdowns
  searchContainer.addEventListener('click', (e) => e.stopPropagation());

  searchBtn.addEventListener('click', (event) => {
    if (searchBox.value.trim() !== '') {
      standaloneSearchBoxController.updateRedirectUrl(`/search-results?term=${searchBox.value}&contentType=${selectedContentType}`);
      standaloneSearchBoxController.submit();
    } else {
      standaloneSearchBoxController.submit();
    }
    event.stopPropagation();
  });

  dropbtn.addEventListener('click', () => {
    // e.stopPropagation();
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
  });

  // Close any open dropdowns when clicking outside
  /* document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-content').forEach((c) => {
      c.style.display = 'none';
    });
  }); */

  searchBox.addEventListener('input', (event) => {
    const query = event.target.value;
    if (query.length > 0) {
      standaloneSearchBoxController.updateText(query);
      standaloneSearchBoxController.showSuggestions();
      showSuggestions(selectedContentType);
    } else {
      standaloneSearchBoxController.updateText('');
      suggestionPopup.style.display = 'none';
    }
  });

  searchBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      standaloneSearchBoxController.updateRedirectUrl(`/search-results?term=${event.target.value}&contentType=${selectedContentType}`);
      standaloneSearchBoxController.submit();
    }
  });

  searchBox.addEventListener('input', () => {
    if (searchBox.value.length >= 200) {
      tooltip.style.display = 'block';
      searchContainer.classList.add('char-limit-reached');
    } else {
      tooltip.style.display = 'none';
      searchContainer.classList.remove('char-limit-reached');
    }
  });

  searchBox.addEventListener('blur', () => {
    tooltip.style.display = 'none';
  });

  return searchContainer;
}
function createMainHeader(section) {
  const menuDiv = div({
    class:
      'tw-flex tw-w-full tw-bg-grey-900 tw-text-grey-300 tw-z-[100] tw-relative header-topbar',
  });
  const containerDiv = div({ class: 'tw-flex tw-container' });
  const qualtricsAnchor = document.createElement('div');
  qualtricsAnchor.id = 'ZN_1o1ioypsMWWxBmB';
  menuDiv.appendChild(qualtricsAnchor);
  const parentdiv = div({
    class:
      'topbar-menu tw-hidden lg:tw-block  lg:tw-top-0 lg:tw-right-0 ', // tw-h-64 tw-border-t
  });
  const ulTag = ul({
    class: 'tw-list-none tw-flex tw-items-stretch tw-text-sm tw-h-full',
  });
  const headerDiv = section.querySelector('.header');
  let myprofile = '';
  let myFavoriteResources = '';
  Array.from(headerDiv.children).forEach((child, index) => {
    const picture = child.querySelector('picture');
    const anchorTag = child.querySelector('a');

    /** ********
     *
     *
     *
      button to toggle mobile menu
     *
     *
     *
     *  */
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'lg:tw-hidden tw-flex tw-items-center menu-close';
    const mobileMenuToggleIcon = document.createElement('span');
    mobileMenuToggleIcon.insertAdjacentHTML(
      'beforeend',
      '<svg  id="mobileMenuOpenIcon"  class="openIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-rand="1739507371221"><path d="M0 20H20" stroke="#ffffff"></path><path d="M0 4H24" stroke="#ffffff"></path><path d="M0 12H16" stroke="#ffffff"></path></svg>',
    );
    mobileMenuToggleIcon.insertAdjacentHTML(
      'beforeend',
      '<svg id="mobileMenuCloseIcon" class="tw-hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-rand="1739527915887"><path d="M4 20L19.9998 4.0002" stroke="white" stroke-width="1.2"></path><path d="M4 4L19.9998 19.9998" stroke="white" stroke-width="1.2"></path></svg>',
    );
    mobileMenuToggle.id = 'toggleMobileMenu';

    const mobileSearch = document.createElement('button');
    mobileSearch.className = 'lg:tw-hidden tw-flex tw-items-center search-close tw-ml-auto tw-mr-16';
    mobileSearch.id = 'togglemobileSearch';
    const mobileSearchIcon = document.createElement('span');
    mobileSearchIcon.insertAdjacentHTML(
      'beforeend',
      `
      <svg id="mobileSearchOpenIcon" class="tw-text-white" width="24" height="24" viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg" data-di-res-id="1cb1ec8d-d09108db" data-di-rand="1768284978909">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0007 11C18.0007 14.866 14.8667 18 11.0007 18C7.13474 18 4.00073 14.866 4.00073 11C4.00073 7.13401 7.13474 4 11.0007 4C14.8667 4 18.0007 7.13401 18.0007 11ZM16.293 16.9994C14.8827 18.2445 13.0299 19 11.0007 19C6.58245 19 3.00073 15.4183 3.00073 11C3.00073 6.58172 6.58245 3 11.0007 3C15.419 3 19.0007 6.58172 19.0007 11C19.0007 13.0292 18.2452 14.882 17.0001 16.2923L20.3543 19.6464L20.7078 20L20.0007 20.7071L19.6472 20.3536L16.293 16.9994Z" fill="#ffffff"></path>
                    </svg>`,
    );
    mobileSearchIcon.insertAdjacentHTML(
      'beforeend',
      '<svg id="mobileSearchCloseIcon" class="tw-hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-rand="1739527915887"><path d="M4 20L19.9998 4.0002" stroke="white" stroke-width="1.2"></path><path d="M4 4L19.9998 19.9998" stroke="white" stroke-width="1.2"></path></svg>',
    );
    mobileSearch.appendChild(mobileSearchIcon);

    /** ********
     *
     *
     *
      function to handle mobile menu
     *
     *
     *
     *  */
    function handleMobileMenu() {
      // Initialize and declare variables
      const headerWrapper = document.querySelector('.header-wrapper');
      const mobileMenuOpenIcon = document.getElementById('mobileMenuOpenIcon');
      const mobileMenuCloseIcon = document.getElementById(
        'mobileMenuCloseIcon',
      );
      const megaMenuWrapper = document.querySelector('.megamenu-wrapper');
      // const subMenu = document.querySelector('.submenu-container');
      const backToMenuButton = document.querySelector('.back-to-menu-button');
      const subMenus = document.querySelectorAll('.submenu-container');

      // Toggle menu open/close classes
      if (this.classList.contains('menu-open')) {
        this.classList.remove('menu-open');
        this.classList.add('menu-close');
      } else {
        this.classList.remove('menu-close');
        this.classList.add('menu-open');
      }

      // Toggle mobile header
      if (headerWrapper) {
        if (headerWrapper.classList.contains('mobile-header')) {
          headerWrapper.classList.remove('mobile-header');
        } else {
          headerWrapper.classList.add('mobile-header');
        }
      }

      // Toggle menu icons
      if (mobileMenuOpenIcon && mobileMenuCloseIcon) {
        if (mobileMenuOpenIcon.classList.contains('tw-hidden')) {
          mobileMenuOpenIcon.classList.remove('tw-hidden');
        } else {
          mobileMenuOpenIcon.classList.add('tw-hidden');
        }
        if (mobileMenuCloseIcon.classList.contains('tw-hidden')) {
          mobileMenuCloseIcon.classList.remove('tw-hidden');
        } else {
          mobileMenuCloseIcon.classList.add('tw-hidden');
        }
        /* if (subMenusDivs) {
          subMenusDivs.forEach((subMenuDivItem) => {
            if (subMenuDivItem.classList.contains('tw-hidden')) {
              subMenuDivItem.classList.remove('tw-hidden');
            }
          });
        } */
      }

      // Toggle megamenu wrapper
      if (megaMenuWrapper) {
        if (megaMenuWrapper.classList.contains('tw-hidden')) {
          megaMenuWrapper.classList.remove('tw-hidden');
        } else {
          megaMenuWrapper.classList.add('tw-hidden');
        }
      }

      // Hide submenus
      if (subMenus) {
        subMenus.forEach((subMenuItem) => {
          subMenuItem.removeAttribute('style');
        });
      }

      /** ********
         *
         *
         *

          render topBar Nav at the bottom of mobile menu
        *
        *
        *
        *  */
      function renderMobileMenuBottom() {
        const topBarNav = document.querySelector('.topbar-menu');
        // const megaMenuWrapper = document.querySelector('.megamenu-wrapper');
        if (topBarNav) {
          if (topBarNav.classList.contains('tw-hidden')) {
            topBarNav.classList.remove('tw-hidden');
          } else {
            topBarNav.classList.add('tw-hidden');
          }
          if (megaMenuWrapper) {
            megaMenuWrapper.insertAdjacentElement('beforeEnd', topBarNav);
          }
        }
      }
      // Render topBar Nav at the bottom of mobile menu
      renderMobileMenuBottom();

      // Additional handling when menu is closed
      if (this.classList.contains('menu-close')) {
        if (backToMenuButton) {
          backToMenuButton.classList.add('tw-hidden');
        }
        if (megaMenuWrapper) {
          megaMenuWrapper.classList.add('tw-hidden');
        }

        // Hide all submenus
        subMenus.forEach((item) => {
          item.classList.add('tw-hidden');
        });
      }
    }
    function handleMobileSearch() {
      const headerWrapper = document.querySelector('.header-wrapper');
      if (headerWrapper) {
        headerWrapper.classList.toggle('search-open');
      }
      document.body.classList.toggle('search-open');
      const mobileSearchOpenIcon = document.getElementById('mobileSearchOpenIcon');
      const mobileSearchCloseIcon = document.getElementById('mobileSearchCloseIcon');
      const standaloneSearchContainer = document.querySelector('.standalone-search-container');
      if (mobileSearchOpenIcon && mobileSearchCloseIcon) {
        if (mobileSearchOpenIcon.classList.contains('tw-hidden')) {
          mobileSearchOpenIcon.classList.remove('tw-hidden');
        } else {
          mobileSearchOpenIcon.classList.add('tw-hidden');
        }
        if (mobileSearchCloseIcon.classList.contains('tw-hidden')) {
          mobileSearchCloseIcon.classList.remove('tw-hidden');
        } else {
          mobileSearchCloseIcon.classList.add('tw-hidden');
        }
      }
      if (standaloneSearchContainer) {
        if (standaloneSearchContainer.classList.contains('tw-hidden')) {
          standaloneSearchContainer.classList.remove('tw-hidden');
        } else {
          // standaloneSearchContainer.classList.add('tw-hidden');
        }
      }
      /* const dropbtn = document.getElementsByClassName('dropbtn');
       const dropdownContent = document.getElementsByClassName('dropdown-content');
      console.log('mobile search toggled'+dropbtn);

  dropbtn.addEventListener('click', () => {
   console.log('dropdown clicked');
  }); */
      // dropbtn.item(0).setAttribute('aria-expanded', 'true');
      // dropdownContent.item(0).style.display = 'block';
    }
    // add click event to handle mobile menu button actions
    mobileMenuToggle.addEventListener('click', handleMobileMenu);
    mobileSearch.addEventListener('click', handleMobileSearch);

    if (index === 0) {
      myprofile = anchorTag.text;
      myprofile = myprofile.replace(/^\/content\/sciex-eds/, '');
    } else if (index === 1) {
      myFavoriteResources = anchorTag.text;
       myFavoriteResources = myFavoriteResources.replace(/^\/content\/sciex-eds/, '');
    } else if (index === 2) {
      anchorTag.text = '';
      anchorTag.className = '';
      // anchorTag.target = '_blank';
      if (picture != null) {
        anchorTag.appendChild(picture);
      }
      containerDiv.appendChild(anchorTag);
      mobileMenuToggle.appendChild(mobileMenuToggleIcon);
      containerDiv.appendChild(mobileSearch);
      containerDiv.appendChild(mobileMenuToggle);

      const searchContainer = createGlobalSearch();
      containerDiv.appendChild(searchContainer);
    } else if (headerDiv.children.length !== index + 1) {
      const liTag = li({
        class:
          'tw-flex tw-items-center tw-transition-colors', // tw-ml-16
      });
      if (anchorTag.text === 'Login' || anchorTag.text === 'My account') {
        // anchorTag.addEventListener('click', handleSignInClick);
        // anchorTag.href = 'https://devcs.sciex.com/bin/sciex/login';
      // }else if (anchorTag.text === 'My account'){
        const dropdown = document.createElement('div');
        dropdown.id = 'accountDropdown';
        dropdown.className = 'dropdown ';

        const dropbtn = document.createElement('button');
        dropbtn.className = 'dropbtn login-dropdown';
        const downArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
        <path d="M14.7344 5L8.73437 11L2.73438 5" stroke="#FFFFFF"/>
        </svg>`;
        dropbtn.innerHTML = `${downArrow}`;

        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content account-dropdown-content';
        dropdownContent.style.display = 'none';
        // register dropdown toggle behaviour
        registerDropdown(dropdown);

        const menuItems = {
          Button: 'Button',
          'Already have an account?Sign In Now': 'Already have an account?<span class = "sign-in-now-link" >Sign In Now</span>',
          'My profile': 'My profile',
          'My favorite resources': 'My favorite resources',
          Logout: 'Logout',
        };
        // liTag.append(dropdown);

        /* standaloneSearchBoxController.subscribe(() => {
          const suggestions = standaloneSearchBoxController.state.suggestions || [];
          if (suggestions.length > 0 && searchBox.value) {
            showSuggestions(selectedContentType, true);
          }
        }); */

        Object.keys(menuItems).forEach((key) => {
          const value = menuItems[key];
          let anchorElement = document.createElement('a');
          if (key === 'Button' && anchorTag.text === 'Login') {
            anchorElement = document.createElement('div');
            anchorElement.innerHTML = '<a href="/support/create-account"><button class=" create-account-btn">Create an account</button></a>';
          } else {
            anchorElement = document.createElement('a');
            anchorElement.href = '#';
            if (key === 'My profile') {
              const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <g clip-path="url(#clip0_137_8473)">
                  <mask id="mask0_137_8473" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                    <path d="M0 1.90735e-06H18V18H0V1.90735e-06Z" fill="white"/>
                  </mask>
                  <g mask="url(#mask0_137_8473)">
                    <path d="M17.4727 9C17.4727 13.6793 13.6793 17.4727 9 17.4727C4.3206 17.4727 0.527344 13.6793 0.527344 9C0.527344 4.3206 4.3206 0.527346 9 0.527346C13.6793 0.527346 17.4727 4.3206 17.4727 9Z" stroke="black" stroke-width="1.125" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.3891 7.87022C12.3891 9.74193 10.8718 11.2593 9.00006 11.2593C7.1282 11.2593 5.61096 9.74193 5.61096 7.87022C5.61096 5.99853 7.1282 4.48119 9.00006 4.48119C10.8718 4.48119 12.3891 5.99853 12.3891 7.87022Z" stroke="black" stroke-width="1.125" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.94495 15.8002C4.216 13.2478 6.37572 11.2595 8.99996 11.2595C11.6243 11.2595 13.7839 13.2479 14.0549 15.8003" stroke="black" stroke-width="1.125" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_137_8473">
                    <rect width="18" height="18" fill="white"/>
                  </clipPath>
                </defs>
              </svg>`;
              anchorElement.innerHTML = `${icon} ${key}`;
              anchorElement.href = myprofile;
              anchorElement.classList.add('myprofile-div');
            } else if (key === 'My favorite resources') {
              const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <g clip-path="url(#clip0_137_8489)">
                  <path d="M15.73 9.25324L15.9637 9.01854C17.5651 7.41 17.5651 4.802 15.9637 3.19346C14.3622 1.58493 11.7657 1.58493 10.1642 3.19346L9.00004 4.3628L7.83584 3.19346C6.23437 1.58493 3.63787 1.58493 2.03643 3.19346C0.434959 4.802 0.434959 7.41 2.03643 9.01854L9.00004 16.0129L14.7962 10.2168" stroke="#020200" stroke-width="1.125" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_137_8489">
                    <rect width="18" height="18" fill="white"/>
                  </clipPath>
                </defs>
              </svg>`;
              anchorElement.innerHTML = `${icon} ${key}`;
              anchorElement.href = myFavoriteResources;
              anchorElement.classList.add('myprofile-div');
            } else if (key === 'Logout' && anchorTag.text === 'My account') {
              const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clip-path="url(#clip0_160_16974)">
                    <path d="M9.61981 4.88509V3.37751C9.61981 2.97768 9.46098 2.59422 9.17825 2.31149C8.89553 2.02877 8.51207 1.86993 8.11223 1.86993H2.8357C2.43587 1.86993 2.05241 2.02877 1.76968 2.31149C1.48696 2.59422 1.32813 2.97768 1.32812 3.37751V12.423C1.32813 12.8228 1.48696 13.2063 1.76968 13.489C2.05241 13.7717 2.43587 13.9306 2.8357 13.9306H8.11223C8.51207 13.9306 8.89553 13.7717 9.17825 13.489C9.46098 13.2063 9.61981 12.8228 9.61981 12.423V10.9154" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5.85059 7.90022H14.8961L12.6347 5.63885" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.6348 10.1616L14.8961 7.90021" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_160_16974">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>`;
              anchorElement.innerHTML = `${icon} ${key}`;
              anchorElement.classList.add('myprofile-div');
              anchorElement.href = 'https://devcs.sciex.com/bin/sciex/logout';
            } else if (key === 'Already have an account?Sign In Now') {
              anchorElement.id = 'signInNowLink';
              if (anchorTag.text === 'Login') {
                anchorElement.href = 'https://devcs.sciex.com/bin/sciex/login';
                anchorElement.innerHTML = `${value}`;
              } else if (anchorTag.text === 'My account') {
                (async function () {
                  const userData = await getUserDetails();
                  if (userData && userData.loggedIn) {
                    anchorElement.innerHTML = `<span class="username-span">${userData.familyName} ${userData.givenName}</span>`;
                  }
                }());
              }
              // anchorElement.classList.add('myprofile-div');
            }
            // close dropdown on item click
            anchorElement.addEventListener('click', () => {
              dropdownContent.style.display = 'none';
            });
          }
          dropdownContent.appendChild(anchorElement);
        });
        dropbtn.addEventListener('click', () => {
          if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
          } else {
            dropdownContent.style.display = 'block';
          }
          // dropdownContent.style.display = 'block';
        });
        dropdown.appendChild(dropbtn);
        dropdown.appendChild(dropdownContent);
        // store dropdown reference keyed by anchor
        dropdownMap.set(anchorTag, dropdown);
        /// ///
      }

      const liId = anchorTag.text;
      liTag.id = liId
        .replace(/ /g, '-')
        .replace('&', '')
        .toLowerCase()
        .replace(/\//g, '')
        .replace('--', '-');
      anchorTag.className = 'tw-inline-flex tw-items-center';
      // anchorTag.target = '_blank';
      if (picture) {
        picture.className = 'tw-mr-8';
        anchorTag.prepend(picture);
      }
      liTag.append(anchorTag);
      if (dropdownMap.has(anchorTag)) {
        anchorTag.insertAdjacentElement('afterend', dropdownMap.get(anchorTag));
      }
      ulTag.append(liTag);
    } else {
      const liTag = li({ class: '' });// tw-ml-32
      anchorTag.className = 'header-link tw-text-mobBase md:tw-text-base tw-flex tw-items-center tw-whitespace-nowrap focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-blue-700 tw-rounded tw-border tw-py-12  active:tw-bg-blue-900 tw-border-blue-700 tw-text-white tw-bg-gradient-to-r tw-bg-blue-700 tw-from-blue-800 tw-via-blue-800 tw-to-blue-800 tw-bg-bottom tw-bg-no-repeat tw-bg-[length:100%_0px] hover:tw-bg-[length:100%_100%] tw-transition-all tw-h-full tw-rounded-none';
      anchorTag.target = '_blank';
      const buttondiv = div(
        { class: 'tw-flex tw-items-center tw-justify-between' },
        span(anchorTag.text),
      );
      anchorTag.text = '';
      anchorTag.append(buttondiv);
      liTag.append(anchorTag);
      if (dropdownMap.has(anchorTag)) {
        anchorTag.insertAdjacentElement('afterend', dropdownMap.get(anchorTag));
      }
      ulTag.append(liTag);
    }
  });

  parentdiv.append(ulTag);
  containerDiv.appendChild(parentdiv);
  menuDiv.append(containerDiv);
  return menuDiv;
}

/** ********
     *
     *
     *
      function to handle back to menu actions
     *
     *
     *
     *  */
function handleBackToMenu() {
  const dataSubMenuContainer = this.dataset.submenuContainer;
  if (dataSubMenuContainer) {
    const dataSubMenuContainerDiv = document.querySelector(
      `#${dataSubMenuContainer}`,
    );
    const dataSubMenuContainerLinks = document.querySelector(
      `#${dataSubMenuContainer} .submenu-links`,
    );
    const dataSubMenuContainerContent = document.querySelector(
      `#${dataSubMenuContainer} .submenu-content`,
    );
    const dataSubMenuContainerImages = document.querySelector(
      `#${dataSubMenuContainer} .submenu-images`,
    );
    const megaMenuWrapper = document.querySelector('.megamenu-wrapper');
    const subMenu = document.querySelectorAll('.submenu-container');

    //
    //
    // back to main menu
    //
    if (this.classList.contains('to-mainmenu')) {
      // toggle mega menu
      if (megaMenuWrapper && megaMenuWrapper.classList.contains('tw-hidden')) {
        megaMenuWrapper.classList.toggle('tw-hidden');
      }

      // toggle submenu
      if (subMenu) {
        subMenu.forEach((item) => {
          item.classList.add('tw-hidden');
        });
      }

      if (this.classList.contains('tw-hidden')) {
        this.classList.remove('tw-hidden');
      } else {
        this.classList.add('tw-hidden');
      }

      if (dataSubMenuContainerDiv) {
        dataSubMenuContainerDiv.removeAttribute('style');
        dataSubMenuContainerDiv.classList.add('tw-hidden');
      }
      if (
        dataSubMenuContainerLinks
        && dataSubMenuContainerLinks.classList.contains('tw-hidden')
      ) {
        dataSubMenuContainerLinks.classList.remove('tw-hidden');
      }
      if (
        dataSubMenuContainerContent
        && dataSubMenuContainerContent.classList.contains('tw-hidden')
      ) {
        dataSubMenuContainerContent.classList.toggle('tw-hidden');
      }
      if (
        dataSubMenuContainerImages
        && dataSubMenuContainerImages.classList.contains('tw-hidden')
      ) {
        dataSubMenuContainerImages.classList.toggle('tw-hidden');
      }
    }

    // back from submenu
    if (this.classList.contains('to-submenu')) {
      if (subMenu) {
        subMenu.forEach((item) => {
          item.classList.add('tw-hidden');
          item.removeAttribute('style');
        });
      }
      if (this.classList.contains('to-submenu')) {
        this.classList.remove('to-submenu');
      }
      this.classList.add('to-mainmenu');

      // checks for tw-hidden class
      if (
        dataSubMenuContainerDiv
        && dataSubMenuContainerDiv.classList.contains('tw-hidden')
      ) {
        dataSubMenuContainerDiv.classList.toggle('tw-hidden');
      }
      if (
        dataSubMenuContainerLinks
        && dataSubMenuContainerLinks.classList.contains('tw-hidden')
      ) {
        dataSubMenuContainerLinks.classList.toggle('tw-hidden');
      }
      if (dataSubMenuContainerContent) {
        dataSubMenuContainerContent.classList.add('tw-hidden');
      }
      if (dataSubMenuContainerImages) {
        dataSubMenuContainerImages.classList.add('tw-hidden');
      }
    } // to-submenu
  } // submenu dataset
}

/** ********
     *
     *
     *
      show/hide back to menu button
     *
     *
     *
     *  */
function showBackToMenuButton() {
  const backToMenu = document.querySelector('#backToMenu');

  if (backToMenu) {
    backToMenu.classList.remove('tw-hidden');
  }
  const backToMenuWrapper = document.querySelector('.back-to-menu-button');
  if (backToMenuWrapper) {
    backToMenuWrapper.classList.remove('tw-hidden');
  }
}

/** ********
     *
     *
     *
      function to create back to menu button
     *
     *
     *
     *  */
function createBackToMenuButton() {
  // add back to menu button

  // create main div
  const backToMenuButtonDiv = document.createElement('div');
  backToMenuButtonDiv.className = 'tw-bg-gray-100 back-to-menu-button tw-z-10 tw-hidden tw-relative  lg:hidden tw-text-blue-700 tw-text-mobBase ';
  const backToMenuButtonDivContainer = document.createElement('div');
  backToMenuButtonDivContainer.className = 'tw-container';

  // add button icon
  const backToMenuButtonIcon = document.createElement('span');
  backToMenuButtonIcon.className = 'tw-mr-12 tw-py-12';
  backToMenuButtonIcon.innerHTML = '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-res-id="6410a14e-832a4f0e" data-di-rand="1739527915889"><path d="M7 13L1 7L7 0.999999" stroke="currentColor"></path></svg>';
  const backToMenuButton = document.createElement('button');

  // add button text
  const backToMenuButtonText = document.createTextNode('Back');
  backToMenuButton.id = 'backToMenu';
  backToMenuButton.className = 'tw-flex tw-items-center tw-font-bold tw-w-fit tw-hidden lg:hidden';

  // add event listener to button
  backToMenuButton.addEventListener('click', handleBackToMenu);

  backToMenuButton.appendChild(backToMenuButtonIcon);
  backToMenuButton.appendChild(backToMenuButtonText);

  backToMenuButtonDivContainer.appendChild(backToMenuButton);

  backToMenuButtonDiv.appendChild(backToMenuButtonDivContainer);

  return backToMenuButtonDiv;
}

function hideAllActiveDivs() {
  const maninNavliList = document.querySelectorAll('.mainmenu-ul li');
  Array.from(maninNavliList).forEach((ele) => {
    ele.classList.remove('menu-active');
  });
  const activediv = document.querySelector('div .secondnav-active');
  if (activediv) {
    activediv.classList.remove('secondnav-active');
    const liList = activediv.querySelectorAll('ul li');
    Array.from(liList).forEach((elem) => {
      if (
        elem.querySelector('a .submenu-active')
        && elem.querySelector('a .submenu-active') === 'submenu-active'
      ) {
        elem.querySelector('a').classList.remove('submenu-active');
      }
    });
    activediv.style.display = 'none';
  }
  document.getElementById('menu-button').style.display = 'none';
  document.getElementById('menu-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

function createMegaMenuTopNav(section) {
  const parentDiv = document.createElement('div');
  parentDiv.className = 'tw-hidden megamenu-wrapper lg:tw-flex tw-w-full tw-bg-white tw-relative '; // tw-z-[100]
  const container = document.createElement('div');
  container.className = 'tw-container ';

  // const searchContainer =
  createGlobalSearch();

  const border = document.createElement('div');
  border.className = 'tw-flex tw-items-center desktop-links ';

  const ulTag = document.createElement('ul');
  ulTag.className = 'mainmenu-ul tw-list-none tw-inline-flex stretch-text tw-text-grey-900';

  const elements = section.querySelector('ul').children;
  Array.from(elements).forEach((element) => {
    element.className = 'tw-py-20 tw-border-b-2 tw-border-white tw-ml-24';
    element.id = element.firstChild.text
      .replace(/ /g, '-')
      .replace(/\//g, '')
      .replace('&', '')
      .replace('--', '-');
    element.firstChild.className = 'tw-flex tw-items-center tw-group hover:tw-text-blue-700 tw-transition-colors';
    const svg = canMobileActions()
      ? '<svg width="8" height="16" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-rand="1739527915888"><path d="M0.5 9.5L5 5L0.500001 0.499999" stroke="currentColor"></path></svg>'
      : '<span class="tw-ml-6"><svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M13 1L7 7L1 0.999999" stroke="currentColor"></path></svg></span>';
    if (element.firstChild) {
      /** ********
     *
     *
     *
      wrap a text inside span
     *
     *
     *
     *  */
      if (canMobileActions()) {
        const mainMenuLinkTextSpan = document.createElement('span');
        mainMenuLinkTextSpan.textContent = element.firstChild.text;

        element.firstChild.innerHTML = '';
        element.firstChild.appendChild(mainMenuLinkTextSpan);
      }

      element.firstChild.insertAdjacentHTML('beforeend', svg);
    }
    ulTag.append(element);

    element.addEventListener('click', (event) => {
      const menuId = event.currentTarget.id;

      const overlayDiv = document.getElementById('menu-overlay');
      const buttoniv = document.getElementById('menu-button');

      if (menuLinks[menuId] && menuLinks[menuId].length > 0) {
        const firstLi = menuLinks[menuId][0].firstElementChild.text;
        if (firstLi) {
          const className = firstLi
            .trim()
            .replace(/ /g, '-')
            .replace('&', '')
            .toLowerCase()
            .replace(/\//g, '')
            .replace('--', '-');
          const myDiv = document.getElementById(`submenu-${className}`);

          // mobile actions
          if (canMobileActions() === true) {
            showBackToMenuButton();

            const megaMenuWrapper = document.querySelector('.megamenu-wrapper');
            const backToMenuButton = document.getElementById('backToMenu');
            const toggleMobileMenu = document.getElementById('toggleMobileMenu');

            if (myDiv) {
              if (myDiv.classList.contains('tw-hidden')) {
                myDiv.classList.remove('tw-hidden');
              } else {
                myDiv.classList.add('tw-hidden');
              }
              myDiv.removeAttribute('style');

              const subMenuElementsContent = myDiv.querySelector('.submenu-content');
              const subMenuElementsImages = myDiv.querySelector('.submenu-images');

              if (megaMenuWrapper) {
                if (megaMenuWrapper.classList.contains('tw-hidden')) {
                  megaMenuWrapper.classList.toggle('tw-hidden');
                } else {
                  megaMenuWrapper.classList.add('tw-hidden');
                }
              }
              if (backToMenuButton) {
                backToMenuButton.classList.add('to-mainmenu');
                backToMenuButton.dataset.submenuContainer = `submenu-${className}`;
              }
              if (subMenuElementsContent) {
                subMenuElementsContent.classList.add('tw-hidden');
              }
              if (subMenuElementsImages) {
                subMenuElementsImages.classList.add('tw-hidden');
              }
            } else if (toggleMobileMenu) {
              toggleMobileMenu.click();
            }
          } else if (myDiv && myDiv.style.display === 'none') {
            hideAllActiveDivs();
            // showing current active div
            event.currentTarget.classList.add('menu-active');
            myDiv.querySelector('ul li a').classList.add('submenu-active');
            myDiv.classList.add('secondnav-active');
            myDiv.style.display = '';
            // showing ovelay and button
            overlayDiv.style.display = '';
            buttoniv.style.display = '';
            document.body.style.overflow = 'hidden';
          } else {
            hideAllActiveDivs();
          }
        }
      } else {
        const myDiv = document.getElementById(
          `submenu-${menuId.toLowerCase()}`,
        );

        // mobile actions
        if (canMobileActions() === true) {
          const megaMenuWrapper = document.querySelector('.megamenu-wrapper');
          const backToMenuButton = document.getElementById('backToMenu');
          const subMenuElementsContent = myDiv.querySelector('.submenu-content');
          const subMenuElementsImages = myDiv.querySelector('.submenu-images');

          if (megaMenuWrapper) {
            if (megaMenuWrapper.classList.contains('tw-hidden')) {
              megaMenuWrapper.classList.toggle('tw-hidden');
            } else {
              megaMenuWrapper.classList.add('tw-hidden');
            }
          }

          myDiv.removeAttribute('style');

          showBackToMenuButton();
          if (backToMenuButton) {
            backToMenuButton.classList.add('to-mainmenu');
            backToMenuButton.dataset.submenuContainer = `submenu-${menuId.toLowerCase()}`;
          }

          myDiv.classList.remove('tw-hidden');
          myDiv.removeAttribute('style');
          const submenuContainer = myDiv.querySelector('.submenu-container');
          if (
            submenuContainer
            && submenuContainer.classList.contains('tw-hidden')
          ) {
            submenuContainer.classList.remove('tw-hidden');
          }
          const subMenuElementsLinks = myDiv.querySelector('.submenu-links');

          if (subMenuElementsLinks) {
            subMenuElementsLinks.classList.add('tw-hidden');
          }
          if (
            subMenuElementsContent
            && subMenuElementsContent.classList.contains('tw-hidden')
          ) {
            subMenuElementsContent.classList.remove('tw-hidden');
          }
          if (
            subMenuElementsImages
            && subMenuElementsImages.classList.contains('tw-hidden')
          ) {
            subMenuElementsImages.classList.remove('tw-hidden');
          }
        } else if (myDiv && myDiv.style.display === 'none') {
          hideAllActiveDivs();
          event.currentTarget.classList.add('menu-active');
          myDiv.classList.add('secondnav-active');
          myDiv.style.display = '';
          // showing ovelay and button
          overlayDiv.style.display = '';
          buttoniv.style.display = '';
          document.body.style.overflow = 'hidden';
        } else {
          hideAllActiveDivs();
        }
      }
    });
  });

  border.append(ulTag);
  // border.append(searchContainer);
  container.append(border);
  parentDiv.append(container);
  return parentDiv;
}

function createMegaMenuSubNav(child) {
  // Select all section headings (e.g., "Products", "Applications", etc.)
  const sections = child.querySelectorAll('p');
  sections.forEach((section) => {
    const sectionTitle = section.textContent
      .trim()
      .replace(/ /g, '-')
      .replace('&', '')
      .replace(/\//g, '')
      .replace('--', '-');
    const list = section.nextElementSibling;
    const subMenuLinks = [];
    list.querySelectorAll('ul > li').forEach((childMenuItem) => {
      subMenuLinks.push(childMenuItem);
    });
    menuLinks[sectionTitle] = subMenuLinks;
  });
}

function createSubMenuItems(section, containerDiv, firstpartdiv) {
  const sectionTitle = section.textContent.trim();
  if (sectionTitle.includes('|')) {
    const nameArray = sectionTitle.split('|');
    const productTitle = nameArray[0]
      .trim()
      .replace(/ /g, '-')
      .replace('&', '')
      .replace(/\//g, '')
      .replace('--', '-');
    const subNavClass = nameArray[1]
      .trim()
      .replace(/ /g, '-')
      .replace('&', '')
      .toLowerCase()
      .replace(/\//g, '')
      .replace('--', '-');
    const secondLevelList = menuLinks[productTitle];
    // First part preparation
    const ulTag = document.createElement('ul');
    const anchorTag = document.createElement('a');
    ulTag.className = `${subNavClass}-ul`;
    containerDiv.id = `submenu-${subNavClass}`;
    if (secondLevelList) {
      Array.from(secondLevelList).forEach((element) => {
        const liEle = document.createElement('li');
        if (element.firstChild) {
          const litext = element.firstChild.text;
          if (litext.includes('#view-all#')) {
            anchorTag.href = element.firstChild.href;
            anchorTag.className = 'tw-mt-32 submenu-viewall tw-transition tw-duration-300 tw-group tw-flex tw-font-bold tw-items-center tw-text-blue-700 hover:tw-text-blue-800';
            const anchDiv = div({
              class:
                'tw-text-mobBase md:tw-text-base tw-relative tw-overflow-hidden tw-pb-2',
            });
            const textArray = litext.split('#');
            const lastValue = textArray[textArray.length - 1];
            anchDiv.textContent = lastValue;
            const spanTag = span({
              class:
                'ttw-absolute tw-left-0 tw-bottom-0 tw-block tw-w-full group-hover:tw-left-[100%] tw-transition-all tw-duration-500 tw-h-1 tw-bg-blue-700 hover:tw-bg-blue-800 ',
            });
            anchDiv.appendChild(spanTag);
            const arrowSvg = span({
              class:
                'icon icon-arrow tw-transition-all tw-duration-500 tw-block tw-ml-8 tw-mb-4 group-hover:tw-ml-12',
            });
            anchorTag.append(anchDiv);
            anchorTag.appendChild(arrowSvg);
          } else {
            const liClass = litext
              .trim()
              .replace(/ /g, '-')
              .replace('&', '')
              .toLowerCase()
              .replace(/\//g, '')
              .replace('--', '-');
            liEle.className = liClass;
            liEle.append(
              a(
                {
                  class:
                    'tw-relative submenu tw-font-light tw-text-lg tw-text-grey-900 tw-flex tw-items-center tw-justify-between tw-w-full tw-group hover:tw-text-blue-700 tw-transition-all tw-duration-200',
                  title: element.firstChild.text,
                  href: '#',
                },
                span({ class: 'tw-mr-3' }, `${element.firstChild.text}`),
              ),
            );
            /** *****
             *
             *
                  adding icons to submenu for mobile only
              *
              *
              */
            const subMenuSvg = canMobileActions()
              ? '<svg width="8" height="16" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-rand="1739527915888"><path d="M0.5 9.5L5 5L0.500001 0.499999" stroke="currentColor"></path></svg>'
              : '';
            liEle.querySelectorAll('a').forEach((item) => {
              item.insertAdjacentHTML('beforeend', subMenuSvg);
            });

            ulTag.append(liEle);
          }
        }
        liEle.addEventListener('click', (event) => {
          const liClassName = event.currentTarget.className;
          const myDiv = document.getElementById(`submenu-${liClassName}`);
          const toggleMobileMenu = document.getElementById('toggleMobileMenu');

          // mobile actions
          if (canMobileActions() === true) {
            if (myDiv) {
              if (myDiv.classList.contains('tw-hidden')) {
                myDiv.classList.remove('tw-hidden');
              } else {
                myDiv.classList.add('tw-hidden');
              }
              myDiv.style.display = 'flex';

              const subMenu = document.querySelectorAll('.submenu-container');
              if (subMenu) {
                subMenu.forEach((item) => {
                  item.classList.add('tw-hidden');
                });
              }

              const backToMenuButton = document.getElementById('backToMenu');
              if (
                backToMenuButton
                && backToMenuButton.classList.contains('to-mainmenu')
              ) {
                backToMenuButton.classList.remove('to-mainmenu');
                backToMenuButton.classList.add('to-submenu');
                backToMenuButton.dataset.submenuContainer = `submenu-${liClassName}`;
              }
              const subMenuElementsLinks = myDiv.querySelector('.submenu-links');
              const subMenuElementsContent = myDiv.querySelector('.submenu-content');
              const subMenuElementsImages = myDiv.querySelector('.submenu-images');

              if (subMenuElementsLinks) {
                subMenuElementsLinks.classList.add('tw-hidden');
              }
              if (
                subMenuElementsContent
                && subMenuElementsContent.classList.contains('tw-hidden')
              ) {
                subMenuElementsContent.classList.remove('tw-hidden');
              }
              if (
                subMenuElementsImages
                && subMenuElementsImages.classList.contains('tw-hidden')
              ) {
                subMenuElementsImages.classList.remove('tw-hidden');
              }
            } else if (toggleMobileMenu) {
              toggleMobileMenu.click();
            }
          } else if (myDiv && myDiv.style.display === 'none') {
            // hiding current div
            const activediv = document.querySelector('div .secondnav-active');
            activediv
              .querySelector('ul li a')
              .classList.remove('submenu-active');
            activediv.classList.remove('secondnav-active');
            activediv.style.display = 'none';
            // showing selected div
            const liList = myDiv.querySelectorAll('ul li');
            Array.from(liList).forEach((ele) => {
              if (ele.className === liClassName) {
                ele.querySelector('a').classList.add('submenu-active');
              }
            });
            myDiv.classList.add('secondnav-active');
            myDiv.style.display = '';
          } else {
            hideAllActiveDivs();
          }
        });
      });
      firstpartdiv.append(ulTag);
      if (anchorTag && anchorTag.href !== '') {
        firstpartdiv.append(anchorTag);
      }
    }
  }
}

function createViewallTag(list, viewAllTag) {
  Array.from(list).forEach((element) => {
    if (element.textContent.includes('#view-all#')) {
      viewAllTag.href = element.href;
      viewAllTag.className = 'tw-mt-32 tw-transition submenu-viewall tw-duration-300 tw-group tw-flex tw-font-bold tw-items-center tw-text-blue-700 hover:tw-text-blue-800';
      const anchDiv = div({
        class:
          'tw-text-mobBase md:tw-text-base tw-relative tw-overflow-hidden tw-pb-2',
      });
      const textArray = element.textContent.split('#');
      const lastValue = textArray[textArray.length - 1];
      anchDiv.textContent = lastValue;
      const spanTag = span({
        class:
          'ttw-absolute tw-left-0 tw-bottom-0 tw-block tw-w-full group-hover:tw-left-[100%] tw-transition-all tw-duration-500 tw-h-1 tw-bg-blue-700 hover:tw-bg-blue-800 ',
      });
      anchDiv.appendChild(spanTag);
      const arrowSvg = span({
        class:
          'icon icon-arrow tw-transition-all tw-duration-500 tw-block tw-ml-8 tw-mb-4 group-hover:tw-ml-12',
      });
      viewAllTag.append(anchDiv);
      viewAllTag.appendChild(arrowSvg);
    }
  });
}

function createAnchorWithDesc(list, listDiv, section) {
  const anchorTag = list[0];
  anchorTag.className = 'tw-group';
  anchorTag.title = '';
  const spanTag = span(
    {
      class:
        'tw-font-bold tw-text-mobBase md:tw-text-base tw-text-grey-900 tw-flex tw-items-center group-hover:tw-text-blue-700 tw-transition-all tw-duration-200 ',
    },
    anchorTag.text,
  );
  anchorTag.text = '';
  anchorTag.append(spanTag);
  const chevronRight = span({
    class:
      'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2',
  });
  spanTag.append(chevronRight);
  const { childNodes } = section;
  let decription = '';
  childNodes.forEach((element) => {
    if (element.nodeName === '#text') decription = element.nodeValue;
  });
  const ptag = p(
    { class: 'tw-text-grey-500 tw-text-sm tw-mt-2 tw-mb-0' },
    decription,
  );
  anchorTag.appendChild(ptag);
  listDiv.append(anchorTag);
  return listDiv;
}

function createAnchorWithTitle(list, listDiv) {
  Array.from(list).forEach((element, ind) => {
    element.className = 'tw-group title';
    element.title = '';
    const spanTag = span(
      {
        class:
          'tw-text-mobBase md:tw-text-base tw-text-grey-500 tw-flex tw-items-center group-hover:tw-text-blue-700 tw-transition-all tw-duration-200 ',
      },
      element.text,
    );
    if (ind === 0) {
      spanTag.classList.add('tw-font-bold');
      spanTag.classList.replace('tw-text-grey-500', 'tw-text-grey-900');
    }
    element.text = '';
    if (ind === 0 && element.getAttribute('href') === '#') {
      listDiv.append(spanTag);
    } else {
      element.append(spanTag);
      const chevronRight = span({
        class:
        'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2',
      });
      element.append(chevronRight);
      listDiv.append(element);
    }
  });
  return listDiv;
}

function isValidURL(url) {
  const regex = /^\/[^\s]*$/i;
  return regex.test(url);
}

function createMegaMenuThirdLevel(child) {
  const parentDiv = div({
    class: 'tw-w-full tw-bg-white tw-relative tw-z-[100]',
  });
  const containerDiv = document.createElement('div');
  containerDiv.className = 'submenu-container tw-hidden lg:tw-flex tw-container tw-pt-32 tw-pb-40 tw-columns-12';
  containerDiv.style.display = 'none';
  const sections = child.querySelectorAll('p');
  const isImages = child.querySelectorAll('img');
  let isSubItems = true;
  if (sections.length > 0 && !sections[0].textContent.includes('|')) {
    isSubItems = false;
  }

  // First part preparation
  const firstpartdiv = div({
    class: 'tw-w-3/12 submenu-links tw-border-r tw-relative tw-pr-24',
  });

  const secondPartdiv = div({
    class: 'tw-w-6/12 submenu-content tw-px-32 tw-pr-40 tw-border-r',
  });
  const wrapdiv = div({ class: 'tw-flex tw-flex-wrap tw-h-fit' });
  const viewAllTag = document.createElement('a');

  const thirdPartdiv = div({ class: 'tw-w-3/12 tw-pl-32 submenu-images' });
  if (sections.length > 0 && isImages.length > 0 && isSubItems) {
    sections.forEach((section, index) => {
      if (index === 0) {
        createSubMenuItems(section, containerDiv, firstpartdiv);
      } else {
        const list = section.querySelectorAll('a');
        const picture = section.previousElementSibling.querySelector('picture');
        const listDiv = div({ class: 'lg:tw-w-full xl:tw-w-1/2 tw-pr-48 ' });
        if (canMobileActions() === true) {
          if (index > 1) {
            listDiv.classList.add('tw-mt-24');
          }
        } else if (index > 2) {
          listDiv.classList.add('tw-mt-24');
        }
        if (list.length === 1 && !list[0].innerText.includes('#view-all#') && picture === null) {
          wrapdiv.append(createAnchorWithDesc(list, listDiv, section));
        } else if (list.length > 0 && section.querySelector('strong')) {
          wrapdiv.append(createAnchorWithTitle(list, listDiv));
        } else {
          const img = section.querySelector('img');
          const listdiv = div({ class: '' });
          if (img != null) {
            const picDiv = div({
              class: 'tw-relative tw-overflow-hidden tw-pt-[56.25%]',
            });
            img.className = 'tw-transition-all tw-duration-500 tw-absolute tw-inset-0 tw-top-0 tw-left-0 tw-w-full tw-h-full tw-object-cover hover:tw-scale-[1.05]';
            picDiv.append(img);
            // Checking if image have href link
            const url = img.alt;
            img.alt = '';
            if (url && isValidURL(url)) {
              const anchTag = a({ class: 'tw-group' });
              anchTag.href = url;
              anchTag.append(picDiv);
              listdiv.append(anchTag);
            } else {
              listdiv.append(picDiv);
            }
            thirdPartdiv.append(listdiv);
            if (section.nextElementSibling && section.nextElementSibling.querySelector('picture')) {
              thirdPartdiv.append(document.createElement('br'));
            }
          }
          if (section.previousElementSibling.querySelector('picture')) {
            const anchTag = section.querySelector('a');
            if (anchTag) {
              const spanTag = span(
                {
                  class:
                    'tw-block tw-pt-16 tw-text-grey-900 tw-font-bold tw-flex tw-items-center group-hover:tw-text-blue-700 tw-transition-colors',
                },
                anchTag.text,
              );
              const chevronRight = span({
                class:
                  'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2',
              });
              spanTag.append(chevronRight);
              if (thirdPartdiv.querySelector('img')) {
                thirdPartdiv.querySelector('img').alt = anchTag.text;
              }
              anchTag.text = '';
              anchTag.append(spanTag);
              const pTag = section.nextElementSibling;
              if (!pTag.querySelector('picture')) {
                pTag.className = 'tw-mt-2 tw-text-grey-500 tw-text-sm tw-mb-0';
                anchTag.append(pTag);
              }
              listdiv.append(anchTag);
              thirdPartdiv.append(listdiv);
              thirdPartdiv.append(document.createElement('br'));
            }
          } else {
            createViewallTag(list, viewAllTag);
          }
        }
      }
    });
  } else if (sections.length > 0 && isImages.length > 0 && !isSubItems) {
    parentDiv.className = 'tw-w-full  tw-bg-white tw-relative tw-z-[100] ';
    parentDiv.style.display = 'none';
    containerDiv.style.display = '';
    containerDiv.className = 'tw-hidden submenu-container tw-container lg:tw-flex  tw-columns-12 tw-pt-32 tw-pb-40';
    wrapdiv.className = 'tw-w-full submenu-content tw-pr-40 tw-flex tw-flex-wrap tw-border-r';
    secondPartdiv.className = 'tw-flex tw-flex-wrap tw-h-fit';
    sections.forEach((section, index) => {
      if (index === 0) {
        const sectionTitle = section.textContent
          .trim()
          .replace(/ /g, '-')
          .replace('&', '')
          .toLowerCase()
          .replace(/\//g, '')
          .replace('--', '-');
        parentDiv.id = `submenu-${sectionTitle}`;
      } else {
        const list = section.querySelectorAll('a');
        const picture = section.previousElementSibling.querySelector('picture');
        const listDiv = div({ class: 'tw-w-1/2 xl:tw-w-1/3 tw-pr-48 ' });
        if (canMobileActions() === true) {
          if (index > 1) {
            listDiv.classList.add('tw-mt-24');
          }
        } else if (index > 3) {
          listDiv.classList.add('tw-mt-24');
        }
        if (list.length === 1 && !list[0].innerText.includes('#view-all#') && picture === null) {
          wrapdiv.append(createAnchorWithDesc(list, listDiv, section));
        } else if (list.length > 0 && section.querySelector('strong')) {
          wrapdiv.append(createAnchorWithTitle(list, listDiv));
        } else {
          const img = section.querySelector('img');
          const listdiv = div({ class: '' });
          if (img != null) {
            const picDiv = div({
              class: 'tw-relative tw-overflow-hidden tw-pt-[56.25%]',
            });
            img.className = 'tw-transition-all tw-duration-500 tw-absolute tw-inset-0 tw-top-0 tw-left-0 tw-w-full tw-h-full tw-object-cover hover:tw-scale-[1.05]';
            picDiv.append(img);
            // Checking if image have href link
            const url = img.alt;
            if (url && isValidURL(url)) {
              img.alt = '';
              const anchTag = a({ class: 'tw-group' });
              anchTag.href = url;
              anchTag.append(picDiv);
              listdiv.append(anchTag);
            } else {
              listdiv.append(picDiv);
            }
            thirdPartdiv.append(listdiv);
            if (section.nextElementSibling && section.nextElementSibling.querySelector('picture')) {
              thirdPartdiv.append(document.createElement('br'));
            }
          }
          if (section.previousElementSibling.querySelector('picture')) {
            const anchTag = section.querySelector('a');
            if (anchTag) {
              const spanTag = span(
                {
                  class:
                    'tw-block tw-pt-16 tw-text-grey-900 tw-font-bold tw-flex tw-items-center group-hover:tw-text-blue-700 tw-transition-colors',
                },
                anchTag.text,
              );
              const chevronRight = span({
                class:
                  'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2',
              });
              spanTag.append(chevronRight);
              anchTag.text = '';
              anchTag.append(spanTag);
              const pTag = section.nextElementSibling;
              if (!pTag.querySelector('picture')) {
                pTag.className = 'tw-mt-2 tw-text-grey-500 tw-text-sm tw-mb-0';
                anchTag.append(pTag);
              }
              listdiv.append(anchTag);
              thirdPartdiv.append(listdiv);
              thirdPartdiv.append(document.createElement('br'));
            }
          } else {
            createViewallTag(list, viewAllTag);
          }
        }
      }
    });
  } else if (sections.length > 0 && isSubItems) {
    secondPartdiv.className = 'tw-w-9/12 submenu-content tw-px-32 tw-pr-40';
    wrapdiv.className = 'tw-flex tw-flex-wrap tw-h-fit';
    sections.forEach((section, index) => {
      if (index === 0) {
        createSubMenuItems(section, containerDiv, firstpartdiv);
      } else {
        const list = section.querySelectorAll('a');
        const picture = section.previousElementSibling.querySelector('picture');
        const listDiv = div({ class: 'tw-w-1/2 xl:tw-w-1/3 tw-pr-48 ' });
        if (canMobileActions() === true) {
          if (index > 1) {
            listDiv.classList.add('tw-mt-24');
          }
        } else if (index > 3) {
          listDiv.classList.add('tw-mt-24');
        }
        if (list.length === 1 && !list[0].innerText.includes('#view-all#') && picture === null) {
          wrapdiv.append(createAnchorWithDesc(list, listDiv, section));
        } else if (list.length > 0 && section.querySelector('strong')) {
          wrapdiv.append(createAnchorWithTitle(list, listDiv));
        } else {
          createViewallTag(list, viewAllTag);
        }
      }
    });
  } else if (sections.length > 0) {
    parentDiv.className = 'tw-w-full  tw-bg-white tw-relative tw-z-[100] ';
    parentDiv.style.display = 'none';
    containerDiv.style.display = '';
    containerDiv.className = 'tw-hidden submenu-container tw-container lg:tw-flex  tw-columns-12 tw-pt-32 tw-pb-40';
    wrapdiv.className = 'tw-w-full submenu-content tw-pr-40 tw-flex tw-flex-wrap';
    secondPartdiv.className = 'tw-flex tw-flex-wrap tw-h-fit';
    sections.forEach((section, index) => {
      if (index === 0) {
        const sectionTitle = section.textContent
          .trim()
          .replace(/ /g, '-')
          .replace('&', '')
          .toLowerCase()
          .replace(/\//g, '')
          .replace('--', '-');
        parentDiv.id = `submenu-${sectionTitle}`;
      } else {
        const list = section.querySelectorAll('a');
        const listDiv = div({ class: 'tw-w-1/4 tw-pr-48 ' });
        if (canMobileActions() === true) {
          if (index > 1) {
            listDiv.classList.add('tw-mt-24');
          }
        } else if (index > 4) {
          listDiv.classList.add('tw-mt-24');
        }
        if (list.length === 1 && !list[0].innerText.includes('#view-all#')) {
          wrapdiv.append(createAnchorWithDesc(list, listDiv, section));
        } else if (list.length > 0 && section.querySelector('strong')) {
          wrapdiv.append(createAnchorWithTitle(list, listDiv));
        } else {
          createViewallTag(list, viewAllTag);
        }
      }
    });
  }
  secondPartdiv.append(wrapdiv);
  if (viewAllTag && viewAllTag.href !== '') {
    secondPartdiv.appendChild(viewAllTag);
  }
  if (isSubItems) {
    containerDiv.appendChild(firstpartdiv);
  }
  containerDiv.appendChild(secondPartdiv);
  if (isImages.length > 0) {
    containerDiv.appendChild(thirdPartdiv);
  }
  parentDiv.append(containerDiv);
  return parentDiv;
}

function createOverlay(nav) {
  const overlayDiv = div({
    class:
      'tw-hidden lg:tw-block tw-fixed tw-inset-0 tw-bg-black tw-opacity-60 tw-z--1',
  });
  overlayDiv.id = 'menu-overlay';
  overlayDiv.style.display = 'none';
  const buttondiv = document.createElement('button');
  buttondiv.className = 'tw-hidden lg:tw-block tw-flex tw-w-32 tw-h-32 tw-rounded-full tw-mx-auto tw-bg-gray-900/30 hover:tw-bg-gray-900/40 tw-transition tw-relative tw-z-[100] tw-mt-24 tw-cursor-pointer';
  buttondiv.id = 'menu-button';
  const chevronUp = span({
    class:
      'icon icon-chevron-up tw-flex tw-items-center tw-justify-center tw-w-full tw-h-full',
  });
  buttondiv.append(chevronUp);
  buttondiv.style.display = 'none';
  nav.appendChild(buttondiv);
  nav.appendChild(overlayDiv);
  overlayDiv.addEventListener('click', () => {
    hideAllActiveDivs();
  });
  buttondiv.addEventListener('click', () => {
    hideAllActiveDivs();
  });
}

/**
 * Processes and appends the sections to the header block
 */
function processHtml(block, main) {
  const parentDiv = div({ class: 'tw' });
  const nav = document.createElement('nav');
  nav.id = 'mega-menu';
  nav.className = 'tw tw-z-99';
  const sections = main.children;
  Array.from(sections).forEach((section, index, array) => {
    const iteration = index + 1;
    if (iteration === 1) {
      nav.append(createMainHeader(section));
    } else if (iteration === 2) {
      nav.append(createMegaMenuTopNav(section));
      if (nav) {
        //  adding back to menu button
        const megaMenuWrapper = nav.querySelector('.megamenu-wrapper');
        if (megaMenuWrapper) {
          nav.insertBefore(createBackToMenuButton(nav), megaMenuWrapper);
        }
      }
    } else if (iteration === 3) {
      createMegaMenuSubNav(section);
    } else {
      nav.appendChild(createMegaMenuThirdLevel(section));
      if (iteration === array.length) {
        createOverlay(nav);
      }
    }
  });
  parentDiv.append(nav);
  block.prepend(parentDiv);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const { lang } = document.documentElement;
  let path = '/nav.plain.html';
  if (lang === 'en') {
    path = '/nav.plain.html';
  } else if (lang === 'ja') {
    path = '/ja-jp/nav.plain.html';
  } else if (lang === 'zh-cn') {
    path = '/zh-cn/nav.plain.html';
  }
  const resp = await fetch(path);
  const suggestionPopupDiv = document.createElement('div');
  suggestionPopupDiv.id = 'global-suggestion-popup';
  standaloneSearchBoxController.subscribe(() => {
    if (standaloneSearchBoxController.state.redirectTo) {
      window.location.href = standaloneSearchBoxController.state.redirectTo;
    }

    const { state } = standaloneSearchBoxController;
    if (!state.isLoading && state.value && state.redirectTo) {
      saveQueryToLocalHistory(state.value);
    }
  });

  document.body.appendChild(suggestionPopupDiv);

  if (resp.ok) {
    const html = await resp.text();
    const main = document.createElement('main');
    main.innerHTML = html;
    processHtml(block, main);
  }
  decorateIcons(block);

  // Track the previous viewport state
  let wasMobile = canMobileActions();

  // Handle viewport resize - refresh page when crossing mobile/desktop threshold
  window.addEventListener('resize', () => {
    const isMobileNow = canMobileActions();

    // Check if viewport crossed the mobile/desktop threshold (1024px)
    if (wasMobile !== isMobileNow) {
      wasMobile = isMobileNow;
      // Refresh the page when switching between mobile and desktop
      window.location.reload();
    }
  });

  /* if (document.getElementById('logout')) {
    document.getElementById('logout').addEventListener('click', () => {
      const redirectUrl = encodeURIComponent(window.location.href);
      fetch('/bin/sciex/logout')
        .then((response) => response)
        .catch(() => {})
        .finally(() => {
          document.location = `https://sso.sciex.cloud/auth/realms/sciex/protocol/openid-connect/logout?redirect_uri=${redirectUrl}`;
        });
    });
  } */
  // logout listener added above

  // Conditionally shwoing the login/logout links
  const userData = await getUserDetails();
  if (userData && userData.loggedIn) {
    const eloquaData = {
      status: userData.loggedIn,
      email: userData.email,
      key: userData.userKey,
    };
    sessionStorage.setItem('loggedin-status', userData.loggedIn);
    sessionStorage.setItem('eloquaData', JSON.stringify(eloquaData));
    // document.getElementById('view-profile').style.display = '';
    // document.getElementById('logout').style.display = '';
    // document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('my-account').style.display = '';
    const signInNowEl = document.getElementById('signInNowLink');
    if (signInNowEl) {
      const family = userData.familyName || '';
      const given = userData.givenName || '';
      const displayName = `${family} ${given}`.trim();
      const nameSpan = document.createElement('span');
      nameSpan.className = 'username-span';
      nameSpan.textContent = displayName;
      signInNowEl.textContent = '';
      signInNowEl.appendChild(nameSpan);
    }
  } else {
    // document.getElementById('view-profile').style.display = 'none';
    // document.getElementById('logout').style.display = 'none';
    // document.getElementById('register').style.display = '';
    document.getElementById('login').style.display = '';
    document.getElementById('my-account').style.display = 'none';
    // document.getElementById('logout').style.display = 'none';
  }
}
