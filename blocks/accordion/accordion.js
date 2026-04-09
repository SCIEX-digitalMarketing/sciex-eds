import { moveInstrumentation } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/aem.js';
import { span } from '../../scripts/dom-builder.js';

/**
 * Initializes and decorates an accordion block.
 * Expects the `block` DOM structure to contain:
 * - Row 0: Accordion ID
 * - Row 1: Heading
 * - Row 2: Description
 * - Row 3+: Each accordion item with:
 *   - Col 0: Item title
 *   - Col 1: Item description
 *   - Col 2: Link label
 *   - Col 3: Link anchor
 *   - Col 4: Target (<p>) [optional, defaults to '_self']
 */
export default function decorate(block) {
  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'accordion-container-block';

  // Move instrumentation markers/metadata from the original block into the new container
  moveInstrumentation(block, accordionContainer);

  const rows = [...block.children];
  if (rows.length < 3) return; // Must have at least ID, heading, description

  // Extract header information from the first three rows
  const accordionId = rows[0]?.querySelector('p')?.textContent?.trim() || '';
  const headingText = rows[1]?.querySelector('p')?.textContent?.trim() || '';
  const descriptionText = rows[2]?.querySelector('p')?.textContent?.trim() || '';

  accordionContainer.id = accordionId;

  // Build heading element
  const headingEl = document.createElement('h2');
  headingEl.className = 'accordion-heading';
  headingEl.textContent = headingText;

  // Build description element
  const descEl = document.createElement('p');
  descEl.className = 'accordion-description';
  descEl.textContent = descriptionText;

  // Append heading and description to container
  accordionContainer.append(headingEl, descEl);

  const itemRows = rows.slice(3);

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return; // Require at least title & description

    // Extract content from expected columns
    const itemTitle = cells[0]?.querySelector('p')?.textContent?.trim() || '';
    const itemDescription = cells[1]?.querySelector('p')?.textContent?.trim() || '';
    const linkLabel = cells[2]?.querySelector('p')?.textContent?.trim() || '';
    const linkAnchor = cells[3]?.querySelector('a');
    const linkTarget = cells[4]?.querySelector('p')?.textContent?.trim() || '_self';

    const itemEl = document.createElement('div');
    itemEl.className = 'accordion-item';
    moveInstrumentation(row, itemEl);

    // Toggle button (controls expand/collapse)
    const toggleButton = document.createElement('button');
    toggleButton.className = 'accordion-toggle';
    toggleButton.setAttribute('aria-expanded', 'false'); // initial collapsed state

    // Title inside the button
    const titleSpan = document.createElement('span');
    titleSpan.className = 'accordion-title';
    titleSpan.textContent = itemTitle;

    // Down arrow icon (will toggle to up arrow when expanded)
    const chevronIcon = span({ class: 'icon icon-accordion-down' });

    // Button visual content
    toggleButton.append(titleSpan, chevronIcon);

    // Expandable content container
    const contentEl = document.createElement('div');
    contentEl.className = 'accordion-content';
    contentEl.hidden = true; // collapsed by default

    // Description paragraph inside content
    const descriptionPara = document.createElement('p');
    descriptionPara.textContent = itemDescription;
    contentEl.append(descriptionPara);

    // Optional link inside content
    if (linkAnchor) {
      const linkEl = document.createElement('a');
      linkEl.href = linkAnchor.getAttribute('href');
      linkEl.target = linkTarget;
      linkEl.textContent = linkLabel;
      linkEl.className = 'accordion-link';

      // Append right arrow icon to link
      const arrowIcon = span({ class: 'icon icon-right-arrow' });
      linkEl.append(arrowIcon);

      contentEl.append(linkEl);
    }

    // Toggle expand/collapse behavior
    toggleButton.addEventListener('click', () => {
      const currentlyExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !currentlyExpanded;

      // Update accessibility attributes & UI state
      toggleButton.setAttribute('aria-expanded', String(nextExpanded));
      contentEl.hidden = !nextExpanded;
      itemEl.classList.toggle('open', nextExpanded);

      // Switch icon class for visual feedback
      chevronIcon.className = nextExpanded
        ? 'icon icon-accordion-up'
        : 'icon icon-accordion-down';
    });

    // Compose item and add to container
    itemEl.append(toggleButton, contentEl);
    accordionContainer.append(itemEl);
  });

  // Ensure icons are decorated (e.g., SVG spriting or replacement)
  decorateIcons(accordionContainer);

  // Replace original block with the new accordion structure
  block.textContent = '';
  block.id = `${accordionId}-content`;
  block.append(accordionContainer);
}
