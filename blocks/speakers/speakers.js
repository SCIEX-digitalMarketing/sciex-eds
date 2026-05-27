import { } from '../../scripts/aem.js';
import { } from '../../scripts/scripts.js';
import decorateSpeaker from '../speaker-details/speaker-details.js';

export default async function decorate(block) {
  let headingText = '';
  const parentDiv = document.createElement('div');

  const rows = Array.from(block.children);

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];

    if (index === 0) {
      block.id = `${row.textContent.trim()}-content`;
      block.parentElement?.classList.add('tabs-container-wrapper');
    } else if (index === 1) {
      headingText = row.textContent.trim();
    } else {
      decorateSpeaker(row);
      parentDiv.appendChild(row);
    }
  }

  const headingEl = document.createElement('h2');
  headingEl.textContent = headingText;
  headingEl.className = 'heading';

  block.textContent = '';
  block.append(headingEl);
  block.append(parentDiv);
}
