/**
 * Remplit les blocs légaux depuis config.js (sans innerHTML).
 * Utilisé sur mentions-legales.html et en/legal-notice.html.
 */
(function () {
  var L = (window.DECOR_SITE && window.DECOR_SITE.legal) || {};
  var isEn = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;

  function formatSiren(value) {
    var d = String(value || '').replace(/\D/g, '');
    if (d.length !== 9) return value;
    return d.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  function formatSiret(value) {
    var d = String(value || '').replace(/\D/g, '');
    if (d.length !== 14) return value;
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
  }

  function formatActiveSince(iso) {
    if (!iso) return '';
    var parts = String(iso).split('-');
    if (parts.length !== 3) return iso;
    if (isEn) {
      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      var m = parseInt(parts[1], 10) - 1;
      return (
        parseInt(parts[2], 10) +
        ' ' +
        (months[m] || parts[1]) +
        ' ' +
        parts[0]
      );
    }
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }
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
  if (L.siren) rows.push({ label: 'SIREN', value: formatSiren(L.siren) });
  if (L.siret) rows.push({ label: 'SIRET', value: formatSiret(L.siret) });
  if (L.apeCode) {
    var apeLabel = isEn ? L.apeLabelEn || L.apeLabelFr : L.apeLabelFr;
    rows.push({
      label: isEn ? 'Main activity (APE)' : 'Activité principale (APE)',
      value: L.apeCode + (apeLabel ? ' — ' + apeLabel : ''),
    });
  }
  if (L.activeSince) {
    rows.push({
      label: isEn ? 'Establishment active since' : 'Établissement actif depuis le',
      value: formatActiveSince(L.activeSince),
    });
  }
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
