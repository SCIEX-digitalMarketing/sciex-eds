import { paginationController } from '../controller/controllers.js';

const renderPagination = () => {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  const { currentPages, hasNextPage, hasPreviousPage } = paginationController.state;

  if (hasPreviousPage) {
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.onclick = () => {
      paginationController.previousPage();
    };
    paginationElement.appendChild(prevButton);
  }

  currentPages.forEach((page) => {
    const pageButton = document.createElement('button');
    pageButton.className = 'tw-w-10 tw-h-10 tw-bg-transparent tw-border tw-border-gray-300 tw-rounded-lg tw-text-black tw-p-2';
    pageButton.innerText = page.toString();
    pageButton.disabled = page === paginationController.state.currentPage;
    pageButton.onclick = () => {
      paginationController.selectPage(page);
    };
    paginationElement.appendChild(pageButton);
  });

  if (hasNextPage) {
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.onclick = () => {
      paginationController.nextPage();
    };
    paginationElement.appendChild(nextButton);
  }
};

export default renderPagination;
