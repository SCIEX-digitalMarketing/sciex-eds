import { span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/aem.js';
import getCourseCatalogData from '../../scripts/blocks-controllers/course-catalog-controller.js';
import {
  getfavoriteAllData,
  removeFavoriteSearchEngine,
  addToFavorite,
} from '../../scripts/favorite-all/favorite-allDocEngine.js';

const USER_API = '/bin/sciex/currentuserdetails';

/**
 * Fetches current user login status, email, and country code from API
 * Returns [isLoggedIn, userEmail, countryCode] - all null/false if API fails
 */
async function checkLoginStatus() {
  try {
    const userResp = await fetch(USER_API);

    if (!userResp.ok) {
      throw new Error(`User API failed: ${userResp.status}`);
    }

    const user = await userResp.json();
    return [user?.loggedIn === true, user?.email, user?.countryCode];
  } catch (e) {
    console.warn('Course catalog detail: treating user as logged out', e);
    return [false, null, null];
  }
}

export default async function decorate(block) {
  const children = Array.from(block.children);
  if (children.length < 13) return;
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
  const isInEcommerce = children[12]?.textContent?.trim();

  // Fetch user authentication info and allowed countries for ecommerce
  const [isLoggedIn, userEmail, countryCode] = await checkLoginStatus();
  const allowedCountryCode = ["us", "gb", "de", "ca", "cz", "nl", "it", "pt", "es"]
  
  // Initialize cost and catalog data
  let costDisplay = '';
  let costClassName = '';
  let catalogData = null;

  // Fetch pricing data from API if user is logged in
  if (isLoggedIn && userEmail && courseId) {
    catalogData = await getCourseCatalogData(userEmail, courseId);
  }

  // Display pricing: show API price if available, otherwise show Free or Login prompt
  if (catalogData && catalogData.cost && catalogData.cost.PriceBookEntry) {
    const unitPrice = catalogData.cost.PriceBookEntry.UnitPrice;
    costDisplay = `$${unitPrice}`;
  } else {
    costDisplay = isFree === 'true' ? 'Free' : 'Login for price';
    costClassName = 'cost-not-logged-in';
  }

  let numericRating = 0;

  // Convert percentage rating to 5-star scale
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
          width="30"
          height="30"
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

  // Transform "Follow on courses"  into a formatted table
  const items = descriptionContainer.querySelectorAll('li');

  items.forEach((li) => {
    const strong = li.querySelector('strong');

    if (strong && strong.textContent.includes('Follow on courses')) {
      const ul = li.querySelector('ul');

      if (ul) {
        const table = document.createElement('table');
        table.classList.add('course-table');

        // Create table header with "No" and "Course info" columns
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const th1 = document.createElement('th');
        th1.textContent = 'No';
        const th2 = document.createElement('th');
        th2.textContent = 'Course info';
        headerRow.append(th1, th2);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Populate table body with course codes and descriptions
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

  const enrollmentContainer = document.createElement('div');
  enrollmentContainer.classList.add('enrollment-container');

  const enrollmentHeading = document.createElement('h3');
  enrollmentHeading.className = 'enrollment-title';
  enrollmentHeading.textContent = 'Enrollment';
  enrollmentContainer.appendChild(enrollmentHeading);
  const tableContainer = document.createElement('div');
  tableContainer.className = 'enrollment-table-container';

  const enrollmentTable = document.createElement('table');
  enrollmentTable.classList.add('enrollment-table');
  const enrollmentThead = document.createElement('thead');
  enrollmentThead.innerHTML = `
    <tr>  
      <th>Session available</th>
      <th>Number of open spaces</th>
      <th></th>
    </tr>
    `

  const enrollmentBody = document.createElement('tbody');

  // Display enrollment sessions if user is logged in and sessions exist
  if (catalogData && catalogData.enrolment && catalogData.enrolment.length > 0) {
    enrollmentTable.appendChild(enrollmentThead);
    catalogData.enrolment.forEach((enrollment) => {
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = enrollment.LMSSession?.Name;

      const tdSeats = document.createElement('td');
      tdSeats.textContent = `${enrollment.seatsRemaining} Seats remaining` || 0;

      // Build "Enrollment's buynow" link with course and session details
      const baseUrl = "https://sciex.com/form-pages/product-request";
      const requestType = "quote";
      const solution = "training";
      const location = enrollment.LMSSession?.Name;
      const product = `${catalogData.cost.PriceBookEntry.Name} - ${location}`;

      const url = `${baseUrl}?requesttype=${requestType}&solution=${solution}&product=${encodeURIComponent(product)}&UTM_Content=${encodeURIComponent(product)}`;

      const buyButton = document.createElement('td');
      buyButton.innerHTML = `
            <a href="${url}" target="_blank" class="btn primary enroll-buy-now">
              Buy now
            </a>
          `;
      tr.append(tdName, tdSeats, buyButton);
      enrollmentBody.appendChild(tr);
    });
    enrollmentTable.appendChild(enrollmentBody);
    tableContainer.appendChild(enrollmentTable);
    enrollmentContainer.appendChild(tableContainer);
  } else {
    // Show message if no enrollment sessions available (not logged in or no sessions)
    const enrollBanner = document.createElement('div');
    enrollBanner.className = 'enroll-banner';
    enrollBanner.innerHTML = `
    <div class="enroll-banner-content">
      <p>Currently there are no active sessions to display.</p>
       <p> Please <a href="/about-us/contact-us" class="enroll-contact-link">contact us</a> if you are interested in taking this course.</p>
       </div>
    `;
    enrollmentContainer.appendChild(enrollBanner);

  }


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
    relatedContainer.appendChild(linksWrapper);
  }
  const exploreBtn = document.createElement('a');
  exploreBtn.href = '/explore-more-courses';
  exploreBtn.target = '_blank';
  exploreBtn.className = 'btn secondary explore-more-btn';
  exploreBtn.textContent = 'Explore more courses';

  // icon
  exploreBtn.append(span({ class: 'icon icon-arrow-blue' }));
  // append buttons
  decorateIcons(exploreBtn);

  const supportNetworkContainer = document.createElement('div');
  supportNetworkContainer.className = 'support-network-container';


  supportNetworkContainer.innerHTML = `
  <div class="support-content">
    <div class="support-text">
      <div class="support-title">SCIEX Now support network</div>
      <div class="support-subtitle">The destination for all your support needs.</div>
    </div>
    <div class="support-actions">   
    </div>
  </div>
`;

  const supportActionRow = supportNetworkContainer.querySelector('.support-actions');

  // --- Primary button ---
  const resourceHubBtn = document.createElement('a');
  resourceHubBtn.href = '/resource-hub';
  resourceHubBtn.target = '_blank';
  resourceHubBtn.className = 'btn primary resource-hub-btn';
  resourceHubBtn.textContent = 'Resource hub';

  // icon (your required pattern)
  resourceHubBtn.append(span({ class: 'icon icon-arrow' }));

  // --- Secondary button ---
  const contactSupportBtn = document.createElement('a');
  contactSupportBtn.href = '/support/request-support';
  contactSupportBtn.target = '_blank';
  contactSupportBtn.className = 'btn secondary contact-support-btn';
  contactSupportBtn.textContent = 'Contact support';

  // icon
  contactSupportBtn.append(span({ class: 'icon icon-arrow' }));
  // append buttons
  supportActionRow.append(resourceHubBtn, contactSupportBtn);
  decorateIcons(supportActionRow);



  descriptionContainer.appendChild(enrollmentContainer);
  descriptionContainer.appendChild(relatedContainer);
  descriptionContainer.appendChild(exploreBtn);

  // ===== RIGHT (COURSE DETAILS) =====
  const courseDetailsContainer = document.createElement('div');
  courseDetailsContainer.className = 'course-details-container';

  // Build course detail rows (only display fields with values)
  const details = [
    { key: 'Cost', value: costDisplay },
    { key: 'Duration', value: duration },
    { key: 'Region', value: region },
    { key: 'Language', value: language },
    { key: 'Type', value: courseType },
    { key: 'Course Level', value: courseLevel }
  ];

  // Filter out empty values and generate HTML for each detail row
  const rowsHTML = details
    .filter(item => item.value)
    .map(item => `
    <div class="course-detail-row">
      <span class="course-detail-key">${item.key}:</span>
      <span class="course-detail-value">${item.value}</span>
    </div>
  `)
    .join('');

  courseDetailsContainer.innerHTML = `
  <h3 class="course-details-title">Course details</h3>
  <div class="course-detail-info">
    ${rowsHTML}
  </div>
  <div class="course-action-row"></div>
`;
  // Update cost value with login link if user needs to authenticate
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

  // Determine primary button: "Buy Now" if ecommerce-enabled, allowed country, and price available; otherwise "Get a Quote"
  const showBuyNow = isInEcommerce && countryCode && allowedCountryCode.includes(countryCode.toLowerCase()) && costDisplay;
  const buttonText = showBuyNow ? 'Buy Now' : 'Get a Quote';
  
  // Build button href: direct to course URL for Buy Now, or construct quote form URL for Get a Quote
  let buttonHref = courseUrl;
  if (!showBuyNow) {
    const baseUrl = "https://sciex.com/form-pages/product-request";
    const requestType = "quote";
    const solution = "training";
    const title = courseTitle;
    buttonHref = `${baseUrl}?requesttype=${requestType}&solution=${solution}&product=${encodeURIComponent(title)}&UTM_Content=${encodeURIComponent(title)}`;
  }

  // Create primary action button
  const takeCourseBtn = document.createElement('a');
  takeCourseBtn.href = buttonHref;
  takeCourseBtn.target = '_blank';
  takeCourseBtn.className = 'btn primary';
  takeCourseBtn.textContent = buttonText;

  takeCourseBtn.append(span({ class: 'icon icon-arrow' }));

  // Create secondary button for Learning Hub access
  const quoteBtn = document.createElement('a');
  quoteBtn.href = 'https://training.sciex.com';
  quoteBtn.target = '_blank';
  quoteBtn.className = 'btn secondary';
  quoteBtn.textContent = 'My Learning Hub';
  quoteBtn.append(span({ class: 'icon icon-arrow-blue' }));
  
  // Add both buttons to action row
  actionRow.append(takeCourseBtn, quoteBtn);
  decorateIcons(actionRow);

  // Assemble main layout: header, two-column body, and support section
  const layout = document.createElement('div');
  layout.className = 'course-layout';
  layout.append(descriptionContainer, courseDetailsContainer);
  
  const mainLayout = document.createElement('div');
  mainLayout.className = 'course-catalog-detail-main-layout';
  mainLayout.append(courseHeaderContainer, layout, supportNetworkContainer);
  block.textContent = '';
  block.append(mainLayout);

  // Set up favorite/bookmark functionality
  const favoriteIcon = courseHeaderContainer.querySelector('.favorite-icon');
  if (favoriteIcon) {
    // Load and display current favorite status
    const checkAndSetFavoriteStatus = async () => {
      try {
        const favoriteData = await getfavoriteAllData();
        if (favoriteData) {
          const isFavorited = favoriteData.some(
            (fav) => fav.path === courseUrl,
          );
          if (isFavorited) {
            favoriteIcon.classList.add('favorited');
          }
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    await checkAndSetFavoriteStatus();

    // Toggle favorite status on icon click
    favoriteIcon.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isFavorited = favoriteIcon.classList.contains('favorited');

      try {
        if (isFavorited) {
          // Remove from favorites
          favoriteIcon.classList.remove('favorited');
          const res = await removeFavoriteSearchEngine(courseUrl);
          if (!res.status === 200) {
            favoriteIcon.classList.add('favorited');
          }
        } else {
          // Add to favorites
          favoriteIcon.classList.add('favorited');
          const res = await addToFavorite(courseUrl);
          if (!res.status === 200 || !res.status === 201) {
            favoriteIcon.classList.remove('favorited');
          }
        }
      } catch (error) {
        console.error('Error updating favorite:', error);
        // Revert UI if operation fails
        if (isFavorited) {
          favoriteIcon.classList.add('favorited');
        } else {
          favoriteIcon.classList.remove('favorited');
        }
      }
    });
  }
}
