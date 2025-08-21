import decorateSessionTimeline from '../session-timeline/session-timeline.js';
import decorateEventDetails from '../events-details/events-details.js';
import decorateRegisterForm from '../events-register-form/events-register-form.js';
import decorateSciexText from '../sciex-text/sciex-text.js';

export default function decorate(block) {
  const rows = [...block.children];
  const leftCol = document.createElement('div');
  const rightCol = document.createElement('div');

  leftCol.classList.add('column-left');
  rightCol.classList.add('column-right');
  block.parentElement.classList.add('tabs-container-wrapper');
  block.classList.add('two-column-layout');
  let isVerticalLayout = false;
  rows.forEach((row, index) => {
    if (index === 0) {
      block.id = `${row.textContent.trim()}-content`;
      return;
    }
    const type = row.querySelector('p')?.textContent?.toLowerCase()?.trim();
    console.log(`type>${type}`);
    switch (type) {
      case 'vertical':
        block.classList.add('vertical-layout');
        isVerticalLayout = true;
        break;
      case 'horizontal':
        block.classList.add('horizontal-layout');
        break;
      case 'sessiontimeline':
        decorateSessionTimeline(row);
        (isVerticalLayout ? leftCol : leftCol).appendChild(row);
        break;
      case 'details':
        decorateEventDetails(row);
        (isVerticalLayout ? leftCol : rightCol).appendChild(row);
        break;
      case 'registerform':
        decorateRegisterForm(row);
        (isVerticalLayout ? leftCol : rightCol).appendChild(row);
        break;
      case 'sciextext':
        decorateSciexText(row);
        leftCol.appendChild(row);
        break;
      default:
        leftCol.appendChild(row);
        break;
    }
  });

  block.innerHTML = '';
  if (isVerticalLayout) {
    block.appendChild(leftCol);
  } else {
    block.append(leftCol, rightCol);
  }
}
