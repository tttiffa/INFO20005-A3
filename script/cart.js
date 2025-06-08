document.addEventListener('DOMContentLoaded', () => {
  // —— 1. 读取并规范化旧数据 —— 
  let items = JSON.parse(localStorage.getItem('cartItems') || '[]')
    .map(item => {
      const quantity = Number.isFinite(item.quantity)
        ? item.quantity
        : Number.isFinite(item.qty)
        ? item.qty
        : 1;
      const color = item.color || item.colour || 'Default';
      const name = item.sub
        ? `${item.name} ${item.sub}`
        : item.name || 'Unknown Product';
      const price = Number.isFinite(item.price) ? item.price : 0;
      const imageUrl = item.imageUrl || '../images/placeholder.png';
      return { id: item.id, name, price, color, quantity, imageUrl };
    })
    .filter(i => i.name && i.price > 0);

  // —— 2. 拿 DOM 钩子 —— 
  const tbody            = document.getElementById('cart-tbody');
  const itemCountElem    = document.getElementById('header-item-count');
  const subtotalElem     = document.getElementById('subtotal-amount');
  const shippingMsg      = document.getElementById('shipping-msg');
  const shippingProgress = document.getElementById('shipping-progress');

  const THRESHOLD = 99;

  // —— 3. 渲染行 —— 
  function renderRows(list) {
    tbody.innerHTML = '';
    list.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="product-cell">
          <div class="product-info">
            <img src="${item.imageUrl}" alt="${item.name}" class="cart-img">
            <div>
              <p class="product-brand">${item.name}</p>
              <p class="product-color">Colour: ${item.color}</p>
            </div>
          </div>
        </td>
        <td class="qty-cell">
          <div class="cart-qty">
            <button class="qty-btn decrease" data-id="${item.id}">-</button>
            <input type="text"
                   class="qty-input"
                   data-id="${item.id}"
                   value="${item.quantity}"
                   readonly>
            <button class="qty-btn increase" data-id="${item.id}">+</button>
          </div>
        </td>

        <td class="price-cell">
          <div>$${(item.price * item.quantity).toFixed(2)}</div>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // —— 4. 更新件数、小计、进度条与提示 —— 
  function updateSummary(list) {
    const totalQty = list.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = list.reduce((sum, i) => sum + i.price * i.quantity, 0);

    itemCountElem.textContent = totalQty;
    subtotalElem.textContent  = `$${subtotal.toFixed(2)}`;

    // 进度条：空车时也设为 0%
    const pct = list.length === 0
      ? 0
      : Math.min((subtotal / THRESHOLD) * 100, 100);
    shippingProgress.style.width = pct + '%';

    // 提示文字
    if (list.length === 0) {
      // 购物车空时也显示这条
      shippingMsg.textContent =
        `You are $${THRESHOLD} away from free shipping! Don't miss out!`;
    } else if (subtotal >= THRESHOLD) {
      shippingMsg.textContent = 'Congrats! You got the free shipping!';
    } else {
      shippingMsg.textContent =
        `Only $${(THRESHOLD - subtotal).toFixed(2)} away from free shipping!`;
    }
  }

  // 初始渲染
  renderRows(items);
  updateSummary(items);

  // —— 5. 事件委托：数量按钮 & Remove —— 
  tbody.addEventListener('click', e => {
    const id = e.target.dataset.id;

    // 增减数量
    if (e.target.matches('.qty-btn')) {
      const dir = e.target.classList.contains('increase') ? 1 : -1;
      const idx = items.findIndex(i => i.id == id);
      if (idx === -1) return;
      items[idx].quantity = Math.max(1, items[idx].quantity + dir);
      localStorage.setItem('cartItems', JSON.stringify(items));

      // 更新行内显示
      const input    = tbody.querySelector(`.qty-input[data-id="${id}"]`);
      const priceDiv = input.closest('tr').querySelector('.price-cell > div');
      input.value    = items[idx].quantity;
      priceDiv.textContent = `$${(items[idx].price * items[idx].quantity).toFixed(2)}`;

      // 更新汇总
      updateSummary(items);
    }

    // 移除商品
    if (e.target.matches('.remove-btn')) {
      items = items.filter(i => i.id != id);
      localStorage.setItem('cartItems', JSON.stringify(items));
      renderRows(items);
      updateSummary(items);
    }
  });
});
