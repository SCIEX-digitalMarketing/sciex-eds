// api to get the enrollment and cost info of the course
export default async function getCourseCatalogData(email,courseId) {
  try {
    const endpoint = `/bin/sciex-eds/enrollement?email=${email}&course=${courseId}`;
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
};