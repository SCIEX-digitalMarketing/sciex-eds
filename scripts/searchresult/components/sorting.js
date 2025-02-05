import { sortController } from '../controller/controllers.js';

const renderSorting = () => {
  const sortElement = document.getElementById('sort');
  sortElement.innerHTML = '';
  const sortOptions = [
    { label: 'Relevancy', criterion: { by: 'relevancy' } },
    { label: 'Title', criterion: { by: 'field', field: 'title' } },
    { label: 'Date Descending', criterion: { by: 'indexeddate' } },
    { label: 'Date Ascending', criterion: { by: 'indexeddate' } },

  ];
  const selectElement = document.createElement('select');
  selectElement.className = 'tw-py-2 tw-px-3 tw-border tw-border-gray-300 tw-bg-white tw-text-sm';
  sortOptions.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = JSON.stringify(option.criterion);
    optionElement.innerText = option.label;
    selectElement.appendChild(optionElement);
  });

  selectElement.addEventListener('change', (event) => {
    const selectedCriterion = JSON.parse(event.target.value);
    sortController.sortBy(selectedCriterion);
  });

  sortElement.appendChild(selectElement);
};
export default renderSorting;
