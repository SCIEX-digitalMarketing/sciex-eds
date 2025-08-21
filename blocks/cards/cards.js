import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { span } from '../../scripts/dom-builder.js';

function embedYoutube(url, autoplay, background) {
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      mute: background ? '1' : '0',
      controls: background ? '0' : '1',
      disablekb: background ? '1' : '0',
      loop: background ? '1' : '0',
      playsinline: background ? '1' : '0',
    };
    suffix = `&${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }

  let vid = '';
  if (url.hostname.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  } else if (url.searchParams.has('v')) {
    vid = url.searchParams.get('v');
  } else {
    [, vid] = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]+)/) || [];
  }

  const temp = document.createElement('div');
  temp.setAttribute('data-youtube-url', url.href);

  temp.innerHTML = `
    <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe
        src="https://www.youtube.com/embed/${vid}?rel=0${suffix}"
        style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
        allowfullscreen
        scrolling="no"
        title="Content from Youtube"
        loading="lazy">
      </iframe>
    </div>`;
  return temp.children.item(0);
}

function initVideoModal() {
  const modal = document.createElement('div');
  modal.className = 'video-modal hidden';
  modal.id = 'video-modal';
  modal.innerHTML = `
  <div class="video-modal-overlay"></div>
  <div class="video-modal-content">
    <div class="video-modal-header">
      <span id="modal-header-title" class="modal-header-title">Event Day 1</span>
      <div class="modal-header-icon">
        <button class="icon-button" aria-label="Expand Video Modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9692 32.7402H28.738C29.8266 32.7402 30.7091 33.6227 30.7091 34.7113V50.4802C30.7091 51.5688 29.8266 52.4513 28.738 52.4513C27.6494 52.4513 26.7669 51.5688 26.7669 50.4802V39.47L14.3629 51.874C13.5932 52.6438 12.3451 52.6438 11.5754 51.874C10.8056 51.1042 10.8056 49.8562 11.5754 49.0864L23.9793 36.6825H12.9692C11.8805 36.6825 10.998 35.8 10.998 34.7113C10.998 33.6227 11.8805 32.7402 12.9692 32.7402Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M50.4195 30.7695L34.6506 30.7695C33.562 30.7695 32.6795 29.887 32.6795 28.7984L32.6795 13.0296C32.6795 11.9409 33.562 11.0584 34.6506 11.0584C35.7393 11.0584 36.6218 11.9409 36.6218 13.0296L36.6218 24.0397L49.0257 11.6358C49.7955 10.866 51.0435 10.866 51.8133 11.6358C52.5831 12.4055 52.5831 13.6536 51.8133 14.4233L39.4093 26.8273L50.4195 26.8273C51.5081 26.8273 52.3906 27.7098 52.3906 28.7984C52.3906 29.887 51.5081 30.7695 50.4195 30.7695Z" fill="white"/>
          </svg>
        </button>
        <button class="video-modal-close" aria-label="Close Video Modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40" fill="none">
            <g clip-path="url(#clip0_666_10800)">
              <path d="M23.9164 19.7562L39.2746 4.39798C39.5125 4.16119 39.701 3.87957 39.8293 3.56942C39.9576 3.25928 40.0231 2.92676 40.022 2.59113C40.0262 2.25627 39.9621 1.92407 39.8336 1.61483C39.7051 1.30558 39.5149 1.02577 39.2746 0.792494C39.0413 0.552225 38.7615 0.362031 38.4523 0.233531C38.143 0.10503 37.8108 0.0409196 37.476 0.0451153C37.1403 0.0440209 36.8078 0.109514 36.4977 0.237802C36.1875 0.366091 35.9059 0.554626 35.6691 0.792494L20.3109 16.1507L4.95267 0.792494C4.71588 0.554626 4.43426 0.366091 4.12411 0.237802C3.81396 0.109514 3.48145 0.0440209 3.14582 0.0451153C2.81096 0.0409196 2.47876 0.10503 2.16951 0.233531C1.86027 0.362031 1.58046 0.552225 1.34718 0.792494C1.10691 1.02577 0.916719 1.30558 0.788218 1.61483C0.659717 1.92407 0.595607 2.25627 0.599803 2.59113C0.598708 2.92676 0.664201 3.25928 0.79249 3.56942C0.920778 3.87957 1.10931 4.16119 1.34718 4.39798L16.7054 19.7562L1.34718 35.1144C1.10931 35.3512 0.920778 35.6328 0.79249 35.943C0.664201 36.2531 0.598708 36.5856 0.599803 36.9213C0.595607 37.2561 0.659717 37.5883 0.788218 37.8976C0.916719 38.2068 1.10691 38.4866 1.34718 38.7199C1.58046 38.9602 1.86027 39.1504 2.16951 39.2789C2.47876 39.4074 2.81096 39.4715 3.14582 39.4673C3.48145 39.4684 3.81396 39.4029 4.12411 39.2746C4.43426 39.1463 4.71588 38.9578 4.95267 38.7199L20.3109 23.3617L35.6691 38.7199C35.9059 38.9578 36.1875 39.1463 36.4977 39.2746C36.8078 39.4029 37.1403 39.4684 37.476 39.4673C38.1505 39.4651 38.7969 39.1962 39.2739 38.7192C39.7509 38.2422 40.0198 37.5959 40.022 36.9213C40.0231 36.5856 39.9576 36.2531 39.8293 35.943C39.701 35.6328 39.5125 35.3512 39.2746 35.1144L23.9164 19.7562Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_666_10800">
                <rect width="39.4222" height="39.4222" fill="white" transform="translate(0.599609 0.0449219)"/>
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
    <div id="video-modal-container"></div>
  </div>
