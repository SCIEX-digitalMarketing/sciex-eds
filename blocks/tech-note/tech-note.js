import {} from '../../scripts/aem.js';

export default async function decorate(block) {
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('technotes');
  const div = document.createElement('div');

  [...block.children].forEach((row, index) => {
    const inputDiv = document.createElement('div');
    if (index === 0 || index === 1) {
      const ele = row.querySelector('div div');
      inputDiv.innerHTML = ele.innerHTML;
      div.append(inputDiv);
    } else if (index === 2) {
      blockDiv.style = `background-color:${row.textContent.trim().replace(/\s+/g, ' ')}`;
    } else {
      const imagePos = row.textContent.trim().replace(/\s+/g, ' ');
      div.classList.add(imagePos);
    }
    blockDiv.append(div);
  });
  block.textContent = '';
  block.append(blockDiv);
}
