/* eslint-disable */
import { i18n } from '../translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

/* =========================
   🔑 PERSISTED STATE
========================= */
const facetSearchState = {};
const facetVisibleCountState = {};

/* =========================
   CREATE TOGGLE BUTTONS
========================= */
function createToggleButtons({
  container,
  totalCount,
  visibleCount,
  onShowMore,
  onShowLess
}) {
  container.querySelectorAll('.facet-toggle-buttons').forEach(b => b.remove());

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('facet-toggle-buttons');

  const showMoreBtn = document.createElement('button');
  showMoreBtn.classList.add('show-more-btn');
  showMoreBtn.textContent = strings.showMore;
  showMoreBtn.innerHTML += `
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M0 6L12 6" stroke="#0068FA"/>
        <path d="M6 0L6 12" stroke="#0068FA"/>
      </svg>
    </span>
  `;
  showMoreBtn.onclick = onShowMore;
  showMoreBtn.style.display = visibleCount < totalCount ? 'flex' : 'none';

  const showLessBtn = document.createElement('button');
  showLessBtn.classList.add('show-less-btn');
  showLessBtn.textContent = strings.showLess;
  showLessBtn.innerHTML += `
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M0 6L12 6" stroke="#0068FA"/>
      </svg>
    </span>
  `;
  showLessBtn.onclick = onShowLess;
  showLessBtn.style.display = visibleCount > 5 ? 'flex' : 'none';

  buttonContainer.append(showMoreBtn, showLessBtn);
  container.appendChild(buttonContainer);
}

