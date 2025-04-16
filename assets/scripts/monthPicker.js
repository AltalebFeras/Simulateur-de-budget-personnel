const simulateBtnThisMonth = document.getElementById("simulateBtnThisMonth");
const simulateBtnAnotherMonth = document.getElementById(
  "simulateBtnAnotherMonth"
);
const month_picker_container = document.querySelector(
  ".month_picker_container"
);
const monthPicker = document.querySelector(".month_picker");
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

let monthsGenerated = false;

// Function to create month cards
function createMonthCard(monthIndex, year) {
  const monthName = monthNames[monthIndex];
  const className = `${monthName}_${year}`;
  const monthDiv = document.createElement("div");
  monthDiv.classList.add(className);
  monthDiv.innerHTML = `
    <div class="month-card" data-month="${monthIndex}" data-year="${year}">
      <div class="month-name">${monthName} ${year}</div>
    </div>`;
  monthPicker.appendChild(monthDiv);

  monthDiv.addEventListener("click", () => {
    localStorage.setItem(
      "selectedMonth",
      JSON.stringify({ month: monthName, year: year })
    );
    window.location.href = "/views/budget.html";
  });
}

simulateBtnThisMonth.addEventListener("click", () => {
  localStorage.setItem(
    "selectedMonth",
    JSON.stringify({ month: monthNames[currentMonth], year: currentYear })
  );
  window.location.href = "/views/budget.html";
});

simulateBtnAnotherMonth.addEventListener("click", () => {
  month_picker_container.style.display = "flex";
  if (!monthsGenerated) {
    monthPicker.innerHTML = ""; // Clear any previous month cards
    for (let i = -6; i <= 5; i++) {
      const date = new Date(currentYear, currentMonth + i);
      const monthIndex = date.getMonth();
      const monthYear = date.getFullYear();

      // Skip the current month when creating month cards
      if (monthIndex === currentMonth && monthYear === currentYear) continue;

      createMonthCard(monthIndex, monthYear);
      window.scrollBy(0, 30);
    }
    monthsGenerated = true; // Set flag to true after months are generated
  }
});

for (let i = -6; i <= 5; i++) {
  const date = new Date(currentYear, currentMonth + i);
  const monthIndex = date.getMonth();
  const monthYear = date.getFullYear();

  if (monthIndex === currentMonth && monthYear === currentYear) continue;

  createMonthCard(monthIndex, monthYear);
}
