export default async function decorate(block) {
  async function getUserDetails() {
    try {
      const response = await fetch('/bin/sciex/currentuserdetails', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return null;
    }
  }

  const userData = await getUserDetails();

  // Clear block content before appending
  block.innerHTML = '';

  // Create a new div to hold the login/logout section
  const sectionDiv = document.createElement('div');

  let markup = '';

  // Conditionally append the login/logout links
  if (userData && userData.loggedIn) {
    markup = `
      <ul class="user-menu">
        <li>
          <a href="/support/create-account" class="tw-inline-flex tw-items-center">
            View Profile
          </a>
        </li>
        <li>
          <button onclick="performLogout()" class="tw-inline-flex tw-items-center logout-v2">Logout</button>
        </li>
      </ul>
    `;
  } else {
    markup = `
      <ul class="user-menu">
        <li>
          <a href="https://sso.sciex.cloud/auth/realms/sciex/protocol/saml/clients/publisher?_gl=1*1js9n2p*_gcl_au*MTk5NjU4NjQyMy4xNzM5MTY5NzA3*_ga*MTA2NjE2MDgxMy4xNzM5MTY5NzA3*_ga_KD23C87L58*MTczOTI3NjYyOS4yLjAuMTczOTI3NjYyOS4wLjAuOTM0NDc1MTg4" class="tw-inline-flex tw-items-center login-v2">
            Login
          </a>
        </li>
        <li>
          <a href="/support/create-account" class="tw-inline-flex tw-items-center">Register</a>
        </li>
      </ul>
    `;
  }

  // Apply styles to the div
  sectionDiv.style.display = 'flex';
  sectionDiv.style.justifyContent = 'center';
  sectionDiv.style.alignItems = 'center';
  sectionDiv.style.marginTop = '20px';

  // Add the markup to the div
  sectionDiv.innerHTML = markup;

  // Append the div to the block
  block.appendChild(sectionDiv);

  // Apply styles to the ul element dynamically
  const ulElement = sectionDiv.querySelector('.user-menu');
  if (ulElement) {
    ulElement.style.display = 'flex';
    ulElement.style.padding = '50px 50px';
    ulElement.style.margin = '20px 0';
    ulElement.style.listStyle = 'none';
    ulElement.style.gap = '20px';
  }
}
