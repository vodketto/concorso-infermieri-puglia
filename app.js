fetch('candidati.json')
  .then(res => res.json())
  .then(data => {
	  
	// Ultimo aggiornamento (data + ora)
	const now = new Date();
	const dataOra = now.toLocaleDateString('it-IT') +
                ' ' +
                now.toLocaleTimeString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit'
                });

	// document.getElementById('ultimo-aggiornamento').innerText = dataOra;

	  
	// === STATISTICHE GENERALI ===
	const totaleCandidati = data.length;

	const sommaPunteggi = data.reduce((acc, c) => acc + c.punteggio, 0);
	const punteggioMedio = (sommaPunteggi / totaleCandidati).toFixed(2);

	document.getElementById('totale-candidati').innerText = totaleCandidati;
	document.getElementById('punteggio-medio').innerText = punteggioMedio;

    const tbody = document.querySelector('tbody');
    const searchInput = document.getElementById('search');

    // Popola tabella UNA SOLA VOLTA
    data.forEach((c, index) => {
//      let esito =
//        c.punteggio >= 27
//          ? '<span class="badge ok">Dentro</span>'
//          : c.punteggio >= 26
//          ? '<span class="badge warn">Al limite</span>'
//          : '<span class="badge no">Fuori</span>';


        const punteggioSoglia =
        data.length >= 4500 ? data[4499].punteggio : null;
		
		
        let esito = "";

		if (punteggioSoglia !== null) {
		esito =
			c.punteggio >= punteggioSoglia
			? '<span class="badge ok">Dentro</span>'
		: '<span class="badge no">Fuori</span>';
		}


		  
//		let esito =
//			index < 4500
//		? '<span class="badge ok">Dentro</span>'
//		: '<span class="badge no">Fuori</span>';


      const row = document.createElement('tr');
      row.dataset.codice = c.codice.toUpperCase();

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${c.codice}</td>
        <td>${c.punteggio.toFixed(2)}</td>
        <td>${c.turno}</td>
        <td>${esito}</td>
      `;

      tbody.appendChild(row);
    });

    // ---- DEBOUNCE DELLA RICERCA ----
    let timeout = null;

    searchInput.addEventListener('input', e => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const value = e.target.value.toUpperCase().trim();

        [...tbody.rows].forEach(row => {
          row.style.display = row.dataset.codice.includes(value)
            ? ''
            : 'none';
        });
      }, 250); // 250 ms → fluidissimo
    });
  });
