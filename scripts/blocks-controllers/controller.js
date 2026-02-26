export const getPartnersData = async () => {
  try {
    const response = await fetch(
      '/bin/sciex/partners',
    );

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