import { decorateIcons } from '../../scripts/aem.js';
import { span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const div = document.createElement('div');
  div.classList.add('session-timeline');

  const rows = [...block.children];
  rows.forEach((row, index) => {
    if (index === 0) {
      const idText = row.querySelector('p')?.textContent?.trim();
      if (idText) {
        div.id = idText;
      }
    } else if (index === 1) {
      const title = document.createElement('div');
      title.classList.add('session-timeline-text');
      title.textContent = row.querySelector('p')?.textContent?.trim() || '';
      div.appendChild(title);
    } else {
      const ul = row.querySelector('div > ul');
      if (ul) {
        [...ul.children].forEach((li) => {
          const clock = document.createElement('div');
          clock.appendChild(span({ class: 'icon icon-blackclock' }));

          const strong = li.querySelector('strong');
          if (strong) {
            const timeRow = document.createElement('div');
            timeRow.className = 'time-row';

            // Move text node after <strong> into span
            let nextNode = strong.nextSibling;
            let sessionText = '';
            while (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
              sessionText += nextNode.textContent;
              const toRemove = nextNode;
              nextNode = nextNode.nextSibling;
              li.removeChild(toRemove);
            }

            const sessionInfo = document.createElement('span');
            sessionInfo.className = 'event-organizer';
            sessionInfo.textContent = sessionText.trim();

            const timemain = document.createElement('div');
            timemain.className = 'time-main';
            // Assemble time-row
            timemain.appendChild(clock);
            timemain.appendChild(strong);
            timeRow.appendChild(timemain);
            timeRow.appendChild(sessionInfo);

            li.insertBefore(timeRow, li.firstChild);

            const sessionTitle = li.querySelector('ul > li');
            if (sessionTitle) {
              sessionTitle.classList.add('session-title');
            }

            console.log('li >', li.outerHTML);
          }
        });

        decorateIcons(ul);
        div.append(ul);
      }
    }
  });

  block.classList.add('session-timeline');
  block.textContent = '';
  block.append(div);
}
