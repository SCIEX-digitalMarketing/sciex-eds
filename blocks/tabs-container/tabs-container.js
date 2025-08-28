import {} from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import decorateSciexText from '../sciex-text/sciex-text.js';

export default async function decorate(block) {
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('technotes-main');

  [...block.children].forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      block.id = `${row.textContent.trim().replace(/\s+/g, '-')}-content`;
    } else {
      const pic = row.querySelector('picture');
      const div = document.createElement('div');
      const button = row.querySelector('.button-container');

      if (pic || button) {
        [...row.children].forEach((col, colIndex) => {
          const inputDiv = document.createElement('div');
          if (colIndex === 0 || colIndex === 1) {
            const ele = col;
            inputDiv.innerHTML = ele ? ele.innerHTML : '';
            div.append(inputDiv);
          } else if (colIndex === 2) {
            if (col.textContent !== '') {
              div.style.backgroundColor = col.textContent.trim().replace(/\s+/g, ' ');
            }
          } else if (colIndex === 3) {
            if (col.textContent !== '') {
              const imagePos = col.textContent.trim().replace(/\s+/g, '-');
              div.classList.add(imagePos);
            }
          }
          div.classList.add('tech-note');
          moveInstrumentation(row, div);
          blockDiv.append(div);
        });
      } else {
        decorateSciexText(row);
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('other-content');
        contentDiv.append(row);
        blockDiv.append(contentDiv);
      }
    }
  });
  block.textContent = '';
  block.append(blockDiv);
}
