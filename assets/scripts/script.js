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

//* This function is used to get the current month and year from the local storage.
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

//calculation revenus
const form = document.querySelector(".formRevnus");
const totalRevenusEl = document.querySelector("#totalRevenus");
const revenusCategoriesEl = document.querySelector("#revenusCategories");

let revenusData = JSON.parse(localStorage.getItem("revenusData")) || {};

if (!revenusData[year]) revenusData[year] = {};
if (!revenusData[year][month]) revenusData[year][month] = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const montant = parseFloat(document.querySelector("#montant").value);
  const categorie = document.querySelector("#categorie").value;

  if (isNaN(montant) || montant <= 0) {
    alert("Le montant doit être un nombre positif.");
    return;
  }

  if (categorie !== "autres") {
    const existeDeja = revenusData[year][month].some(
      (r) => r.categorie === categorie
    );
    if (existeDeja) {
      alert(`La catégorie "${categorie}" a déjà été ajoutée ce mois-ci.`);
      return;
    }
  }

  revenusData[year][month].push({ montant, categorie });
  localStorage.setItem("revenusData", JSON.stringify(revenusData));

  form.reset();
  afficherRevenus();
  calculerBudgetRestant();
});

function afficherRevenus() {
  const revenus = revenusData[year][month] || [];

  let total = 0;
  const categories = {};

  revenusCategoriesEl.innerHTML = "";

  revenus.forEach(({ montant, categorie }, index) => {
    total += montant;
    categories[categorie] = (categories[categorie] || 0) + montant;

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
    revenusData[year][month].splice(index, 1);
    localStorage.setItem("revenusData", JSON.stringify(revenusData));
    afficherRevenus();
    calculerBudgetRestant();
  }
}

afficherRevenus();

// calculation depenses
const formDepenses = document.querySelector(".formDepenses");
const totalDepensesEl = document.querySelector("#totalDepenses");
const depensesCategoriesEl = document.querySelector("#depensesCategories");

let depensesData = JSON.parse(localStorage.getItem("depensesData")) || {};

if (!depensesData[year]) depensesData[year] = {};
if (!depensesData[year][month]) depensesData[year][month] = [];

formDepenses.addEventListener("submit", (e) => {
  e.preventDefault();

  const montant = parseFloat(document.querySelector("#montantDepenses").value);
  const categorie = document.querySelector("#categorieDepenses").value;

  if (isNaN(montant) || montant <= 0) {
    alert("Le montant doit être un nombre positif.");
    return;
  }

  if (categorie !== "autres") {
    const existeDeja = depensesData[year][month].some(
      (d) => d.categorie === categorie
    );
    if (existeDeja) {
      alert(`La catégorie "${categorie}" a déjà été ajoutée ce mois-ci.`);
      return;
    }
  }

  depensesData[year][month].push({ montant, categorie });
  localStorage.setItem("depensesData", JSON.stringify(depensesData));

  formDepenses.reset();
  afficherDepenses();
  calculerBudgetRestant();
});

function afficherDepenses() {
  const depenses = depensesData[year][month] || [];

  let total = 0;
  const categories = {};

  depensesCategoriesEl.innerHTML = "";

  depenses.forEach(({ montant, categorie }, index) => {
    total += montant;
    categories[categorie] = (categories[categorie] || 0) + montant;

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
    depensesData[year][month].splice(index, 1);
    localStorage.setItem("depensesData", JSON.stringify(depensesData));
    afficherDepenses();
    calculerBudgetRestant();
  }
}

afficherDepenses();

// calculation total
function calculerBudgetRestant() {
  const revenus = revenusData[year]?.[month] || [];
  const depenses = depensesData[year]?.[month] || [];

  const totalRevenus = revenus.reduce((sum, r) => sum + r.montant, 0);
  const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);

  const restant = totalRevenus - totalDepenses;

  document.querySelector(
    "#totalBudgetRemaining"
  ).textContent = `${restant.toFixed(2)} €`;
  document.querySelector("#totalBudgetRemaining").style.color =
    restant >= 0 ? "green" : "red";

  if (!localStorage.getItem("budgetRestant"))
    localStorage.setItem("budgetRestant", "{}");

  let storedBudget = JSON.parse(localStorage.getItem("budgetRestant"));
  if (!storedBudget[year]) storedBudget[year] = {};
  storedBudget[year][month] = restant;

  localStorage.setItem("budgetRestant", JSON.stringify(storedBudget));
}
calculerBudgetRestant();

// csv lib

document.querySelector("#exportCSV").addEventListener("click", () => {
  const revenus = revenusData[year]?.[month] || [];
  const depenses = depensesData[year]?.[month] || [];

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

// pdf lib

document.querySelector("#exportPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const revenus = revenusData[year]?.[month] || [];
  const depenses = depensesData[year]?.[month] || [];

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
