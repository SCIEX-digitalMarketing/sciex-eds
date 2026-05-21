import { createElement } from '../../scripts/scripts.js';

// Cache for page titles to avoid refetching the same URL multiple times
const pageTitleCache = new Map();

/**
 * Fetches and returns the <title> text from the given URL.
 *
 * @param {string} url
 * @returns {Promise<string>}
 */
const getPageTitle = async (url) => {
  if (pageTitleCache.has(url)) {
    return pageTitleCache.get(url);
  }

  try {
    const response = await fetch(url);

    if (response.ok) {
      const htmlContainer = document.createElement('div');
      htmlContainer.innerHTML = await response.text();

      const pageTitle =
        htmlContainer.querySelector('meta[property="og:title"]')?.content
        || htmlContainer.querySelector('title')?.innerText
        || htmlContainer.querySelector('h1')?.innerText
        || '';

      pageTitleCache.set(url, pageTitle);

      return pageTitle;
    }
  } catch (error) {
    console.warn(`Failed to fetch ${url}:`, error);
  }

  return '';
};

/**
 * Builds breadcrumb paths excluding current page.
 *
 * @param {string} pathname
 * @returns {Promise<Array>}
 */
const getAllPathsExceptCurrent = async (pathname) => {
  const pathSegments = pathname.replace(/^\/|\/$/g, '').split('/');

  let accumulatedPath = '';

  const fetchTitlePromises = pathSegments
    .slice(0, -1)
    .map(async (segment) => {
      accumulatedPath = `${accumulatedPath}/${segment}`;

      const path = accumulatedPath;
      const url = `${window.location.origin}${path}`;

      const titleName = await getPageTitle(url);

      return {
        path,
        name: titleName,
        url,
      };
    });

  const results = await Promise.all(fetchTitlePromises);

  return results.filter((entry) => {
    if (!entry.name) {
      console.warn(`Breadcrumb: No title found for ${entry.url}`);
    }

    return entry.name;
  });
};

/**
 * Creates breadcrumb anchor element.
 *
 * @param {Object} breadcrumbItem
 * @returns {HTMLAnchorElement}
 */
const createLink = (breadcrumbItem) => {
  const linkEl = document.createElement('a');

  linkEl.href = breadcrumbItem.url;

  if (breadcrumbItem.name === 'Home') {
    linkEl.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.33398 13V5.66667L8.00065 2L12.6673 5.66667V13H9.33398V8.66667H6.66732V13H3.33398Z" stroke="#707070"/>
      </svg>`;
  } else {
    linkEl.innerText = breadcrumbItem.name;
  }

  linkEl.classList.add('breadcrumb-link');

  return linkEl;
};

/**
 * Decorates breadcrumb block.
 *
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  const breadcrumbNav = createElement('nav', '', {
    'aria-label': 'Breadcrumb',
  });

  block.innerHTML = '';

  const currentPathname = window.location.pathname;

  const isKbaPage = currentPathname.includes('/knowledge-base-articles');

  const homeLink = createLink({
    path: '',
    name: 'Home',
    url: window.location.origin,
  });

  const breadcrumbHtmlParts = [homeLink.outerHTML];

  /**
   * STATIC KBA BREADCRUMBS
   */
  if (isKbaPage) {
    const staticBreadcrumbs = [
      {
        name: 'Support',
        url: `${window.location.origin}/support`,
      },
      {
        name: 'Knowledgebase articles',
        url: `${window.location.origin}/support/knowledge-base-articles`,
      },
    ];

    staticBreadcrumbs.forEach((item) => {
      breadcrumbHtmlParts.push(
        createLink({
          path: '',
          name: item.name,
          url: item.url,
        }).outerHTML,
      );
    });
  }

  /**
   * DYNAMIC CATEGORY / SUBCATEGORY
   */
  const ancestorPaths = await getAllPathsExceptCurrent(currentPathname);

  const filteredAncestors = isKbaPage
    ? ancestorPaths.filter(
      (item) => (
        item.path !== '/support'
          && item.path !== '/support/knowledge-base-articles'
      ),
    )
    : ancestorPaths;

  filteredAncestors.forEach((ancestorItem) => {
    breadcrumbHtmlParts.push(
      createLink(ancestorItem).outerHTML,
    );
  });

  /**
   * CURRENT PAGE
   */
  const currentPageTitle =
    document.querySelector('title')?.innerText || 'Current Page';

  // Special handling for Favorites page
  if (currentPageTitle === 'My favorite') {
    const resourceHubEl = document.createElement('a');

    resourceHubEl.href = '/resource-hub';
    resourceHubEl.innerText = 'Resource hub';
    resourceHubEl.classList.add('breadcrumb-resource-link');

    breadcrumbHtmlParts.push(resourceHubEl.outerHTML);
  }

  const currentPageEl = document.createElement('span');

  currentPageEl.innerText = currentPageTitle;
  currentPageEl.style.fontWeight = 'bold';
  currentPageEl.style.color = 'black';
  currentPageEl.setAttribute('aria-current', 'page');

  breadcrumbHtmlParts.push(currentPageEl.outerHTML);

  /**
   * SEPARATOR
   */
  const separatorHtml = `
    <span class="breadcrumb-separator">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.75 10.5L8.25 6L3.75 1.5" stroke="#707070"/>
      </svg>
    </span>`;

  breadcrumbNav.innerHTML = breadcrumbHtmlParts.join(separatorHtml);

  block.append(breadcrumbNav);
}