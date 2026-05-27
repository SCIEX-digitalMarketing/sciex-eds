import { span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/aem.js';

/**
 * Decorates a block to render one or two CTA buttons with optional label,
 *
 * @param {HTMLElement} block - The source container to decorate.
 */
export default async function decorate(block) {
  const buttonWrapperEl = document.createElement('div');
  buttonWrapperEl.classList.add('button-wrapper');

  // Gather paragraphs from the expected nested structure
  const paragraphNodes = [...block.querySelectorAll('div > div > p')];
  const [
    ,
    labelEl,
    primaryTextPara,,
    primaryTargetPara,
    secondaryTextPara,,
    secondaryTargetPara,
  ] = paragraphNodes;

  const primaryButtonText = primaryTextPara?.textContent.trim() || 'Download PDF';
  const secondaryButtonText = secondaryTextPara?.textContent.trim();
  const primaryTarget = primaryTargetPara?.textContent.trim() || '_blank';
  const secondaryTarget = secondaryTargetPara?.textContent.trim() || '_blank';

  // Collect all anchors inside the block (primary is anchors[0], secondary is anchors[1])
  const anchorEls = [...block.querySelectorAll('a')];

  // Clear existing block content; we’ll rebuild with our wrapper
  block.textContent = '';

  /**
   * Helper to construct a <button> wrapped in an <a> with icon and click behavior.
   *
   * @param {string} buttonText    - Visible text on the button.
   * @param {string} href          - Destination URL for the anchor/button.
   * @param {string} title         - Title attribute for the anchor.
   * @param {string} target        - Target attribute (e.g., '_blank').
   * @param {string} iconName      - Icon suffix (e.g., 'arrow', 'white-arrow').
   * @param {string} buttonClass   - CSS class for button styling.
   * @returns {HTMLAnchorElement}  - The constructed anchor wrapping the button.
   */
  const createButtonAnchor = (buttonText, href, title, target, iconName, buttonClass) => {
    const buttonEl = document.createElement('button');
    buttonEl.classList.add(buttonClass);
    buttonEl.appendChild(document.createTextNode(buttonText));
    buttonEl.appendChild(span({ class: `icon icon-${iconName}` }));
    const anchorEl = document.createElement('a');
    anchorEl.href = href;
    anchorEl.title = title;
    anchorEl.target = target;
    anchorEl.rel = 'noopener noreferrer';
    anchorEl.classList.add('button-link');
    anchorEl.appendChild(buttonEl);

    buttonEl.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(href, target);
    });

    decorateIcons(anchorEl);

    return anchorEl;
  };

  if (anchorEls.length >= 1) {
    // Optional label above the buttons
    if (labelEl) {
      labelEl.classList.add('button-label');
      buttonWrapperEl.appendChild(labelEl);
    }

    const buttonsContainerEl = document.createElement('div');
    buttonsContainerEl.classList.add('button-container');

    // Primary button: required if we have at least one anchor
    const primaryButtonAnchorEl = createButtonAnchor(
      primaryButtonText,
      anchorEls[0].href,
      anchorEls[0].title,
      primaryTarget,
      'arrow',
      'custom-button',
    );
    buttonsContainerEl.appendChild(primaryButtonAnchorEl);

    // Secondary button: only render if we have a second anchor and non-empty text
    if (secondaryButtonText && secondaryButtonText.trim().length > 0 && anchorEls[1]) {
      const secondaryButtonAnchorEl = createButtonAnchor(
        secondaryButtonText.trim(),
        anchorEls[1].href,
        anchorEls[1].title,
        secondaryTarget,
        'white-arrow',
        'secondary-custom-button',
      );
      buttonsContainerEl.appendChild(secondaryButtonAnchorEl);
    }

    buttonWrapperEl.appendChild(buttonsContainerEl);
  }

  block.append(buttonWrapperEl);
}
