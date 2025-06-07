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

// cart-page.js

document.addEventListener("DOMContentLoaded", () => {
  // —— 1. 读取 localStorage 或初始化空数组 —— 
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  // —— 2. 保存到 localStorage —— 
  function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  // —— 3. 渲染购物车列表 —— 
  function renderCart() {
    const list = document.getElementById("cartList");
    list.innerHTML = "";
    cartItems.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="cart-img" />
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>${item.sub}</p>
          <div class="qty-control">
            <button class="decrease" data-id="${item.id}">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="increase" data-id="${item.id}">+</button>
          </div>
          <span class="price">$${(item.price * item.qty).toFixed(2)}</span>
          <button class="remove" data-id="${item.id}">Remove</button>
        </div>
      `;
      list.appendChild(li);
    });
    bindCartEvents();
  }

  // —— 4. 绑定增减和删除按钮 —— 
  function bindCartEvents() {
    document.querySelectorAll(".increase").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = +btn.dataset.id;
        const it = cartItems.find(x => x.id === id);
        it.qty++;
        saveCart();
        renderCart();
      });
    });
    document.querySelectorAll(".decrease").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = +btn.dataset.id;
        const it = cartItems.find(x => x.id === id);
        if (it.qty > 1) it.qty--;
        saveCart();
        renderCart();
      });
    });
    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = +btn.dataset.id;
        cartItems = cartItems.filter(x => x.id !== id);
        saveCart();
        renderCart();
      });
    });
  }

  /*Helped the checkout page to get item total price for the free shipping criteria*/
  window.addToCart = function(item) {
    const exist = cartItems.find(x => x.id === item.id);
    if (exist) {
      exist.qty++;
    } else {
      cartItems.push({ ...item, qty: 1 });
    }
    saveCart();
    renderCart();
  };
  
  renderCart();
});

function recalcCart() {
  const cartRows = document.querySelectorAll(".cart-item");
  // … 你现有的小计、进度条、头部数目那些逻辑 …

  // ——— 新增：把当前表格里的所有商品收集到一个数组 ———
  const itemsForStorage = Array.from(cartRows).map(row => {
    // 假设每行有 data-product-id, .brand-name, .product-title, .product-color, .qty-number, data-price
    const id      = row.dataset.productId;
    const name    = row.querySelector(".brand-name").textContent;
    const sub     = row.querySelector(".product-title").textContent;
    const colour  = row.querySelector(".product-color").textContent.replace("Colour: ", "");
    const qty     = parseInt(row.querySelector(".qty-number").textContent, 10);
    const unit    = parseFloat(row.querySelector(".price-cell").dataset.price) || 0;
    const imageEl = row.querySelector(".product-info img");
    const imageUrl= imageEl ? imageEl.src : "";
    return { id, name, sub, colour, price: unit, qty, imageUrl };
  });

  // 存到 localStorage
  localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
}


