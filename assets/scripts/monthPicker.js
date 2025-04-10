
const monthPicker = document.querySelector('.month_picker');
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const monthList = [];

for (let i = -6; i <= 5; i++) {
  const date = new Date(currentYear, currentMonth + i);
  const monthIndex = date.getMonth();
  const monthYear = date.getFullYear();
  const monthName = monthNames[monthIndex];

  const className = `${monthName}_${monthYear}`;
  monthList.push({ name: monthName, year: monthYear, index: monthIndex, className });

  const monthDiv = document.createElement('div');
  monthDiv.classList.add(className);
  monthDiv.innerHTML = `
    <div class="month-card" data-month="${monthIndex}" data-year="${monthYear}">
      <div class="month-name">${monthName} ${monthYear}</div>
    </div>`;
  monthPicker.appendChild(monthDiv);

  // Écouteur d'événement
  monthDiv.addEventListener('click', () => {
    localStorage.setItem('selectedMonth', JSON.stringify({ month: monthName, year: monthYear }));
    window.location.href = '/views/budget.html'; // Redirection vers la page de budget
  });
}