/*
 * Video Block
 * Show a video as a hero background with heading and CTAs, or as a standard embed.
 * https://www.hlx.live/developer/block-collection/video
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getVideoElement(source) {
  const video = document.createElement('video');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.muted = true;

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', `video/${source.split('.').pop()}`);
  video.append(sourceEl);

  return video;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Extract content from rows
  const firstRow = rows[0];
  const link = firstRow.querySelector('a');
  const posterImg = firstRow.querySelector('img');

  if (!link) return;

  const videoSrc = link.href;
  const headingRow = rows.length > 1 ? rows[1] : null;
  const ctaRow = rows.length > 2 ? rows[2] : null;

  // Determine if this is a hero-style video (has heading or CTAs)
  const isHero = headingRow || ctaRow;

  if (isHero) {
    block.classList.add('hero');

    // Build hero structure
    block.textContent = '';

    // Video background container
    const videoBg = document.createElement('div');
    videoBg.className = 'video-background';

    if (posterImg) {
      const poster = document.createElement('div');
      poster.className = 'video-poster';
      const img = document.createElement('img');
      img.src = posterImg.src;
      img.alt = posterImg.alt || '';
      img.loading = 'eager';
      poster.append(img);
      videoBg.append(poster);
    }

    block.append(videoBg);

    // Content overlay - title top-left, CTAs bottom-center
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';

    if (headingRow) {
      const headingText = headingRow.textContent.trim();
      if (headingText) {
        const topSection = document.createElement('div');
        topSection.className = 'video-overlay-top';
        const h1 = document.createElement('h1');
        h1.textContent = headingText;
        topSection.append(h1);
        overlay.append(topSection);
      }
    }

    if (ctaRow) {
      const bottomSection = document.createElement('div');
      bottomSection.className = 'video-overlay-bottom';
      const ctaContainer = document.createElement('div');
      ctaContainer.className = 'video-ctas';
      const links = ctaRow.querySelectorAll('a');
      links.forEach((a, i) => {
        const btn = document.createElement('a');
        btn.href = a.href;
        btn.textContent = a.textContent;
        btn.className = i === 0 ? 'button secondary' : 'button';
        ctaContainer.append(btn);
      });
      bottomSection.append(ctaContainer);
      overlay.append(bottomSection);
    }

    block.append(overlay);

    // Load video with IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        if (!prefersReducedMotion.matches) {
          const video = getVideoElement(videoSrc);
          videoBg.prepend(video);
          video.addEventListener('canplay', () => {
            video.play();
            const poster = videoBg.querySelector('.video-poster');
            if (poster) poster.style.opacity = '0';
          });
        }
      }
    });
    observer.observe(block);
  } else {
    // Standard video embed (non-hero)
    block.textContent = '';
    block.dataset.embedLoaded = false;
    const video = getVideoElement(videoSrc);
    video.setAttribute('controls', '');
    video.removeAttribute('muted');
    block.append(video);
  }
}
