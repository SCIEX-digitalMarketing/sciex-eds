import { fetchPlaceholders } from '../../scripts/aem.js';

const strings = await fetchPlaceholders();

const renderCommonQuerySummary = (querySummaryController) => {
  const querySummaryElement = document.getElementById('query-summary');
  const mobileFilterResultBtn = document.getElementById('mobile-filter-footer-results');
  querySummaryElement.innerHTML = '';
  const resultItem = document.createElement('div');
  const querySummaryState = querySummaryController.state;
  mobileFilterResultBtn.innerHTML = `Results (${querySummaryState.total})`;
  resultItem.innerHTML = `${strings.result} <span> ${querySummaryState.firstResult} -  ${querySummaryState.lastResult} </span>
                            ${strings.of} <span>${querySummaryState.total}</span>
    `;
  querySummaryElement.appendChild(resultItem);
};
export default renderCommonQuerySummary;
