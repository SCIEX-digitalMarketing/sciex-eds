import { } from '../../scripts/aem.js';

export default function decorate(block) {
  const div = document.createElement('div');
  const rows = [...block.children];
  rows.forEach((row, index) => {
    if (index === 0) {
      div.id = row.children[0].textContent;
    } else if (index === 1) {
      const title = document.createElement('div');
      title.classList.add('event-details-heading');
      title.textContent = row.children[0].textContent;
      div.appendChild(title);
    } else if (index === 2) {
      const fullDateTime = row.children[0].textContent.trim();

      // Check if it contains a 'T' to split
      if (fullDateTime.includes('T')) {
        const [date, time] = fullDateTime.split('T');

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('events-details-text', 'events-icontext');
        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
        dateDiv.textContent = formattedDate;

        const calendarIcon = document.createElement('div');
        calendarIcon.alt = 'Calendar Icon';

        const svgMarkup = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9.22935 12.491V10.9488H10.7713V12.491H9.22935ZM5.39648 12.491V10.9488H6.93848V12.491H5.39648ZM13.0622 12.491V10.9488H14.6042V12.491H13.0622ZM9.22935 15.9534V14.4111H10.7713V15.9534H9.22935ZM5.39648 15.9534V14.4111H6.93848V15.9534H5.39648ZM13.0622 15.9534V14.4111H14.6042V15.9534H13.0622ZM2.23633 19V3.47196H5.9633V1H7.27877V3.47196H12.7598V1H14.0374V3.47196H17.7644V19H2.23633ZM3.51395 17.7224H16.4867V9.17974H3.51395V17.7224ZM3.51395 7.90212H16.4867V4.74958H3.51395V7.90212Z" fill="#0068FA"/>
        </svg>
        `;

        calendarIcon.innerHTML = svgMarkup;

        dateDiv.insertBefore(calendarIcon, dateDiv.firstChild);
        const timeDiv = document.createElement('div');
        timeDiv.id = 'event-time';
        timeDiv.classList.add('events-details-text', 'events-icontext');
        timeDiv.textContent = time;
        const clockIcon = document.createElement('div');
        clockIcon.alt = 'Clock Icon';
        const clockSvgMarkup = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 10L10 10L10 4" stroke="#0068FA"/>
          <circle cx="10" cy="10" r="9" stroke="#0068FA"/>
        </svg>
        `;
        clockIcon.innerHTML = clockSvgMarkup;

        timeDiv.insertBefore(clockIcon, timeDiv.firstChild);
        div.appendChild(dateDiv);
        div.appendChild(timeDiv);
      } else {
        // Fallback if no 'T' in string
        const title = document.createElement('div');
        title.classList.add('events-details-text', 'events-icontext');
        title.textContent = fullDateTime;
        div.appendChild(title);
      }
    } else if (index === 3) {
      const title = document.createElement('div');
      title.classList.add('events-details-text', 'events-icontext');
      title.textContent = row.children[0].textContent;

      const locationIcon = document.createElement('div');
      locationIcon.alt = 'Location Icon';
      const locationIconMarkup = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clip-path="url(#clip0_142_3085)">
          <path d="M7 9C7 9.79565 7.31607 10.5587 7.87868 11.1213C8.44129 11.6839 9.20435 12 10 12C10.7956 12 11.5587 11.6839 12.1213 11.1213C12.6839 10.5587 13 9.79565 13 9C13 8.20435 12.6839 7.44129 12.1213 6.87868C11.5587 6.31607 10.7956 6 10 6C9.20435 6 8.44129 6.31607 7.87868 6.87868C7.31607 7.44129 7 8.20435 7 9Z" stroke="#0068FA" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.5088 14.2985L11.3771 18.4303C11.0119 18.7951 10.5168 19 10.0006 19C9.48446 19 8.98939 18.7951 8.62421 18.4303L4.49152 14.2985C3.40208 13.2091 2.66018 11.821 2.35962 10.3098C2.05907 8.7987 2.21336 7.23237 2.803 5.80892C3.39263 4.38547 4.39112 3.16884 5.6722 2.31286C6.95328 1.45688 8.45942 1 10.0002 1C11.5409 1 13.047 1.45688 14.3281 2.31286C15.6092 3.16884 16.6077 4.38547 17.1973 5.80892C17.787 7.23237 17.9412 8.7987 17.6407 10.3098C17.3401 11.821 16.5982 13.2091 15.5088 14.2985Z" stroke="#0068FA" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_142_3085">
            <rect width="20" height="20" fill="white"/>
          </clipPath>
        </defs>
      </svg>`;
      locationIcon.innerHTML = locationIconMarkup;

      title.insertBefore(locationIcon, title.firstChild);
      div.appendChild(title);
      const eventtime = div.querySelector('#event-time');
      if (eventtime) {
        div.appendChild(eventtime);
      }
    } else if (index === 4) {
      const buttonrow = document.createElement('div');
      buttonrow.classList.add('button-row');
      if (row.children[0]) {
        const button = document.createElement('button');
        button.classList.add('primary-button');
        button.appendChild(document.createTextNode(row.children[0].textContent));
        const anchor = document.createElement('a');
        anchor.classList.add('button1-link');
        anchor.appendChild(button);
        buttonrow.appendChild(anchor);
      }
      div.appendChild(buttonrow);
    } else if (index === 5) {
      let href = '#';
      if (row.children[0]) {
        href = row.children[0].textContent;
      }
      if (div.querySelector('.button1-link')) {
        div.querySelector('.button1-link').setAttribute('href', href);
      }
    } else if (index === 6) {
      let target = '_blank';
      if (row.children[0]) {
        target = row.children[0].textContent;
      }
      if (div.querySelector('.button1-link')) {
        div.querySelector('.button1-link').setAttribute('target', target);
      }
    } else if (index === 7) {
      const buttonrow = div.querySelector('.button-row');
      if (buttonrow && row.children[0]) {
        const button = document.createElement('button');
        button.classList.add('secondary-button');
        button.appendChild(document.createTextNode(row.children[0].textContent));
        const anchor = document.createElement('a');
        anchor.classList.add('button2-link');
        anchor.appendChild(button);
        buttonrow.appendChild(anchor);
      }
    } else if (index === 8) {
      let href = '#';
      if (row.children[0]) {
        href = row.children[0].textContent;
      }
      if (div.querySelector('.button2-link')) {
        div.querySelector('.button2-link').setAttribute('href', href);
      }
    } else if (index === 9) {
      let target = '_blank';
      if (row.children[0]) {
        target = row.children[0].textContent;
      }
      if (div.querySelector('.button2-link')) {
        div.querySelector('.button2-link').setAttribute('target', target);
      }
    }
  });
  block.classList.add('events-details');
  block.textContent = '';
  block.append(div);
}
