import {
  sourceFacetController,
  filetypeFacetController,
  tagsFacetController,
} from '../controller/controllers.js';

export const renderSourceFacet = () => {
  const facetElement = document.getElementById('source-facet');
  facetElement.innerHTML = '<h3>Source</h3>';

  const { values } = sourceFacetController.state;
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

  const { values } = filetypeFacetController.state;
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

export const renderTagsFacet = () => {
  const facetElement = document.getElementById('tags-facet');
  facetElement.innerHTML = '<h3>Tags</h3>';

  const { values } = tagsFacetController.state;
  values.forEach((value) => {
    const facetItem = document.createElement('div');
    facetItem.className = 'facet-item';
    facetItem.innerHTML = `
        <input type="checkbox" id="${value.value}" ${
  value.state === 'selected' ? 'checked' : ''
}>
        <label for="${value.value}">${value.value.split('/').pop()} (${
  value.numberOfResults
})</label>
      `;

    facetItem.querySelector('input').addEventListener('change', () => {
      tagsFacetController.toggleSelect(value);
    });

    facetElement.appendChild(facetItem);
  });
};
