import { i18n } from '../translation.js';

const lang = document.documentElement.lang || 'en';
const strings = i18n[lang] || i18n.en;

const isMobile = () => window.innerWidth <= 767;

/* ======================================================
   HELPERS
====================================================== */

function resetAllSelections(data) {
  data.forEach((asset) => {
    asset.state = 'idle';

    asset.tags?.forEach((group) => {
      group.value?.forEach((tag) => {
        tag.state = 'idle';
      });
    });
  });
}

function hasAnySelection(data) {
  return (
    data.some((a) => a.state === 'selected')
    || data.some((a) => a.tags?.some((g) => g.value?.some((t) => t.state === 'selected')))
  );
}

function createBreadcrumbItem(label, onClear) {
  const container = document.createElement('div');
  container.className = 'facet-breadcrumb';

  container.addEventListener('click', onClear);

  const text = document.createElement('div');
  text.className = 'grid-item';
  text.textContent = label;

  const iconWrap = document.createElement('div');
  iconWrap.className = 'grid-item';

  const icon = document.createElement('span');
  icon.innerHTML = '&#10005;';
  icon.style.cursor = 'pointer';

  iconWrap.appendChild(icon);
  container.append(text, iconWrap);

  return container;
}

/* ======================================================
   MAIN RENDER
====================================================== */

const renderFavoriteFacetBreadcrumb = (data, toggleAssetType, toggleTag, renderUi) => {
  const root = document.getElementById('facet-readcrumb');
  root.innerHTML = '';

  if (!hasAnySelection(data)) {
    root.style.display = 'none';
    return;
  }

  root.style.display = 'block';

  const container = document.createElement('div');
  container.className = 'facet-breadcrumb-container';

  /* =========================
     ASSET TYPE BREADCRUMBS
  ========================= */
  data.forEach((asset) => {
    if (asset.state !== 'selected') return;

    const breadcrumb = createBreadcrumbItem(
      `${strings.assetType} : ${asset.assetType}`,
      () => {
        asset.state = 'idle';

        asset.tags?.forEach((group) => {
          group.value?.forEach((tag) => {
            tag.state = 'idle';
          });
        });

        renderUi();
      },
    );

    container.appendChild(breadcrumb);
  });

  /* =========================
     TAG BREADCRUMBS (DEDUPED)
  ========================= */
  const selectedTags = new Map();

  data.forEach((asset) => {
    asset.tags?.forEach((group) => {
      group.value?.forEach((tag) => {
        if (tag.state === 'selected') {
          selectedTags.set(
            `${group.key}__${tag.key}`,
            { groupKey: group.key, tagKey: tag.key },
          );
        }
      });
    });
  });

  selectedTags.forEach(({ groupKey, tagKey }) => {
    const breadcrumb = createBreadcrumbItem(
      `${groupKey} : ${tagKey}`,
      () => {
        data.forEach((asset) => {
          const group = asset.tags?.find((g) => g.key === groupKey);
          const tag = group?.value?.find((v) => v.key === tagKey);
          if (tag) tag.state = 'idle';
        });
        renderUi();
      },
    );

    container.appendChild(breadcrumb);
  });

  /* =========================
     MOBILE FILTER COUNT
  ========================= */
  /* =========================
   MOBILE FILTER COUNT + SHOW LESS
========================= */
  /* =========================
   MOBILE FILTER COUNT + SHOW LESS (WITH STYLES)
========================= */
  if (isMobile()) {
    const filters = container.querySelectorAll('.facet-breadcrumb');

    if (filters.length > 1) {
      const showMore = document.createElement('div');
      showMore.id = 'filter-count-wrapper';
      showMore.innerHTML = `<span>Filters: +${filters.length}</span>`;

      const showLess = document.createElement('div');
      showLess.id = 'filter-count-show-less';
      showLess.classList.add('tw-hidden', 'tw-flex');
      showLess.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
        viewBox="0 0 12 12" fill="none">
        <path d="M0 6L12 6" stroke="#0068FA"/>
      </svg>
      Show Less
    `;

      // Initial state
      filters.forEach((f) => f.classList.add('tw-hidden'));

      // SHOW MORE
      showMore.addEventListener('click', () => {
        filters.forEach((f) => f.classList.remove('tw-hidden'));

        showMore.style.display = 'none';
        showLess.classList.remove('tw-hidden');

        container.style.marginTop = '0px';
        root.style.marginBottom = '30px';

        const clearBtn = container.querySelector('button');
        if (clearBtn) clearBtn.style.bottom = '-20px';
      });

      // SHOW LESS
      showLess.addEventListener('click', () => {
        filters.forEach((f) => f.classList.add('tw-hidden'));

        showLess.classList.add('tw-hidden');
        showMore.style.display = 'block';

        container.style.marginTop = '20px';
        root.style.marginBottom = '0px';

        const clearBtn = container.querySelector('button');
        if (clearBtn) {
          clearBtn.style.marginTop = '-100px';
          clearBtn.style.bottom = 'auto';
        }
      });

      root.prepend(showMore);
      root.prepend(showLess);
    }
  }

  /* =========================
     CLEAR ALL BUTTON
  ========================= */
  const clearAll = document.createElement('button');
  clearAll.textContent = 'Clear All';
  clearAll.className = 'facet-clear-all';
  clearAll.textContent = 'Clear All';
  clearAll.style.marginRight = '0';
  clearAll.style.marginLeft = 'auto';
  clearAll.style.color = 'var(--Blue-700, #0068FA)';
  clearAll.style.fontSize = '16px';
  clearAll.style.fontStyle = 'normal';
  clearAll.style.fontWeight = '530';
  clearAll.style.lineHeight = '24px';
  clearAll.style.letterSpacing = '0.08px';

  clearAll.addEventListener('click', () => {
    resetAllSelections(data);
    renderUi();
  });

  container.appendChild(clearAll);
  root.appendChild(container);

  /* =========================
     MOBILE FOOTER CLEAR ALL
  ========================= */
  const mobileClear = document.getElementById(
    'mobile-filter-footer-clear-all',
  );

  if (mobileClear) {
    mobileClear.onclick = () => {
      resetAllSelections(data);
      renderUi();
    };
  }
};

export default renderFavoriteFacetBreadcrumb;
