    
document.addEventListener("DOMContentLoaded", () => {
  const emailSelect = document.getElementById("emailSelect");
  const codeInput   = document.getElementById("codeInput");
  const continueBtn = document.getElementById("continueBtn");

  // 初始隐藏“Code”输入框
  codeInput.classList.add("hidden");

  continueBtn.addEventListener("click", e => {
    // 如果 codeInput 还没显示，就先阻止跳转，显示它
    if (codeInput.classList.contains("hidden")) {
      e.preventDefault();
      codeInput.classList.remove("hidden");
      codeInput.focus();
      // 修改按钮文案，提示用户下一步要“Verify Code”
      continueBtn.textContent = "CONTINUE WITH EMAIL";
      return;
    }

    // codeInput 已显示，检查用户是否输入了 code
    const code = codeInput.value.trim();
    if (!code) {
      e.preventDefault();
      alert("Please enter the log in code we sent to your email.");
      codeInput.focus();
      return;
    }

    // 验证通过，允许跳转到 checkout（依赖 href="../pages/checkout.html"）
    // 如果你想模拟验证码校验，可在这里插入异步请求
  });
});