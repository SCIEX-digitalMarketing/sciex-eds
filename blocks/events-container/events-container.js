import decorateSessionTimeline from '../session-timeline/session-timeline.js';
import decorateEventDetails from '../events-details/events-details.js';
import decorateRegisterForm from '../events-register-form/events-register-form.js';
import decorateSciexText from '../sciex-text/sciex-text.js';
import { } from '../../scripts/scripts.js';
import decorateSpeaker from '../speaker-details/speaker-details.js';

/**
 * Decorates a two-column layout block that supports multiple content sections
 * (e.g., session timeline, speakers, details, register form, sciex text).
 * @param {HTMLElement} block - The container element to decorate.
 */
export default function decorate(block) {
  const rowElements = [...block.children];

  const leftColumnEl = document.createElement('div');
  const rightColumnEl = document.createElement('div');

  leftColumnEl.classList.add('column-left');
  rightColumnEl.classList.add('column-right');

  block.parentElement.classList.add('tabs-container-wrapper');
  block.classList.add('two-column-layout');

  // Tracks whether the layout should render as a single, vertical column
  let isVerticalLayout = false;

  rowElements.forEach((rowEl, rowIndex) => {
    if (rowIndex === 0) {
      block.id = `${rowEl.textContent.trim()}-content`;
      return;
    }

    const rowType = rowEl.querySelector('p')?.textContent?.toLowerCase()?.trim();

    switch (rowType) {
      case 'vertical': {
        block.classList.add('vertical-layout');
        isVerticalLayout = true;
        break;
      }
      case 'horizontal': {
        block.classList.add('horizontal-layout');
        break;
      }
      case 'sessiontimeline': {
        decorateSessionTimeline(rowEl);
        (isVerticalLayout ? leftColumnEl : leftColumnEl).appendChild(rowEl);
        break;
      }
      case 'speakers': {
        console.log('decorate speakers>>');
        decorateSpeaker(rowEl);
        (isVerticalLayout ? leftColumnEl : leftColumnEl).appendChild(rowEl);
        break;
      }
      case 'details': {
        decorateEventDetails(rowEl);
        (isVerticalLayout ? leftColumnEl : rightColumnEl).appendChild(rowEl);
        break;
      }
      case 'registerform': {
        decorateRegisterForm(rowEl);
        (isVerticalLayout ? leftColumnEl : rightColumnEl).appendChild(rowEl);
        break;
      }
      case 'sciextext': {
        decorateSciexText(rowEl);
        leftColumnEl.appendChild(rowEl);
        break;
      }
      default: {
        leftColumnEl.appendChild(rowEl);
        break;
      }
    }
  });
  block.innerHTML = '';

  if (isVerticalLayout) {
    block.appendChild(leftColumnEl);
  } else {
    block.append(leftColumnEl, rightColumnEl);
  }
}
