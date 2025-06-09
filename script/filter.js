document.addEventListener('DOMContentLoaded', () => {
  const btn     = document.getElementById('filterTriggerMobile');
  const overlay = document.getElementById('filterOverlay');
  const close   = document.getElementById('filterCloseButton');

  if (!btn || !overlay || !close) {
    console.error('Filter drawer elements not found');
    return;
  }

/*Open the shelf*/
  btn.addEventListener('click', () => {
    overlay.classList.add('open');
  });

  /*Press "x" to close filter shelf*/
  close.addEventListener('click', () => {
    overlay.classList.remove('open');
  });

  /*The shelf would be closed if clicking empty space*/
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
    }
  });
});
