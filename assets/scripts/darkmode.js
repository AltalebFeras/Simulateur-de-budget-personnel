let body = document.body;
let darkMode = localStorage.getItem("darkMode") === "true" ? true : false;
if (darkMode) {
  body.classList.add("darkMode");
}

let darkModeButton = document.querySelector("#toggleDark");
darkModeButton.addEventListener("click", () => {
  body.classList.toggle("darkMode");
  darkMode = body.classList.contains("darkMode");
  localStorage.setItem("darkMode", darkMode);
});