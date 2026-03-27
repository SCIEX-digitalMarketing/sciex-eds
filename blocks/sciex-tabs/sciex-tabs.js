import { div, button } from '../../scripts/dom-builder.js';

function getContainerId(block) {
  const firstChild = block.firstElementChild;

  if (!firstChild) return null;

  const containerId = firstChild.textContent.trim();
  firstChild.remove();

  return containerId || null;
}

function toggleTabs(tabId, mmgTabs, tabs) {
  const contentSections = document.querySelectorAll('[data-tabname]');

  contentSections.forEach((section) => {
    if (section.dataset.tabname === tabId) {
      section.classList.remove('hide-section');
    } else if (tabs.includes(section.dataset.tabname)) {
      section.classList.add('hide-section');
    }
  });

  const allTabs = mmgTabs.querySelectorAll('.tab');
  allTabs.forEach((tab) => {
    if (tab.id === tabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  const dropdown = document.querySelector('.sciex-tabs-dropdown');
  if (dropdown) {
    dropdown.querySelector('.dropdown-selected span').textContent = tabId;
    dropdown.querySelectorAll('.dropdown-item').forEach((item) => {
      if (item.dataset.value === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

function getTabName(block) {
  const tabName = new Set();
  const parentEl = block.parentElement.parentElement;
  let sectionEl = parentEl.nextElementSibling;

  while (sectionEl) {
    if (!sectionEl.dataset.tabname) break;
    tabName.add(sectionEl.dataset.tabname);
    sectionEl = sectionEl.nextElementSibling;
  }

  return [...tabName];
}

function buildDesktopTabs(block, tabs, containerId) {
  const mmgTabs = div({
    class: 'custom-sciex-tabs',
    ...(containerId ? { id: `${containerId}-tabs` } : {}),
  });

  tabs.forEach((tab) => {
    const buttonTab = button({ class: 'tab', id: tab }, tab);

    mmgTabs.appendChild(buttonTab);

    buttonTab.addEventListener('click', () => {
      toggleTabs(tab, mmgTabs, tabs);
    });
  });

  block.appendChild(mmgTabs);
  return mmgTabs;
}

function buildMobileDropdown(tabs, containerId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'sciex-tabs-dropdown';

  if (containerId) wrapper.id = `${containerId}-dropdown`;

  wrapper.innerHTML = `
    <div class="dropdown-selected">
      <span>${tabs[0]}</span>
    </div>
    <div class="dropdown-list">
      ${tabs
    .map(
      (tab) => `<div class="dropdown-item" data-value="${tab}">${tab}</div>`,
    )
    .join('')}
    </div>
  `;

  document.querySelector('.sciex-tabs-wrapper')?.prepend(wrapper);

  const selected = wrapper.querySelector('.dropdown-selected');

  selected.addEventListener('click', () => {
    wrapper.classList.toggle('open');
  });

  wrapper.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener('click', () => {
      const { value } = item.dataset;

      wrapper.classList.remove('open');
      selected.querySelector('span').textContent = value;

      const desktopTabs = document.querySelector('.custom-sciex-tabs');
      toggleTabs(value, desktopTabs, tabs);
    });
  });
}

function decorateButtonTabs(block) {
  const containerId = getContainerId(block);

  const tabs = getTabName(block);

  block.innerHTML = '';

  const desktopTabs = buildDesktopTabs(block, tabs, containerId);
  buildMobileDropdown(tabs, containerId);

  toggleTabs(tabs[0], desktopTabs, tabs);
  block.id = `${containerId}-content`;
  block.parentElement.classList.add('tabs-container-wrapper');
}

export default function decorate(block) {
  decorateButtonTabs(block);
}
