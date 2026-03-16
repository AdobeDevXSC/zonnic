/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: zonnic cleanup.
 * Selectors from captured DOM of https://www.zonnic.com
 * Removes non-authorable content: header, footer, side menu, cookie dialogs.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent / overlays that may block parsing
    // Found in captured DOM: noscript tags for GTM
    WebImporter.DOMUtils.remove(element, ['noscript', '[id*="cookie"]', '[class*="cookie"]', '[id*="consent"]']);
  }
  if (hookName === H.after) {
    // Remove non-authorable site chrome from captured DOM:
    // header: .header with logo and nav
    // .side-menu: mobile slide-out navigation
    // footer: .footer with links and legal text
    // .kop-zonnic: "Buy Zonnic" dropdown overlay section
    WebImporter.DOMUtils.remove(element, [
      'header',
      '.side-menu',
      'footer',
      '.kop-zonnic',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
