// sorting-utils.js
import { i18n } from '../../translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

export const createSortHandler = (sortController) => ({
  sortBy: (criterion) => {
    if (criterion.by === 'field' || criterion.by === 'relevancy') {
      sortController.sortBy(criterion);
    }
    return '';
  },
});

/**
 * Renders the logged-out state UI.
 * Displays message, Login CTA, and Create Account CTA.
 * */
export function renderLoggedOut(container, text, loginUrl, createUrl) {
  container.innerHTML = `
    <div class="favorites-logged-out">
      <p>${text}</p>
      <div class="cta-row">
        <a class="btn secondary" href="${loginUrl}">Login</a>
        <a class="btn primary" href="${createUrl}">Create an account</a>
      </div>
    </div>
  `;
}

export const renderSortingDropdown = ({
  containerId,
  sortOptions,
  sortController,
  labelText = `${strings.sortBy}:`,
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
