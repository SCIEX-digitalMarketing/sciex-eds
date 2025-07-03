import {} from '../../scripts/aem.js';
import { courseCatalogSearchEngine } from '../../scripts/course-catalog/courseCatalogEngine.js';
import renderCourseCatalogSearchBox from '../../scripts/course-catalog/components/renderCourseCatalogSearchBox.js';
import renderCourseCatalogSearchResults from '../../scripts/course-catalog/components/renderCourseCatalogSearchResult.js';
import renderCourseCatalogSorting from '../../scripts/course-catalog/components/courseCatalogSorting.js';
import renderCourseCatalogQuerySummary from '../../scripts/course-catalog/components/courseCatalogQuerySummary.js';
import renderCourseCatalogPagination from '../../scripts/course-catalog/components/courseCatalogPagination.js';
import { renderCourseCatalogFacet, handleMobileFilters } from '../../scripts/course-catalog/components/courseCatalogFacet.js';
import { renderCourceCatalogFacetBreadcurm, handleClearMobileFilters } from '../../scripts/course-catalog/components/courseCatalogFacetBreadcurm.js';

// Helper function for creating DOM elements
function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  Object.entries(options).forEach(([key, value]) => {
    if (key === 'classList') el.classList.add(...value);
    else if (key === 'text') el.textContent = value;
    else if (key === 'html') el.innerHTML = value;
    else if (key === 'append') el.append(...value);
    else if (key === 'addEventListener') el.addEventListener(...value);
    else el.setAttribute(key, value);
  });
  return el;
}

