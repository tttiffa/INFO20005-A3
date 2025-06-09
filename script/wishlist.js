document.addEventListener('DOMContentLoaded', () => {
  const KEY      = 'wishlist';
  const openBtn  = document.getElementById('openWishlist');
  const modal    = document.getElementById('wishlistModal');
  const backdrop = document.getElementById('wishlistBackdrop');
  const backBtn  = document.getElementById('backToProduct');
  const listEl   = document.getElementById('wishlistItems');

  const getList  = () => JSON.parse(localStorage.getItem(KEY)) || [];
  const saveList = arr => localStorage.setItem(KEY, JSON.stringify(arr));

  function renderList() {
    const arr = getList();
    if (!arr.length) {
      listEl.innerHTML = '<p>Your wishlist is empty!</p>';
      return;
    }
    listEl.innerHTML = arr.map(i => `
      <div class="wishlist-item">
        <img src="${i.img}" alt="${i.name}"/>
        <div class="info">
          <h3>${i.id}</h3>
          <p>${i.name}</p>
        </div>
        <div class="controls">
          <div class="price">$${i.price}</div>
          <div class="quantity">
            <button class="qty-btn" data-id="${i.id}" data-action="decrease">-</button>
            <input 
              type="text" 
              class="qty-input" 
              data-id="${i.id}" 
              value="${i.qty}" 
              readonly
            />
            <button class="qty-btn" data-id="${i.id}" data-action="increase">+</button>
          </div>
          <a href="../pages/cart.html" class="add-cart-btn">ADD TO CART</a>
        </div>
      </div>
    `).join('');

  /*quantity button logic*/
    listEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id     = btn.dataset.id;
        const action = btn.dataset.action;
        const list   = getList();
        const item   = list.find(x => x.id === id);
        if (!item) return;
        if (action === 'increase') {
          item.qty++;
        } else if (action === 'decrease' && item.qty > 1) {
          item.qty--;
        }
        saveList(list);
        renderList();
      });
    });
  }


  openBtn.addEventListener('click', e => {
    e.preventDefault();
    renderList();
    modal.classList.add('open');
  });
  [backBtn, backdrop].forEach(el =>
    el.addEventListener('click', () => modal.classList.remove('open'))
  );

/*click heart/unclick*/
  document.querySelectorAll('.wishlist-icon').forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      const isAdd = icon.classList.contains('fa-regular');
      const card  = btn.closest('.product-card');
      const data  = {
        id:    card.dataset.id,
        name:  card.dataset.name,
        price: card.dataset.price,
        img:   card.dataset.img,
        qty:   parseInt(card.dataset.qty, 10) || 1    /*Read from the quantity*/
      };

      if (isAdd) {
        icon.classList.replace('fa-regular','fa-solid');
        btn.classList.add('favorited');
      } else {
        icon.classList.replace('fa-solid','fa-regular');
        btn.classList.remove('favorited');
      }

      let list = getList();
      if (isAdd) {
        if (!list.some(x => x.id === data.id)) list.push(data);
      } else {
        list = list.filter(x => x.id !== data.id);
      }
      saveList(list);
    });
  });
});
