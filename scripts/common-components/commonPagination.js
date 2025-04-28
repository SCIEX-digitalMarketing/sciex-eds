const renderCommonPagination = (paginationController) => {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  const { currentPages, hasNextPage, hasPreviousPage } = paginationController.state;

  if (hasPreviousPage) {
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M16.5 20L8.5 12L16.5 4" stroke="#141414"/></svg>';
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
    nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M8.5 20L16.5 12L8.5 4" stroke="#141414"/></svg>';
    nextButton.onclick = () => {
      paginationController.nextPage();
    };
    paginationElement.appendChild(nextButton);
  }
};

export default renderCommonPagination;
