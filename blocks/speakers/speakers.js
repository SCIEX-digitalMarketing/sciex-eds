import { } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  let headingText = '';
  const parentDiv = document.createElement('div');
  parentDiv.className = 'speaker-container';

  function canMobileActions() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 1024) {
      return false;
    }
    return true;
  }

  [...block.children].forEach((row, index) => {
    if (index === 0) {
      block.id = `${row.textContent.trim()}-content`;
      block.parentElement.classList.add('tabs-container-wrapper');
      return;
    }
    if (index === 1) {
      headingText = row.textContent.trim();
      return;
    }

    const showMoreButton = document.createElement('div');
    showMoreButton.classList = 'show-more';
    const showMoreSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg>';
    showMoreButton.innerHTML = `${showMoreSvg} Show More`;

    const showLessButton = document.createElement('div');
    showLessButton.classList = 'show-less content-hidden';
    const showLessSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg>';
    showLessButton.innerHTML = `${showLessSvg} Show Less`;

    const speakerDiv = document.createElement('div');
    speakerDiv.className = 'speaker-card';
    moveInstrumentation(row, speakerDiv);

    while (row.firstElementChild) speakerDiv.append(row.firstElementChild);

    [...speakerDiv.children].forEach((div) => {
      if (div.querySelector('picture')) {
        div.className = 'speaker-image';
      } else {
        div.className = 'speaker-content';
        if (canMobileActions()) {
          const target = div.querySelector('ul');
          if (target) {
            target.insertAdjacentElement('beforebegin', showMoreButton);
            target.insertAdjacentElement('afterend', showLessButton);
          }
          target.className = 'content-hidden';
        }
      }
      showMoreButton.addEventListener('click', (event) => {
        event.target.classList.add('content-hidden');
        event.target.parentElement.querySelector('ul').classList.remove('content-hidden');
        event.target.parentElement.querySelector('.show-less').classList.remove('content-hidden');
      });

      showLessButton.addEventListener('click', (event) => {
        event.target.classList.add('content-hidden');
        event.target.parentElement.querySelector('ul').classList.add('content-hidden');
        event.target.parentElement.querySelector('.show-more').classList.remove('content-hidden');
      });
    });

    parentDiv.appendChild(speakerDiv);
  });

  const headingEl = document.createElement('h2');
  headingEl.textContent = headingText;
  headingEl.className = 'heading';

  block.textContent = '';
  block.append(headingEl);
  block.append(parentDiv);
}
