export default function decorate(block) {
  const rows = [...block.children];

  const desktopPicture = rows[0]?.querySelector("picture");
  const mobilePicture = rows[1]?.querySelector("picture");
  const caption = rows[2]?.textContent?.trim();
  const align = rows[3]?.textContent?.trim().toLowerCase();
  const imageFit = rows[4]?.textContent?.trim();
  const width = rows[5]?.textContent?.trim();

  // clear existing structure
  block.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "image-wrapper";

  // alignment class
  if (align) {
    block.classList.add(align);
  }

  // width
  if (width) {
    wrapper.style.width = `${width}%`;
  }

  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector("img");

    if (desktopImg) {
      // set alt from caption
      if (caption) {
        desktopImg.alt = caption;
      }

      // object-fit
      if (imageFit) {
        desktopImg.style.objectFit = imageFit;
      }

      desktopImg.style.width = "100%";
      desktopImg.style.height = "auto";
    }

    // add mobile source if available
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector("img");

      if (mobileImg) {
        const source = document.createElement("source");
        source.media = "(max-width: 768px)";
        source.srcset = mobileImg.src;

        desktopPicture.prepend(source);
      }
    }

    wrapper.append(desktopPicture);
  }


  block.append(wrapper);
}