/* eslint-disable */
import { buildSearchEngine } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

export const searchEngine = buildSearchEngine({
  configuration: {
    organizationId: 'danahernonproduction1892f3fhz',
    accessToken: 'xxca9398dc-2af2-4d92-aaa6-62b8f55efc57',
    search: {
      searchHub: 'SCIEXMainSearch',
    },
    analytics: {
      analyticsMode: 'next',
      trackingId: 'sciex_us'
    },
  },
});

export default { searchEngine };