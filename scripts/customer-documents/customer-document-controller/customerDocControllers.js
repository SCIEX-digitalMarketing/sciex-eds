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
import { customerDocSearchEngine }  from '../customerDocEngine.js';

export const customerDocSearchBoxController = buildSearchBox(customerDocSearchEngine, {
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

export const customerDocResultsList = buildResultList(customerDocSearchEngine, {
  options: {
    fieldsToInclude: ['description', 'duration', 'levelcategories', 'coursetypecategories', 'isnewcourse'],
  },
});

export  function customerDocResultClick(results) {
  const interactiveResult = buildInteractiveResult(customerDocSearchEngine, {
    options: {result : results}
  })
  interactiveResult.select();
}

// sorting controller
export const customerDocSortController = buildSort(customerDocSearchEngine, {
  initialState: {
    criterion: { by: 'relevancy' },
  },
});

// query summary controller
export const customerDocQuerySummary = buildQuerySummary(customerDocSearchEngine);

// pagination controller
export const customerDocPaginationController = buildPager(customerDocSearchEngine);

export const customerDocFacetBreadcrumb = buildBreadcrumbManager(customerDocSearchEngine)

// Context variable controller
const context = buildContext(customerDocSearchEngine)
context.add('host', window.location.origin);

export const allFacetController = createFacetController();

function createFacetController() {
  const facetsId = [
    'assettypes',
    'year',
    'language',
    'massspectrometerscategories',
    'capillaryelectrophoresiscategories',
    'hplcandceproductscategories',
    'integratedsolutionscategories',
    'softwarecategories',
  ];
  const controllerMap = new Map();
  facetsId.forEach((item) => {
   const controller = buildFacet(customerDocSearchEngine, {
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