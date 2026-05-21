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
        close: '</strong> &nbsp;',
      },
      correctionDelimiters: {
        open: '<i>',
        close: '</i> &nbsp;',
      },
    },
  },
});

export const headlessResultsList = buildResultList(searchEngine, {
  options: {
    fieldsToInclude: ['ogimage', 'description', 'productpartnumber', 'lotnumber', 'kitpartnumber', 'duration', 'levelcategories', 'coursetypecategories', 'isnewcourse', 'rating', 'courseUrl', 'trainingcoursetype'],
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

// Language facets controller
export const languageFacetController = buildFacet(searchEngine, {
  options: { 
    numberOfValues: 10,
    field: 'language',
    facetId: 'language'
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
  let lang = document.documentElement.lang;
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
    'trainingcoursetype',
    'categories',
    'subcategories',
    'assettypes',
    'instrumentfamily',
    'languagecountry',
    'year',
    'location',
    'applications',
    'technicaldocuments',
    'productcategories'
  ];

  if (lang !== 'ja' && lang !== 'zh-cn') {
    facetsId.push('language');
  }

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
    'massspectrometerscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library', 'Knowledge base articles' ,'SCIEX How', 'Technical notes','User guides'],
    'capillaryelectrophoresiscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library', 'Knowledge base articles', 'SCIEX How', 'Technical notes','User guides'],
    'hplcandceproductscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library', 'Knowledge base articles', 'SCIEX How', 'Technical notes','User guides'],
    'integratedsolutionscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library', 'Knowledge base articles', 'SCIEX How', 'Technical notes','User guides'],
    'softwarecategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library', 'Knowledge base articles', 'SCIEX How', 'Technical notes','User guides'],
    'standardsandreagentscategories': ['Products and services', 'Resource Library', 'Customer documents', 'Training', 'Resource library' ,'Knowledge base articles', 'SCIEX How', 'Technical notes','User guides'],
    'categories': [ 'Knowledge base articles'],
    'subcategories': [ 'Knowledge base articles'],
    'levelcategories': ['Training'],
    'techniquescategories': ['Training'],
    'trainingtopiccategories': ['Training'],
    'trainingtypecategories': ['Training'],
    'trainingcoursetype': ['Training'],
    'assettypes': ['Resource library', 'Customer documents','User guides'],
    'instrumentfamily': ['Regulatory documents'],
    'languagecountry': ['Regulatory documents'],
    'language': ['Customer documents', 'Training', 'Resource library', 'Knowledge base articles', 'SCIEX How', 'Technical notes','User guides'],
    'year': ['Customer documents', 'Regulatory documents','User guides'],
    'location': ['Training'],
    'applications': ['Applications', 'Resource library', 'Knowledge base articles', 'SCIEX How', 'Technical notes'],
    'technicaldocuments': ['Regulatory documents'],
    'certificatetypecategories': ['Training'],
    'coursetypecategories': ['Training'],
    'productcategories': ['binarydata', 'eCommerce']
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