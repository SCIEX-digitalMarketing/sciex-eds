import { decorateIcons } from '../../scripts/aem.js';
 
/* List of background colors considered light */
const LIGHT_BACKGROUNDS = ['#C6C6C6', '#FFFFFF', '#F0F0F0'];
 
/* Check if provided color is a light background */
function isLightBackground(color) {
  if (!color) return false;
  return LIGHT_BACKGROUNDS.includes(color.trim().toUpperCase());
}
 
/* Apply icon inversion for visibility on light backgrounds */
function applyInvertFilter(element, color) {
  element.style.filter = isLightBackground(color) ? 'invert(1)' : 'invert(0)';
}
 
/* Convert raw date string into formatted date and time */
function formatDateTime(dateString) {
  const dateObj = new Date(dateString);
  if (Number.isNaN(dateObj.getTime())) return null;
 
  const pad = (n) => String(n).padStart(2, '0');
 
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
 
  const day = pad(dateObj.getDate());
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
 
  let hours = dateObj.getHours();
  const minutes = pad(dateObj.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
 
  hours = hours % 12 || 12;
 
  return {
    date: `${day} ${month} ${year}`,
    time: `${hours}:${minutes} ${ampm}`,
  };
}
 
/* Render eyebrow label above heading */
function decorateEyebrow(eyebrowText, buttonColor, container) {
  const wrapper = document.createElement('p');
  wrapper.classList.add('eyebrow-wrapper');
 
  const highlight = document.createElement('span');
  highlight.classList.add('eyebrow-highlight');
  highlight.textContent = eyebrowText;
 
  /* Adjust border/text color based on background */
  if (isLightBackground(buttonColor)) {
    highlight.style.border = '1.5px solid #141414';
  } else {
    highlight.style.border = '1.5px solid #fff';
    highlight.style.color = '#fff';
  }
 
  highlight.style.borderRadius = '4px';
  wrapper.append(highlight);
  container.append(wrapper);
}
 
export default function decorate(block) {
 
  /* Extract authored content from the block */
  const bannerImg = block.querySelector('picture > img');
  const heading = block.querySelector('h5');
  const description = heading?.nextElementSibling;
  const timeText = block.children[5]?.textContent?.trim();
 
  const buttonContainer = block.querySelector('.button-container');
  const buttonLabel = buttonContainer?.querySelector('a')?.textContent;
 
  const eyebrowText = block.children[2]?.textContent?.trim();
  const isFullImage = block.children[6]?.textContent?.trim()?.toLowerCase() === 'true';
 
  /* Variables used only in full-image layout */
  let overlayImage;
  let fullWidthButtonText;
  let fullWidthButtonLink;
  let fullWidthButtonTarget;
  let fullWidthButtonIcon;
 
  if (isFullImage) {
    overlayImage = block.children[7]?.querySelector('picture');
    fullWidthButtonText = block.children[8]?.textContent?.trim();
    fullWidthButtonLink = block.children[9]?.textContent?.trim();
    fullWidthButtonIcon = block.children[10]?.querySelector('picture');
    fullWidthButtonTarget = block.children[11]?.textContent?.trim();
  }
 
  /* Clear original block content before rebuilding layout */
  block.innerHTML = '';
 
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');
 
  if (isFullImage) {
    eventCard.classList.add('full-image-layout');
  }
 
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('event-content');
 
  /* Apply theme based on background color */
  if (buttonLabel && !isFullImage) {
    const lightTheme = isLightBackground(buttonLabel);
    contentContainer.classList.add(lightTheme ? 'light-theme' : 'dark-theme');
  }
 
  /* Eyebrow label */
  if (eyebrowText) {
    decorateEyebrow(eyebrowText, buttonLabel, contentContainer);
  }
 
  /* Heading and description */
  if (heading) {
    const headingGroup = document.createElement('div');
    headingGroup.classList.add('heading-group');
 
    headingGroup.append(heading);
    if (description) headingGroup.append(description);
 
    contentContainer.append(headingGroup);
  }
 
  /* Render date and time for standard layout */
  const formatted = formatDateTime(timeText);
 
  if (formatted && !isFullImage) {
    const datetimeWrapper = document.createElement('div');
    datetimeWrapper.classList.add('datetime-wrapper');
 
    const dateItem = document.createElement('div');
    dateItem.classList.add('datetime-item');
 
    const calendarIcon = document.createElement('span');
    calendarIcon.classList.add('icon', 'icon-calender');
    applyInvertFilter(calendarIcon, buttonLabel);
 
    const dateSpan = document.createElement('span');
    dateSpan.classList.add('event-date');
    dateSpan.textContent = formatted.date;
 
    dateItem.append(calendarIcon, dateSpan);
 
    const timeItem = document.createElement('div');
    timeItem.classList.add('datetime-item');
 
    const clockIcon = document.createElement('span');
    clockIcon.classList.add('icon', 'icon-clock');
    applyInvertFilter(clockIcon, buttonLabel);
 
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('event-time');
    timeSpan.textContent = formatted.time;
 
    timeItem.append(clockIcon, timeSpan);
 
    datetimeWrapper.append(dateItem, timeItem);
    contentContainer.append(datetimeWrapper);
  }
 
  /* Full-width button used in full-image layout */
  if (isFullImage && fullWidthButtonText && fullWidthButtonLink) {
 
    const buttonWrapper = document.createElement('p');
    buttonWrapper.classList.add('button-container');
 
    const button = document.createElement('a');
    button.classList.add('button');
    button.href = fullWidthButtonLink;
 
    if (fullWidthButtonTarget) {
      button.target = fullWidthButtonTarget;
    }
 
    const textSpan = document.createElement('span');
    textSpan.textContent = fullWidthButtonText;
    button.append(textSpan);
 
    /* Optional button icon */
    if (fullWidthButtonIcon) {
      const iconWrapper = document.createElement('span');
      iconWrapper.classList.add('button-icon');
 
      iconWrapper.append(fullWidthButtonIcon.cloneNode(true));
      button.append(iconWrapper);
    }
 
    buttonWrapper.append(button);
    contentContainer.append(buttonWrapper);
  }
 
  /* Convert icon placeholders into SVG icons */
  decorateIcons(contentContainer);
 
  /* Image container */
  const imageContainer = document.createElement('div');
  const overlayWrapper = document.createElement('div');
  imageContainer.classList.add('event-image');
 
  if (bannerImg) {
    imageContainer.append(bannerImg);
  }
 
  /* Overlay image for full-image layout */
  if (isFullImage && overlayImage) {
    overlayWrapper.classList.add('overlay-image');
 
    overlayWrapper.append(overlayImage.cloneNode(true));
  }
 
  /* Final card assembly */
  eventCard.append(imageContainer,overlayWrapper, contentContainer );
  block.append(eventCard);
}
