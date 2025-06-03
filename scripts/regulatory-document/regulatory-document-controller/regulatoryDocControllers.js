/* eslint-disable */
import {
  buildSearchBox,
  buildFacet,
  buildResultList,
  buildPager,
  buildQuerySummary,
  buildSort,
  buildInteractiveResult,
  buildBreadcrumbManager,
  buildContext
} from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';
import { regulatoryDocSearchEngine }  from '../regulatoryDocEngine.js';

export const regulatoryDocSearchBoxController = buildSearchBox(regulatoryDocSearchEngine, {
  options: {
    numberOfSuggestions: 5,
    highlightOptions: {
      notMatchDelimiters: {
        open: '<strong>',
        close: '</strong>',
      },
      correctionDelimiters: {
        open: '<i>',
        close: '</i>',
      },
    },
  },
});

export const regulatoryDocResultsList = buildResultList(regulatoryDocSearchEngine, {
  options: {
    fieldsToInclude: ['productpartnumber', 'lotnumber', 'kitpartnumber', 'description'],
  },
});

export  function regulatoryDocResultClick(results) {
  const interactiveResult = buildInteractiveResult(regulatoryDocSearchEngine, {
    options: {result : results}
  })
  interactiveResult.select();
}

// sorting controller
export const regulatoryDocSortController = buildSort(regulatoryDocSearchEngine, {
  initialState: {
    criterion: { by: 'relevancy' },
  },
});

// query summary controller
export const regulatoryDocQuerySummary = buildQuerySummary(regulatoryDocSearchEngine);

// pagination controller
export const regulatoryDocPaginationController = buildPager(regulatoryDocSearchEngine);

export const regulatoryDocFacetBreadcrumb = buildBreadcrumbManager(regulatoryDocSearchEngine)

// Context variable controller
const context = buildContext(regulatoryDocSearchEngine)
context.add('host', window.location.origin);

export const allFacetController = createFacetController();

function createFacetController() {
  const facetsId = [
    'technicaldocuments',
    'instrumentfamily',
    'languagecountry',
    'year'
  ];
  const controllerMap = new Map();
  facetsId.forEach((item) => {
   const controller = buildFacet(regulatoryDocSearchEngine, {
    options: { 
      numberOfValues: 5,
      field: item,
      facetId: item,
      basePath: [],
      delimitingCharacter: '|'
    },
  });
  controllerMap.set(item,controller);
});
  return controllerMap;
}