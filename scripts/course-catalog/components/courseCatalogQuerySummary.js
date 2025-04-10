import { courseCatalogQuerySummary } from '../course-catalog-controller/controllers.js';

const renderCourseCatalogQuerySummary = () => {
  const querySummaryElement = document.getElementById('query-summary');
  const mobileFilterResultBtn = document.getElementById('mobile-filter-footer-results');
  querySummaryElement.innerHTML = '';
  const resultItem = document.createElement('div');
  const querySummaryState = courseCatalogQuerySummary.state;
  mobileFilterResultBtn.innerHTML = `Results (${querySummaryState.total})`;
  resultItem.innerHTML = `Results <span> ${querySummaryState.firstResult} -  ${querySummaryState.lastResult} </span>
                            of <span>${querySummaryState.total}</span>
    `;
  querySummaryElement.appendChild(resultItem);
};
export default renderCourseCatalogQuerySummary;
