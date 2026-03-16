/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion block.
 * Source: https://www.zonnic.com
 * Selector: .faq-section
 * Extracts: seven accordion items with question headings and answer paragraphs
 */
export default function parse(element, { document }) {
  // Find all accordion items
  const items = element.querySelectorAll('.accordion-item');
  if (!items || items.length === 0) return;

  const cells = [];

  items.forEach((item) => {
    // Extract question heading from accordion-header
    const question = item.querySelector('.accordion-header h2, .accordion-header h3, .accordion-button h2');

    // Extract answer content from accordion-body
    const answerBody = item.querySelector('.accordion-body');

    // Each accordion item is a row: [question, answer]
    const row = [];
    if (question) row.push(question);
    if (answerBody) row.push(answerBody);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
