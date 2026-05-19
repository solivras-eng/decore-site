/**
 * Configuration site (une seule source pour Formspree + URL canonique + Google).
 * 1) Formspree : https://formspree.io — ID après /f/
 * 2) Domaine production : siteBaseUrl = canonical / sitemap / robots (sans slash final)
 * 3) Google Business : collez les URL depuis business.google.com (fiche + lien « demander avis »)
 */
window.DECOR_SITE = {
  siteBaseUrl: 'https://www.decoralenvers.com',
  /** ID Formspree (segment après /f/) */
  formspreeId: 'xpqbkkoa',
  /** Email de notification Formspree (référence — configurer aussi dans le tableau de bord) */
  notificationEmail: 'contact@agnesbouche.com',
  /**
   * Fiche Google Maps / Profil Google (ex. https://g.page/... ou lien Maps).
   * Laisser vide tant que non disponible — le lien footer n’apparaît pas.
   */
  googleBusinessUrl: '',
  /**
   * Lien « Laisser un avis » depuis Google Business (Demander des avis).
   * Laisser vide pour masquer le bouton dédié.
   */
  googleReviewUrl: '',
};
