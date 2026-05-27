// renderCourseCatalogSorting.js

import { renderSortingDropdown } from './sortiingUtils.js';

const sortOptions = [
  { label: 'Relevancy', criterion: { by: 'relevancy' } },
  {
    label: 'Title',
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