/* =========================
   MAIN RENDER
========================= */
export function renderCommonFacet(
  data,
  toggleAssetType,
  toggleTag
) {
  let facetsContainer = document.querySelector('#facets');

  if (!facetsContainer) {
    facetsContainer = document.createElement('div');
    facetsContainer.id = 'facets';
    document.body.appendChild(facetsContainer);
  }

  facetsContainer.innerHTML = '';
  const facetId=document.getElementById('facets')
  const querySortSection = document.getElementById('query-sort-section');

  if (!data || data.length === 0) {
    if (facetId) {
      facetId.style.display = 'none';
    }
    querySortSection.classList.add("removeFilter");
    return;
  }
  const openIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 11L8 5L14 11" stroke="#0068FA"/>
    </svg>
  `;

  const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14 5L8 11L2 5" stroke="#0068FA"/>
    </svg>
  `;

  function createFacet(title, itemsContainer) {
    const block = document.createElement('div');
    block.className = 'facet-block';

    const header = document.createElement('div');
    header.className = 'facet-header tw-flex tw-justify-between tw-items-center';
    header.style.cursor = 'pointer';

    const text = document.createElement('span');
    text.textContent = title;

    const icon = document.createElement('span');
    icon.innerHTML = openIcon;

    header.append(text, icon);

    header.onclick = () => {
      const open = itemsContainer.style.display !== 'none';
      itemsContainer.style.display = open ? 'none' : 'flex';
      icon.innerHTML = open ? closeIcon : openIcon;
    };

    block.append(header, itemsContainer);
    return block;
  }

  /* =========================
     🔑 ALLOWED ASSET LOGIC (ADDED)
  ========================= */

  const selectedTags = [];

  data.forEach(asset => {
    asset.tags?.forEach(group => {
      group.value?.forEach(tag => {
        if (tag.state === 'selected') {
          selectedTags.push({
            groupKey: group.key,
            key: tag.key
          });
        }
      });
    });
  });

  const allowedAssets =
    selectedTags.length === 0
      ? data
      : data.filter(asset =>
        selectedTags.every(sel =>
          asset.tags?.some(group =>
            group.key === sel.groupKey &&
            group.value?.some(v => v.key === sel.key)
          )
        )
      );

  /* =========================
     ASSET TYPE FACET
  ========================= */
  const assetItems = document.createElement('div');
  assetItems.style.display = 'flex';
  assetItems.style.flexDirection = 'column';
  assetItems.style.gap = '14px';

  const hasAssetClear = allowedAssets.some(a => a.state === 'selected');

  if (hasAssetClear) {
    const clearButtonContainer = document.createElement('div');
    clearButtonContainer.className = 'clear-filter-btn';

    const clearButton = document.createElement('button');
    clearButton.style.marginLeft = '0';
    clearButton.style.marginRight = '10px';
    clearButton.textContent = 'Clear Filter';

    const clearIcon = document.createElement('span');
    clearIcon.innerHTML = '&#10005;';
    clearIcon.style.cursor = 'pointer';

    clearButton.onclick = clearIcon.onclick = () => {
      data.forEach(asset => {
        if (asset.state === 'selected') {
          toggleAssetType(asset);
        }
        asset.tags?.forEach(group =>
          group.value?.forEach(tag => (tag.state = 'idle'))
        );
      });

      Object.keys(facetSearchState).forEach(k => (facetSearchState[k] = ''));
      Object.keys(facetVisibleCountState).forEach(k => (facetVisibleCountState[k] = 5));
    };

    clearButtonContainer.append(clearButton, clearIcon);
    assetItems.appendChild(clearButtonContainer);
  }

  /* 🔑 ONLY CHANGE: data → allowedAssets */
  allowedAssets.forEach(asset => {
    const label = document.createElement('label');
    label.className = 'facet-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = asset.state === 'selected';
    input.onchange = () => toggleAssetType(asset);
    const text = document.createElement('span');
    text.textContent = asset.assetType;
    label.append(input, text);
    assetItems.appendChild(label);
  });

  facetsContainer.appendChild(createFacet('Type', assetItems));

  /* =========================
     TAG FACETS (UNCHANGED LOGIC)
  ========================= */
  const selectedAssets = data.filter(a => a.state === 'selected');
  if (!selectedAssets.length) return;

  const tagGroupMap = {};
  selectedAssets.forEach(asset => {
    asset.tags?.forEach(group => {
      tagGroupMap[group.key] ??= {};
      group.value?.forEach(item => {
        tagGroupMap[group.key][item.key] ??= [];
        tagGroupMap[group.key][item.key].push(item);
      });
    });
  });

  const selectedCount = selectedAssets.length;

  Object.entries(tagGroupMap).forEach(([groupKey, items]) => {
    const commonItems = Object.entries(items).filter(
      ([, list]) => list.length === selectedCount
    );
    if (!commonItems.length) return;

    const tagItemsContainer = document.createElement('div');
    tagItemsContainer.style.display = 'flex';
    tagItemsContainer.style.flexDirection = 'column';
    tagItemsContainer.style.gap = '14px';

    let visibleCount = facetVisibleCountState[groupKey] || 5;
    let searchTerm = facetSearchState[groupKey] || '';

    /* 🔍 SEARCH BOX ADDED */
if (commonItems.length > 10) {

  const facetId = `facet-${groupKey}`;

  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add(
    'facet-search-box',
    'tw-border',
    'tw-p-2',
    'tw-rounded-lg',
    'tw-mt-2',
    'tw-flex',
    'tw-items-center',
    'tw-gap-2'
  );

  // Search Icon
  const searchIcon = document.createElement('img');
  searchIcon.src = '/icons/search-input.svg';
  searchIcon.alt = 'Search';
  searchIcon.style.width = '16px';
  searchIcon.style.height = '16px';

  // Input
  const facetInput = document.createElement('input');
  facetInput.type = 'text';
  facetInput.id = `${facetId}-input`;
  facetInput.maxLength = 200;
  facetInput.placeholder = 'Search';
  facetInput.value = searchTerm;

  facetInput.style.border = 'none';
  facetInput.style.outline = 'none';

  facetInput.addEventListener('input', (event) => {
    searchTerm = event.target.value.toLowerCase();
    facetSearchState[groupKey] = searchTerm;
    facetVisibleCountState[groupKey] = visibleCount;
    renderTags();
  });

  searchWrapper.appendChild(searchIcon);
  searchWrapper.appendChild(facetInput);
  tagItemsContainer.appendChild(searchWrapper);
}


    const hasClearBtn = selectedAssets.some(asset =>
      asset.tags?.some(
        g => g.key === groupKey && g.value?.some(v => v.state === 'selected')
      )
    );

    if (hasClearBtn) {
      const clearButtonContainer = document.createElement('div');
      clearButtonContainer.className = 'clear-filter-btn';

      const clearButton = document.createElement('button');
      clearButton.style.marginLeft = '0';
      clearButton.style.marginRight = '10px';
      clearButton.textContent = 'Clear Filter';

      const clearIcon = document.createElement('span');
      clearIcon.innerHTML = '&#10005;';
      clearIcon.style.cursor = 'pointer';

      clearButton.onclick = clearIcon.onclick = () => {
        selectedAssets.forEach(asset => {
          const group = asset.tags?.find(g => g.key === groupKey);
          group?.value?.forEach(tag => {
            if (tag.state === 'selected') toggleTag(tag);
          });
        });
        facetSearchState[groupKey] = '';
        facetVisibleCountState[groupKey] = 5;
      };

      clearButtonContainer.append(clearButton, clearIcon);
      tagItemsContainer.appendChild(clearButtonContainer);
    }

    function renderTags() {
      tagItemsContainer.querySelectorAll('.facet-item').forEach(e => e.remove());

      const filtered = commonItems.filter(([k]) =>
        k.toLowerCase().includes(searchTerm)
      );

      filtered.slice(0, visibleCount).forEach(([key, refs]) => {
        const ref = refs[0];
        const label = document.createElement('label');
        label.className = 'facet-item';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = ref.state === 'selected';
        input.onchange = () => {
          selectedAssets.forEach(asset => {
            const g = asset.tags?.find(gr => gr.key === groupKey);
            const t = g?.value?.find(v => v.key === key);
            if (t) toggleTag(t);
          });
        };

        const text = document.createElement('span');
        text.textContent = key;
        label.append(input, text);
        tagItemsContainer.appendChild(label);
      });

      createToggleButtons({
        container: tagItemsContainer,
        totalCount: filtered.length,
        visibleCount,
        onShowMore: () => {
          visibleCount += 5;
          facetVisibleCountState[groupKey] = visibleCount;
          renderTags();
        },
        onShowLess: () => {
          visibleCount = Math.max(5, visibleCount - 5);
          facetVisibleCountState[groupKey] = visibleCount;
          renderTags();
        }
      });
    }

    renderTags();
    facetsContainer.appendChild(createFacet(groupKey, tagItemsContainer));
  });
}
