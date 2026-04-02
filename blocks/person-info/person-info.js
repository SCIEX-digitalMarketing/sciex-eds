export default function decorate(block) {
  const children = Array.from(block.children);
console.log('Decorating person-info block with children:', children);
  const nameEl = children[0];
  const ageEl = children[1];
  const dobEl = children[2];
  const addressEl = children[3];

  const name = nameEl?.textContent?.trim() || '';
  const age = ageEl?.textContent?.trim() || '';
  const dob = dobEl?.textContent?.trim() || '';
  const address = addressEl?.textContent?.trim() || '';

  // साफ़ UI के लिए original elements हटाएँ
  children.forEach((el) => el.remove());

  block.classList.add('person-info');

  const container = document.createElement('div');
  container.className = 'person-info-container';

  container.innerHTML = `
    <h3 class="person-name">${name}</h3>
    <p><strong>Age:</strong> ${age}</p>
    <p><strong>DOB:</strong> ${dob}</p>
    <p><strong>Address:</strong> ${address}</p>
  `;

  block.append(container);
}