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

// Get selected month and year from localStorage
let selectedMonth = localStorage.getItem("selectedMonth")
  ? localStorage.getItem("selectedMonth")
  : null;
if (!selectedMonth) {
  window.location.href = "./../index.html";
}

let monthYear = JSON.parse(selectedMonth);
let month = monthYear.month;
let year = monthYear.year;
console.log(month, year);

document.querySelector(".selectedMonth").textContent = month + " " + year;

// Initialize or get data from localStorage
let monBudget = JSON.parse(localStorage.getItem("monBudget")) || {};

if (!monBudget[year]) monBudget[year] = {};
if (!monBudget[year][month]) {
  monBudget[year][month] = {
    revenus: [],
    depenses: [],
    totalRevenus: 0,
    totalDepenses: 0,
    budgetRestant: 0,
  };
}

// Afficher Revenus (Revenue handling)
const form = document.querySelector(".formRevnus");
const totalRevenusEl = document.querySelector("#totalRevenus");
const revenusCategoriesEl = document.querySelector("#revenusCategories");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const montant = parseFloat(document.querySelector("#montant").value);
  const categorie = document.querySelector("#categorie").value;

  if (isNaN(montant) || montant <= 0) {
    alert("Le montant doit être un nombre positif.");
    return;
  }

  if (categorie !== "autres") {
    const existeDeja = monBudget[year][month].revenus.some(
      (r) => r.categorie === categorie
    );
    if (existeDeja) {
      alert(`La catégorie "${categorie}" a déjà été ajoutée ce mois-ci.`);
      return;
    }
  }

  monBudget[year][month].revenus.push({ montant, categorie });
  monBudget[year][month].totalRevenus += montant;
  localStorage.setItem("monBudget", JSON.stringify(monBudget));

  form.reset();
  afficherRevenus();
  calculerBudgetRestant();
});

function afficherRevenus() {
  const revenus = monBudget[year][month].revenus;
  let total = 0;
  revenusCategoriesEl.innerHTML = "";

  revenus.forEach(({ montant, categorie }, index) => {
    total += montant;
    const li = document.createElement("li");
    li.innerHTML = `
      ${categorie} : ${montant.toFixed(2)} € 
      <span style="cursor:pointer; color:red; margin-left:10px;" data-index="${index}">❌</span>
    `;
    li.querySelector("span").addEventListener("click", () => {
      supprimerRevenu(index);
    });

    revenusCategoriesEl.appendChild(li);
  });

  totalRevenusEl.textContent = `${total.toFixed(2)} €`;
}

function supprimerRevenu(index) {
  if (confirm("Voulez-vous vraiment supprimer ce revenu ?")) {
    const montantToRemove = monBudget[year][month].revenus[index].montant;
    monBudget[year][month].revenus.splice(index, 1);
    monBudget[year][month].totalRevenus -= montantToRemove;
    localStorage.setItem("monBudget", JSON.stringify(monBudget));
    afficherRevenus();
    calculerBudgetRestant();
  }
}

// Afficher Dépenses (Expense handling)
const formDepenses = document.querySelector(".formDepenses");
const totalDepensesEl = document.querySelector("#totalDepenses");
const depensesCategoriesEl = document.querySelector("#depensesCategories");

formDepenses.addEventListener("submit", (e) => {
  e.preventDefault();

  const montant = parseFloat(document.querySelector("#montantDepenses").value);
  const categorie = document.querySelector("#categorieDepenses").value;

  if (isNaN(montant) || montant <= 0) {
    alert("Le montant doit être un nombre positif.");
    return;
  }

  if (categorie !== "autres") {
    const existeDeja = monBudget[year][month].depenses.some(
      (d) => d.categorie === categorie
    );
    if (existeDeja) {
      alert(`La catégorie "${categorie}" a déjà été ajoutée ce mois-ci.`);
      return;
    }
  }

  monBudget[year][month].depenses.push({ montant, categorie });
  monBudget[year][month].totalDepenses += montant;
  localStorage.setItem("monBudget", JSON.stringify(monBudget));

  formDepenses.reset();
  afficherDepenses();
  calculerBudgetRestant();
});

