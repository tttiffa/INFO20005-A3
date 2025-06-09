    
document.addEventListener("DOMContentLoaded", () => {
  const emailSelect = document.getElementById("emailSelect");
  const codeInput   = document.getElementById("codeInput");
  const continueBtn = document.getElementById("continueBtn");

  codeInput.classList.add("hidden");

  continueBtn.addEventListener("click", e => {
    if (codeInput.classList.contains("hidden")) {
      e.preventDefault();
      codeInput.classList.remove("hidden");
      codeInput.focus();
      continueBtn.textContent = "CONTINUE WITH EMAIL";
      return;
    }

    const code = codeInput.value.trim();
    if (!code) {
      e.preventDefault();
      alert("Please enter the log in code we sent to your email.");
      codeInput.focus();
      return;
    }

  });
});