import { buildBlock } from '../../scripts/aem.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const section = main.querySelector('div');
  const headerSection = section.querySelector('div.header');
  if (headerSection) {
    const headerBlock = buildBlock('header', { elems: [] });
    section.append(headerBlock);
  }
  const breadcrumbBlock = buildBlock('breadcrumb', { elems: [] });
  section.append(breadcrumbBlock);
  const titleBlock = buildBlock('title', { elems: [] });
  section.append(titleBlock);
  const buttontextBlock = buildBlock('button-text', { elems: [] });
  section.append(buttontextBlock);
  const tabsnavBlock = buildBlock('tabs-nav', { elems: [] });
  section.append(tabsnavBlock);
  const featuredproductsBlock = buildBlock('featured-products', { elems: [] });
  section.append(featuredproductsBlock);
  const relatedresourcesBlock = buildBlock('related-resources', { elems: [] });
  section.append(relatedresourcesBlock);
  const footerDiv = section.querySelector('div.footer');
  if (footerDiv) {
    const footerBlock = buildBlock('footer', { elems: [] });
    section.append(footerBlock);
  }
  main.append(section);
}
