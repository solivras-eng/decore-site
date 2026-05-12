/**
 * Configuration site (une seule source pour Formspree + URL canonique).
 * 1) Créez un formulaire sur https://formspree.io et copiez l’ID (partie après /f/ dans l’URL).
 * 2) Remplacez formspreeId ci-dessous (ex. "xpzabcde" sans slash).
 * 3) Domaine production : gardez siteBaseUrl identique aux balises canonical / sitemap / robots
 *    (après branchement IONOS → Vercel, remplacez partout si l’URL change).
 */
window.DECOR_SITE = {
  siteBaseUrl: 'https://www.decoralenvers.fr',
  /** ID Formspree (segment après /f/) — synchronisé avec l’attribut action du formulaire contact */
  formspreeId: 'xpqbkkoa',
};
