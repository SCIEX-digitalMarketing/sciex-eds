export const getfavoriteAllData = async () => {
  try {
    const response = await fetch(
      '/bin/sciex/eds-favorite-content',
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('datasss', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};
export const removeFavoriteSearchEngine = async (url) => {
  try {
    const response = await fetch(
      `/bin/sciex/favoritecontent?url=${encodeURIComponent(url)}&operation=remove`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response?.text();
    const data = text ? JSON.parse(text) : null;
    console.log('datasss', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};
export const addToFavorite = async (url) => {
  try {
    const response = await fetch(
      `/bin/sciex/favoritecontent?url=${encodeURIComponent(url)}&operation=add`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response?.text();
    const data = text ? JSON.parse(text) : null;
    console.log('datasss', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};
export default { getfavoriteAllData, removeFavoriteSearchEngine };
