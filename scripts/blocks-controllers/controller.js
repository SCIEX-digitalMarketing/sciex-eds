export const getPartnersData = async () => {
  try {
    // const endpoint = `${location.origin}/bin/sciex/partners`;
    const endpoint = `https://author-p93412-e854706.adobeaemcloud.com/bin/sciex/partners`;
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