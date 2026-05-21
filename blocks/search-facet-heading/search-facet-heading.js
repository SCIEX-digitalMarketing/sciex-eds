import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
    const rows = [...block.children];
    const mainContainer = document.createElement('div');
    mainContainer.className = 'search-facet-heading-block-container';
    
    moveInstrumentation(block, mainContainer);

    rows.forEach((row) => {
        const columns = [...row.children];

        const id = columns[0]?.textContent?.trim();
        const description = columns[1]?.innerHTML?.trim();
        const image = columns[2]?.querySelector('picture');
        const buttonText = columns[3]?.textContent?.trim();
        const buttonLink = columns[4]
            ?.querySelector('a')

        // Main Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = `search-facet-heading-item search-facet-heading-${id?.toLowerCase()}`;
        wrapper.id = `search-facet-heading-${id?.toLowerCase()}`;

        moveInstrumentation(row, wrapper);

        // Image Wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'search-facet-heading-image';

        if (image) {
            imageWrapper.appendChild(image);
        }

        // Content Wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'search-facet-heading-content';
         const actionWrapper = document.createElement('div');
        actionWrapper.className = 'action-wrapper';

      

        // Description
        const desc = document.createElement('p');
        desc.className = 'search-facet-heading-description';
        desc.innerHTML = description || '';
        contentWrapper.appendChild(imageWrapper);
        contentWrapper.appendChild(desc);

        // Button
        if (buttonText && buttonLink) {
            const button = document.createElement('a');
            button.href = buttonLink;
            button.textContent = buttonText;
            button.className = 'search-facet-heading-button';

            actionWrapper.appendChild(button);
        }


        wrapper.append(contentWrapper,actionWrapper);

        mainContainer.append(wrapper);
    });

    block.innerHTML = '';
    block.append(mainContainer);
}