export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const inner = col.querySelector('.default-content-wrapper') || col;
      const pic = inner.querySelector('picture, img');
      if (pic) {
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'columns-content';
        [...inner.children].forEach((el) => {
          if (el !== pic && !el.contains(pic)) {
            contentWrapper.appendChild(el);
          }
        });
        inner.insertBefore(contentWrapper, inner.firstChild);
        const picWrapper = document.createElement('div');
        picWrapper.className = 'columns-img-col';
        picWrapper.appendChild(pic);
        inner.appendChild(picWrapper);
      }
    });
  });
}
