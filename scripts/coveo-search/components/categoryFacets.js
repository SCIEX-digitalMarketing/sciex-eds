import {
    sourceFacetController,
    filetypeFacetController,
    pagetypeFacetController
  } from '../controller/controllers.js';
  
  export const renderSourceFacet = () => {
    const facetElement = document.getElementById('source-facet');
    facetElement.innerHTML = '<h3>Source</h3>';
  
    const values = sourceFacetController.state.values;
    values.forEach((value) => {
      const facetItem = document.createElement('div');
      facetItem.className = 'facet-item';
      facetItem.innerHTML = `
        <input type="checkbox" id="${value.value}" ${
        value.state === 'selected' ? 'checked' : ''
      }>
        <label for="${value.value}">${value.value} (${
        value.numberOfResults
      })</label>
      `;
  
      facetItem.querySelector('input').addEventListener('change', () => {
        sourceFacetController.toggleSelect(value);
      });
  
      facetElement.appendChild(facetItem);
    });
  };
  
  export const renderFiletypeFacet = () => {
    const facetElement = document.getElementById('filetype-facet');
    facetElement.innerHTML = '<h3>Filetype</h3>';
  
    const values = filetypeFacetController.state.values;
    values.forEach((value) => {
      const facetItem = document.createElement('div');
      facetItem.className = 'facet-item';
      facetItem.innerHTML = `
        <input type="checkbox" id="${value.value}" ${
        value.state === 'selected' ? 'checked' : ''
      }>
        <label for="${value.value}">${value.value} (${
        value.numberOfResults
      })</label>
      `;
  
      facetItem.querySelector('input').addEventListener('change', () => {
        filetypeFacetController.toggleSelect(value);
      });
  
      facetElement.appendChild(facetItem);
    });
  };

  export const renderPagetypeFacet = () => {
    const facetElement = document.getElementById('pagetype-facet');
    facetElement.innerHTML = '<h3>Pagetype</h3>';
  
    const values = pagetypeFacetController.state.values;
    values.forEach((value) => {
      const facetItem = document.createElement('div');
      facetItem.className = 'facet-item';
      facetItem.innerHTML = `
        <input type="checkbox" id="${value.value}" ${
        value.state === 'selected' ? 'checked' : ''
      }>
        <label for="${value.value}">${value.value} (${
        value.numberOfResults
      })</label>
      `;
  
      facetItem.querySelector('input').addEventListener('change', () => {
        filetypeFacetController.toggleSelect(value);
      });
  
      facetElement.appendChild(facetItem);
    });
  };
  