/* eslint-disable */
import { buildSearchEngine } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

export const searchEngine = buildSearchEngine({
  configuration: {
    organizationId: 'danaherproductionrfl96bkr',
    accessToken: 'xx2136ae2c-554b-41a7-8afd-1ad8c7ffcb07',
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