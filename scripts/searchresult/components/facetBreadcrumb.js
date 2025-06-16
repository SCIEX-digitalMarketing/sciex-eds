import { facetBreadcrumb } from '../controller/controllers.js';
import { i18n } from '../../translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

function canMobileActions() {
  const screenWidth = window.innerWidth;
  if (screenWidth > 767) {
    return false;
  }
  return true;
}
export const renderFacetBreadcurm = () => {
  const facetBreadcrumbElement = document.getElementById('facet-readcrumb');
  facetBreadcrumbElement.innerHTML = '';

  const breadcrumbContainer = document.createElement('div');
  breadcrumbContainer.classList.add('facet-breadcrumb-container');

  // create filter wrapper to wrap category filter terms
  // if selected filters are more than 1 only for mobile.
  const filterCountWrapper = document.createElement('div');
  filterCountWrapper.classList.add('tw-hidden');
  filterCountWrapper.id = 'filter-count-wrapper';

  // create filter wrapper to wrap category filter terms
  // if selected filters are more than 1 only for mobile.
  const filterCountShowLessButton = document.createElement('div');
  filterCountShowLessButton.classList.add('tw-hidden', 'tw-flex');
  filterCountShowLessButton.id = 'filter-count-show-less';
  const showLessSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg>';
  filterCountShowLessButton.innerHTML = `${showLessSvg} ${strings.showLess}`;

  // add click event to show filters list and show less
  filterCountWrapper.addEventListener('click', function showfilters() {
    const breadcrumb = document.querySelector('#facet-readcrumb');
    const breadcrumbCont = breadcrumb.querySelector('.facet-breadcrumb-container');
    const filtersCount = breadcrumbCont.querySelectorAll('.facet-breadcrumb');
    const filtersCountShowLessButton = breadcrumb.querySelector('#filter-count-show-less');
    const clearAllFiltersButton = breadcrumbCont.querySelector('button');
    if (breadcrumb && filtersCount) {
      filtersCount.forEach((item) => {
        if (item.classList.contains('tw-hidden')) {
          item.classList.remove('tw-hidden');
        }
      });
      if (filtersCountShowLessButton) {
        if (filtersCountShowLessButton.classList.contains('tw-hidden')) {
          filtersCountShowLessButton.classList.remove('tw-hidden');
        }
      }
      breadcrumb.style.marginBottom = '30px';

      if (breadcrumbCont) {
        breadcrumbCont.style.marginTop = '0px';
      }
      if (clearAllFiltersButton) {
        clearAllFiltersButton.style.bottom = '-20px';
      }
      this.style.display = 'none';
    }
  });

  // add click event to hide  filters list and hide filters count
  filterCountShowLessButton.addEventListener('click', function hideFilters() {
    const breadcrumb = document.querySelector('#facet-readcrumb');
    const breadcrumbContai = breadcrumb.querySelector('.facet-breadcrumb-container');
    const filtersCount = breadcrumbContai.querySelectorAll('.facet-breadcrumb');
    const filtersCountWrapper = breadcrumb.querySelector('#filter-count-wrapper');
    const clearAllFiltersButton = breadcrumbContai.querySelector('button');
    if (breadcrumb && filtersCount) {
      filtersCount.forEach((item) => {
        item.classList.add('tw-hidden');
      });
      this.classList.add('tw-hidden');
    }

    breadcrumb.style.marginBottom = '0px';
    if (filtersCountWrapper) {
      filtersCountWrapper.style.display = 'block';
    }
    if (breadcrumbContai) {
      breadcrumbContai.style.marginTop = '20px';
    }
    if (clearAllFiltersButton) {
      clearAllFiltersButton.style.marginTop = '-100px';
      clearAllFiltersButton.style.bottom = 'auto';
    }
  });

  facetBreadcrumbElement.appendChild(filterCountWrapper);
  facetBreadcrumbElement.appendChild(filterCountShowLessButton);

  const facetsId = {
    coursetypecategories: strings.courseType,
    certificatetypecategories: strings.certificateType,
    capillaryelectrophoresiscategories: strings.capillaryElectrophoresis,
    hplcandceproductscategories: strings.liquidChromoatography,
    integratedsolutionscategories: strings.integratedSolutions,
    levelcategories: strings.level,
    massspectrometerscategories: strings.massSpectrometry,
    softwarecategories: strings.software,
    standardsandreagentscategories: strings.standardsAndReagentKits,
    techniquescategories: strings.techniques,
    trainingtopiccategories: strings.trainingTopic,
    trainingtypecategories: strings.trainingType,
    assettypes: strings.assetType,
    instrumentfamily: strings.instrumentFamily,
    languagecountry: strings.languageCountry,
    language: strings.language,
    year: strings.year,
    location: strings.trainingLocation,
    applications: strings.applications,
    technicaldocuments: strings.technicalDocuments,
  };

  facetBreadcrumb.state.facetBreadcrumbs.forEach((value) => {
    value.values.forEach((item) => {
      let fieldName;
      if (value.field === 'contenttype') {
        fieldName = strings.contentType;
      } else {
        fieldName = facetsId[value.field];
      }
      const gridContainer = document.createElement('div');
      gridContainer.classList.add('facet-breadcrumb');
      gridContainer.addEventListener('click', () => item.deselect());

      const gridItem1 = document.createElement('div');
      gridItem1.classList.add('grid-item');
      const box1 = document.createElement('div');
      box1.textContent = `${fieldName} : ${item.value.value}`;
      gridItem1.appendChild(box1);

      const gridItem2 = document.createElement('div');
      gridItem2.classList.add('grid-item');
      const clearIcon = document.createElement('span');
      clearIcon.innerHTML = '&#10005;';
      clearIcon.style.cursor = 'pointer';

      gridItem2.appendChild(clearIcon);
      gridContainer.appendChild(gridItem1);
      gridContainer.appendChild(gridItem2);
      breadcrumbContainer.appendChild(gridContainer);

      if (canMobileActions()) {
        // count number of filters selected and render the filter count wrapper...
        const filtersCount = breadcrumbContainer.querySelectorAll('.facet-breadcrumb');
        const filterCountDiv = document.getElementById('filter-count-wrapper');

        if (filtersCount) {
          if (filtersCount.length > 1) {
            if (filterCountDiv) {
              if (filterCountDiv.classList.contains('tw-hidden')) {
                filterCountDiv.classList.remove('tw-hidden');
              }

              filterCountDiv.innerHTML = '';
              filterCountDiv.innerHTML = `<span>Filters: +${filtersCount.length}</span>`;
              filtersCount.forEach((val) => {
                val.classList.add('tw-hidden');
              });
            }
          } else if (filtersCount.length === 1) {
            filtersCount.forEach((filter) => {
              if (filter.classList.contains('tw-hidden')) {
                filter.classList.remove('tw-hidden');
              }
            });
          }
        }
      }
    });
  });
  const button = document.createElement('button');
  button.style.marginRight = '0';
  button.style.marginLeft = 'auto';
  button.textContent = strings.clearAll;
  button.style.color = 'var(--Blue-700, #0068FA)';
  // button.style.fontFamily = '"Geogrotesque"';
  button.style.fontSize = '16px';
  button.style.fontStyle = 'normal';
  button.style.fontWeight = '530';
  button.style.lineHeight = '24px';
  button.style.letterSpacing = '0.08px';

  button.addEventListener('click', () => {
    facetBreadcrumb.deselectAll();
  });

  if (facetBreadcrumb.state.hasBreadcrumbs) {
    facetBreadcrumbElement.style.display = 'block';
    breadcrumbContainer.appendChild(button);
  } else {
    facetBreadcrumbElement.style.display = 'none';
  }

  facetBreadcrumbElement.appendChild(breadcrumbContainer);
};

export const handleClearMobileFilters = () => {
  facetBreadcrumb.deselectAll();
};
