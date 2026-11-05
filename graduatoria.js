let currentPage = 1;
const rowsPerPage = 50;

let originalData = [];
let filteredData = [];

fetch("finale.json")
  .then(res => res.json())
  .then(data => {

    originalData = data.candidati;
    filteredData = [...originalData];

    const totaleCandidati = originalData.length;

    const mediaScritta =
      (
        originalData.reduce((a, c) => a + c.scritta, 0)
        / totaleCandidati
      ).toFixed(2);

    const mediaPratica =
      (
        originalData.reduce((a, c) => a + c.pratica, 0)
        / totaleCandidati
      ).toFixed(2);

    const mediaOrale =
      (
        originalData.reduce((a, c) => a + c.orale, 0)
        / totaleCandidati
      ).toFixed(2);

    const oraliPubblicati =
      originalData.filter(c => c.orale > 0).length;

    document.getElementById("totale-candidati").innerText =
      totaleCandidati;

    document.getElementById("media-scritta").innerText =
      mediaScritta;

    document.getElementById("media-pratica").innerText =
      mediaPratica;

    document.getElementById("media-orale").innerText =
      mediaOrale;

    document.getElementById("orali-pubblicati").innerText =
      oraliPubblicati;

    renderTable();
  });

function renderTable() {

  const tbody = document.querySelector("tbody");

  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const pageData = filteredData.slice(start, end);

  pageData.forEach((candidato, index) => {

    const oraleClass =
      candidato.orale > 0
        ? "orale-presente"
        : "orale-assente";

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${start + index + 1}</td>
      <td>${candidato.codice}</td>
      <td>${candidato.scritta.toFixed(2)}</td>
      <td>${candidato.pratica.toFixed(2)}</td>
      <td class="${oraleClass}">
        ${candidato.orale.toFixed(2)}
      </td>
      <td>
        <strong>
          ${candidato.totale.toFixed(2)}
        </strong>
      </td>
    `;

    tbody.appendChild(row);

  });

  const totalePagine =
    Math.ceil(filteredData.length / rowsPerPage);

  document.getElementById("page-info").innerText =
    `Pagina ${currentPage} di ${totalePagine}`;

  document.getElementById("prev").disabled =
    currentPage === 1;

  document.getElementById("next").disabled =
    currentPage >= totalePagine;
}

document
  .getElementById("next")
  .addEventListener("click", () => {

    if (currentPage * rowsPerPage < filteredData.length) {
      currentPage++;
      renderTable();
    }

  });

document
  .getElementById("prev")
  .addEventListener("click", () => {

    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }

  });

const searchInput =
  document.getElementById("search");

let timeout = null;

searchInput.addEventListener("input", e => {

  clearTimeout(timeout);

  timeout = setTimeout(() => {

    const value =
      e.target.value.toUpperCase().trim();

    filteredData =
      originalData.filter(c =>
        c.codice.toUpperCase().includes(value)
      );

    currentPage = 1;

    renderTable();

  }, 250);

});
