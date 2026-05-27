/* eslint-disable */
import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const blockDiv = document.createElement('div');
  const id = block.children[0].textContent;
  if (id && id.trim() !== '') {
    blockDiv.id = id.trim();
  } else {
    blockDiv.id = 'ZN_1o1ioypsMWWxBmB';
  }
  block.textContent = '';
  block.append(blockDiv);

  function chatScript() {
    (function(){var g=function(g){
        this.go=function(){var a=document.createElement("script");a.type="text/javascript";a.src=g;document.body&&document.body.appendChild(a)};
        this.start=function(){var t=this;"complete"!==document.readyState?window.addEventListener?window.addEventListener("load",function(){t.go()},!1):window.attachEvent&&window.attachEvent("onload",function(){t.go()}):t.go()};};
        try{(new g("https://zn1o1ioypsmwwxbmb-sciex.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_1o1ioypsMWWxBmB")).start()}catch(i){}})();
  }

  const enableSurveyScript = getMetadata('enablesurveyscript');
  if (enableSurveyScript && enableSurveyScript === 'true') {
    chatScript();
  }
}
