export default function decorate(block) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container-text';
    block.append(cardContainer);
}