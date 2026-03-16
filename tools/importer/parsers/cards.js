/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards block.
 * Source: https://www.zonnic.com
 * Selector: .news-section
 * Extracts: three cards with images (including GIFs), titles, descriptions, and read-more links
 */
export default function parse(element, { document }) {
  // Find all card wrappers
  const cardWraps = element.querySelectorAll('.news-wrap');
  if (!cardWraps || cardWraps.length === 0) return;

  const cells = [];

  cardWraps.forEach((card) => {
    // Extract image from image-wrap, handling lazy loading
    const img = card.querySelector('.image-wrap img, img');
    if (img) {
      // Handle lazy-loaded images: copy data-src to src if needed
      const dataSrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
      if (dataSrc) {
        img.setAttribute('src', dataSrc);
      }
    }

    // Build text content cell: title, description, link
    const textContent = [];

    const title = card.querySelector('h3');
    if (title) textContent.push(title);

    const description = card.querySelector('p');
    if (description) textContent.push(description);

    const readMore = card.querySelector('a.read-more');
    if (readMore) textContent.push(readMore);

    // Each card is a row: [image, text content]
    const row = [];
    if (img) row.push(img);
    row.push(textContent);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
