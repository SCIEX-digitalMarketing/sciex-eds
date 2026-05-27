// This function updates the visibility of  heading banners based on content type facet selection
//  in the search results page.

export default function updateSearchFacetBanners(values) {
  const searchFacetHeadingWrapper = document.getElementsByClassName('search-facet-banner-wrapper')[0];
  let hasSelectedChild = false;
  if (!searchFacetHeadingWrapper) {
    return false; ;
  }
console.log('values', values);
  values?.forEach(value => {
      const searchFacetHeading = document.getElementById(
        `search-facet-banner-${value.value.toLowerCase()}`
      );
      if (searchFacetHeading) {
        if (value.state === "selected") {
          hasSelectedChild = true;
          searchFacetHeading.style.setProperty('display', 'flex');
          searchFacetHeadingWrapper.style.setProperty('display', 'block', 'important');
        } else {
          searchFacetHeading.style.setProperty('display', 'none');
          if (!hasSelectedChild) {
            searchFacetHeadingWrapper.style.setProperty('display', 'none', 'important');
          }
        }
      }    
  });

  return hasSelectedChild;
}
