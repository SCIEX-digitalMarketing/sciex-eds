/* eslint-disable */
import { buildStandaloneSearchBox } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';
import { searchEngine }  from './headerSearchEngine.js';

export const standaloneSearchBoxController = buildStandaloneSearchBox(searchEngine, {
  options: {
    redirectionUrl: '/search-results',
    numberOfSuggestions: 5,
    highlightOptions: {
      notMatchDelimiters: {
        open: '<strong>',
        close: '</strong>&nbsp;',
      },
      correctionDelimiters: {
        open: '<i>',
        close: '</i>&nbsp;',
      },
    },
  },
});