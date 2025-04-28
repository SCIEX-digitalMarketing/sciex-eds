// sorting-utils.js

export const createSortHandler = (sortController) => ({
  sortBy: (criterion) => {
    if (criterion.by === 'field' || criterion.by === 'relevancy') {
      sortController.sortBy(criterion);
    }
    return '';
  },
});

export const renderSortingDropdown = ({
  containerId,
  sortOptions,
  sortController,
  labelText = 'Sort By:',
  selectId = 'sort-element',
  selectClass =
  'tw-py-2 tw-px-3 tw-border tw-border-gray-300 tw-bg-white tw-text-sm',
}) => {
  const sortCondition = createSortHandler(sortController);

  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with ID "${containerId}" not found.`);
    return;
  }

  container.innerHTML = '';

  const sortLabel = document.createElement('div');
  sortLabel.innerHTML = labelText;
  sortLabel.className = 'sort-by-label';

  const selectElement = document.createElement('select');
  selectElement.id = selectId;
  selectElement.className = selectClass;

  sortOptions.forEach(({ label, criterion }) => {
    const optionElement = document.createElement('option');
    optionElement.value = JSON.stringify(criterion);
    optionElement.innerText = label;
    selectElement.appendChild(optionElement);
  });

  selectElement.addEventListener('change', (event) => {
    const selectedCriterion = JSON.parse(event.target.value);
    sortCondition.sortBy(selectedCriterion);
  });

  container.appendChild(sortLabel);
  container.appendChild(selectElement);
};
