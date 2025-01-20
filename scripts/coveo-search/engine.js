import { buildSearchEngine, getSampleSearchEngineConfiguration } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

export const searchEngine = buildSearchEngine({
    configuration: {
      organizationId: 'sciextestkympne75',
      accessToken: 'xx3e8b448c-4265-4283-bd4f-9856cd68e916',
      apiBaseUrl: 'https://sciextestkympne75.org.coveo.com/rest/search',
    },
});

// export const searchEngine = buildSearchEngine({
//   configuration: getSampleSearchEngineConfiguration()
// });

