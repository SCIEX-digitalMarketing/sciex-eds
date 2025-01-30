import { querySummary } from '../controller/controllers.js';

const renderQuerySummary = () => {
  const querySummaryElement = document.getElementById('query-summary');
  querySummaryElement.innerHTML = '';
  const resultItem = document.createElement('div');
  const querySummaryState = querySummary.state;
  resultItem.innerHTML = `Results <span> ${querySummaryState.firstResult} -  ${querySummaryState.lastResult} </span>
                            of <span>${querySummaryState.total}</span>
    `;
  querySummaryElement.appendChild(resultItem);
};
export default renderQuerySummary;
