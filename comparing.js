let countries = [];

    fetch('db.json')
      .then(res => res.json())
      .then(json => {
        countries = json;
        const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));
        ['select-a', 'select-b'].forEach(id => {
          const sel = document.getElementById(id);
          sorted.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = (c.flag ?? '') + '  ' + c.name;
            sel.appendChild(opt);
          });
        });
      });

    function renderCard(cardId, country) {
      const card = document.getElementById(cardId);
      if (!country) {
        card.innerHTML = '<span class="placeholder">Select a country above</span>';
        return;
      }
      card.innerHTML = `
        <span class="card-flag">${country.flag ?? ''}</span>
        <div class="card-name">${country.name}</div>
        <span class="card-cont">${country.continent}</span>
        <table class="fact-table">
          <tr><td>Capital</td><td>${country.capital}</td></tr>
          <tr><td>Continent</td><td>${country.continent}</td></tr>
          ${country.currency ? `<tr><td>Currency</td><td>${country.currency}</td></tr>` : ''}
          <tr><td>Language</td><td>${country.language}</td></tr>
          <tr><td>Code</td><td>${country.id}</td></tr>
        </table>
      `;
    }

    function render() {
      const idA = document.getElementById('select-a').value;
      const idB = document.getElementById('select-b').value;
      const a = countries.find(c => c.id === idA) || null;
      const b = countries.find(c => c.id === idB) || null;

      renderCard('card-a', a);
      renderCard('card-b', b);

      const sharedRow = document.getElementById('shared-row');
      const badgesEl  = document.getElementById('shared-badges');

      if (a && b) {
        sharedRow.classList.add('visible');
        const shared = [];
        if (a.continent === b.continent) shared.push('Same continent: ' + a.continent);
        if (a.language === b.language) shared.push('Same language: ' + a.language);
        if (a.currency  && b.currency && a.currency === b.currency) shared.push('Same currency: ' + a.currency);

        if (shared.length === 0) {
          badgesEl.innerHTML = '<span class="no-shared">Nothing in common — they\'re quite different!</span>';
        } else {
          badgesEl.innerHTML = shared.map(s => `<span class="badge same">${s}</span>`).join('');
        }
      } else {
        sharedRow.classList.remove('visible');
      }
    }