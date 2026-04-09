export default async function getPartnersData() {
  try {
    const endpoint = '/bin/sciex/partners';
    console.log('Fetching partners data from:', endpoint);
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