function afficherDepenses() {
  const depenses = monBudget[year][month].depenses;
  let total = 0;
  depensesCategoriesEl.innerHTML = "";

  depenses.forEach(({ montant, categorie }, index) => {
    total += montant;
    const li = document.createElement("li");
    li.innerHTML = `
      ${categorie} : ${montant.toFixed(2)} € 
      <span style="cursor:pointer; color:red; margin-left:10px;" data-index="${index}">❌</span>
    `;
    li.querySelector("span").addEventListener("click", () => {
      supprimerDepense(index);
    });

    depensesCategoriesEl.appendChild(li);
  });

  totalDepensesEl.textContent = `${total.toFixed(2)} €`;
}

function supprimerDepense(index) {
  if (confirm("Voulez-vous vraiment supprimer cette dépense ?")) {
    const montantToRemove = monBudget[year][month].depenses[index].montant;
    monBudget[year][month].depenses.splice(index, 1);
    monBudget[year][month].totalDepenses -= montantToRemove;
    localStorage.setItem("monBudget", JSON.stringify(monBudget));
    afficherDepenses();
    calculerBudgetRestant();
  }
}

// Calculer Budget Restant (Remaining budget calculation)
function calculerBudgetRestant() {
  const totalRevenus = monBudget[year][month].totalRevenus;
  const totalDepenses = monBudget[year][month].totalDepenses;

  const restant = totalRevenus - totalDepenses;

  document.querySelector(
    "#totalBudgetRemaining"
  ).textContent = `${restant.toFixed(2)} €`;
  document.querySelector("#totalBudgetRemaining").style.color =
    restant >= 0 ? "green" : "red";

  monBudget[year][month].budgetRestant = restant;

  localStorage.setItem("monBudget", JSON.stringify(monBudget));
}

// CSV Export
document.querySelector("#exportCSV").addEventListener("click", () => {
  const revenus = monBudget[year][month].revenus;
  const depenses = monBudget[year][month].depenses;

  let csv = `Catégorie,Type,Montant (€)\n`;

  revenus.forEach(({ montant, categorie }) => {
    csv += `${categorie},Revenu,${montant.toFixed(2)}\n`;
  });

  depenses.forEach(({ montant, categorie }) => {
    csv += `${categorie},Dépense,${montant.toFixed(2)}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `budget_${month}_${year}.csv`;
  link.click();
});

// PDF Export
document.querySelector("#exportPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const revenus = monBudget[year][month].revenus;
  const depenses = monBudget[year][month].depenses;

  let rows = [];

  revenus.forEach(({ montant, categorie }) => {
    rows.push([categorie, "Revenu", `${montant.toFixed(2)} €`]);
  });

  depenses.forEach(({ montant, categorie }) => {
    rows.push([categorie, "Dépense", `${montant.toFixed(2)} €`]);
  });

  const totalRevenus = revenus
    .reduce((sum, r) => sum + r.montant, 0)
    .toFixed(2);
  const totalDepenses = depenses
    .reduce((sum, d) => sum + d.montant, 0)
    .toFixed(2);
  const restant = (totalRevenus - totalDepenses).toFixed(2);

  doc.setFontSize(18);
  doc.text(`Bilan Budget - ${month} ${year}`, 14, 20);

  doc.autoTable({
    head: [["Catégorie", "Type", "Montant"]],
    body: rows,
    startY: 30,
    theme: "striped",
    headStyles: { fillColor: [0, 123, 255] },
  });

  doc.setFontSize(12);
  doc.text(
    `Total Revenus : ${totalRevenus} €`,
    14,
    doc.lastAutoTable.finalY + 10
  );
  doc.text(
    `Total Dépenses : ${totalDepenses} €`,
    14,
    doc.lastAutoTable.finalY + 18
  );
  doc.text(`Budget Restant : ${restant} €`, 14, doc.lastAutoTable.finalY + 26);

  doc.save(`budget_${month}_${year}.pdf`);
});

// Initial function calls to load data
afficherRevenus();
afficherDepenses();
calculerBudgetRestant();
