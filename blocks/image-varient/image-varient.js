export default function decorate(block) {
  const rows = [...block.children];

  const desktopPicture = rows[0]?.querySelector('picture');
  const mobilePicture = rows[1]?.querySelector('picture');
  const altText = rows[2]?.textContent?.trim();
  const align = rows[3]?.textContent?.trim().toLowerCase();
  const imageFit = rows[4]?.textContent?.trim();
  const width = rows[5]?.textContent?.trim();
  const height = rows[6]?.textContent?.trim();

  block.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'image-wrapper';

  // alignment
  if (align) {
    block.classList.add(align);
  }

  // width
  if (width) {
    wrapper.style.width = `${width}%`;
  }

  if (desktopPicture) {
    const img = desktopPicture.querySelector('img');

    if (img) {
      if (altText) {
        img.alt = altText;
      }

      // object-fit
      if (imageFit) {
        img.style.objectFit = imageFit;
      }

      img.style.width = '100%';

      // height
      if (height) {
        img.style.height = `${height}px`;
      } else {
        img.style.height = 'auto';
      }
    }

    // mobile image source
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');

      if (mobileImg) {
        const source = document.createElement('source');
        source.media = '(max-width:768px)';
        source.srcset = mobileImg.src;

        desktopPicture.prepend(source);
      }
    }

    wrapper.append(desktopPicture);
  }

  block.append(wrapper);
}
