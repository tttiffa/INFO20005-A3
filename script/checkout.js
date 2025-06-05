document.addEventListener("DOMContentLoaded", () => {
    const emailSelect = document.getElementById("emailSelect");
    const codeInput = document.getElementById("codeInput");
    const continueBtn = document.getElementById("continueBtn");
  
    let state = 0;
  
    continueBtn.addEventListener("click", function (e) {
      e.preventDefault();
  
      if (state === 0) {
        const selectedEmail = emailSelect.value;
        if (!selectedEmail) {
          alert("Please choose an email from the dropdown.");
          return;
        }

        state = 1;
  
        emailSelect.disabled = true;
  
        codeInput.classList.remove("hidden");

  
        const tip = document.createElement("p");
        tip.id = "codeTip";
        emailSelect.parentNode.insertBefore(tip, codeInput);
      } else if (state === 1) {
        const codeValue = codeInput.value.trim();
        if (!codeValue) {
          alert("Please enter the code you received.");
          return;
        }
        window.location.href = "checkout.html";
      }
    });
});