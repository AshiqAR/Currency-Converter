function toggleDarkMode() {
  const elements = document.querySelectorAll(".light-mode, .dark-mode");
  const exchangeIcon = document.getElementById("exchange-icon");

  elements.forEach((element) => {
    if (element.classList.contains("light-mode")) {
      element.classList.remove("light-mode");
      element.classList.add("dark-mode");
      exchangeIcon.src = "exchange-dark.png";
    } else if (element.classList.contains("dark-mode")) {
      element.classList.remove("dark-mode");
      element.classList.add("light-mode");
      exchangeIcon.src = "exchange-light.png";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    toggleDarkMode();
  }
});
