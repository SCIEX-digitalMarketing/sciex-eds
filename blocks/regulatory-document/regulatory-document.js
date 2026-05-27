import initializeSerachInterface from '../../scripts/common-components/renderUI.js';
import { regulatoryDocSearchEngine } from '../../scripts/regulatory-document/regulatoryDocEngine.js';
import renderCommonSearchBox from '../../scripts/common-components/commonRenderSearchBox.js';
import {
  regulatoryDocSearchBoxController,
  regulatoryDocSortController,
  regulatoryDocResultsList,
  regulatoryDocResultClick,
  regulatoryDocQuerySummary,
  regulatoryDocPaginationController,
  allFacetController,
  regulatoryDocFacetBreadcrumb,
} from '../../scripts/regulatory-document/regulatory-document-controller/regulatoryDocControllers.js';
import renderCommonSorting from '../../scripts/common-components/commonSorting.js';
import renderRegulatorySearchResultList from '../../scripts/regulatory-document/component/renderRegulatorySearchResult.js';
import renderCommonQuerySummary from '../../scripts/common-components/commonQuerySummary.js';
import renderCommonPagination from '../../scripts/common-components/commonPagination.js';
import { renderCommonFacet } from '../../scripts/common-components/commonFacets.js';
import renderCommonFacetBreadcurm from '../../scripts/common-components/commonFacetBreadcurm.js';
import { i18n } from '../../scripts/translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

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
    const sections = Array.from(main.querySelector('.regulatory-document').children);
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
    technicaldocuments: strings.technicalDocuments,
    instrumentfamily: strings.instrumentFamily,
    languagecountry: strings.languageCountry,
    year: strings.year,
  };

  const desiredOrder = [
    'technicaldocuments-facet',
    'instrumentfamily-facet',
    'languagecountry-facet',
    'year-facet',
  ];

  // Initialize course catalog components
  try {
    await readBlockProperties(block);
    await initializeSerachInterface(block, 'regulatory-document-search');
    renderCommonSearchBox(regulatoryDocSearchBoxController);
    renderCommonSorting(regulatoryDocSortController);
    regulatoryDocSearchEngine.executeFirstSearch();
    regulatoryDocSearchEngine.subscribe(() => {
      renderRegulatorySearchResultList(regulatoryDocResultsList, regulatoryDocResultClick);
      renderCommonQuerySummary(regulatoryDocQuerySummary);
      renderCommonPagination(regulatoryDocPaginationController);
      renderCommonFacet(allFacetController, facetsId, desiredOrder);
      renderCommonFacetBreadcurm(regulatoryDocFacetBreadcrumb);
    });
  } catch (error) {
    regulatoryDocSearchEngine.executeFirstSearch();
  }
}
