export default async function decorate(block) {
  block.style.display = 'none';

  const blockDiv = document.createElement('div');
  blockDiv.classList.add('related-resources');

  const heading = block.children[0].textContent;
  const headingDiv = document.createElement('div');
  headingDiv.classList.add('heading');
  headingDiv.append(heading);
  blockDiv.append(headingDiv);

  [...block.children].slice(1, 5).forEach((row) => {
    const columns = [...row.children];

    if (columns.length >= 3) {
      const title = columns[0]?.textContent.trim();
      const linkText = columns[1]?.textContent.trim();
      const linkUrl = columns[2]?.querySelector('a')?.href;
      const linkTarget = columns[3]?.textContent.trim() || '_self';

      if (title && linkText && linkUrl) {
        const resourceDiv = document.createElement('div');
        resourceDiv.classList.add('links-container');

        const titleElement = document.createElement('strong');
        titleElement.textContent = `${title} `;
        titleElement.classList.add('title-Element');

        const linkElement = document.createElement('a');
        linkElement.href = linkUrl;
        linkElement.textContent = linkText;
        linkElement.classList.add('link-Element');
        linkElement.target = linkTarget;

        resourceDiv.appendChild(titleElement);
        resourceDiv.appendChild(linkElement);
        blockDiv.appendChild(resourceDiv);
      }
    }
  });

  block.parentNode.insertBefore(blockDiv, block.nextSibling);
}
