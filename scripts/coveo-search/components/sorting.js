import { sortController } from "../controller/controllers.js";

export const renderSorting = () => {
    const sortElement = document.getElementById('sort');
    sortElement.innerHTML = '';
    const sortOptions = [
        { label: 'Relevancy', criterion: { by: 'relevancy' } },
        { label: 'Title', criterion: { by: 'field', field: 'title', order: 'ascending' },},
        { label: 'Date Descending', criterion: { by: 'datedescending', },},
        { label: 'Date Ascending', criterion: { by: 'dateascending', },},

    ];
    const selectElement = document.createElement('select');
    sortOptions.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = JSON.stringify(option.criterion);
        optionElement.innerText = option.label;
        selectElement.appendChild(optionElement);
    });

    selectElement.addEventListener('change', (event) => {
        const selectedCriterion = JSON.parse(event.target.value);
        sortController.sortBy(selectedCriterion);
    });

    sortElement.appendChild(selectElement);
};