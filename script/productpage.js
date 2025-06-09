document.addEventListener('DOMContentLoaded', () => {

    /* The image sliding effect*/
    const thumbBtns = document.querySelectorAll('.thumb-btn');
    const mainImg = document.querySelector('.image-main .main-img');
    const prevBtn = document.querySelector('.image-main .img-nav.prev');
    const nextBtn = document.querySelector('.image-main .img-nav.next');

    const imageSrcList = Array.from(thumbBtns).map(btn => {
        const img = btn.querySelector('img');
        return img ? img.getAttribute('src') : '';
    });

    let currentIndex = 0;

    function updateMainImage(index) {
        if (imageSrcList.length === 0) return;

        if (index < 0) {
            index = imageSrcList.length - 1;
        } else if (index >= imageSrcList.length) {
            index = 0;
        }
        currentIndex = index;

        mainImg.setAttribute('src', imageSrcList[index]);

        thumbBtns.forEach(btn => btn.classList.remove('active'));
        if (thumbBtns[index]) {
            thumbBtns[index].classList.add('active');
        }
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

    /*Initialise Main Image*/
    updateMainImage(0);


    /* quantity add and minus logiv */
    const qtyInput = document.querySelector('.qty-input');
    const decreaseQtyBtn = document.querySelector('.qty-btn[data-action="decrease"]');
    const increaseQtyBtn = document.querySelector('.qty-btn[data-action="increase"]');

    if (decreaseQtyBtn && qtyInput) {
        decreaseQtyBtn.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value) || 1;
            if (currentQty > 1) {
                qtyInput.value = currentQty - 1;
            }
        });
    }

    if (increaseQtyBtn && qtyInput) {
        increaseQtyBtn.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value) || 1;
            qtyInput.value = currentQty + 1;
        });
    }


    /* The colour selector of the product */
    const colorSwatches = document.querySelectorAll('.color-options .swatch-btn');
    let selectedColor = '';

    if (colorSwatches.length > 0) {
        const initialActiveSwatch = document.querySelector('.color-options .swatch-btn.active');
        if (initialActiveSwatch) {
            selectedColor = initialActiveSwatch.dataset.color;
        } else {
            colorSwatches[0].classList.add('active');
            selectedColor = colorSwatches[0].dataset.color;
        }

        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                colorSwatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                selectedColor = swatch.dataset.color;
            });
        });
    } else {
        selectedColor = "/";
    }


    /* --- Add to Cart (popup message and local storage) --- */
    const addToCartBtn = document.getElementById('addToCartBtn');
    const cartMessagePopup = document.getElementById('cartMessagePopup');

    if (addToCartBtn && cartMessagePopup) {
        addToCartBtn.addEventListener('click', () => {
          /*Showing the pop up */
            cartMessagePopup.classList.add('show');
    

            /*Collect shopping item information*/
            const productNameElement = document.querySelector('.product-des .product-title');
            const productPriceElement = document.querySelector('.product-des .price');

            const productName = productNameElement ? productNameElement.textContent.trim() : "Unknown Product";
            const productPrice = productPriceElement ? parseFloat(productPriceElement.textContent.replace('$', '').trim()) : 0;
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

            const product = {
                id: Date.now(),
                name: productName,
                price: productPrice,
                color: selectedColor,
                quantity: quantity,
                imageUrl: imageSrcList[currentIndex]
            };

            /*Save the products information locallly*/
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

            const existingItemIndex = cartItems.findIndex(item => item.name === product.name && item.color === product.color);

            if (existingItemIndex > -1) {
                cartItems[existingItemIndex].quantity += product.quantity;
            } else {
                cartItems.push(product);
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            /*Hide the pop up in 2 seconds*/
            setTimeout(() => {
                cartMessagePopup.classList.remove('show');
            }, 1500);
        });
      }
});