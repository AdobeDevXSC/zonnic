/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns block.
 * Source: https://www.zonnic.com
 * Selector: .half-blocks
 * Extracts: two columns, each with heading, paragraph, CTA link, and image
 */
export default function parse(element, { document }) {
  // Find the two half-block columns
  const halfBlocks = element.querySelectorAll('.half-block');
  if (!halfBlocks || halfBlocks.length === 0) return;

  // Build content for each column
  const columnCells = [];
  halfBlocks.forEach((block) => {
    const cellContent = [];

    // Extract heading
    const heading = block.querySelector('h2, h3, h1');
    if (heading) cellContent.push(heading);

    // Extract paragraph text (remove inline images from paragraph)
    const para = block.querySelector('p');
    if (para) {
      const inlineImgs = para.querySelectorAll('img');
      inlineImgs.forEach((img) => img.remove());
      cellContent.push(para);
    }

    // Extract CTA link
    const cta = block.querySelector('a.btn-second, a.btn-third, a.btn-main, a[class*="btn"]');
    if (cta) cellContent.push(cta);

    // Extract the main product image - find any img NOT inside a paragraph or heading
    const allImgs = block.querySelectorAll('img');
    for (const img of allImgs) {
      // Skip images inside paragraphs or headings (inline icons/emojis)
      if (img.closest('p') || img.closest('h2') || img.closest('h3')) continue;

      // Handle lazy-loaded images
      const dataSrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('data-original');
      if (dataSrc) {
        img.setAttribute('src', dataSrc);
      }

      // Only include images with a real src (not data: URI placeholders)
      const src = img.getAttribute('src') || '';
      if (src && !src.startsWith('data:')) {
        cellContent.push(img);
        break;
      }
    }

    columnCells.push(cellContent);
  });

  // Build cells: single row with both columns
  const cells = [columnCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
