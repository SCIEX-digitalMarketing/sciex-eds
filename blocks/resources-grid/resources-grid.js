import {} from '../../scripts/aem.js';
import { } from '../../scripts/dom-builder.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.classList.add('resource-grid-ul');
  block.classList.add('resources-grid-wrapper');

  // Initialize variables
  let id = '';
  let headingText = '';
  let textSize = 'text-delta';
  let description = '';
  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'resources-grid-text-hide';
  const subDiv = document.createElement('div');
  const filters = [
    { id: 'all', label: 'All', value: 'all' },
  ];
  let viewType = 'small';
  let filterWrapper = '';
  let filterValue = '';
  // Create heading element
  const heading = document.createElement('div');
  [...block.children].forEach((row, index) => {
    if (index === 0) {
      id = row.textContent.trim();
      sectionDiv.id = id;
      return;
    }
    if (index === 1) {
      headingText = row.textContent.trim();

      heading.id = 'headingDiv';
      heading.textContent = headingText;
      subDiv.appendChild(heading);
      return;
    }
    if (index === 2) {
      textSize = row.textContent.trim() || 'text-delta';
      if (!['text-delta', 'text-charlie'].includes(textSize)) {
        textSize = 'text-delta';
      }
      if (heading !== null) {
        heading.className = textSize;
      }
      return;
    }
    if (index === 3) {
      description = row.textContent.trim();
      const descriptionDiv = document.createElement('div');
      descriptionDiv.textContent = description;
      descriptionDiv.classList.add('resources-grid-description');
      subDiv.appendChild(descriptionDiv);
      sectionDiv.appendChild(subDiv);
      return;
    }
    if (index === 4) {
      viewType = row.textContent.trim().toLowerCase();
    }
    if (index === 5) {
      filterValue = row.textContent.trim();
      if (filterValue === 'show') {
        sectionDiv.className = 'resources-grid-text-show';
        filterWrapper = document.createElement('div');
        filterWrapper.className = 'resource-grid-filter-label';
      } else {
        sectionDiv.className = 'resources-grid-text-hide';
      }
    }
    if (index >= 6 && row.children.length > 0) {
      const li = document.createElement('li');
      if (viewType === 'small') {
        li.className = 'resource-grid-li-small resource-grid-li';
      } else {
        li.className = 'resource-grid-li-grid resource-grid-li';
      }
      let colour = 'grey';
      const a = document.createElement('a');
      a.className = 'resource-grid-link';
      const topDiv = document.createElement('div');
      topDiv.className = 'resource-grid-topDiv';
      const middleDiv = document.createElement('div');
      const bottomDiv = document.createElement('div');
      bottomDiv.className = 'resource-grid-bottomDiv';
      let pTag = '';
      [...row.children].forEach((column, colIndex) => {
        li.appendChild(a);
        if (colIndex === 0) {
          if (column.textContent !== '') {
            colour = column.textContent;
          }
          li.classList.add(`resource-grid-li-background-${colour.toLowerCase()}`);
        } else if (colIndex === 1) {
          pTag = column.textContent;
          const tageName = document.createElement('p');
          tageName.textContent = column.textContent;
          topDiv.appendChild(tageName);
          li.id = column.textContent.trim().toLowerCase().replace(/\s+/g, '-');
          if (filters.findIndex((f) => f.value === column.textContent) === -1) {
            const tagName = column.textContent;
            filters.push({ id: column.textContent.trim().toLowerCase().replace(/\s+/g, '-'), label: tagName, value: tagName });
          }
        } else if (colIndex === 2) {
          const span = document.createElement('span');
          if (pTag === 'Technical note') {
            span.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M2.99902 18.9284V4.13917C2.99902 4.07091 3.06589 4.02272 3.13065 4.0443L11.9306 6.97763C11.9715 6.99125 11.999 7.02946 11.999 7.0725V21.8617C11.999 21.9299 11.9322 21.9781 11.8674 21.9566L3.0674 19.0232C3.02657 19.0096 2.99902 18.9714 2.99902 18.9284Z" stroke="#141414"></path>
              <path d="M20.999 18.9284V4.13917C20.999 4.07091 20.9322 4.02272 20.8674 4.0443L12.0674 6.97763C12.0266 6.99125 11.999 7.02946 11.999 7.0725V21.8617C11.999 21.9299 12.0659 21.9781 12.1306 21.9566L20.9306 19.0232C20.9715 19.0096 20.999 18.9714 20.999 18.9284Z" stroke="#141414"></path>
              <path d="M14.7328 10.086L18.7082 8.79433C18.8318 8.75415 18.8885 8.78561 18.8873 8.92561L18.8836 9.37559C18.8825 9.51559 18.825 9.58413 18.7014 9.6243L17.1797 10.1187L17.1324 15.8885C17.1312 16.0285 17.0832 16.104 16.9595 16.1441L16.3699 16.3357C16.2462 16.3759 16.1992 16.3314 16.2003 16.1914L16.2477 10.4216L14.726 10.916C14.5928 10.9593 14.5457 10.9247 14.5468 10.7847L14.5505 10.3347C14.5517 10.1947 14.5996 10.1293 14.7328 10.086Z" fill="#141414"></path>
            </svg>`;
          } else if (pTag === 'Webinar' || pTag === 'Q&A blog' || pTag === 'Blog' || pTag === 'Article' || pTag === 'Hub') {
            span.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 40 40"
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.75" y="3.75" width="32.5" height="32.5" stroke="#141414" />
              <path d="M3.75 12.5H36.25" stroke="#141414" />
              <circle cx="8.33366" cy="8.33333" r="1.66667" fill="#141414" />
              <circle cx="13.3337" cy="8.33333" r="1.66667" fill="#141414" />
              <circle cx="18.3337" cy="8.33333" r="1.66667" fill="#141414" />
            </svg>`;
          } else if (pTag === 'Document' || pTag === 'Solution guide' || pTag === 'Publication' || pTag === 'User guide' || pTag === 'Application guide' || pTag === 'Manual' || pTag === 'Release notes' || pTag === 'Specification sheet') {
            span.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.99902 18.9284V4.13917C2.99902 4.07091 3.06589 4.02272 3.13065 4.0443L11.9306 6.97763C11.9715 6.99125 11.999 7.02946 11.999 7.0725V21.8617C11.999 21.9299 11.9322 21.9781 11.8674 21.9566L3.0674 19.0232C3.02657 19.0096 2.99902 18.9714 2.99902 18.9284Z" stroke="#141414"/>
            <path d="M20.999 18.9284V4.13917C20.999 4.07091 20.9322 4.02272 20.8674 4.0443L12.0674 6.97763C12.0266 6.99125 11.999 7.02946 11.999 7.0725V21.8617C11.999 21.9299 12.0659 21.9781 12.1306 21.9566L20.9306 19.0232C20.9715 19.0096 20.999 18.9714 20.999 18.9284Z" stroke="#141414"/>
            <path d="M18.8779 13.4918V14.1218C18.8779 14.9418 18.4119 15.8132 16.7761 16.3447C15.1403 16.8762 14.6743 16.3077 14.6743 15.4877V11.6077C14.6743 10.7877 15.1403 9.91623 16.7761 9.38472C18.4119 8.85321 18.8779 9.4218 18.8779 10.2418V10.7318C18.8779 10.8718 18.8304 10.9472 18.7068 10.9874L18.1551 11.1666C18.022 11.2099 17.9744 11.1654 17.9744 11.0254V10.6954C17.9744 10.1554 17.6416 9.93352 16.7856 10.2116C15.9297 10.4897 15.6063 10.9248 15.6063 11.4648V15.0248C15.6063 15.5648 15.9297 15.7897 16.7856 15.5116C17.6416 15.2335 17.9744 14.7954 17.9744 14.2554V13.7854C17.9744 13.6554 18.022 13.5799 18.1551 13.5366L18.7068 13.3574C18.8304 13.3172 18.8779 13.3618 18.8779 13.4918Z" fill="#141414"/>
          </svg>`;
          } else if (pTag === 'Video' || pTag === 'Podcast' || pTag === 'Vodcast') {
            span.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 19.191V4.80902L19.882 12L5.5 19.191Z" stroke="#141414"/>
            </svg>`;
          } else if (pTag === 'PDF' || pTag === 'Compendium') {
            span.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5.49902" y="2.50043" width="16" height="19" stroke="#141414"/>
              <path d="M10.999 16.0004H17.999" stroke="#141414"/>
              <path d="M10.999 12.0004H17.999" stroke="#141414"/>
              <path d="M10.999 8.00043H17.999" stroke="#141414"/>
              <path d="M5.49902 9.50043C4.11831 9.50043 2.99902 8.38114 2.99902 7.00043C2.99902 5.61972 4.11831 4.50043 5.49902 4.50043" stroke="#141414"/>
              <path d="M5.49902 14.5004C4.11831 14.5004 2.99902 13.3811 2.99902 12.0004C2.99902 10.6197 4.11831 9.50043 5.49902 9.50043" stroke="#141414"/>
              <path d="M5.49902 19.5004C4.11831 19.5004 2.99902 18.3811 2.99902 17.0004C2.99902 15.6197 4.11831 14.5004 5.49902 14.5004" stroke="#141414"/>
              <path d="M7.99902 7.00043C7.99902 5.61972 6.87974 4.50043 5.49902 4.50043" stroke="#141414"/>
              <path d="M7.99902 12.0004C7.99902 10.6197 6.87974 9.50043 5.49902 9.50043" stroke="#141414"/>
              <path d="M7.99902 17.0004C7.99902 15.6197 6.87974 14.5004 5.49902 14.5004" stroke="#141414"/>
            </svg>`;
          } else if (pTag === 'Brochure' || pTag === 'Flyer' || pTag === 'Expert brief' || pTag === 'Poster' || pTag === 'Infographic' || pTag === 'Press release' || pTag === 'Executive summary' || pTag === 'Spectral library') {
            span.innerHTML = `
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.749 3.75043H7.49902V17.2504H19.499V9.75043" stroke="#141414"/>
              <path d="M15.499 7.50043V4.20753L17.1455 5.85398L18.7919 7.50043H15.499Z" stroke="#141414"/>
              <path d="M16.999 10.5004H9.99902" stroke="#141414"/>
              <path d="M16.999 13.5004H9.99902" stroke="#141414"/>
              <path d="M7.49902 5.25043H4.49902V20.2504H17.249V17.2504" stroke="#141414"/>
            </svg>`;
          }

          topDiv.appendChild(span);
          const title = document.createElement('p');
          title.className = 'resource-grid-li-title';
          title.textContent = column.textContent;
          middleDiv.appendChild(title);
        } else if (colIndex === 3) {
          if (column.textContent.trim() === '') {
            return;
          }
          const desc = document.createElement('p');
          desc.className = 'resource-grid-li-description';
          desc.textContent = column.textContent;
          middleDiv.appendChild(desc);
        } else if (colIndex === 4) {
          bottomDiv.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-rand="1764659665921">
              <path d="M3 12L21 12" stroke="#0068FA"></path>
              <path d="M13.7998 4.79999L20.9998 12L13.7998 19.2" stroke="#0068FA"></path>
          </svg>`;
          middleDiv.appendChild(bottomDiv);
          const aTag = li.querySelector('a');
          console.log(`Setting href for link${aTag}`);
          aTag.setAttribute('href', column.textContent);
          aTag.setAttribute('target', '_blank');
        }
        a.appendChild(topDiv);
        a.appendChild(middleDiv);
      });

      ul.appendChild(li);
      moveInstrumentation(row, li);
    }
  });
  if (filterValue === 'show') {
    const filterLabel = document.createElement('span');
    filterLabel.className = '';
    filterLabel.textContent = 'Filter:';
    filterWrapper.appendChild(filterLabel);
    filters.forEach((f) => {
      const div = document.createElement('div');
      const label = document.createElement('label');
      label.htmlFor = f.id;
      label.textContent = f.label;
      label.className = 'resource-grid-filter-input-white';
      if (f.value === 'all') {
        label.classList.add('active');
      }
      label.addEventListener('click', (e) => {
        e.preventDefault();
        filterValue = f.value;
        document.querySelectorAll('.resource-grid-filter-input-white').forEach((lbl) => {
          lbl.classList.remove('active');
        });
        label.classList.add('active');
        const allItems = ul.querySelectorAll('.resource-grid-li');
        allItems.forEach((item) => {
          if (filterValue === 'all') {
            item.style.display = '';
          } else if (item.id === f.id) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
      div.appendChild(label);
      filterWrapper.appendChild(div);
    });
    sectionDiv.appendChild(filterWrapper);
  }
  block.textContent = '';
  block.appendChild(sectionDiv);

  block.appendChild(ul);
}
