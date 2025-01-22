import {
    buildSearchBox,
    buildFacet,
    buildResultList,
    buildPager,
    buildQuerySummary,
    buildSort,
  } from "https://static.cloud.coveo.com/headless/v3/headless.esm.js";
  import { searchEngine } from "../engine.js";
  
  export const searchBoxController = buildSearchBox(searchEngine, {
    options: {
      numberOfSuggestions: 5,
      highlightOptions: {
        notMatchDelimiters: {
          open: "<strong>",
          close: "</strong>",
        },
        correctionDelimiters: {
          open: "<i>",
          close: "</i>",
        },
      },
    },
  });
  
  export const headlessResultsList = buildResultList(searchEngine, {
    options: {
      fieldsToInclude: ["date"],
    },
  });
  
  // category facets controller
  export const pagetypeFacetController = buildFacet(searchEngine, {
    options: { field: "pagetype" },
  });
  
  export const sourceFacetController = buildFacet(searchEngine, {
    options: { field: "source" },
  });
  
  export const filetypeFacetController = buildFacet(searchEngine, {
    options: { field: "filetype" },
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
  