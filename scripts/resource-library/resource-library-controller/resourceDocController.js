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
  import { resourceLibrarySearchEngine }  from '../resourceDocEngine.js';
  
  export const resourceLibrarySearchBoxController = buildSearchBox(resourceLibrarySearchEngine, {
    options: {
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
  
  export const resourceLibraryResultsList = buildResultList(resourceLibrarySearchEngine, {
    options: {
      fieldsToInclude: ['description', 'duration', 'levelcategories', 'coursetypecategories', 'isnewcourse'],
    },
  });
  
  export  function resourceLibraryResultClick(results) {
    const interactiveResult = buildInteractiveResult(resourceLibrarySearchEngine, {
      options: {result : results}
    })
    interactiveResult.select();
  }
  
  // sorting controller
  export const resourceLibrarySortController = buildSort(resourceLibrarySearchEngine, {
    initialState: {
      criterion: { by: 'relevancy' },
    },
  });
  
  // query summary controller
  export const resourceLibraryQuerySummary = buildQuerySummary(resourceLibrarySearchEngine);
  
  // pagination controller
  export const resourceLibraryPaginationController = buildPager(resourceLibrarySearchEngine);
  
  export const resourceLibraryFacetBreadcrumb = buildBreadcrumbManager(resourceLibrarySearchEngine)
  
  // Context variable controller
  const context = buildContext(resourceLibrarySearchEngine)
  context.add('host', window.location.origin);
  let lang = document.documentElement.lang
  context.add('locale', lang || 'en-US');
  
  export const allFacetController = createFacetController();
  
  function createFacetController() {
    const facetsId = [
      'assettypes',
      'applications',
      'massspectrometerscategories',
      'capillaryelectrophoresiscategories',
      'hplcandceproductscategories',
      'integratedsolutionscategories',
      'softwarecategories',
      'standardsandreagentscategories',
      'language'
    ];
    const controllerMap = new Map();
    facetsId.forEach((item) => {
     const controller = buildFacet(resourceLibrarySearchEngine, {
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