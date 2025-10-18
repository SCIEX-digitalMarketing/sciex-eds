/* eslint-disable */
import { buildSearchEngine } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

let accessToken = '';
let organizationId = '';

let mainDiv = document.querySelector('main');
const sections = mainDiv.querySelector('.resource-library').children;
Array.from(sections).forEach((section, index) => {
  const iteration = index + 1;
  if(iteration === 5){
    organizationId = section.querySelector('div').innerText;
  } else if(iteration === 6){
    accessToken = section.querySelector('div').innerText;
  }
});

export const resourceLibrarySearchEngine = buildSearchEngine({
  configuration: {
    organizationId: organizationId,
    accessToken: accessToken,
    search: {
      searchHub: 'SCIEXResourceLibraryListing',
    },
    analytics: {
      analyticsMode: 'next',
      trackingId: 'sciex_us'
    },
  },
});

export default { resourceLibrarySearchEngine };