import {} from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function smoothScrollTo(element) {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const header = document.querySelector('.tabs-nav.tab-buttons');
  const headerHeight = header ? header.offsetHeight : 0;
  const additionalOffset = isMobile ? 200 : 0;
  const offset = headerHeight + additionalOffset;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
}

function showTabContent(tabId) {
  const section = document.getElementById(`${tabId}-content`);
  if (section) {
    smoothScrollTo(section, 80, 1000);
  }
}
function showActiveTab(tabId) {
  const tab = document.getElementById(`${tabId}`);
  const tabContent = document.getElementById(`${tabId}-content`);
  const tabs = document.querySelectorAll('.tab-section');
  const tabContents = document.querySelectorAll('.tabs-container-wrapper');
  tabs.forEach((t) => t.classList.remove('active'));
  tabContents.forEach((content) => content.classList.remove('active'));
  tab.classList.add('active');
  tabContent.classList.add('active');
}
function toggleVisibility() {
  const tabsNav = document.querySelector('.tabs-nav .tab-buttons');
  if (window.matchMedia('(max-width: 768px)').matches) {
    tabsNav.classList.add('tw-hidden');
  } else {
    tabsNav.classList.remove('tw-hidden');
  }
}
function onload() {
  const tabs = document.querySelectorAll('.tab-section');
  const tabContents = document.querySelectorAll('.tabs-container-wrapper');
  if (tabs.length > 0) {
    tabs[0].classList.add('active');
  }
  if (tabContents.length > 0) {
    tabContents[0].classList.add('active');
  }
  toggleVisibility();
}
function handleMobileTabs() {
  const mobileIcon = document.querySelector('#display-icon');
  const tabsNav = document.querySelector('.tabs-nav .tab-buttons');
  const tabsNavWrapper = document.querySelector('.tabs-nav-wrapper');

  if (tabsNavWrapper.classList.contains('mobile-tabs-section')) {
    tabsNavWrapper.classList.remove('mobile-tabs-section');
    tabsNav.classList.add('tw-hidden');
    mobileIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L8 10L12 6" stroke="#141414" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  } else {
    tabsNavWrapper.classList.add('mobile-tabs-section');
    tabsNav.classList.remove('tw-hidden');
    mobileIcon.innerHTML = '<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 13.5L3.0001 3.5001" stroke="#141414"/><path d="M13 3.5L3.0001 13.4999" stroke="#141414"/></svg>';
  }
}

function hideIfEmpty(selector, buttonSelector) {
  const container = document.querySelector(selector);
  const button = document.querySelector(buttonSelector);
  if (null == container) {
    if (button) {
      button.style.display = 'none';
    }
  } else {
    container.style.display = '';
    button.style.display = '';
  }
}

export default async function decorate(block) {
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('tw', 'tabs-nav', 'tab-buttons', 'tw-bg-white');
  const tabData = document.createElement('div');
  tabData.classList.add('tab-data');
  [...block.children].forEach((row) => {
    const tabDIv = document.createElement('div');
    tabDIv.id = row.children[1].textContent;
    tabDIv.classList.add('tab-section');
    tabDIv.textContent = row.children[0].textContent;
    moveInstrumentation(row, tabDIv);
    blockDiv.append(tabDIv);
    tabDIv.addEventListener('click', function () {
      showTabContent(this.id);
      showActiveTab(this.id);
      if (window.matchMedia('(max-width: 768px)').matches) {
        handleMobileTabs();
      }
    });
  });
  block.textContent = '';
  block.classList.add('tw');
  const buttons = document.createElement('div');
  buttons.classList.add('tabs-right');

  const featurebutton = document.createElement('div');
  featurebutton.classList.add('feature-products-button');
  featurebutton.textContent = 'Featured products';
  buttons.append(featurebutton);
  featurebutton.addEventListener('click', () => {
    const section = document.getElementsByClassName('featured-products-wrapper');
    if (section[0]) {
      smoothScrollTo(section[0], 80, 1000);
      if (window.matchMedia('(max-width: 768px)').matches) {
        handleMobileTabs();
      }
    }
  });

  const relatedresources = document.createElement('div');
  relatedresources.classList.add('related-resource-button');
  relatedresources.textContent = 'Related resources';
  buttons.append(relatedresources);
  relatedresources.addEventListener('click', () => {
    const section = document.getElementsByClassName('sciex-related-resource-wrapper');
    if (section[0]) {
      smoothScrollTo(section[0], 80, 1000);
      if (window.matchMedia('(max-width: 768px)').matches) {
        handleMobileTabs();
      }
    }
  });

  const mobileTabsNav = document.createElement('div');
  mobileTabsNav.id = 'mobile-tabs-nav';
  mobileTabsNav.classList.add(
    'tw-hidden',
    'tw-flex',
    'tw-justify-between',
    'tw-border-b-2',
    'tw-border-gray-500',
    'tw-bg-white',
  );
  const mobileTabsNavText = document.createElement('span');
  mobileTabsNavText.textContent = 'Jump To';
  const mobileTabsNavIcon = document.createElement('span');
  mobileTabsNavIcon.id = 'display-icon';
  mobileTabsNavIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L8 10L12 6" stroke="#141414" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  mobileTabsNav.append(mobileTabsNavText);
  mobileTabsNav.append(mobileTabsNavIcon);
  mobileTabsNav.addEventListener('click', handleMobileTabs);

  blockDiv.append(buttons);
  block.append(mobileTabsNav);
  block.append(blockDiv);
  block.append(tabData);

  window.addEventListener('resize', toggleVisibility);
  onload();

  hideIfEmpty('.featured-products', '.feature-products-button');
  hideIfEmpty('.sciex-related-resource', '.related-resource-button');
}
