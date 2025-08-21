/* eslint-disable */
import { buildSearchEngine } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

let accessToken = '';
let organizationId = '';

let mainDiv = document.querySelector('main');
const sections = mainDiv.querySelector('.events').children;
Array.from(sections).forEach((section, index) => {
  const iteration = index + 1;
  if(iteration === 2){
    organizationId = section.querySelector('div').innerText;
  } else if(iteration === 3){
    accessToken = section.querySelector('div').innerText;
  }
});

export const eventSearchEngine = buildSearchEngine({
  configuration: {
    organizationId: organizationId,
    accessToken: accessToken,
    search: {
      searchHub: 'SCIEXEventListing',
    },
    analytics: {
      analyticsMode: 'next',
      trackingId: 'sciex_us'
    },
  },
});

export default { eventSearchEngine };