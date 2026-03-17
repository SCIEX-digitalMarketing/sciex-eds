import {} from '../../scripts/aem.js';
import {} from '../../scripts/scripts.js';
import {} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const rows = [...block.children];
  const slides = [];
  let viewType = 'portrait';
  rows.forEach((row, index) => {
    const cells = [...row.children];
    if (!cells.length) return;

    if (index === 1) {
      viewType = row.textContent.trim().toLowerCase();
    } else if (index > 1) {
    // ----- YouTube -----
      const link = cells[0].querySelector('a');
      if (link && link.href.includes('youtube')) {
        const videoId = new URL(link.href).searchParams.get('v');
        const iframe = document.createElement('iframe');
        iframe.classList.add(viewType);
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.setAttribute('allowfullscreen', true);

        const caption = cells[1]?.textContent?.trim() || '';
        slides.push({ media: iframe, caption });
        return;
      }

      // ----- Image / Picture -----
      const picture = cells[0].querySelector('picture');
      picture.classList.add(viewType);

      const img = cells[0].querySelector('img');
      img.classList.add(viewType);

      if (picture) {
        slides.push({
          media: picture.cloneNode(true),
          caption: cells[1]?.textContent?.trim() || '',
        });
      } else if (img) {
        slides.push({
          media: img.cloneNode(true),
          caption: cells[1]?.textContent?.trim() || '',
        });
      }
    }
  });

  // Clear block
  block.innerHTML = '';

  // ----- Carousel Structure -----
  const wrapper = document.createElement('div');
  wrapper.className = 'atomic-media-carousel splide';

  const track = document.createElement('div');
  track.className = 'splide__track';

  const list = document.createElement('ul');
  list.className = 'splide__list';

  slides.forEach((s) => {
    const li = document.createElement('li');
    li.className = 'splide__slide';

    const card = document.createElement('div');
    card.className = 'media-card';

    // Media
    card.appendChild(s.media);

    // Bottom Row (Caption + Arrows)
    const bottomRow = document.createElement('div');
    bottomRow.className = 'caption-row';

    const caption = document.createElement('div');
    caption.className = 'media-card-caption';
    caption.textContent = s.caption;

    // Arrows inside each slide
    const arrows = document.createElement('div');
    arrows.className = 'caption-arrows';
    arrows.innerHTML = `
      <button class="splide__arrow splide__arrow--prev carousel-btn svg-blue">
        <svg width="16" height="16" viewb="" ox="0 0 16 16" fill="none" style = "color: rgba(0, 104, 250, var(--tw-text-opacity));" xmlns="http://www.w3.org/2000/svg" data-di-res-id="8a3475bd-de90057c" data-di-rand="1763987725725">
            <path d="M10 14.0037L4 8.00366L10 2.00366" stroke="currentColor"></path>
        </svg>
      </button>

      <button class="splide__arrow splide__arrow--next carousel-btn svg-white">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-res-id="808aac3f-d550cc16" data-di-rand="1763987725730">
            <path d="M5 14.0037L11 8.00366L5 2.00366" stroke="currentColor"></path>
        </svg>
      </button>
    `;

    bottomRow.appendChild(caption);
    bottomRow.appendChild(arrows);

    card.appendChild(bottomRow);
    li.appendChild(card);
    list.appendChild(li);
  });

  track.appendChild(list);
  wrapper.appendChild(track);
  block.appendChild(wrapper);

  // ----- VANILLA CAROUSEL LOGIC -----
  const trackEl = list;
  let currentIndex = 0;
  const slideCount = slides.length;

  trackEl.style.display = 'flex';
  trackEl.style.transition = 'transform 0.5s ease';

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, slideCount - 1));
    const offset = currentIndex * wrapper.offsetWidth;
    trackEl.style.transform = `translateX(-${offset}px)`;
  }

  // Attach events to arrows
  block.querySelectorAll('.splide__arrow--next').forEach((btn) => {
    btn.addEventListener('click', () => goToSlide(currentIndex + 1));
  });

  block.querySelectorAll('.splide__arrow--prev').forEach((btn) => {
    btn.addEventListener('click', () => goToSlide(currentIndex - 1));
  });

  window.addEventListener('resize', () => goToSlide(currentIndex));
}
