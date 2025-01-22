import { paginationController } from "../controller/controllers.js";

export const renderPagination = () => {
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
  