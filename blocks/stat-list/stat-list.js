import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const statListContainer = document.createElement('div');
  statListContainer.className = 'stat-list-container-text';

  const rows = block.querySelectorAll(':scope > div');

  const containerId = rows[0]?.textContent.trim();
  if (containerId) statListContainer.id = `${containerId}-content`;

  const headingDiv = rows[1];
  const heading = headingDiv ? headingDiv.textContent.trim() : '';
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    statListContainer.append(h2);
  }

  const benefitsWrapper = document.createElement('div');
  benefitsWrapper.className = 'benefits-wrapper';

  rows.forEach((row, index) => {
    if (index < 2) return; // skip first two (id + heading)

    const cols = row.querySelectorAll(':scope > div');
    if (cols.length < 2) return;

    const title = cols[0].textContent.trim();
    const description = cols[1].textContent.trim();

    // Build each benefit card
    const card = document.createElement('div');
    card.className = 'benefit-card';

    const h3 = document.createElement('h3');
    h3.textContent = title;

    const p = document.createElement('p');
    p.textContent = description;

    moveInstrumentation(row, card);

    card.append(h3, p);
    benefitsWrapper.append(card);
  });

  statListContainer.append(benefitsWrapper);
  // Clear existing content inside the block
  block.textContent = '';
  block.append(statListContainer);
}
