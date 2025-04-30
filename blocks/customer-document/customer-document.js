import initializeSerachInterface from '../../scripts/common-components/renderUI.js';
import { customerDocSearchEngine } from '../../scripts/customer-documents/customerDocEngine.js';
import renderCourseCatalogSearchBox from '../../scripts/common-components/commonRenderSearchBox.js';
import {
  customerDocSearchBoxController,
  customerDocSortController,
  customerDocResultsList,
  customerDocResultClick,
  customerDocQuerySummary,
  customerDocPaginationController,
  allFacetController,
  customerDocFacetBreadcrumb,
} from '../../scripts/customer-documents/customer-document-controller/customerDocControllers.js';
import renderCommonSorting from '../../scripts/common-components/commonSorting.js';
import renderCommonSearchResultList from '../../scripts/common-components/commonSearchResultList.js';
import renderCommonQuerySummary from '../../scripts/common-components/commonQuerySummary.js';
import renderCommonPagination from '../../scripts/common-components/commonPagination.js';
import { renderCommonFacet } from '../../scripts/common-components/commonFacets.js';
import renderCommonFacetBreadcurm from '../../scripts/common-components/commonFacetBreadcurm.js';

async function readBlockProperties(block) {
  // Create no results section
  const coveoNoResultsDiv = document.createElement('div');
  coveoNoResultsDiv.id = 'coveo-no-results';
  coveoNoResultsDiv.style.display = 'none';
  const noResultsText = document.createElement('div');
  noResultsText.className = 'no-result-text';
  coveoNoResultsDiv.appendChild(noResultsText);
  document.body.appendChild(coveoNoResultsDiv);

  // lifeSciencesDiv
  const lifeSciencesDiv = document.createElement('div');
  lifeSciencesDiv.id = 'coveo-life-sciences';
  const path = window.location.pathname;
  const resp = await fetch(`${path}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const main = document.createElement('main');
    main.innerHTML = html;
    const sections = Array.from(main.querySelector('.customer-document').children);
    block.textContent = '';

    let description;
    sections.forEach((section, index) => {
      switch (index + 1) {
        case 1: {
          description = section.querySelector('div');
          description.className = 'banner-description';
          lifeSciencesDiv.appendChild(description);
          block.appendChild(lifeSciencesDiv);
          break;
        }
        case 2: {
          const picture = main.querySelector('picture');
          if (picture) {
            coveoNoResultsDiv.appendChild(picture);
          }
          break;
        }
        case 3: {
          const noResultsText1 = section.querySelector('div');
          noResultsText1.id = 'noresults-text1';
          noResultsText1.setAttribute('data-text1', noResultsText1.textContent);
          coveoNoResultsDiv.appendChild(noResultsText1);
          break;
        }
        case 4: {
          const noResultsText2 = section.querySelector('div');
          noResultsText2.classList.add('noresults-text2');
          coveoNoResultsDiv.appendChild(noResultsText2);
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}

export default async function decorate(block) {
  // Create suggestion popup div
  const suggestionPopupDiv = document.createElement('div');
  suggestionPopupDiv.id = 'suggestion-popup';
  document.body.appendChild(suggestionPopupDiv);

  const facetsId = {
    assettypes: 'Asset type',
    year: 'Year',
    language: 'Language',
    massspectrometerscategories: 'Mass spectrometry',
    capillaryelectrophoresiscategories: 'Capillary electrophoresis',
    hplcandceproductscategories: 'Liquid chromoatography',
    integratedsolutionscategories: 'Integrated solutions',
    softwarecategories: 'Software',
  };

  const desiredOrder = [
    'assettypes-facet',
    'year-facet',
    'language-facet',
    'massspectrometerscategories-facet',
    'capillaryelectrophoresiscategories-facet',
    'hplcandceproductscategories-facet',
    'integratedsolutionscategories-facet',
    'softwarecategories-facet',
  ];

  // Initialize course catalog components
  try {
    await readBlockProperties(block);
    await initializeSerachInterface(block, 'customer-document-search');
    renderCourseCatalogSearchBox(customerDocSearchBoxController);
    renderCommonSorting(customerDocSortController);
    customerDocSearchEngine.executeFirstSearch();
    customerDocSearchEngine.subscribe(() => {
      renderCommonSearchResultList(customerDocResultsList, customerDocResultClick);
      renderCommonQuerySummary(customerDocQuerySummary);
      renderCommonPagination(customerDocPaginationController);
      renderCommonFacet(allFacetController, facetsId, desiredOrder);
      renderCommonFacetBreadcurm(customerDocFacetBreadcrumb);
    });
  } catch (error) {
    customerDocSearchEngine.executeFirstSearch();
  }
}
