import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  // Add structure classes for design layout
  const sections = block.querySelectorAll('.section');
  const firstSection = sections[0];
  if (firstSection) {
    const wrapper = firstSection.querySelector('.default-content-wrapper');
    if (wrapper) {
      const uls = wrapper.querySelectorAll(':scope > ul');
      const disclaimer = wrapper.querySelector(':scope > p');
      if (uls.length >= 2) {
        const navWrapper = document.createElement('div');
        navWrapper.className = 'footer-nav';
        uls.forEach((ul) => navWrapper.appendChild(ul));
        wrapper.insertBefore(navWrapper, wrapper.firstChild);
      }
      if (disclaimer) {
        disclaimer.classList.add('footer-disclaimer');
      }
    }
  }

  const lastSection = sections.length > 1 ? sections[1] : null;
  if (lastSection) {
    lastSection.classList.add('footer-bottom');
    const wrapper = lastSection.querySelector('.default-content-wrapper');
    if (wrapper) {
      const paragraphs = wrapper.querySelectorAll(':scope > p');
      if (paragraphs[0]) paragraphs[0].classList.add('footer-copyright');
      if (paragraphs[1]) paragraphs[1].classList.add('footer-policies');
    }
  }
}
