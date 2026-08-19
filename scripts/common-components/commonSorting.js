// renderCourseCatalogSorting.js
import { renderSortingDropdown } from '../favorite-all/favorite-all-controller/sortiingUtils.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

const strings = await fetchPlaceholders();

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
