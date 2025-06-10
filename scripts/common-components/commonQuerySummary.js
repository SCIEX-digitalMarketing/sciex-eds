import { i18n } from '../translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

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
