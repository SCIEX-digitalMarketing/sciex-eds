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
  buildFacetConditionsManager,
  buildContext
} from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';
import { searchEngine }  from '../engine.js';

export const searchBoxController = buildSearchBox(searchEngine, {
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

export const headlessResultsList = buildResultList(searchEngine, {
  options: {
    fieldsToInclude: ['ogimage', 'description', 'productpartnumber', 'lotnumber', 'kitpartnumber', 'duration', 'levelcategories', 'coursetypecategories', 'isnewcourse', 'rating'],
  },
});

// Content Type facets controller
export const contentTypeFacetController = buildFacet(searchEngine, {
  options: { 
    numberOfValues: 10,
    field: 'contenttype',
    facetId: 'contenttype'
  },
});

// pagination controller
export const paginationController = buildPager(searchEngine);

// query summary controller
export const querySummary = buildQuerySummary(searchEngine);

// sorting controller
export const sortController = buildSort(searchEngine, {
  initialState: {
    criterion: { by: 'relevancy' },
  },
});
// Update Sorting
export const updateSorting = (criterion) => {
  return {
    type: 'UPDATE_SORTING',  // Example action type
    payload: criterion,      // The new sorting criterion
  };
};

// Context variable controller
const context = buildContext(searchEngine)
context.add('host', window.location.origin);
let lang = document.documentElement.lang
context.add('locale', lang || 'en');


export const facetBreadcrumb = buildBreadcrumbManager(searchEngine)

export  function handleResultClick(results) {
  const interactiveResult = buildInteractiveResult(searchEngine, {
    options: {result : results}
  })
  interactiveResult.select();
}
export const allFacetController = createFacetController();

function createFacetController() {
  const facetsId = [
    'coursetypecategories',
    'capillaryelectrophoresiscategories',
    'certificatetypecategories',
    'hplcandceproductscategories',
    'integratedsolutionscategories',
    'levelcategories',
    'massspectrometerscategories',
    'softwarecategories',
    'standardsandreagentscategories',
    'techniquescategories',
    'trainingtopiccategories',
    'trainingtypecategories',
    'assettypes',
    'instrumentfamily',
    'languagecountry',
    'language',
    'year',
    'location',
    'applications',
    'technicaldocuments',
    'productcategories'
  ];
  const controllerMap = new Map();
  facetsId.forEach((item) => {
   const controller = buildFacet(searchEngine, {
    options: { 
      numberOfValues: 5,
      field: item,
      facetId: item,
      basePath: [],
      delimitingCharacter: '|'
    },
  });
  initDependentFacet(controller, contentTypeFacetController);
  controllerMap.set(item,controller);
});
  return controllerMap;
}

function initDependentFacet(dependentFacet, parentFacets) {
  const conditionForParentValues = (parentValues, allowedValues) =>
    parentValues.some(
      (value) =>
        'value' in value &&
        allowedValues.includes(value.value) &&
        value.state === 'selected'
    );

  const facetConditionsMap = {
    'massspectrometerscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library'],
    'capillaryelectrophoresiscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library'],
    'hplcandceproductscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library'],
    'integratedsolutionscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library'],
    'softwarecategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library'],
    'standardsandreagentscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library'],
    'levelcategories': ['Training'],
    'techniquescategories': ['Training'],
    'trainingtopiccategories': ['Training'],
    'trainingtypecategories': ['Training'],
    'assettypes': ['Resource library', 'Customer documents'],
    'instrumentfamily': ['Regulatory documents'],
    'languagecountry': ['Regulatory documents'],
    'language': ['Customer documents', 'Training', 'Resource library'],
    'year': ['Customer documents', 'Regulatory documents'],
    'location': ['Training'],
    'applications': ['Applications', 'Resource library'],
    'technicaldocuments': ['Regulatory documents'],
    'certificatetypecategories': ['Training'],
    'coursetypecategories': ['Training'],
    'productcategories': ['eCommerce']
  };

  const facetId = dependentFacet.state.facetId;
  const allowedValues = facetConditionsMap[facetId];

  if (!allowedValues) return;

  const facetConditionsManager = buildFacetConditionsManager(searchEngine, {
    facetId: dependentFacet.state.facetId,
    conditions: [
      {
        parentFacetId: parentFacets.state.facetId,
        condition: (parentValues) => conditionForParentValues(parentValues, allowedValues),
      },
    ],
  });

  return facetConditionsManager.stopWatching;
}