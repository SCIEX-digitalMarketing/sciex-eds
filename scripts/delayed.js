// add delayed functionality here
// eslint-disable-next-line import/no-cycle
import { getCookie } from './scripts.js';

function loadGTM() {
  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
            let gtmIdScript = 'GTM-WMZL3B';
            // googleTagManager
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start':
                        new Date().getTime(), event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', gtmIdScript);
            `;
  document.head.prepend(scriptTag);
  const noScriptTag = document.createElement('noscript');
  noScriptTag.innerHTML = `
      let gtmIdNiScript = (window.location.host === 'www.abcam.com') ? 'GTM-5J97L4S' : 'GTM-PDRV95V';
      <iframe src="https://www.googletagmanager.com/ns.html?id="+gtmIdNiScript
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
  document.body.prepend(noScriptTag);
}

if (getCookie('cq-authoring-mode') !== 'TOUCH') {
  loadGTM();
}
