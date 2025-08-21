import getEventIcon from './eventTypeIcon.js';

function createElement(tag, className, innerHTML = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function createIcon(eventType) {
  const iconContainer = createElement('div', 'event-icon');
  const icon = createElement('span');
  icon.innerHTML = getEventIcon(eventType.trim());

  iconContainer.appendChild(icon);
  return iconContainer;
}

function createDate(month, date) {
  return createElement('div', 'event-date', `<span>${month}</span><strong>${date}</strong>`);
}

function createInfo(eventType, description) {
  return createElement('div', 'event-info', `<span class="tag">${eventType}</span><p>${description}</p>`);
}

function createAction(event) {
  return createElement('div', 'event-action', `
    <a href="${event.ClickUri}" class="register-link">
      Register Now 
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
          <path d="M0 7L15 7" stroke="#0068FA"/>
          <path d="M9 1L15 7L9 13" stroke="#0068FA"/>
        </svg>
      </span>
    </a>
  `);
}

function createEventCard(event) {
  const eventType = event.raw.eventtype[0];
  const description = event.Excerpt ? event.Excerpt : event.title;
  const month = event.raw.eventmonth;

  const newDate = new Date(event.raw.eventdate);
  const day = newDate.getDate();
  const date = day;

  const icon = createIcon(eventType);
  const dateEl = createDate(month, date);
  const info = createInfo(eventType, description);
  const action = createAction(event);

  const eventCard = createElement('div', 'event-card');

  if (window.matchMedia('(max-width: 768px)').matches) {
    const iconDate = createElement('div', 'icon-date');
    iconDate.append(icon, dateEl);

    const infoAction = createElement('div', 'info-action');
    infoAction.append(info, action);

    eventCard.append(iconDate, infoAction);
  } else {
    eventCard.append(icon, dateEl, info, action);
  }

  return eventCard;
}

function groupEventsByMonth(events) {
  return events.reduce((acc, event) => {
    const date = new Date(event.raw.eventdate);
    const year = date.getFullYear();
    const key = `${event.raw.eventmonth} ${year}`;
    acc[key] = acc[key] || [];
    acc[key].push(event);
    return acc;
  }, {});
}

function createMonthHeading(monthKey) {
  return createElement('div', 'month-heading', monthKey);
}

function renderGroupedEvents(groupedEvents, container) {
  Object.entries(groupedEvents)
    .sort(([a], [b]) => new Date(`1 ${a}`) - new Date(`1 ${b}`)) // Sort by date
    .forEach(([monthKey, events]) => {
      container.appendChild(createMonthHeading(monthKey));
      events.forEach((event, idx) => {
        const card = createEventCard(event);
        if (idx === events.length - 1) {
          card.classList.add('last-in-group');
        }
        container.appendChild(card);
      });
    });
}

export default function renderEventList(eventResultsListController) {
  const eventList = createElement('div', 'event-list');

  const events = eventResultsListController.state.results;

  const groupedEvents = groupEventsByMonth(events);

  renderGroupedEvents(groupedEvents, eventList);
  return eventList;
}
