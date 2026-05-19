/**
 * Remplit les blocs légaux depuis config.js (sans innerHTML).
 * Utilisé sur mentions-legales.html et en/legal-notice.html.
 */
(function () {
  var L = (window.DECOR_SITE && window.DECOR_SITE.legal) || {};
  var isEn = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var director = document.getElementById('legal-director-name');
  if (director && L.publicationDirector) {
    director.textContent = L.publicationDirector;
  }
  var block = document.getElementById('legal-identity-block');
  if (!block) return;
  var rows = [];
  if (L.legalName) {
    rows.push({
      label: isEn ? 'Legal name' : 'Raison sociale',
      value: L.legalName,
    });
  }
  if (L.legalForm) {
    rows.push({
      label: isEn ? 'Legal form' : 'Forme juridique',
      value: L.legalForm,
    });
  }
  if (L.siren) rows.push({ label: 'SIREN', value: L.siren });
  if (L.siret) rows.push({ label: 'SIRET', value: L.siret });
  if (L.tva) {
    rows.push({
      label: isEn ? 'EU VAT' : 'TVA intracommunautaire',
      value: L.tva,
    });
  }
  if (!rows.length) return;
  block.textContent = '';
  rows.forEach(function (row, index) {
    if (index > 0) block.appendChild(document.createElement('br'));
    var strong = document.createElement('strong');
    strong.textContent = row.label + ' : ';
    block.appendChild(strong);
    block.appendChild(document.createTextNode(row.value));
  });
})();
