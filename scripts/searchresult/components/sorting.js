import { sortController } from '../controller/controllers.js';

export const sortCondition = {
  sortBy: (criterion) => {
    if (criterion.by === 'field') {
      sortController.sortBy(criterion);
    } else if (criterion.by === 'date') {
      sortController.sortBy(criterion);
    } else if (criterion.by === 'relevancy') {
      sortController.sortBy(criterion);
    }
    return '';
  },
};
const renderSorting = () => {
  const sortElement = document.getElementById('sort');
  sortElement.innerHTML = '';
  const sortOptions = [
    { label: 'Relevancy', criterion: { by: 'relevancy' } },
    { label: 'Title', criterion: { by: 'field', field: 'title', order: 'ascending' } },
    { label: 'Date', criterion: { by: 'date', order: 'ascending' } },
  ];
  const sortLabel = document.createElement('div');
  sortLabel.innerHTML = 'Sort By:';
  sortLabel.className = 'sort-by-label';
  const selectElement = document.createElement('select');
  selectElement.id = 'sort-element';
  selectElement.className = 'tw-py-2 tw-px-3 tw-border tw-border-gray-300 tw-bg-white tw-text-sm';
  sortOptions.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = JSON.stringify(option.criterion);
    optionElement.innerText = option.label;
    selectElement.appendChild(optionElement);
  });

  selectElement.addEventListener('change', (event) => {
    const selectedCriterion = JSON.parse(event.target.value);
    sortCondition.sortBy(selectedCriterion);
  });
  sortElement.appendChild(sortLabel);
  sortElement.appendChild(selectElement);
};
export default renderSorting;
