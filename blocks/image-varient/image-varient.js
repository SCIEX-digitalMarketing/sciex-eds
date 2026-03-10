export default function decorate(block) {

  // Get rows from block
  const rows = [...block.children];

  let picture;
  let caption;
  let objectFit;
  let width;

  rows.forEach((row) => {
    const label = row.children[0]?.textContent?.toLowerCase().trim();
    const valueCell = row.children[1];

    if (!label || !valueCell) return;

    if (label === "image") {
      picture = valueCell.querySelector("picture");
    }

    if (label === "caption") {
      caption = valueCell.textContent;
    }

    if (label === "image fit") {
      objectFit = valueCell.textContent.trim();
    }

    if (label === "width (%)") {
      width = valueCell.textContent.trim();
    }
  });

  // Clear block
  block.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "image-wrapper";

  // Apply width
  if (width) {
    wrapper.style.width = `${width}%`;
  }

  if (picture) {
    const img = picture.querySelector("img");

    if (img && objectFit) {
      img.style.objectFit = objectFit;
    }

    wrapper.appendChild(picture);
  }

  // Add caption
  if (caption) {
    const captionEl = document.createElement("p");
    captionEl.className = "image-caption";
    captionEl.textContent = caption;
    wrapper.appendChild(captionEl);
  }

  block.append(wrapper);
}