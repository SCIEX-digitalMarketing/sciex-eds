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
  const courseCatalogBlock = buildBlock('coursecatalog', { elems: [] });
  section.append(courseCatalogBlock);
  const footerDiv = section.querySelector('div.footer');
  if (footerDiv) {
    const footerBlock = buildBlock('footer', { elems: [] });
    section.append(footerBlock);
  }
  main.append(section);
}
