import { createElement } from '../../scripts/scripts.js';

const titleCache = new Map();

const getPageTitle = async (url) => {
  if (titleCache.has(url)) return titleCache.get(url);

  try {
    const resp = await fetch(url);
    if (resp.ok) {
      const html = document.createElement('div');
      html.innerHTML = await resp.text();
      const title = html.querySelector('title')?.innerText || '';
      titleCache.set(url, title);
      return title;
    }
  } catch (err) {
    console.warn(`Failed to fetch ${url}:`, err);
  }

  return '';
};

const getAllPathsExceptCurrent = async (paths) => {
  const pathsList = paths.replace(/^\/|\/$/g, '').split('/');

  let prevPath = '';
  const fetchPromises = pathsList.slice(0, -1).map((pathPart) => {
    prevPath = `${prevPath}/${pathPart}`;
    const path = `${prevPath}.html`;
    const url = `${window.location.origin}${path}`;

    return getPageTitle(url).then((name) => ({
      path,
      name,
      url,
    }));
  });

  const results = await Promise.all(fetchPromises);

  return results.filter((r) => {
    if (!r.name) console.warn(`Breadcrumb: No title found for ${r.url}`);
    return r.name;
  });
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;

  if (path.name === 'Home') {
    pathLink.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.33398 13V5.66667L8.00065 2L12.6673 5.66667V13H9.33398V8.66667H6.66732V13H3.33398Z" stroke="#707070"/>
      </svg>`;
  } else {
    pathLink.innerText = path.name;
  }

  pathLink.classList.add('breadcrumb-link');
  return pathLink;
};

export default async function decorate(block) {
  const breadcrumb = createElement('nav', '', {
    'aria-label': 'Breadcrumb',
  });
  block.innerHTML = '';

  const HomeLink = createLink({
    path: '',
    name: 'Home',
    url: window.location.origin,
  });
  const breadcrumbLinks = [HomeLink.outerHTML];

  const path = window.location.pathname;
  const paths = await getAllPathsExceptCurrent(path);

  paths.forEach((pathPart) => {
    breadcrumbLinks.push(createLink(pathPart).outerHTML);
  });

  const currentPath = document.createElement('span');
  currentPath.innerText = document.querySelector('title')?.innerText || 'Current Page';
  currentPath.style.fontWeight = 'bold';
  currentPath.style.color = 'black';
  currentPath.setAttribute('aria-current', 'page');
  breadcrumbLinks.push(currentPath.outerHTML);

  const separator = `
    <span class="breadcrumb-separator">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.75 10.5L8.25 6L3.75 1.5" stroke="#707070"/>
      </svg>
    </span>`;

  breadcrumb.innerHTML = breadcrumbLinks.join(separator);
  block.append(breadcrumb);
}
