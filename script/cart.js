/*The free shipping section*/
const FREE_SHIPPING_THRESHOLD = 100;

document.addEventListener("DOMContentLoaded", () => {
  /*Connect item number and remove*/
  bindCartRowEvents();
  recalcCart();
});

function bindCartRowEvents() {
  const cartRows = document.querySelectorAll(".cart-item");

  cartRows.forEach((row) => {
    const qtyNumberEl = row.querySelector(".qty-control .qty-number");
    const minusBtn = row.querySelector(".qty-control .minus");
    const plusBtn = row.querySelector(".qty-control .plus");
    const removeLink = row.querySelector(".remove-link");
    const priceCell = row.querySelector(".price-cell");

    /*Read single price from data list*/
    const unitPrice = parseFloat(priceCell.getAttribute("data-price")) || 0;

   /*Only minus when the amount is >1 */
    minusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let currentQty = parseInt(qtyNumberEl.textContent, 10);
      if (currentQty > 1) {
        currentQty--;
        qtyNumberEl.textContent = currentQty;
        updateRowPrice(priceCell, unitPrice, currentQty);
        recalcCart();
      }
    });

   /* "+" button : +1 */
    plusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let currentQty = parseInt(qtyNumberEl.textContent, 10);
      currentQty++;
      qtyNumberEl.textContent = currentQty;
      updateRowPrice(priceCell, unitPrice, currentQty);
      recalcCart();
    });

    /* Remove link */
    removeLink.addEventListener("click", (e) => {
      e.preventDefault();
      row.remove();
      recalcCart();
    });

    const initialQty = parseInt(qtyNumberEl.textContent, 10) || 1;
    updateRowPrice(priceCell, unitPrice, initialQty);
  });
}

/*Update price and quantity information for each item */
function updateRowPrice(priceCell, unitPrice, qty) {
  const lineTotal = unitPrice * qty;
  const formattedTotal = `$${lineTotal.toFixed(2)}`;

  const removeAnchor = priceCell.querySelector(".remove-link");

  priceCell.textContent = "";
  priceCell.appendChild(document.createTextNode(formattedTotal));
  priceCell.appendChild(document.createElement("br"));
  priceCell.appendChild(removeAnchor);

 /* update information data-price-text attribute simultaneously */
  priceCell.setAttribute("data-price-text", formattedTotal);
}

function recalcCart() {
  const cartRows = document.querySelectorAll(".cart-item");
  const shippingMsgEl = document.getElementById("shipping-msg");
  const progressEl = document.getElementById("shipping-progress");
  const subtotalEl = document.getElementById("subtotal-amount");
  const headerCountEl = document.getElementById("header-item-count");

/* When the cart is empty */
  if (cartRows.length === 0) {
    if (shippingMsgEl) {
      shippingMsgEl.textContent = "You are $99 away from free shipping! Don't miss out!";
    }
    /*Hide the progress bar */
    if (progressEl) {
      progressEl.style.width = "0%";
    }
    /*Update price of the side bar */
    if (subtotalEl) {
      subtotalEl.textContent = "$0.00";
    }
    if (headerCountEl) {
      headerCountEl.textContent = "0";
    }
    return; 
  }

/* Calculate the sub total */
  let subtotal = 0;
  cartRows.forEach((row) => {
    const priceCell = row.querySelector(".price-cell");
    const priceText = priceCell.getAttribute("data-price-text") ||
                      priceCell.textContent.trim().split("\n")[0] ||
                      "$0.00";
    const priceNum = parseFloat(priceText.replace(/^\$/, "")) || 0;
    subtotal += priceNum;
  });

  if (subtotalEl) {
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }
/* Update the number of items in the header */
  if (headerCountEl) {
    headerCountEl.textContent = cartRows.length;
  }

 /*Update shipping message */
  if (shippingMsgEl && progressEl) {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      shippingMsgEl.textContent = "Congrats! You got free shipping!";
      progressEl.style.width = "100%";
    } else {
      const remain = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
      shippingMsgEl.textContent = `You are $${remain} away from free shipping!`;
      const percent = Math.floor((subtotal / FREE_SHIPPING_THRESHOLD) * 100);
      progressEl.style.width = `${percent}%`;
    }
  }
}
