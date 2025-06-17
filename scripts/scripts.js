import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  toClassName,
  getMetadata,
} from './aem.js';

export function getCookie(name) {
  let cookieVal = null;
  const cookieArr = document.cookie.split(';');
  cookieArr.forEach((elem) => {
    const cookie = elem.trim();
    if (cookie.startsWith(`${name}=`)) {
      cookieVal = decodeURIComponent(cookie.substring(name.length + 1));
    }
  });
  return cookieVal;
}

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/* Start Search survey script */
/* eslint-disable */
export function setSearchSurveyCookie() {
  const searchcookieValue = getCookie('searchSurvey');
  if (searchcookieValue !== 'visited') {
    window.showSearchSurvey = 'true';
    const d = new Date();
    d.setTime(d.getTime() + (6 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `searchSurvey=visited;secure=true;path=/;${expires}`;
  }
}

export function qualtricsFeedback() {
  (function () {
    const g = function (e, h, f, g) {
      this.get = function (a) { for (var a = `${a}=`, c = document.cookie.split(';'), b = 0, e = c.length; b < e; b++) { for (var d = c[b]; d.charAt(0) == ' ';)d = d.substring(1, d.length); if (d.indexOf(a) == 0) return d.substring(a.length, d.length); } return null; };
      this.set = function (a, c) { var b = ''; var b = new Date(); b.setTime(b.getTime() + 6048E5); b = `; expires=${b.toGMTString()}`; document.cookie = `${a}=${c}${b}; path=/; `; };
      this.check = function () { let a = this.get(f); if (a)a = a.split(':'); else if (e != 100)h == 'v' && (e = Math.random() >= e / 100 ? 0 : 100), a = [h, e, 0], this.set(f, a.join(':')); else return !0; let c = a[1]; if (c == 100) return !0; switch (a[0]) { case 'v': return !1; case 'r': return c = a[2] % Math.floor(100 / c), a[2]++, this.set(f, a.join(':')), !c; } return !0; };
      this.go = function () { if (this.check()) { const a = document.createElement('script'); a.type = 'text/javascript'; a.src = g; document.body && document.body.appendChild(a); } };
      this.start = function () { const t = this; document.readyState !== 'complete' ? window.addEventListener ? window.addEventListener('load', () => { t.go(); }, !1) : window.attachEvent && window.attachEvent('onload', () => { t.go(); }) : t.go(); };
    };
    try { (new g(100, 'r', 'QSI_S_ZN_b4z8pJnZ6X9z32B', 'https://znb4z8pjnz6x9z32b-sciex.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_b4z8pJnZ6X9z32B')).start(); } catch (i) {}
  }());
}
/* eslint-enable */
/* End Search survey script */

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}
const TEMPLATE_LIST = [
  'course-catalog-template',
  'tech-notes-template',
];

async function decorateTemplates(main) {
  try {
    const template = toClassName(getMetadata('template'));
    if (TEMPLATE_LIST.includes(template)) {
      const templateName = template;
      const mod = await import(`../templates/${templateName}/${templateName}.js`);
      loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`);
      if (mod.default) {
        await mod.default(main);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}
/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateTemplates(main);
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 9000);
  // load anything that can be postponed to the latest here
}

/**
 * Loads the page and initializes scripts.
 */
async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

/**
 * create an element.
 * @param {string} tagName the tag for the element
 * @param {string|Array<string>} classes classes to apply
 * @param {object} props properties to apply
 * @param {string|Element} html content to add
 * @returns the element
 */
export function createElement(tagName, classes, props, html) {
  const elem = document.createElement(tagName);
  if (classes) {
    const classesArr = (typeof classes === 'string') ? [classes] : classes;
    elem.classList.add(...classesArr);
  }
  if (props) {
    Object.keys(props).forEach((propName) => {
      elem.setAttribute(propName, props[propName]);
    });
  }

  if (html) {
    const appendEl = (el) => {
      if (el instanceof HTMLElement || el instanceof SVGElement) {
        elem.append(el);
      } else {
        elem.insertAdjacentHTML('beforeend', el);
      }
    };

    if (Array.isArray(html)) {
      html.forEach(appendEl);
    } else {
      appendEl(html);
    }
  }

  return elem;
}

loadPage();
