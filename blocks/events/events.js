import { } from '../../scripts/aem.js'; // Leave if needed for AEM-specific setup
import renderEvents from '../../scripts/events-page/components/initialize-event.js';
import renderEventSearchBox from '../../scripts/events-page/components/renderEventSeachBox.js';
import { eventSearchEngine } from '../../scripts/events-page/event-engine.js';
import { tabController, eventregionController, } from '../../scripts/events-page/controller/event-page-controllers.js';

function getEventPageParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    event: params.get('event'),
    region: params.get('region'),
  };
}

function clearQueryParams() {
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
}

export default async function decorate(block) {

  const { event, region } = getEventPageParams();
  const eventsDiv = document.createElement('div');
  eventsDiv.id = 'events';

  const modal = document.createElement('div');
  modal.id = 'event-filter-modal';
  modal.className = 'event-modal hidden';
  document.body.appendChild(modal);

  // Create tab navigation
  const nav = document.createElement('nav');
  nav.className = 'tab-nav';

  const tabs = document.createElement('div');
  tabs.className = 'tabs';

  const tabUpcoming = document.createElement('button');
  tabUpcoming.className = 'tab active';
  tabUpcoming.dataset.tab = 'upcoming';
  tabUpcoming.textContent = 'Upcoming events';

  const tabOnDemand = document.createElement('button');
  tabOnDemand.className = 'tab';
  tabOnDemand.dataset.tab = 'on-demand';
  tabOnDemand.textContent = 'On-demand';

  tabs.appendChild(tabUpcoming);
  tabs.appendChild(tabOnDemand);

  const searchBox = renderEventSearchBox();

  nav.appendChild(tabs);
  nav.appendChild(searchBox);
  eventsDiv.appendChild(nav);

  // Render and store references to section containers
  let upcomingSection = renderEvents();

  eventsDiv.appendChild(upcomingSection);

  // Tab switching logic
  eventsDiv.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      eventsDiv.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      eventsDiv.querySelectorAll('.event-details').forEach((section) => section.classList.remove('active'));

      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      if (tabName === 'upcoming') {
        tabController('NOT@eventType==On-demand', 'Upcoming');
      } else {
        tabController('@eventtype==On-demand', 'OnDemand');
      }
      const target = eventsDiv.querySelector(`#${tabName}`);
      if (target) target.classList.add('active');
    });
  });

  localStorage.removeItem('searchTerm');

  block.textContent = '';
  block.append(eventsDiv);

  try {
    eventSearchEngine.executeFirstSearch();
  
    if (event === 'on-demand') {
      tabOnDemand.classList.add('active');
      tabUpcoming.classList.remove('active');
    
      tabController('@eventtype==On-demand', 'OnDemand');
    } else {
      tabUpcoming.classList.add('active');
      tabOnDemand.classList.remove('active');
    
      tabController('NOT@eventType==On-demand', 'Upcoming');
    }

    clearQueryParams();

    let regionApplied = false;

    eventSearchEngine.subscribe(() => {
    
      if (region && !regionApplied) {
        const regionValue = eventregionController.state.values.find(
          (v) => v.value.toLowerCase() === region.toLowerCase(),
        );
    
        if (regionValue) {
          eventregionController.toggleSelect(regionValue);
          regionApplied = true;
        }
      }
    
      const newUpcoming = renderEvents();
    
      eventsDiv.replaceChild(newUpcoming, upcomingSection);
    
      upcomingSection = newUpcoming;
    });
  } catch (error) {
    eventSearchEngine.executeFirstSearch();
  }
}