`;

  document.body.appendChild(modal);
  const container = document.getElementById('video-modal-container');
  const closeModal = () => {
    modal.classList.add('hidden');
    if (container) container.innerHTML = '';
  };

  modal.querySelector('.video-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.video-modal-overlay').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  const expandBtn = modal.querySelector('.icon-button');
  expandBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoModal);
} else {
  initVideoModal();
}

function extractYouTubeID(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }
    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }
    const match = parsed.pathname.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
  } catch (e) {
    console.error('Invalid URL in extractYouTubeID:', url, e);
  }
  return null;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  let headingText = '';
  let target = '_blank';
  let id = '';
  let gridValue = '';

  [...block.children].forEach((row, index) => {
    if (index === 0) {
      id = row.textContent.trim();
      return;
    }
    if (index === 1) {
      headingText = row.textContent.trim();
      return;
    }
    if (index === 2 && row.querySelector('div > div > p')) {
      target = row.textContent.trim();
      return;
    }

    if (
      index === 3
      && /^[1-4]$/.test(row.textContent.trim())
    ) {
      gridValue = row.textContent.trim();
      return;
    }

    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    const firstDiv = li.children[0];
    const youtubeLink = firstDiv.textContent.trim();
    let videoThumbnailImg;

    if (!youtubeLink.includes('youtube')) {
      [...li.children].forEach((div, divIndex) => {
        if (divIndex !== 0 && div.querySelector('picture')) {
          const pictureImg = div.querySelector('picture img');
          if (pictureImg) videoThumbnailImg = pictureImg.src;
          div.innerHTML = '';
        }

        if (divIndex === 0 && firstDiv) {
          const picture = firstDiv.querySelector('picture');

          let videoSrc = '';
          const videoAnchor = firstDiv.querySelector('a[href$=".mp4"]');
          if (videoAnchor) {
            videoSrc = videoAnchor.href;
          } else {
            const text = firstDiv.textContent.trim();
            if (text.endsWith('.mp4')) videoSrc = text;
          }

          if (picture) {
            firstDiv.className = 'cards-card-image';
          } else if (videoSrc) {
            const thumbnailSrc = videoThumbnailImg || `${videoSrc}/jcr:content/renditions/cq5dam.web.1280.1280.jpeg`;

            const videoWrapper = document.createElement('div');
            videoWrapper.className = 'video-wrapper';

            const video = document.createElement('video');
            video.src = videoSrc;
            video.poster = thumbnailSrc;
            video.setAttribute('title', 'Embedded Video');
            video.setAttribute('loading', 'lazy');
            video.setAttribute('playsinline', '');
            video.setAttribute('preload', 'metadata');

            const playBtn = document.createElement('button');
            playBtn.className = 'custom-play-button';
            playBtn.innerHTML = `<span class="icon icon-play"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none">
              <path d="M3.50715 1.31598C1.70404 0.281693 0.242188 1.129 0.242188 3.20698V18.5416C0.242188 20.6216 1.70404 21.4678 3.50715 20.4345L16.9103 12.7479C18.7141 11.7132 18.7141 10.0369 16.9103 9.0025L3.50715 1.31598Z" fill="white"/>
            </svg></span>`;

            playBtn.addEventListener('click', () => {
              const modal = document.getElementById('video-modal');
              const modalContainer = document.getElementById('video-modal-container');
              if (!modal || !modalContainer) return;

              modalContainer.innerHTML = '';
              const modalTitle = document.getElementById('modal-header-title');
              const heading = li.querySelector('h5');
              modalTitle.textContent = heading ? heading.textContent.trim() : '';

              const youtubeWrapper = video.closest('.cards-card-image')?.querySelector('div[data-youtube-url]');
              const youtubeUrl = youtubeWrapper?.getAttribute('data-youtube-url');

              if (youtubeUrl) {
                const parsedUrl = new URL(youtubeUrl);
                const embed = embedYoutube(parsedUrl, true, false);
                modalContainer.appendChild(embed);
              } else {
                const modalVideo = document.createElement('video');
                modalVideo.src = video.src;
                modalVideo.poster = video.poster;
                modalVideo.controls = true;
                modalVideo.autoplay = true;
                modalVideo.setAttribute('playsinline', '');
                modalVideo.setAttribute('preload', 'metadata');
                modalVideo.style.width = '100%';
                modalVideo.style.height = 'auto';
                modalContainer.appendChild(modalVideo);
                modalVideo.play().catch(console.error);
              }

              modal.classList.remove('hidden');
            });

            if (videoAnchor) {
              moveInstrumentation(videoAnchor, video);
            }

            videoWrapper.appendChild(video);
            videoWrapper.appendChild(playBtn);
            firstDiv.innerHTML = '';
            firstDiv.appendChild(videoWrapper);
            firstDiv.className = 'cards-card-image';
          }
        } else {
          div.className = 'cards-card-body';
        }
      });

      const anchor = li.querySelector('a');
      if (anchor) {
        anchor.setAttribute('target', target);
        anchor.appendChild(span({ class: 'icon icon-right-arrow' }));
      }

      if (videoThumbnailImg) {
        li.querySelectorAll('video').forEach((video) => {
          video.setAttribute('poster', videoThumbnailImg);
        });
      }

      ul.append(li);
      decorateIcons(li);
    } else {
      [...li.children].forEach((div, divIndex) => {
        if (divIndex === 0 && firstDiv) {
          const vid = extractYouTubeID(youtubeLink);

          if (!vid) {
            console.warn('Could not extract YouTube video ID from:', youtubeLink);
            return;
          }

          const thumbnailSrc = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;

          const videoWrapper = document.createElement('div');
          videoWrapper.className = 'video-wrapper';
          videoWrapper.style.border = '1px solid #ddd';

          const thumbnail = document.createElement('img');
          thumbnail.src = thumbnailSrc;
          thumbnail.alt = 'YouTube Video Thumbnail';

          const playBtn = document.createElement('button');
          playBtn.className = 'custom-play-button';
          playBtn.innerHTML = `<span class="icon icon-play"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none">
              <path d="M3.50715 1.31598C1.70404 0.281693 0.242188 1.129 0.242188 3.20698V18.5416C0.242188 20.6216 1.70404 21.4678 3.50715 20.4345L16.9103 12.7479C18.7141 11.7132 18.7141 10.0369 16.9103 9.0025L3.50715 1.31598Z" fill="white"/>
            </svg></span>`;

          playBtn.addEventListener('click', () => {
            const modal = document.getElementById('video-modal');
            const modalContainer = document.getElementById('video-modal-container');
            if (!modal || !modalContainer) {
              return;
            }

            modalContainer.innerHTML = '';

            const modalTitle = document.getElementById('modal-header-title');
            modalTitle.innerHTML = '';
            const heading = li.querySelector('h5');
            if (modalTitle && heading) {
              modalTitle.textContent = heading.textContent.trim();
            }

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1&controls=1&rel=0`;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            modalContainer.appendChild(iframe);
            modal.classList.remove('hidden');
          });

          videoWrapper.appendChild(thumbnail);
          videoWrapper.appendChild(playBtn);
          firstDiv.innerHTML = '';
          firstDiv.appendChild(videoWrapper);
          firstDiv.className = 'cards-card-image';
        } else {
          div.className = 'cards-card-body';
        }
      });
      ul.append(li);
      decorateIcons(li);
    }
  });

  if (gridValue) {
    const gridClass = `grid-${gridValue}`;
    ul.classList.add(gridClass);
  } else {
    // Default to grid-4 if no gridValue is specified
    ul.classList.add('grid-4');
  }

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  const headingEl = document.createElement('h2');
  headingEl.textContent = headingText;
  headingEl.className = 'cards-heading';

  block.textContent = '';
  block.id = `${id}-content`;
  block.parentElement.classList.add('tabs-container-wrapper');
  block.append(headingEl);
  block.append(ul);
}
