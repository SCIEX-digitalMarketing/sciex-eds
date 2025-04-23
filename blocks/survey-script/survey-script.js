/* eslint-disable */
import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const blockDiv = document.createElement('div');
  const id = block.children[0].textContent;
  if (id && id.trim() !== '') {
    blockDiv.id = id.trim();
  } else {
    blockDiv.id = 'abstract';
  }
  block.textContent = '';
  block.append(blockDiv);

  function surveyScript() {
    (function () {
      const g = function (e, h, f, g) {
        this.get = function (a) { for (var a = `${a}=`, c = document.cookie.split(';'), b = 0, e = c.length; b < e; b++) { for (var d = c[b]; d.charAt(0) == ' ';)d = d.substring(1, d.length); if (d.indexOf(a) == 0) return d.substring(a.length, d.length); } return null; };
        this.set = function (a, c) { var b = ''; var b = new Date(); b.setTime(b.getTime() + 6048E5); b = `; expires=${b.toGMTString()}`; document.cookie = `${a}=${c}${b}; path=/; `; };
        this.check = function () { let a = this.get(f); if (a)a = a.split(':'); else if (e != 100)h == 'v' && (e = Math.random() >= e / 100 ? 0 : 100), a = [h, e, 0], this.set(f, a.join(':')); else return !0; let c = a[1]; if (c == 100) return !0; switch (a[0]) { case 'v': return !1; case 'r': return c = a[2] % Math.floor(100 / c), a[2]++, this.set(f, a.join(':')), !c; } return !0; };
        this.go = function () { if (this.check()) { const a = document.createElement('script'); a.type = 'text/javascript'; a.src = g; document.body && document.body.appendChild(a); } };
        this.start = function () { const t = this; document.readyState !== 'complete' ? window.addEventListener ? window.addEventListener('load', () => { t.go(); }, !1) : window.attachEvent && window.attachEvent('onload', () => { t.go(); }) : t.go(); };
      };
      try { (new g(100, 'r', 'QSI_S_ZN_1o1ioypsMWWxBmB', 'https://zn1o1ioypsmwwxbmb-sciex.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_1o1ioypsMWWxBmB')).start(); } catch (i) {}
    }());
  }

  const enableSurveyScript = getMetadata('enablesurveyscript');
  if (enableSurveyScript && enableSurveyScript === 'true') {
    surveyScript();
  }
}
