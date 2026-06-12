import { span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/aem.js';
import getCourseCatalogData from '../../scripts/blocks-controllers/course-catalog-controller.js';
import {
  getfavoriteAllData,
  removeFavoriteSearchEngine,
  addToFavorite,
} from '../../scripts/favorite-all/favorite-allDocEngine.js';


/**
 * Fetches current user login status, email, and country code from API
 * Returns [isLoggedIn, userEmail, countryCode] - all null/false if API fails
 */
async function checkLoginStatus() {
  try {

    const user = JSON.parse(localStorage.getItem('userDetails'));
    return [user?.loggedIn === true, user?.email, user?.countryCode, user?.premiumContentEligible];
  } catch (e) {
    console.warn('Course catalog detail: treating user as logged out', e);
    return [false, null, null,null];
  }
}

export default async function decorate(block) {
  const children = Array.from(block.children);
  if (children.length < 14) return;
  const courseId = children[0]?.textContent?.trim();
  const courseTitle = children[1]?.textContent?.trim();
  const courseUrl = children[2]?.textContent?.trim();
  const courseRating = children[3]?.textContent?.trim();
  const description = children[4]?.innerHTML?.trim();
  const duration = children[5]?.textContent?.trim();
  const region = children[6]?.textContent?.trim();
  const courseType = children[7]?.textContent?.trim();
  const courseLevel = children[8]?.textContent?.trim();
  const relatedResources = children[9]?.textContent?.trim();
  const isFree = children[10]?.textContent?.trim();
  const isInEcommerce = children[11]?.textContent?.trim();
  const trainingType = children[12]?.textContent?.trim();
  const categoriesTags = children[13]?.textContent?.trim();

const hasInstructorLedVirtual = categoriesTags
  ?.split(',')
  .includes('sciex:coursecatalog/course-type/instructor-led-virtual');
  // Fetch user authentication info and allowed countries for ecommerce
  const [isLoggedIn, userEmail, countryCode,premiumContentEligible] = await checkLoginStatus();
  const allowedCountryCode = ["us","uk", "gb", "de", "ca", "cz", "nl", "fr", "at", "be", "it", "pt", "es"];

  // Check if course is available in user's region
  const isInRegion = countryCode && allowedCountryCode.includes(countryCode.toLowerCase());

  const tagsLanguage = categoriesTags
  ? categoriesTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.startsWith('sciex:language/'))
      .map(tag => {
        const value = tag.replace('sciex:language/', '');
        return value
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      })
  : [];

  // Country-specific store URLs for Buy Now button
  const storePathMap = {
    us: 'https://shop.sciex.com/us/en/products/sku/',
    uk: 'https://shop.sciex.com/uk/en/products/sku/',
    de: 'https://shop.sciex.com/eu/en/products/sku/',
    ca: 'https://shop.sciex.com/ca/en/products/sku/',
    cz: 'https://shop.sciex.com/us/en/products/sku/',
    nl: 'https://shop.sciex.com/eu/en/products/sku/',
    fr: 'https://shop.sciex.com/eu/en/products/sku/',
    at: 'https://shop.sciex.com/eu/en/products/sku/',
    be: 'https://shop.sciex.com/eu/en/products/sku/',
    it: 'https://shop.sciex.com/eu/en/products/sku/',
    pt: 'https://shop.sciex.com/eu/en/products/sku/',
    es: 'https://shop.sciex.com/eu/en/products/sku/',
  }

  // Initialize cost and catalog data
  let costDisplay = '';
  let costClassName = '';
  let catalogData = null;

  // Fetch pricing data from API if user is logged in
  if (isLoggedIn && userEmail && courseId) {
    catalogData = await getCourseCatalogData(userEmail, courseId);
  }

  // Display pricing: show API price if available, otherwise show Free or Login prompt
  if (isLoggedIn) {
    // Case: Not available in region
    if (!isInRegion) {
      costDisplay = 'Not available in your region';
      costClassName = 'cost-unavailable';
    } else if (
      catalogData &&
      catalogData.cost &&
      catalogData.cost.PriceBookEntry &&
      catalogData.cost.PriceBookEntry.UnitPrice != null
    ) {
      // Case: Price exists
      const unitPrice = catalogData.cost.PriceBookEntry.UnitPrice.toFixed(2);
      const CurrencyIsoCode = catalogData.cost.PriceBookEntry?.CurrencyIsoCode;
      costDisplay = `${unitPrice} ${CurrencyIsoCode}`;
    } else if (isFree === 'true') {
      // Free course
      costDisplay = 'Free';
      costClassName = 'cost-free';
    } else {
      //show "Get a quote"      
      costDisplay = 'Get a quote';
      costClassName = 'cost-quote';
    }
  } else if (isFree === 'true') {
    // Not logged in + free
    costDisplay = 'Free';
    costClassName = 'cost-free';
  } else {
    // Not logged in + paid
    costDisplay = 'Login for price';
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
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 30 30" fill="none">
          <path d="M22.75 4.5V24.7344L15.3652 16.8584L15 16.4688L14.6348 16.8584L7.25 24.7344V4.5H22.75Z" />
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

    if (strong && strong.textContent.includes('Overview')) {
      if (li) {
        li.classList.add('Overviews-desc');
      }

      const ul = li.closest('ul'); 

      if (ul) {
        ul.classList.add('top-ul-wrap-course');
      }
    }
  });
  const validEnrollmentCourseType = [
    'at sciex',
    'virtual'
  ];
  const isValidEnrollmentCourseType =
  validEnrollmentCourseType.includes(courseType?.toLowerCase()) ||
   hasInstructorLedVirtual;
  if (isValidEnrollmentCourseType ) {
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
    const showEnrollment =
  catalogData?.cost?.PriceBookEntry?.ProductCode &&
  catalogData?.cost?.PriceBookEntry?.ProductCode !== '' &&
  catalogData?.enrolment &&
  catalogData?.enrolment.length > 0;
  // Display enrollment sessions if user is logged in and sessions exist
  if (showEnrollment) {
    enrollmentTable.appendChild(enrollmentThead);
    catalogData.enrolment.forEach((enrollment) => {
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = enrollment.LMSSession?.Name;

      const tdSeats = document.createElement('td');
      tdSeats.textContent = `${enrollment.seatsRemaining} Seats remaining` || 0;

      // Build "Enrollment's buynow" link using ProductCode and country-specific store URL
      let enrollmentUrl='#';
      if (catalogData?.cost?.PriceBookEntry?.ProductCode) {
        const countryCodeLower = countryCode.toLowerCase();
        const baseUrl = storePathMap[countryCodeLower];
        const productCode = catalogData.cost.PriceBookEntry.ProductCode;
        
        if (baseUrl) {
          enrollmentUrl = `${baseUrl}${productCode}-sciex.html`;
        } else {
          // Fallback to US store
          enrollmentUrl = `${storePathMap.us}${productCode}-sciex.html`;
        }
      } 

      const buyButton = document.createElement('td');
      buyButton.innerHTML = `
            <a href="${enrollmentUrl}" target="_blank" class="btn primary enroll-buy-now">
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
    descriptionContainer.appendChild(enrollmentContainer);
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
  let exploreUrl = '/search-results?contentType=Training&facetId=trainingcoursetype';
  if (trainingType === 'instructor-led-training') {
    exploreUrl = '/search-results?contentType=Training&facetId=trainingcoursetype&value=Instructor%20led%20training';
  }
  else if (trainingType === 'self-paced-learning') {
    exploreUrl = '/search-results?contentType=Training&facetId=trainingcoursetype&value=Self%20paced%20learning';
  }
  exploreBtn.href = exploreUrl;
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
    { key: 'Language', value: tagsLanguage },
    { key: 'Type', value: courseType },
    { key: 'Course Level', value: courseLevel }
  ];

  // Filter out empty values and generate HTML for each detail row
const rowsHTML = details
  .filter(
    (item) =>
      item.value &&
      (Array.isArray(item.value) ? item.value.length > 0 : true),
  )
  .map((item) => {
    let formattedValue = item.value;

    if (Array.isArray(item.value)) {
      formattedValue = item.value.join(', ');
    } else if (typeof item.value === 'string') {
      formattedValue = item.value.split(',').join(', ');
    }

    return `
      <div class="course-detail-row">
        <span class="course-detail-key">${item.key}:</span>
        <span class="course-detail-value">
          ${formattedValue}
        </span>
      </div>
    `;
  })
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
    }
    else if (costDisplay === 'Get a quote') {
      const quoteUrl = `https://sciex.com/form-pages/product-request?requesttype=quote&solution=training&product=${encodeURIComponent(courseTitle)}&UTM_Content=${encodeURIComponent(courseTitle)}`;
      costValueSpan.innerHTML = `<a href="${quoteUrl}" target="_blank" class="cost-quote-link">${costDisplay}</a>`;
    }
    else {
      costValueSpan.textContent = costDisplay;
    }
    if (costClassName) {
      costValueSpan.classList.add(costClassName);
    }
  }

  const actionRow = courseDetailsContainer.querySelector('.course-action-row');

  // Determine primary button: "Buy Now" if ecommerce-enabled, 
  // allowed country, and price available; otherwise "Get a Quote"
  const showBuyNow = catalogData?.cost?.PriceBookEntry?.ProductCode && catalogData?.cost?.PriceBookEntry?.ProductCode !== '' && isInEcommerce === "true" && isInRegion === true && !costDisplay.includes("Get a quote") ;
  let buttonText = '';
  if (courseType.toLowerCase() === 'premium' || courseType.toLowerCase() === 'free online') {
    if (premiumContentEligible==='true' || courseType.toLowerCase() === 'free online') {
      buttonText = 'View course';
    }
    else {
      buttonText = 'Learn more'
    }
  }else{
    buttonText = showBuyNow ? 'Buy now' : 'Get a quote';
  }


  // Build button href: use country-specific store URL with ProductCode for Buy Now, 
  // or construct quote form URL for Get a Quote
  let buttonHref;
  if(courseType.toLowerCase() === 'premium' || courseType.toLowerCase() === 'free online'){
    if (premiumContentEligible === 'true' || courseType.toLowerCase() === 'free online') {
      buttonHref = courseUrl
    }
    else {
      buttonHref = 'https://sciex.com/support/software-support/premium-access-content'
    }
  } else if (showBuyNow) {
    const countryCodeLower = countryCode.toLowerCase();
    const baseUrl = storePathMap[countryCodeLower];
    const productCode = catalogData.cost.PriceBookEntry.ProductCode;
    
    if (baseUrl) {
      buttonHref = `${baseUrl}${productCode}-sciex.html`;
    } else {
      // Fallback to US store
      buttonHref = `${storePathMap.us}${productCode}-sciex.html`;
    }
  } else {
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
  const fullUrl =  window.location.href;
  // Set up favorite/bookmark functionality
  const favoriteIcon = courseHeaderContainer.querySelector('.favorite-icon');

  if (!isLoggedIn) {
    const courseHeaderSocial = courseHeaderContainer.querySelector('.course-header-social');
    courseHeaderSocial.style.display = 'none';
  }

  if (favoriteIcon) {
    // Load and display current favorite status
    const checkAndSetFavoriteStatus = async () => {
      try {
        const favoriteData = await getfavoriteAllData();
        if (favoriteData) {
          const isFavorited = !!favoriteData?.some(fav =>
            fav?.pageData?.some(
              page => page?.path === fullUrl
            )
          );
          if (isFavorited) {
            favoriteIcon.classList.add('favorited');
            favoriteIcon.setAttribute('title', 'Remove from favorites');
          } else {
            favoriteIcon.setAttribute('title', 'Save to favorites');
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
          favoriteIcon.setAttribute('title', 'Save to favorites');
          const res = await removeFavoriteSearchEngine(fullUrl);
          if (res?.message !== "The operation went successfully") {
            favoriteIcon.classList.add('favorited');
            favoriteIcon.setAttribute('title', 'Remove from favorites');
          }
        } else {
          // Add to favorites
          favoriteIcon.classList.add('favorited');
          favoriteIcon.setAttribute('title', 'Remove from favorites');
          const res = await addToFavorite(fullUrl);
          if (res?.message !== "The operation went successfully") {
            favoriteIcon.classList.remove('favorited');
            favoriteIcon.setAttribute('title', 'Save to favorites');
          }
        }
      } catch (error) {
        console.error('Error updating favorite:', error);
        // Revert UI if operation fails
        if (isFavorited) {
          favoriteIcon.classList.add('favorited');
          favoriteIcon.setAttribute('title', 'Remove from favorites');
        } else {
          favoriteIcon.classList.remove('favorited');
          favoriteIcon.setAttribute('title', 'Save to favorites');
        }
      }
    });
  }
}
