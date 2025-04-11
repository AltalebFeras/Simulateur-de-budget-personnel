function initialiserFiltres() {
  const monBudgetData = JSON.parse(localStorage.getItem("monBudget")) || {};

  const anneeSelect = document.querySelector("#filtreAnnee");
  const moisSelect = document.querySelector("#filtreMois");

  // Clear existing options
  anneeSelect.innerHTML = `<option value="">-- Toutes les années --</option>`;
  moisSelect.innerHTML = `<option value="">-- Tous les mois --</option>`;

  // Populate years dynamically
  const annees = Object.keys(monBudgetData);
  annees.forEach((annee) => {
    const opt = document.createElement("option");
    opt.value = annee;
    opt.textContent = annee;
    anneeSelect.appendChild(opt);
  });

  // Populate months (static list)
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

  for (const an of Object.keys(monBudgetData)) {
    if (annee && an !== annee) continue;

    for (const mo of Object.keys(monBudgetData[an])) {
      if (mois && mo !== mois) continue;

      const data = monBudgetData[an][mo];
      const totalRevenus = data.totalRevenus || 0;
      const totalDepenses = data.totalDepenses || 0;
      const budgetRestant = data.budgetRestant || totalRevenus - totalDepenses;

      // Create summary card only
      const summaryCard = document.createElement("div");
      summaryCard.classList.add("card", "summary-card");
      summaryCard.innerHTML = `
          <h2>${mo} ${an}</h2>
          <p><strong>Total Revenus:</strong> ${totalRevenus.toFixed(2)} €</p>
          <p><strong>Total Dépenses:</strong> ${totalDepenses.toFixed(2)} €</p>
          <p><strong>Budget Restant:</strong> ${budgetRestant.toFixed(2)} €</p>
        `;
      historyCards.appendChild(summaryCard);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initialiserFiltres();
  document
    .querySelectorAll("#filtreAnnee, #filtreMois")
    .forEach((el) => el.addEventListener("change", afficherHistoriqueFiltre));
  afficherHistoriqueFiltre();
});


let budgetChartInstance = null;

function afficherHistoriqueFiltre() {
  const monBudgetData = JSON.parse(localStorage.getItem("monBudget")) || {};
  const annee = document.querySelector("#filtreAnnee").value;
  const mois = document.querySelector("#filtreMois").value;

  const historyCards = document.querySelector("#historyCards");
  historyCards.innerHTML = "";

  if (!annee || !monBudgetData[annee]) {
    console.log("No data found for the selected year:", annee);
    return;
  }

  const moisOrdre = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const moisLabels = [];
  const revenusData = [];
  const depensesData = [];
  const restantData = [];

  // Loop through each month for the selected year
  moisOrdre.forEach((moisName) => {
    const data = monBudgetData[annee][moisName];

    if (data) {
      moisLabels.push(moisName);
      revenusData.push(data.totalRevenus || 0);
      depensesData.push(data.totalDepenses || 0);
      restantData.push((data.totalRevenus || 0) - (data.totalDepenses || 0));

      const summaryCard = document.createElement("div");
      summaryCard.classList.add("card", "summary-card");
      summaryCard.innerHTML = `
        <h2>${moisName} ${annee}</h2>
        <p><strong>Total Revenus:</strong> ${data.totalRevenus.toFixed(2)} €</p>
        <p><strong>Total Dépenses:</strong> ${data.totalDepenses.toFixed(2)} €</p>
        <p><strong>Budget Restant:</strong> ${(data.totalRevenus - data.totalDepenses).toFixed(2)} €</p>
      `;
      historyCards.appendChild(summaryCard);
    }
  });

  if (moisLabels.length === 0) {
    console.log("No valid month data found for the selected year.");
    return;
  }

  const ctx = document.getElementById("budgetChart").getContext("2d");

  if (budgetChartInstance) {
    budgetChartInstance.destroy();
  }

  budgetChartInstance = new Chart(ctx, {
    type: "bar",  
    data: {
      labels: moisLabels,
      datasets: [
        {
          label: "Revenus",
          data: revenusData,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Dépenses",
          data: depensesData,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
        {
          label: "Budget Restant",
          data: restantData,
          backgroundColor: "rgba(255, 206, 86, 0.6)",
        }
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Résumé Mensuel - ${annee}`
        },
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
