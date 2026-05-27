import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
    const rows = [...block.children];
    const mainContainer = document.createElement('div');
    mainContainer.className = 'search-facet-banner-block-container';
    
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
        wrapper.className = `search-facet-banner-item search-facet-banner-${id?.toLowerCase()}`;
        wrapper.id = `search-facet-banner-${id?.toLowerCase()}`;

        moveInstrumentation(row, wrapper);

        // Image Wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'search-facet-banner-image';

        if (image) {
            imageWrapper.appendChild(image);
        }

        // Content Wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'search-facet-banner-content';
         const actionWrapper = document.createElement('div');
        actionWrapper.className = 'action-wrapper';

      

        // Description
        const desc = document.createElement('div');
        desc.className = 'search-facet-banner-description';
        desc.innerHTML = description || '';
        contentWrapper.appendChild(imageWrapper);
        if (desc) {
            const descriptionText = desc.querySelector('p:nth-of-type(1)');
            descriptionText.id = 'description-text';

            const readMoreSpan = document.createElement('span');
            readMoreSpan.id = 'banner-read-more';
            readMoreSpan.textContent = 'Read More';

            // insert immediately after descriptionText
            descriptionText.insertAdjacentElement('afterend', readMoreSpan);

            readMoreSpan.addEventListener('click', () => {
                const isExpanded = descriptionText.style.webkitLineClamp !== '2';
                descriptionText.style.webkitLineClamp = isExpanded ? '2' : 'unset';
                readMoreSpan.textContent = isExpanded ? 'Read More' : 'Read Less';
            });
        }

        contentWrapper.appendChild(desc);

        // Button
        if (buttonText && buttonLink) {
            const button = document.createElement('a');
            button.href = buttonLink;
            button.textContent = buttonText;
            button.className = 'search-facet-banner-button';

            actionWrapper.appendChild(button);
        }


        wrapper.append(contentWrapper,actionWrapper);

        mainContainer.append(wrapper);
    });

    block.innerHTML = '';
    block.append(mainContainer);
}