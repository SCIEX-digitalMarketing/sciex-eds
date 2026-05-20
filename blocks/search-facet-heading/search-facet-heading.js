export default function decorate(block) {
    const rows = [...block.children];

    rows.forEach((row) => {
        const columns = [...row.children];

        const id = columns[0]?.textContent?.trim();
        const description = columns[1]?.textContent?.trim();
        const image = columns[2]?.querySelector('picture');
        const buttonText = columns[3]?.textContent?.trim();
        const buttonLink = columns[4]
            ?.querySelector('a')


        // Main Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = `search-facet-heading search-facet-heading-${id?.toLowerCase()}`;
        wrapper.id = `search-facet-heading-${id?.toLowerCase()}`;

        // wrapper.style.display = 'none'; // Hide by default, will be shown when the corresponding facet is selected

        // Image Wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'search-facet-heading-image';

        if (image) {
            imageWrapper.appendChild(image);
        }

        // Content Wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'search-facet-heading-content';

      

        // Description
        const desc = document.createElement('p');
        desc.className = 'search-facet-heading-description';
        desc.textContent = description || '';

        // Button
        if (buttonText && buttonLink) {
            const button = document.createElement('a');
            button.href = buttonLink;
            button.textContent = buttonText;
            button.className = 'search-facet-heading-button';

            contentWrapper.append(desc, button);
        } else {
            contentWrapper.append(desc);
        }

        wrapper.append(imageWrapper, contentWrapper);

        row.replaceWith(wrapper);
    });

}