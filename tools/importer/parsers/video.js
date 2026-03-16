/* eslint-disable */
/* global WebImporter */
/**
 * Parser for video block.
 * Source: https://www.zonnic.com
 * Selectors: .hero-section#hero-1, .hero-section#hero-2
 * Extracts: loop video URL, heading text, CTA buttons
 */
export default function parse(element, { document }) {
  // Use the desktop hero-video div (d-sm-block)
  const desktopHero = element.querySelector('.hero-video.d-sm-block') || element.querySelector('.hero-video');
  if (!desktopHero) return;

  // Extract the loop video (video#video-2 contains the loop video)
  const videos = desktopHero.querySelectorAll('video');
  let loopVideo = null;
  for (const v of videos) {
    const src = v.querySelector('source');
    if (src && src.getAttribute('src') && src.getAttribute('src').includes('loop')) {
      loopVideo = v;
      break;
    }
  }
  // Fallback to second video or first video
  if (!loopVideo && videos.length > 1) loopVideo = videos[1];
  if (!loopVideo && videos.length > 0) loopVideo = videos[0];

  // Extract heading
  const heading = desktopHero.querySelector('.heading, h1, h2');

  // Extract CTA buttons
  const ctaLinks = Array.from(desktopHero.querySelectorAll('.buttons a, a.btn-main, a.btn-second'));

  // Build cells matching video block structure:
  // Row 1: video element
  // Row 2: heading text
  // Row 3: CTA links
  const cells = [];

  if (loopVideo) {
    cells.push([loopVideo]);
  }

  if (heading) {
    cells.push([heading]);
  }

  if (ctaLinks.length > 0) {
    cells.push(ctaLinks);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'video', cells });
  element.replaceWith(block);
}
