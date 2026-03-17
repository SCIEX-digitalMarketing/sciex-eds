import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const switchTabContainer = document.createElement('div');
  switchTabContainer.className = 'switch-tabs-container-block';
  moveInstrumentation(block, switchTabContainer);

  const rows = [...block.children];
  let id = '';
  let headingText = '';
  let descriptionText = '';

  // Extract meta info
  rows.forEach((row, index) => {
    const text = row.textContent.trim();
    if (index === 0) id = text;
    else if (index === 1) headingText = text;
    else if (index === 2) descriptionText = text;
  });

  // Heading and description
  const headingEl = document.createElement('h2');
  headingEl.className = 'switch-tabs-heading';
  headingEl.textContent = headingText;

  let descEl = '';
  if (descriptionText && descriptionText.trim() !== '') {
    descEl = document.createElement('h4');
    descEl.className = 'switch-tabs-description';
    descEl.textContent = descriptionText.trim();
  }

  switchTabContainer.append(headingEl, descEl);

  const tabHeader = document.createElement('div');
  tabHeader.className = 'tab-header';

  // Custom dropdown for mobile
  const dropdownWrapper = document.createElement('div');
  dropdownWrapper.className = 'custom-dropdown';

  const dropdownSelected = document.createElement('div');
  dropdownSelected.className = 'dropdown-selected';
  dropdownSelected.textContent = '';

  const dropdownList = document.createElement('ul');
  dropdownList.className = 'dropdown-list';

  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';

  // --- Build tabs ---
  rows.slice(3).forEach((row, index) => {
    const tabRows = [...row.children];
    if (!tabRows.length) return;

    const tabName = tabRows[0]?.textContent.trim() || '';
    const tabPicture = tabRows[1]?.querySelector('picture');
    const pictureDescription = tabRows[2]?.textContent.trim() || '';
    const altText = tabRows[3]?.textContent.trim() || '';
    const tabHeading = tabRows[4]?.textContent.trim() || '';
    const tabDescription = tabRows[5]?.innerHTML || '';
    const tabLinkLabel = tabRows[6]?.textContent.trim() || '';
    const tabLinkAnchor = tabRows[7]?.querySelector('a');
    const tabTarget = tabRows[8]?.textContent.trim() || '_self';

    // --- Header Button (Desktop) ---
    const tabButton = document.createElement('button');
    tabButton.className = 'tab-title';
    tabButton.textContent = tabName;
    if (index === 0) tabButton.classList.add('active');
    tabHeader.append(tabButton);

    // --- Dropdown Item (Mobile) ---
    const dropdownItem = document.createElement('li');
    dropdownItem.className = 'dropdown-item';
    dropdownItem.textContent = tabName;
    dropdownItem.dataset.index = index;
    if (index === 0) dropdownItem.classList.add('active');
    dropdownList.append(dropdownItem);

    // --- Content Panel ---
    const tabPanel = document.createElement('div');
    tabPanel.className = 'tab-panel';
    if (index === 0) tabPanel.classList.add('active');
    moveInstrumentation(row, tabPanel);

    const tabBody = document.createElement('div');
    tabBody.className = 'tab-body';

    if (tabHeading) {
      const h2 = document.createElement('h2');
      h2.textContent = tabHeading;
      tabBody.append(h2);
    }

    if (tabDescription) {
      const descWrap = document.createElement('div');
      descWrap.className = 'tab-description';
      descWrap.innerHTML = tabDescription;
      tabBody.append(descWrap);
    }

    const chevronRight = span({
      class:
        'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2',
    });

    if (tabLinkAnchor) {
      const a = document.createElement('a');
      a.href = tabLinkAnchor.href;
      a.target = tabTarget;
      a.textContent = tabLinkLabel || '';
      a.className = 'tab-link';
      a.append(chevronRight);
      tabBody.append(a);
    }

    tabPanel.append(tabBody);

    if (tabPicture) {
      const img = tabPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          altText || img.alt,
          false,
          [{ width: '750' }],
        );
        optimizedPic.setAttribute('data-description', pictureDescription);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        tabPanel.append(optimizedPic);
      }
    }

    decorateIcons(tabPanel);
    tabContent.append(tabPanel);
  });

  // --- Switching logic ---
  const tabButtons = tabHeader.querySelectorAll('.tab-title');
  const tabPanels = tabContent.querySelectorAll('.tab-panel');
  const dropdownItems = dropdownList.querySelectorAll('.dropdown-item');

  const activateTab = (index) => {
    tabButtons.forEach((b) => b.classList.remove('active'));
    tabPanels.forEach((p) => p.classList.remove('active'));
    dropdownItems.forEach((i) => i.classList.remove('active'));

    if (tabButtons[index]) tabButtons[index].classList.add('active');
    if (tabPanels[index]) tabPanels[index].classList.add('active');
    if (dropdownItems[index]) dropdownItems[index].classList.add('active');

    dropdownSelected.textContent = dropdownItems[index].textContent;
    dropdownWrapper.classList.remove('open');
  };

  // Desktop tab click
  tabButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => activateTab(idx));
  });

  // Mobile dropdown interactions
  dropdownSelected.addEventListener('click', () => {
    dropdownWrapper.classList.toggle('open');
  });

  dropdownItems.forEach((item, idx) => {
    item.addEventListener('click', () => activateTab(idx));
  });

  // Set initial dropdown label
  if (dropdownItems[0]) dropdownSelected.textContent = dropdownItems[0].textContent;

  dropdownWrapper.append(dropdownSelected, dropdownList);

  switchTabContainer.append(tabHeader, dropdownWrapper, tabContent);

  // Replace original block content
  block.textContent = '';
  block.id = `${id}-content`;
  block.parentElement.classList.add('switch-tabs-container-wrapper');
  block.append(switchTabContainer);
}
