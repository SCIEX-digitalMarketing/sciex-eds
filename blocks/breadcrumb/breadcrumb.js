import { createElement } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/aem.js';

const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title').innerText;
  }
  return '';
};

const getAllPathsExceptCurrent = async (paths) => {
  const result = [];
  const pathsList = paths.replace(/^\/|\/$/g, '').split('/');

  let prevPath = '';
  const fetchPromises = [];

  for (let i = 0; i < pathsList.length - 1; i += 1) {
    const pathPart = pathsList[i];
    prevPath = `${prevPath}/${pathPart}`;
    const path = `${prevPath}.html`;
    const url = `${window.location.origin}${path}`;
    fetchPromises.push(getPageTitle(url).then((name) => {
      if (name) {
        result.push({ path, name, url });
      }
    }));
  }

  await Promise.all(fetchPromises);

  return result;
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;
  // Append the icon if available
  if (path.icon) {
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('icon', path.icon);
    pathLink.appendChild(iconSpan);
  }
  const nameSpan = document.createElement('span');
  pathLink.appendChild(nameSpan);
  pathLink.classList.add('breadcrumb-link');
  return pathLink;
};

export default async function decorate(block) {
  const breadcrumb = createElement('nav', '', {
    'aria-label': 'Breadcrumb',
  });
  block.innerHTML = '';

  // Define the HomeLink with an icon
  const HomeLink = createLink({
    path: '',
    url: window.location.origin,
    icon: 'icon-home', // Add the icon class here
  });
  const breadcrumbLinks = [HomeLink.outerHTML];

  window.setTimeout(async () => {
    const path = window.location.pathname;
    const paths = await getAllPathsExceptCurrent(path);

    paths.forEach((pathPart) => breadcrumbLinks.push(createLink(pathPart).outerHTML));

    const currentPath = document.createElement('span');
    currentPath.innerText = document.querySelector('title').innerText;
    currentPath.style.color = 'black';
    breadcrumbLinks.push(currentPath.outerHTML);

    const separator = '<span class="icon icon-chevron-right"></span>';

    breadcrumb.innerHTML = breadcrumbLinks.join(separator);
    decorateIcons(breadcrumb);
    block.append(breadcrumb);
  }, 1000);
}
