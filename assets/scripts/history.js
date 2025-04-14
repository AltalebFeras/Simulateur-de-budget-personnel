let budgetChartInstance = null;

function initialiserFiltres() {
  const monBudgetData = JSON.parse(localStorage.getItem("monBudget")) || {};

  const anneeSelect = document.querySelector("#filtreAnnee");
  const moisSelect = document.querySelector("#filtreMois");

  moisSelect.innerHTML = `<option value="">-- Tous les mois --</option>`;

  const annees = Object.keys(monBudgetData);
  annees.forEach((annee) => {
    const opt = document.createElement("option");
    opt.value = annee;
    opt.textContent = annee;
    anneeSelect.appendChild(opt);
  });

  const currentYear = new Date().getFullYear().toString();
  if (annees.includes(currentYear)) {
    anneeSelect.value = currentYear;
  } else if (annees.length > 0) {
    anneeSelect.value = annees[0];
  }

  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  mois.forEach((moisName) => {
    const opt = document.createElement("option");
    opt.value = moisName;
    opt.textContent = moisName;
    moisSelect.appendChild(opt);
  });
}

function afficherHistoriqueFiltre() {
  const monBudgetData = JSON.parse(localStorage.getItem("monBudget")) || {};
  const annee = document.querySelector("#filtreAnnee").value;
  const mois = document.querySelector("#filtreMois").value;

  const historyCards = document.querySelector("#historyCards");
  historyCards.innerHTML = "";

  if (!annee || !monBudgetData[annee]) {
    const message = document.createElement("p");
    message.textContent = "Il n'y a pas de données à afficher.";
    message.classList.add("no-data-message");
    historyCards.appendChild(message);
    if (budgetChartInstance) budgetChartInstance.destroy();
    return;
  }

  const moisOrdre = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const moisLabels = [];
  const revenusData = [];
  const depensesData = [];
  const restantData = [];

  moisOrdre.forEach((moisName) => {
    if (mois && mois !== moisName) return;
    const data = monBudgetData[annee][moisName];

    if (data) {
      moisLabels.push(moisName);
      revenusData.push(data.totalRevenus || 0);
      depensesData.push(data.totalDepenses || 0);
      restantData.push((data.totalRevenus || 0) - (data.totalDepenses || 0));

      const summaryCard = document.createElement("div");
      summaryCard.classList.add("card", "summary-card");
      const budgetRestant = (data.totalRevenus - data.totalDepenses).toFixed(2);
      const budgetRestantColor = budgetRestant >= 0 ? "green" : "red";

      summaryCard.innerHTML = `
        <h2>${moisName} ${annee}</h2>
        <p><strong>Total Revenus:</strong> <span style="color: blue;">${data.totalRevenus.toFixed(
          2
        )} €</span></p>
        <p><strong>Total Dépenses:</strong> <span style="color: orange;">${data.totalDepenses.toFixed(
          2
        )} €</span></p>
        <p><strong>Budget Restant:</strong> <span style="color: ${budgetRestantColor};">${budgetRestant} €</span></p>
      `;

      historyCards.appendChild(summaryCard);
    }
  });

  if (moisLabels.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Il n'y a pas de données à afficher.";
    message.classList.add("no-data-message");
    historyCards.appendChild(message);
    if (budgetChartInstance) budgetChartInstance.destroy();
    return;
  }

  const ctx = document.getElementById("budgetChart").getContext("2d");

  if (budgetChartInstance) {
    budgetChartInstance.destroy();
  }

  const restantColors = restantData.map((val) => (val >= 0 ? "green" : "red"));

  budgetChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: moisLabels,
      datasets: [
        {
          label: "Revenus",
          data: revenusData,
          backgroundColor: "blue",
        },
        {
          label: "Dépenses",
          data: depensesData,
          backgroundColor: "orange",
        },
        {
          label: "Budget Restant",
          data: restantData,
          backgroundColor: restantColors,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Résumé Mensuel - ${annee}`,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialiserFiltres();
  document
    .querySelectorAll("#filtreAnnee, #filtreMois")
    .forEach((el) => el.addEventListener("change", afficherHistoriqueFiltre));
  afficherHistoriqueFiltre();
});
