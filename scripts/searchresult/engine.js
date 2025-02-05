/* eslint-disable */
import { buildSearchEngine } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

export const searchEngine = buildSearchEngine({
  configuration: {
    organizationId: 'sciextestkympne75',
    accessToken: 'xx3e8b448c-4265-4283-bd4f-9856cd68e916',
    search: {
      searchHub: 'SCIEXMainSearch',
    },
  },
});

export const analyticsEngine = buildSearchEngine({
  configuration: {
    organizationId: 'sciextestkympne75',
    accessToken: 'xx8f638eec-65ca-4581-b72b-993e4fa148b2',
    search: {
      searchHub: 'SCIEXMainSearch',
    },
    analytics: {
      analyticsMode: 'next',
      trackingId: 'sciex_us'
    },
  },
});

export default { searchEngine, analyticsEngine };


