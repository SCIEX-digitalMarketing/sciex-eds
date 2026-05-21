import { span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/aem.js';
import  getCourseCatalogData  from '../../scripts/blocks-controllers/course-catalog-controller.js';

const USER_API = '/bin/sciex/currentuserdetails';

async function checkLoginStatus() {
  try {
    const userResp = await fetch(USER_API, { credentials: 'include' });

    if (!userResp.ok) {
      throw new Error(`User API failed: ${userResp.status}`);
    }

    const user = await userResp.json();
    return [user?.loggedIn === true, user?.email];
  } catch (e) {
    console.warn('Course catalog detail: treating user as logged out', e);
    return [false, null];
  }
}

export default async function decorate(block) {
  const children = Array.from(block.children);
  if (children.length < 10) return;
  const courseId = children[0]?.textContent?.trim();
  const courseTitle = children[1]?.textContent?.trim();
  const courseUrl = children[2]?.textContent?.trim();
  const courseRating = children[3]?.textContent?.trim();
  const description = children[4]?.innerHTML?.trim();
  const duration = children[5]?.textContent?.trim();
  const region = children[6]?.textContent?.trim();
  const language = children[7]?.textContent?.trim();
  const courseType = children[8]?.textContent?.trim();
  const courseLevel = children[9]?.textContent?.trim();
  const relatedResources = children[10]?.textContent?.trim();
  const isFree = children[11]?.textContent?.trim();
  console.log('freeeeeeeeeeeee', isFree);
  console.log('id', courseId, relatedResources, isFree);

  // Check login status and fetch available course sessions if logged in
  const [isLoggedIn, userEmail] = await checkLoginStatus();

  // Determine cost display based on login status and free status
  let costDisplay = '';
  let costClassName = '';

  if (isLoggedIn && userEmail && courseId) {
    // Fetch cost from API if logged in
    const catalogData = await getCourseCatalogData(userEmail, courseId);
    if (catalogData && catalogData.cost && catalogData.cost.PriceBookEntry) {
      const unitPrice = catalogData.cost.PriceBookEntry.UnitPrice;
      costDisplay = `$${unitPrice}`;
    }
  } else {
    // Not logged in - show Free or Login for price
    costDisplay = isFree === 'true' ? 'Free' : 'Login for price';
    costClassName = 'cost-not-logged-in';
  }

  // Convert "78.5%" → 3.9 (out of 5)
  let numericRating = 0;

  if (courseRating) {
    const percent = parseFloat(courseRating.replace('%', '').trim());
    numericRating = ((percent / 100) * 5).toFixed(1);
  }

  const starsContainer = document.createElement('div');
  starsContainer.className = 'stars-container';

  const ratingValue = Math.round(parseFloat(numericRating));

  for (let i = 1; i <= 5; i += 1) {
    const star = document.createElement('p');
    star.className = 'star';

    const fillColor = i <= ratingValue ? '#F2C94C' : '#E0E0E0';

    star.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
      <path d="M11.4141 0L14.1082 8.2918H22.8267L15.7733 13.4164L18.4675 21.7082L11.4141 16.5836L4.36064 21.7082L7.05481 13.4164L0.00138474 8.2918H8.71989L11.4141 0Z" fill="${fillColor}"/>
    </svg>
  `;

    starsContainer.appendChild(star);
  }

  const courseHeaderContainer = document.createElement('div');
  courseHeaderContainer.className = 'course-header-container';

  courseHeaderContainer.innerHTML = `
  <div class="course-header-row">
    <div class="course-header-left">
      <h1 class="course-name">${courseTitle}</h1>
      <div class="rating">Rating:</div>
    </div>

   <div class="course-header-social">
      <span class="favorite-icon" aria-label="Favorite">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 22"
          width="20"
          height="20"
          fill="none"
          stroke="#000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21.1412 11.2293L11.7662 20.5143L2.39125 11.2293C1.77288 10.6275 1.2858 9.90428 0.96068 9.10505C0.635562 8.30583 0.479448 7.44795 0.502167 6.58543C0.524887 5.7229 0.725949 4.87443 1.09269 4.09343C1.45944 3.31243 1.98391 2.61583 2.6331 2.04748C3.28229 1.47914 4.04213 1.05137 4.86476 0.79111C5.68739 0.53085 6.555 0.443739 7.41296 0.535261C8.27091 0.626783 9.10062 0.894955 9.84984 1.32289C10.5991 1.75083 11.2516 2.32926 11.7662 3.02176C12.2832 2.33429 12.9364 1.76091 13.6851 1.33752C14.4338 0.91412 15.2619 0.649821 16.1174 0.561159C16.973 0.472497 17.8376 0.561382 18.6572 0.822249C19.4768 1.08312 20.2338 1.51035 20.8807 2.07721C21.5276 2.64408 22.0505 3.33836 22.4168 4.11662C22.783 4.89488 22.9847 5.74036 23.0091 6.60014C23.0336 7.45993 22.8803 8.3155 22.5589 9.11332C22.2375 9.91114 21.7549 10.634 21.1412 11.2368" />
        </svg>
      </span>  
    </div>
  </div>

  <div class="course-header-border"></div>
`;
  const ratingDiv = courseHeaderContainer.querySelector('.rating');

  // Add stars
  ratingDiv.appendChild(starsContainer);
  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('description-container');
  descriptionContainer.innerHTML = description;

  // ===== Convert "Follow on courses" UL → TABLE =====
  const items = descriptionContainer.querySelectorAll('li');

  items.forEach((li) => {
    const strong = li.querySelector('strong');

    if (strong && strong.textContent.includes('Follow on courses')) {
      const ul = li.querySelector('ul');

      if (ul) {
        const table = document.createElement('table');
        table.classList.add('course-table');

        // ===== HEADER ROW =====
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const th1 = document.createElement('th');
        th1.textContent = 'No';

        const th2 = document.createElement('th');
        th2.textContent = 'Course info';

        headerRow.append(th1, th2);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // ===== BODY =====
        const tbody = document.createElement('tbody');

        Array.from(ul.children).forEach((childLi) => {
          const tr = document.createElement('tr');

          const temp = document.createElement('div');
          temp.innerHTML = childLi.innerHTML;

          const fullText = temp.textContent
            .replace(/\u00A0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          const firstSpaceIndex = fullText.indexOf(' ');
          const code = fullText.slice(0, firstSpaceIndex).trim();

          const descHTML = temp.innerHTML.slice(firstSpaceIndex)
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          const td1 = document.createElement('td');
          td1.textContent = code;

          const td2 = document.createElement('td');
          td2.innerHTML = descHTML;

          tr.append(td1, td2);
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        li.replaceChild(table, ul);
      }
    }
  });

  const relatedContainer = document.createElement('div');
  relatedContainer.classList.add('related-container');

  // Heading
  const heading = document.createElement('h4');
  heading.className = 'related-title';
  heading.textContent = 'Related resources';
  const linksWrapper = document.createElement('div');
  linksWrapper.classList.add('related-links');

  if (relatedResources) {
    relatedContainer.appendChild(heading);

    const relatedResourcesItems = relatedResources.split(',');

    relatedResourcesItems.forEach((item) => {
      const [label, url] = item.split(':');

      if (label && url) {
        const link = document.createElement('a');
        link.href = url.trim();
        link.textContent = label.trim();

        linksWrapper.appendChild(link);
      }
    });
  }
  relatedContainer.appendChild(linksWrapper);
  const exploreBtn = document.createElement('a');
  exploreBtn.href = '/explore-more-courses';
  exploreBtn.target = '_blank';
  exploreBtn.className = 'btn secondary related-explore-btn';
  exploreBtn.textContent = 'Explore more courses';

  // icon
  exploreBtn.append(span({ class: 'icon icon-arrow-blue' }));
  // append buttons
  decorateIcons(exploreBtn);
  relatedContainer.appendChild(exploreBtn);

  descriptionContainer.appendChild(relatedContainer);

  // ===== RIGHT (COURSE DETAILS) =====
  const courseDetailsContainer = document.createElement('div');
  courseDetailsContainer.className = 'course-details-container';

  courseDetailsContainer.innerHTML = `
  <h3 class="course-details-title">Course details</h3>
  <div class="course-detail-info">

  <div class="course-detail-row">
    <span class="course-detail-key">Cost:</span>
    <span class="course-detail-value"></span>
  </div>

  <div class="course-detail-row">
    <span class="course-detail-key">Duration:</span>
    <span class="course-detail-value">${duration}</span>
  </div>

  <div class="course-detail-row">
    <span class="course-detail-key">Region:</span>
    <span class="course-detail-value">${region}</span>
  </div>

  <div class="course-detail-row">
    <span class="course-detail-key">Language:</span>
    <span class="course-detail-value">${language}</span>
  </div>

  <div class="course-detail-row">
    <span class="course-detail-key">Type:</span>
    <span class="course-detail-value">${courseType}</span>
  </div>

  <div class="course-detail-row">
    <span class="course-detail-key">Course Level:</span>
    <span class="course-detail-value">${courseLevel}</span>
  </div>
  </div>
  <div class="course-action-row"></div> 
`;
  // Update cost display in the course details
  const costValueSpan = courseDetailsContainer.querySelector('.course-detail-value');
  if (costValueSpan) {
    if (costDisplay === 'Login for price') {
      costValueSpan.innerHTML = `<a href="https://devcs.sciex.com/bin/sciex/login" class="cost-login-link">${costDisplay}</a>`;
    } else {
      costValueSpan.textContent = costDisplay;
    }
    if (costClassName) {
      costValueSpan.classList.add(costClassName);
    }
  }

  const actionRow = courseDetailsContainer.querySelector('.course-action-row');

  // --- Primary button ---
  const takeCourseBtn = document.createElement('a');
  takeCourseBtn.href = courseUrl;
  takeCourseBtn.target = '_blank';
  takeCourseBtn.className = 'btn primary';
  takeCourseBtn.textContent = 'Take course';

  // icon (your required pattern)
  takeCourseBtn.append(span({ class: 'icon icon-arrow' }));

  // --- Secondary button ---
  const quoteBtn = document.createElement('a');
  quoteBtn.href = '/my-learning-hub';
  quoteBtn.target = '_blank';
  quoteBtn.className = 'btn secondary';
  quoteBtn.textContent = 'Request a quote';

  // icon
  quoteBtn.append(span({ class: 'icon icon-arrow-blue' }));
  // append buttons
  actionRow.append(takeCourseBtn, quoteBtn);
  decorateIcons(actionRow);

  // ===== MAIN LAYOUT WRAPPER =====
  const layout = document.createElement('div');
  layout.className = 'course-layout';

  layout.append(descriptionContainer, courseDetailsContainer);
  const mainLayout = document.createElement('div');
  mainLayout.className = 'course-catalog-detail-main-layout';
  mainLayout.append(courseHeaderContainer, layout);
  block.textContent = '';
  block.append(mainLayout);
}
