import { sortController } from '../controller/controllers.js';
import { i18n } from '../../translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

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
    { label: strings.relevancy, criterion: { by: 'relevancy' } },
    { label: strings.title, criterion: { by: 'field', field: 'title', order: 'ascending' } },
    { label: strings.date, criterion: { by: 'date', order: 'ascending' } },
  ];
  const sortLabel = document.createElement('div');
  sortLabel.innerHTML = `${strings.sortBy}:`;
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
