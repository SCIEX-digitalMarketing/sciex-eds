import { } from '../../scripts/aem.js';

/** * Decorates a block to render a titled event registration form inside an iframe.
 * * * @param {HTMLElement} block - The container element to decorate. */
export default function decorate(block) {
  block.id = `${block.children[0].textContent.trim()}-content`;
  block.parentElement.classList.add('tabs-container-wrapper');
  const titleId = block.children[1].textContent;
  const headingDiv = document.createElement('div');
  headingDiv.classList.add('form-heading');
  headingDiv.textContent = titleId;
  const subHeading = block.children[2].textContent;
  const subHeadingDiv = document.createElement('div');
  subHeadingDiv.classList.add('form-sub-heading');
  subHeadingDiv.textContent = subHeading;

  const iframeDiv = document.createElement('div');
  iframeDiv.classList.add('frameDiv');

  const iframe = document.createElement('iframe');
  iframe.id = 'events-register-form';
  iframe.src = block.children[3].textContent;// 'https://info.sciex.com/LP=4907';

  // Optional height (fallback to '900px' if not provided)
  const height = block.children[5]?.textContent?.trim() || '900px';

  let alignment;
  if (block.children[4] && block.children[4].textContent) {
    alignment = block.children[4].textContent.trim();
    if (alignment === '') {
      alignment = 'one-column';
    }
  } else {
    alignment = 'one-column';
  }
  iframe.className = `iframe-form-container ${alignment}`;
  iframe.style.setProperty('height', height, 'important');
  iframeDiv.append(iframe);
  block.innerHTML = '';
  block.append(headingDiv);
  block.append(subHeadingDiv);
  block.append(iframeDiv);

  // Append query parameters from the current page to the iframe src (preserve existing params)
  const loc = window.location.toString();
  const params = loc.split('?')[1];
  const iframeElement = document.getElementById('events-register-form');

  if (iframeElement && params) {
    iframeElement.src += (iframeElement.src.includes('?') ? '&' : '?') + params;
  }
}
