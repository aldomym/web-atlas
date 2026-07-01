const map = L.map('map', { zoomControl: true }).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    const defaultStyle = {
      color: '#555',
      weight: 0.8,
      fillColor: '#4a90d9',
      fillOpacity: 0.15
    };
    const highlightStyle = {
      color: '#ffdd57',
      weight: 2.5,
      fillColor: '#ffdd57',
      fillOpacity: 0.45
    };

    let geojsonLayer = null;
    let highlightedLayer = null;
    let pendingIso = null; // store selection made before GeoJSON loaded

    // The correct property name in this GeoJSON is "ISO3166-1-Alpha-2"
    const ISO_PROP = 'ISO3166-1-Alpha-2';

    const ISO_OVERRIDES = {
  "France": "FR",
  "Kosovo": "XK",
  "Christmas Island": "CX",
  "Cocos (Keeling) Islands": "CC",
  "Norway": "NO",
  "Somaliland": "SO"
};

function isValidAlpha2(code) {
  return typeof code === 'string' && /^[A-Z]{2}$/.test(code);
}

    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(r => {
        if (!r.ok) throw new Error('GeoJSON fetch failed: ' + r.status);
        return r.json();
      })
      .then(geoJson => {
        geoJson.features.forEach(feature => {
      const props = feature.properties;
      const current = props[ISO_PROP];
      if (!isValidAlpha2(current)) {
        const name = props.name || props.ADMIN || props.NAME;
        const fixed = ISO_OVERRIDES[name];
        if (fixed) {
          props[ISO_PROP] = fixed;
        } else {
          console.warn('No ISO override found for:', name, 'raw value:', current);
        }
      }
    });
        geojsonLayer = L.geoJSON(geoJson, {
          style: defaultStyle,
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              const iso = feature.properties[ISO_PROP];
              const dropdown = document.getElementById('dropdown');
              if (iso && dropdown.querySelector(`option[value="${iso}"]`)) {
                dropdown.value = iso;
                dropdown.dispatchEvent(new Event('change'));
              }
            });
          }
        }).addTo(map);

        // If user already selected a country before GeoJSON finished loading, apply it now
        if (pendingIso) {
          applyHighlight(pendingIso);
          pendingIso = null;
        }
      })
      .catch(err => console.error('Could not load country borders:', err));

    let data = [];

    fetch('db.json')
      .then(res => res.json())
      .then(json => {
        data = json;
        const select = document.getElementById('dropdown');
        select.innerHTML = '<option value="">Select a country</option>';
        json.forEach(country => {
          const option = document.createElement('option');
          option.value = country.id;
          option.textContent = country.name;
          select.appendChild(option);
        });
      });

    function applyHighlight(isoCode) {
      // Reset previous highlight
      if (highlightedLayer) {
        geojsonLayer.resetStyle(highlightedLayer);
        highlightedLayer = null;
      }
      if (!isoCode) return;

      geojsonLayer.eachLayer(layer => {
        if (layer.feature.properties[ISO_PROP] === isoCode) {
          layer.setStyle(highlightStyle);
          layer.bringToFront();
          highlightedLayer = layer;
          const bounds = layer.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
          }
        }
      });
    }

    function highlightCountry(isoCode) {
      if (!geojsonLayer) {
        // GeoJSON not ready yet — save for when it loads
        pendingIso = isoCode || null;
        return;
      }
      applyHighlight(isoCode);
    }

    document.getElementById('dropdown').addEventListener('change', function () {
      const box = document.getElementById('info-box');
      const item = data.find(c => c.id === this.value);

      highlightCountry(this.value);

      if (!item) {
        box.innerHTML = '<p style="font-family:Arial, Helvetica, sans-serif; color:white;">Select a country from the menu</p>';
        return;
      }

      box.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:20px;">
          <div>
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:24px; color:white; text-align:center"><strong>ISO Code:</strong> ${item.id}</p>
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:24px; color:white; text-align:center"><strong>Country:</strong> ${item.name}</p>
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:24px; color:white; text-align:center"><strong>Continent:</strong> ${item.continent}</p>
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:24px; color:white; text-align:center"><strong>Capital:</strong> ${item.capital}</p>
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:24px; color:white; text-align:center"><strong>Language:</strong> ${item.language}</p>
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:24px; color:white; text-align:center"><strong>Currency:</strong> ${item.currency}</p>
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:24px; color:white; text-align:center"><strong>Flag:</strong> ${item.flag ?? ""}</p>
          </div>
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:300px; height:auto; border-radius:8px; margin:4px;">` : ""}
        </div>
      `;
    });
