import { querySummary } from '../controller/controllers.js';
import { i18n } from '../../translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

const renderQuerySummary = () => {
  const querySummaryElement = document.getElementById('query-summary');
  const mobileFilterResultBtn = document.getElementById('mobile-filter-footer-results');
  querySummaryElement.innerHTML = '';
  const resultItem = document.createElement('div');
  const querySummaryState = querySummary.state;
  mobileFilterResultBtn.innerHTML = `${strings.result} (${querySummaryState.total})`;
  resultItem.innerHTML = `${strings.result} <span> ${querySummaryState.firstResult} -  ${querySummaryState.lastResult} </span>
                            ${strings.of} <span>${querySummaryState.total}</span>
    `;
  querySummaryElement.appendChild(resultItem);
};
export default renderQuerySummary;
