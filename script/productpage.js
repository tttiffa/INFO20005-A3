/* The transition of produce images animation*/
document.addEventListener('DOMContentLoaded', () => {

  /*Grab all the thumb buttons using querySelectorAll*/
  const thumbBtns = document.querySelectorAll('.thumb-btn');
  
  /*Grab the main/primary image*/
  const mainImg = document.querySelector('.image-main .main-img');
  
  /*Grab left and right arrow buttons*/
  const prevBtn = document.querySelector('.image-main .img-nav.prev');
  const nextBtn = document.querySelector('.image-main .img-nav.next');

  /*Collected all the image addresses and save them based on the orders */
  const imageSrcList = Array.from(thumbBtns).map(btn => {
    const img = btn.querySelector('img');
    return img ? img.getAttribute('src') : '';
  });

/*The index of images: Start from  */
  let currentIndex = 0;

  function updateMainImage(index) {
    if (index < 0) {
      index = imageSrcList.length - 1;
    } else if (index >= imageSrcList.length) {
      index = 0;
    }
    currentIndex = index; 

   /*Change to the primary image */
    mainImg.setAttribute('src', imageSrcList[index]);

    thumbBtns.forEach(btn => btn.classList.remove('active'));
    thumbBtns[index].classList.add('active');
  }

  thumbBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      updateMainImage(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateMainImage(currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateMainImage(currentIndex + 1);
    });
  }

  /*The quantity button */
  const qtyBtns = document.querySelectorAll('.qty-btn');
  const qtyInput = document.querySelector('.qty-input');

  qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
    /*Data action: Decrease or Increase*/
      const action = btn.getAttribute('data-action');
      let currentQty = parseInt(qtyInput.value) || 1;

      if (action === 'decrease') {
        /* Decrease if more than 1, otherwise plus 1 */
        if (currentQty > 1) {
          currentQty--;
        }
      } else if (action === 'increase') {
        /* Plus one when pressed the '+' button*/
        currentQty++;
      }
      /*Upgraded to the input bar */
      qtyInput.value = currentQty;
    });
  });
});

  document.addEventListener('DOMContentLoaded', function () {
    //*Grab all the buttons*/
    const swatches = document.querySelectorAll('.swatch-btn');
    /*Grab hidden button and input */
    const hiddenInput = document.getElementById('selected-colour');

    swatches.forEach(button => {
      button.addEventListener('click', () => {
        /*Get rid of buttons*/
        swatches.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        hiddenInput.value = button.getAttribute('data-color');
      });
    });
  });


