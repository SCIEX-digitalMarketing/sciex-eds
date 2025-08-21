import { decorateIcons } from '../../scripts/aem.js';

const lightBackgrounds = ['#C6C6C6', '#FFFFFF', '#F0F0F0'];

function isLightBackground(color) {
  if (!color) return false;
  const normalized = color.trim().toUpperCase();
  return lightBackgrounds.includes(normalized);
}

function applyInvertFilter(element, color) {
  element.style.filter = isLightBackground(color) ? 'invert(1)' : 'invert(0)';
}

function decorateEyebrow(eyeBrow, buttonText, contentContainer) {
  const eyebrowWrapper = document.createElement('p');
  eyebrowWrapper.classList.add('eyebrow-wrapper');

  const borderedPart = document.createElement('span');
  borderedPart.classList.add('eyebrow-highlight');
  borderedPart.textContent = eyeBrow;

  if (isLightBackground(buttonText)) {
    borderedPart.style.border = '1.5px solid #141414';
  } else {
    borderedPart.style.border = '1.5px solid #fff';
    borderedPart.style.color = '#fff';
  }

  borderedPart.style.borderRadius = '4px';
  eyebrowWrapper.append(borderedPart);
  contentContainer.append(eyebrowWrapper);
}

export default async function decorate(block) {
  const imgBanner = block.querySelector('picture > img');
  const heading = block.querySelector('h5');
  const description = heading?.nextElementSibling;
  const lastChild = block.lastElementChild;
  const time = lastChild.textContent.trim();

  const buttonContainer = block.querySelector('.button-container');
  const buttonText = buttonContainer?.querySelector('a')?.textContent;
  const eyeBrow = block.children[2]?.textContent?.trim();

  block.textContent = '';

  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('event-content');

  if (buttonText) {
    const isLight = isLightBackground(buttonText);
    contentContainer.classList.add(isLight ? 'light-theme' : 'dark-theme');
  }

  // Eyebrow
  if (eyeBrow) {
    decorateEyebrow(eyeBrow, buttonText, contentContainer);
  }

  // Heading and sibling grouped
  if (heading) {
    const headingGroup = document.createElement('div');
    headingGroup.classList.add('heading-group');
    headingGroup.append(heading);
    if (description) headingGroup.append(description);
    contentContainer.append(headingGroup);
  }

  // Format Date and Time if valid
  const dateObj = new Date(time);
  if (!Number.isNaN(dateObj.getTime())) {
    const pad = (num) => String(num).padStart(2, '0');
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const day = pad(dateObj.getDate());
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    const minutes = pad(dateObj.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    const formattedDate = `${day} ${month} ${year}`;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    const datetimeWrapper = document.createElement('div');
    datetimeWrapper.classList.add('datetime-wrapper');

    const dateContainer = document.createElement('div');
    dateContainer.classList.add('datetime-item');
    const calendarIcon = document.createElement('span');
    calendarIcon.classList.add('icon', 'icon-calender');
    applyInvertFilter(calendarIcon, buttonText);

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('event-date');
    dateSpan.textContent = formattedDate;
    dateContainer.append(calendarIcon, dateSpan);

    const timeContainer = document.createElement('div');
    timeContainer.classList.add('datetime-item');
    const clockIcon = document.createElement('span');
    clockIcon.classList.add('icon', 'icon-clock');
    applyInvertFilter(clockIcon, buttonText);

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('event-time');
    timeSpan.textContent = formattedTime;
    timeContainer.append(clockIcon, timeSpan);

    datetimeWrapper.append(dateContainer, timeContainer);
    contentContainer.append(datetimeWrapper);
  }

  decorateIcons(contentContainer);

  // Image
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('event-image');
  if (imgBanner) imageContainer.append(imgBanner);

  eventCard.append(contentContainer, imageContainer);
  block.append(eventCard);
}
