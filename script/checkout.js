document.addEventListener("DOMContentLoaded", () => {

  const summaryToggle  = document.getElementById("summaryToggle");
  const summaryContent = document.getElementById("summaryContent");
  const toggleIcon     = summaryToggle.querySelector(".toggle-icon");
  let isExpanded = false;

  summaryToggle.addEventListener("click", () => {
    isExpanded = !isExpanded;
    summaryContent.classList.toggle("expanded", isExpanded);
    toggleIcon.textContent = isExpanded ? "▲" : "▼";
  });

  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  const summaryList  = document.getElementById("summaryList");
  const summarySum   = document.getElementById("summarySum");
  const summaryTotal = document.getElementById("summaryTotal");

  function renderSummary() {
    summaryList.innerHTML = "";
    let total = 0;

    cartItems.forEach(item => {
      const lineTotal = item.price * item.qty;
      total += lineTotal;

      const li = document.createElement("li");
      li.innerHTML = `
        <div class="item-image">
          <img src="${item.imageUrl}" alt="${item.name}" />
        </div>
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-sub">${item.sub}</div>
          <div class="item-colour">Colour: ${item.colour}</div>
          <div class="item-actions">
            <div class="qty-control">
              <button class="qty-decrease" data-id="${item.id}">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
          </div>
        </div>
        <div class="item-price">$${lineTotal.toFixed(2)}</div>
      `;
      summaryList.appendChild(li);
    });

    summarySum.textContent   = `$${total.toFixed(2)}`;
    summaryTotal.textContent = `$${total.toFixed(2)}`;

    bindSummaryEvents();
  }

  function bindSummaryEvents() {
    document.querySelectorAll(".qty-increase").forEach(btn => {
      btn.onclick = () => {
        const id = +btn.dataset.id;
        const it = cartItems.find(x => x.id === id);
        it.qty++;
        saveCartAndRerender();
      };
    });
    document.querySelectorAll(".qty-decrease").forEach(btn => {
      btn.onclick = () => {
        const id = +btn.dataset.id;
        const it = cartItems.find(x => x.id === id);
        if (it.qty > 1) it.qty--;
        saveCartAndRerender();
      };
    });
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.onclick = () => {
        const id = +btn.dataset.id;
        cartItems = cartItems.filter(x => x.id !== id);
        saveCartAndRerender();
      };
    });
  }

  function saveCartAndRerender() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    renderSummary();
  }

  renderSummary();

  const stepBtns = document.querySelectorAll(".step-btn");
  const panels   = {
    1: document.getElementById("step1"),
    2: document.getElementById("step2"),
    3: document.getElementById("step3"),
  };
  const nextBtns = document.querySelectorAll(".next-btn");


  const displayEmail      = document.getElementById("displayEmail");
  const displayAddress    = document.getElementById("displayAddress");
  const displayEmail2     = document.getElementById("displayEmail2");
  const displayAddress2   = document.getElementById("displayAddress2");
  const displayShipMethod = document.getElementById("displayShipMethod");

  function showStep(n) {

    Object.values(panels).forEach(p => p.classList.add("hidden"));
    stepBtns.forEach(b => b.classList.remove("current", "done"));

 
    panels[n].classList.remove("hidden");
    stepBtns[n-1].classList.add("current");
    if (n > 1) stepBtns[n-2].classList.add("done");
  }

  const FREE_THRESHOLD = 99;

  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const next = +btn.dataset.next;

      if (next === 2) {
        const email  = document.getElementById("infoEmail").value.trim();
        const fn     = document.getElementById("infoFirstName").value.trim();
        const ln     = document.getElementById("infoLastName").value.trim();
        const addr   = document.getElementById("infoAddress").value.trim();
        const city   = document.getElementById("infoCity").value.trim();
        const post   = document.getElementById("infoPostcode").value.trim();
        const phone  = document.getElementById("infoPhone").value.trim();

        if (!email||!fn||!ln||!addr||!city||!post||!phone) {
          alert("Please fill out all required fields in Information.");
          return;
        }

        displayEmail.textContent   = email;
        displayAddress.textContent = `${fn} ${ln}, ${addr}, ${city}, ${post}`;

   
        const total = cartItems.reduce((s,i)=> s + i.price*i.qty, 0);
        const stdBtn = document.querySelector('.ship-btn[data-value="standard"]');
        const freeBtn= document.querySelector('.ship-btn[data-value="free"]');

        if (total >= FREE_THRESHOLD) {
          freeBtn.classList.add("selected");
          freeBtn.classList.remove("disabled");
          stdBtn.classList.add("disabled");
          stdBtn.classList.remove("selected");
        } else {
          stdBtn.classList.add("selected");
          stdBtn.classList.remove("disabled");
          freeBtn.classList.add("disabled");
          freeBtn.classList.remove("selected");
        }
      }

      if (next === 3) {
        const shipBtn = document.querySelector(".ship-btn.selected");
        if (!shipBtn || shipBtn.classList.contains("disabled")) {
          alert("Please select a valid shipping method.");
          return;
        }
        displayEmail2.textContent     = displayEmail.textContent;
        displayAddress2.textContent   = displayAddress.textContent;
        displayShipMethod.textContent = shipBtn.querySelector(".ship-label").textContent;
      }

      showStep(next);

  
      if (window.innerWidth <= 800 && isExpanded) {
        summaryContent.classList.remove("expanded");
        toggleIcon.textContent = "▼";
        isExpanded = false;
      }
    });
  });

 
  document.getElementById("changeInfo").addEventListener("click", () => {
    showStep(1);
  });

  document.getElementById("submitPayment").addEventListener("click", () => {
    const pay = document.querySelector('input[name="paymentMethod"]:checked');
  });
  showStep(1);
});
