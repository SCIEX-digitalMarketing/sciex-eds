// renderCourseCatalogSorting.js
import { renderSortingDropdown } from '../favorite-all/favorite-all-controller/sortiingUtils.js';
import { i18n } from '../translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

const sortOptions = [
  { label: strings.relevancy, criterion: { by: 'relevancy' } },
  {
    label: strings.title,
    criterion: { by: 'field', field: 'title', order: 'ascending' },
  },
];

const renderCommonSorting = (sortController) => {
  renderSortingDropdown({
    containerId: 'sort', // ID of the DOM element to render into
    sortOptions,
    sortController,
  });
};

export default renderCommonSorting;