export default async function decorate(block) {
  // Create main container div
  const courseCatalogDiv = createElement('div', { classList: ['tw', 'coursecatalog-search', 'tw-bg-white'] });

  // Create search wrapper div
  const searchWrapperDiv = createElement('div', {
    classList: ['search-wrapper', 'tw-flex', 'tw-gap-5', 'tw-flex-wrap', 'tw-mx-auto'],
  });

  // Create facets div
  const facetsDiv = createElement('div', {
    id: 'facets',
    classList: ['facet-section', 'tw-bg-white', 'tw-p-5', 'tw-rounded-lg', 'tw-w-1/4'],
  });

  // Mobile filter header
  const mobileFilterHeader = createElement('div', {
    id: 'mobile-filter-header',
    classList: ['tw-hidden', 'tw-flex', 'tw-py-20', 'tw-px-24', 'tw-justify-between', 'tw-border-b-2', 'tw-border-gray-500', 'tw-bg-white'],
  });
  const mobileFilterHeaderText = createElement('span', { text: 'Filter' });
  const mobileFilterHeaderIcon = createElement('span', {
    html: '<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 13.5L3.0001 3.5001" stroke="#141414"/><path d="M13 3.5L3.0001 13.4999" stroke="#141414"/></svg>',
  });
  mobileFilterHeader.append(mobileFilterHeaderText, mobileFilterHeaderIcon);
  mobileFilterHeaderIcon.addEventListener('click', handleMobileFilters);

  // Mobile filter footer
  const mobileFilterFooter = createElement('div', {
    id: 'mobile-filter-footer',
    classList: ['tw-hidden', 'tw-flex', 'tw-py-20', 'tw-px-24', 'tw-justify-between', 'tw-border-b-2', 'tw-border-gray-500', 'tw-bg-white'],
  });
  const mobileFilterFooterClearButton = createElement('button', {
    text: 'Clear All',
    id: 'mobile-filter-footer-clear-all',
    addEventListener: ['click', handleClearMobileFilters],
  });
  const mobileFilterFooterResultsButton = createElement('button', {
    id: 'mobile-filter-footer-results',
    addEventListener: ['click', handleMobileFilters],
  });
  mobileFilterFooter.append(mobileFilterFooterClearButton, mobileFilterFooterResultsButton);

  // Search term
  const searchTermDiv = createElement('div', { classList: ['search-term-container'], id: 'searchTermContainer' });
  const searchTermLabel = createElement('div', { classList: ['search-term-label'], text: 'Search term' });
  const searchTermValue = createElement('div', { classList: ['search-term-value'], id: 'searchTermValue' });
  searchTermDiv.append(searchTermLabel, searchTermValue);

  // Search input
  const searchInput = createElement('input', {
    type: 'text',
    id: 'coveo-query',
    placeholder: 'Search...',
    maxLength: 200,
    classList: ['search-box', 'tw-w-full', 'tw-py-3', 'tw-px-4', 'tw-border', 'tw-border-gray-300', 'tw-rounded-md'],
  });

  // Search validation
  const searchTermValidation = createElement('div', { classList: ['search-term-validation'], id: 'searchTermValidation' });
  const validationText = createElement('div', { classList: ['search-validation-text'], id: 'validationText', text: 'Search within max 200 characters' });
  const validationCount = createElement('div', { classList: ['search-validation-count'], id: 'validationCount' });
  const validationError = createElement('div', { classList: ['search-validation-error'], id: 'validationError', text: 'Input exceeds the limit. Please search within 200 characters' });

  searchTermValidation.appendChild(validationText);
  searchTermValidation.appendChild(validationError);
  searchTermValidation.appendChild(validationCount);

  // Clear search input icon
  const clearSearchInput = createElement('span', {
    id: 'clear-search',
    className: 'clear-search',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 13L3.0001 3.0001" stroke="#141414"/><path d="M13 3L3.0001 12.9999" stroke="#141414"/></svg>',
  });

  // Search icon
  const searchIcon = createElement('span', {
    id: 'search-icon',
    className: 'search-icon',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0065 7.33324C12.0065 9.7264 10.0664 11.6665 7.67318 11.6665C5.27993 11.6665 3.33984 9.7264 3.33984 7.33324C3.33984 4.94007 5.27993 3 7.67318 3C10.0664 3 12.0065 4.94007 12.0065 7.33324ZM11.0743 11.4414C10.1512 12.2066 8.96589 12.6665 7.67318 12.6665C4.72766 12.6665 2.33984 10.2787 2.33984 7.33324C2.33984 4.38777 4.72766 2 7.67318 2C10.6187 2 13.0065 4.38777 13.0065 7.33324C13.0065 8.62593 12.5466 9.81119 11.7815 10.7343L14.0267 12.9796L14.3803 13.3331L13.6732 14.0402L13.3196 13.6867L11.0743 11.4414Z" fill="#707070"/></svg>',
  });

  // Append search input to search container
  const coveoSearchComponentDiv = createElement('div', {
    classList: ['coveo-search-component', 'tw-flex', 'tw-gap-2'],
    append: [searchIcon, searchInput, clearSearchInput],
  });

  // Create query sort section div
  const querySortSectionDiv = createElement('div', {
    classList: ['query-sort-section', 'tw-flex', 'tw-justify-between', 'tw-items-center'],
  });

  // Create query summary div
  const querySummaryDiv = createElement('div', { id: 'query-summary', classList: ['tw-text-sm'] });

  // Create sort div
  const sortDiv = createElement('div', {
    id: 'sort',
    classList: ['tw-flex', 'tw-justify-center'],
  });

  // Append query summary and sort divs to query sort section
  querySortSectionDiv.append(querySummaryDiv, sortDiv);

  // Create pagination div
  const paginationDiv = createElement('div', {
    id: 'pagination',
    classList: ['pagination', 'tw-flex', 'tw-justify-center', 'tw-gap-1', 'tw-mt-6'],
  });

  // Create facets breadcrumb div
  const facetBreadcrumbDiv = createElement('div', { id: 'facet-readcrumb' });

  // Create results section div
  const coveoResultsDiv = createElement('div', { id: 'coveo-results', classList: ['result-section'] });

  // Create loading results div
  const coveoResultsLoading = createElement('div', {
    id: 'coveo-results-loading',
    className: 'result-loading-section tw-text-center tw-text-2xl',
    text: 'Loading Results...',
  });

  // Create no results section
  const coveoNoResultsDiv = createElement('div', {
    id: 'coveo-no-results',
    style: { display: 'none' },
  });
  const noResultsText = createElement('div', { className: 'no-result-text' });
  coveoNoResultsDiv.appendChild(noResultsText);

  // Fetch life sciences data
  const lifeSciencesDiv = createElement('div', { id: 'coveo-life-sciences' });
  const path = window.location.pathname;
  const resp = await fetch(`${path}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const main = document.createElement('main');
    main.innerHTML = html;
    const sections = Array.from(main.querySelector('.coursecatalog').children);
    block.textContent = '';

    let buttonText;
    let description;

    sections.forEach((section, index) => {
      switch (index + 1) {
        case 1: {
          description = section.querySelector('div');
          description.className = 'banner-description';
          const descriptionText = description.querySelector('p:nth-of-type(2)');
          descriptionText.id = 'description-text';

          const readMoreSpan = createElement('span', { id: 'banner-read-more', text: 'Read More' });
          description.insertBefore(readMoreSpan, description.children[2]);

          lifeSciencesDiv.appendChild(description);
          block.appendChild(lifeSciencesDiv);

          readMoreSpan.addEventListener('click', () => {
            const isExpanded = descriptionText.style.webkitLineClamp !== '2';
            descriptionText.style.webkitLineClamp = isExpanded ? '2' : 'unset';
            readMoreSpan.textContent = isExpanded ? 'Read More' : 'Read Less';
          });
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
        case 7: {
          const bannerDetails = createElement('div', { classList: ['banner-details'] });
          const picture = section.querySelector('div');
          picture.classList.add('banner-image');
          bannerDetails.appendChild(picture);
          bannerDetails.appendChild(description);
          lifeSciencesDiv.appendChild(bannerDetails);
          break;
        }
        case 8: {
          buttonText = section.querySelector('div');
          buttonText.classList.add('banner-button-text');
          break;
        }
        case 9: {
          const buttonUrl = section.querySelector('div a');
          const button = createElement('a', {
            classList: ['banner-button'], href: buttonUrl.getAttribute('href'), text: buttonText.textContent, target: '_blank',
          });
          lifeSciencesDiv.appendChild(button);
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  // Append all sections to the search result section div
  const searchResultSectionDiv = createElement('div', {
    classList: ['search-result-section', 'tw-flex-1'],
    append: [
      coveoSearchComponentDiv,
      searchTermValidation,
      searchTermDiv,
      querySortSectionDiv,
      facetBreadcrumbDiv,
      coveoResultsLoading,
      coveoResultsDiv,
      coveoNoResultsDiv,
      paginationDiv,
    ],
  });

  // Append facets and search result sections to search
  searchWrapperDiv.appendChild(mobileFilterHeader);
  searchWrapperDiv.appendChild(facetsDiv);
  searchWrapperDiv.appendChild(mobileFilterFooter);
  searchWrapperDiv.appendChild(searchResultSectionDiv);

  // Append the main search result div to the body or any specific container
  courseCatalogDiv.appendChild(searchWrapperDiv);
  block.append(courseCatalogDiv);

  // Create suggestion popup div
  const suggestionPopupDiv = createElement('div', { id: 'suggestion-popup' });
  document.body.appendChild(suggestionPopupDiv);

  // Initialize course catalog components
  try {
    renderCourseCatalogSearchBox();
    renderCourseCatalogSorting();
    courseCatalogSearchEngine.executeFirstSearch();
    courseCatalogSearchEngine.subscribe(() => {
      renderCourseCatalogSearchResults();
      renderCourseCatalogQuerySummary();
      renderCourseCatalogPagination();
      renderCourseCatalogFacet();
      renderCourceCatalogFacetBreadcurm();
    });
  } catch (error) {
    courseCatalogSearchEngine.executeFirstSearch();
  }
}
