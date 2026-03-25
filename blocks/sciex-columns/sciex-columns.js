import { decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  let id = '';
  let heading = '';
  let columns = 3;

  rows.forEach((row, index) => {
    const text = row.textContent.trim();

    if (index === 0) id = text;
    else if (index === 1) heading = text;
    else if (index === 2) columns = parseInt(text, 10) || 3;
  });

  const container = document.createElement('div');
  container.className = 'sciex-columns-block';

  container.classList.add('text-black-background');
  if (id) container.id = `${id}-content`;

  moveInstrumentation(block, container);

  /* Heading */
  if (heading) {
    const headingEl = document.createElement('h2');
    headingEl.className = 'sciex-columns-heading';
    headingEl.textContent = heading;
    container.append(headingEl);
  }

  /* Grid */
  const grid = document.createElement('div');
  grid.className = `sciex-columns-grid columns-${columns}`;
  container.append(grid);

  /* Cards */
  rows.slice(3).forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const quoteHTML = cells[0]?.innerHTML?.trim() || '';
    const imageHTML = cells[1]?.innerHTML?.trim() || '';
    const authorName = cells[2]?.textContent?.trim() || '';
    const authorDetailsHTML = cells[3]?.innerHTML?.trim() || '';

    const card = document.createElement('div');
    card.className = 'sciex-columns-card';

    moveInstrumentation(row, card);

    /* Quote */
    if (quoteHTML) {
      const quote = document.createElement('p');
      quote.className = 'sciex-columns-quote';
      quote.innerHTML = quoteHTML;
      card.append(quote);
    }

    /* Author Section */
    const authorSection = document.createElement('div');
    authorSection.className = 'sciex-columns-author';

    /* Author Image */
    if (imageHTML) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'sciex-columns-author-image';
      imageWrap.innerHTML = imageHTML;
      authorSection.append(imageWrap);
    }

    const authorContent = document.createElement('div');
    authorContent.className = 'sciex-columns-author-content';

    /* Author Name */
    if (authorName) {
      const name = document.createElement('p');
      name.className = 'sciex-columns-author-name';
      name.textContent = authorName;
      authorContent.append(name);
    }

    /* Author Details */
    if (authorDetailsHTML) {
      const details = document.createElement('div');
      details.className = 'sciex-columns-author-details';
      details.innerHTML = authorDetailsHTML;
      authorContent.append(details);
    }

    authorSection.append(authorContent);

    card.append(authorSection);

    grid.append(card);
  });

  decorateIcons(container);

  block.innerHTML = '';
  block.append(container);

  if (id) block.id = `${id}-content`;
}