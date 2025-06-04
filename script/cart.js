const FREE_SHIPPING_THRESHOLD = 100.0;


function getCartFromLocalStorage() {
  const cartJSON = localStorage.getItem("myCartItems");
  if (!cartJSON) return [];
  try {
    return JSON.parse(cartJSON);
  } catch (e) {
    console.error("解析购物车数据失败：", e);
    return [];
  }
}

/**
 * 将购物车数组存回 localStorage
 */
function saveCartToLocalStorage(cartArray) {
  localStorage.setItem("myCartItems", JSON.stringify(cartArray));
}

/**
 * 渲染购物车：渲染表格行 + 更新 Header 上的 ITEM 数量 + 更新 Subtotal + 更新运费进度
 */
function renderCart() {
  // 1. 渲染购物车表格（略，保持原有逻辑，渲染到 #cart-tbody）
  //    ...（这里调用你的 renderCart 旧逻辑，创建 <tr class="cart-item"> …</tr> 并绑定按钮）

  // 2. 更新 Header 上的“ITEM”总数
  const cartData = getCartFromLocalStorage();
  const totalItems = cartData.reduce((sum, it) => sum + it.qty, 0);
  document.getElementById("header-item-count").textContent = totalItems;

  // 3. 更新 Subtotal（金钱数）-- 假设有一个 calculateSubtotal() 函数
  calculateSubtotal();

  // 4. 最后一步：更新“运费进度条”和提示文字
  updateShippingProgress();
}

/**
 * 计算并更新 Subtotal
 */
function calculateSubtotal() {
  const cartData = getCartFromLocalStorage();
  let total = 0;
  cartData.forEach((item) => {
    total += item.price * item.qty;
  });
  document.getElementById("subtotal-amount").textContent =
    "¥" + total.toFixed(2);
}

/**
 * 这个函数负责动态设置顶部进度条的宽度和提示文字
 */
function updateShippingProgress() {
  const cartData = getCartFromLocalStorage();
  let subtotal = 0;
  cartData.forEach((item) => {
    subtotal += item.price * item.qty;
  });

  const progressEl = document.getElementById("shipping-progress");
  const msgEl = document.getElementById("shipping-msg");

  if (totalItems === 0) {
    msgEl.textContent = "Your cart is empty";
    progressEl.style.width = "0%";
    return;
  }

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    // 已达到或超过免运费门槛
    progressEl.style.width = "100%";
    msgEl.textContent = "Congrats! You got the free shipping!";
  } else {
    // 还未达到门槛
    const percent = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
    progressEl.style.width = percent + "%";

    // 还差多少钱才免运费（保留两位小数）
    const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
    msgEl.textContent = `Only $${remaining} away from free shipping!`;
  }
}

