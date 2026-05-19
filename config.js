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
  googleBusinessUrl:
    'https://www.google.com/maps/place/D%C3%A9cor+%C3%A0+l%27Envers+-+Maison+d%27H%C3%B4tes+et+espace+%C3%A9v%C3%A9nementiel/@48.8567105,2.4163807,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66d55e7574665:0x4ed8f1178a2be7a!8m2!3d48.8567105!4d2.4163807!16s%2Fg%2F11wh6g34_s',
  /**
   * Lien « Laisser un avis » depuis Google Business (Demander des avis).
   * Laisser vide pour masquer le bouton dédié.
   */
  googleReviewUrl: 'https://g.page/r/CXq-ongRj-0EEBM/review',
  /** Carte intégrée (iframe sans clé API). Optionnel : googleMaps.embedUrl depuis « Intégrer une carte ». */
  googleMaps: {
    lat: 48.8567105,
    lng: 2.4163807,
    zoom: 16,
    embedUrl: '',
  },
  /**
   * Informations légales (mentions légales, confidentialité).
   * Complétez siren / siret / legalForm / tva dès que vous les avez (Kbis, URSSAF, etc.).
   */
  /**
   * Photo Agnès sur l-artiste.html — déposer le fichier puis décommenter :
   * artistPhoto: 'assets/photos/agnes.jpg',
   */
  // artistPhoto: '',
  legal: {
    legalName: "LE DECOR DE L'ENVERS",
    tradeName: "Le Décor à l'Envers",
    legalForm: 'Association déclarée',
    publicationDirector: 'Agnès Bouche',
    addressLine: '18 rue Édouard Vaillant',
    postalCode: '93170',
    city: 'Bagnolet',
    country: 'France',
    siren: '390586386',
    siret: '39058638600059',
    tva: '',
  },
  business: {
    publicName: "Décor à l'Envers - Maison d'Hôtes et espace événementiel",
    priceRange: '€€',
    aggregateRating: { ratingValue: 5.0, reviewCount: 19 },
    descriptionFr:
      'Événements, espace créatif, maison d\'hôtes, activités artistiques et spectacle vivant à Bagnolet.',
    descriptionEn:
      'Events, creative space, guest house, artistic activities and live performance in Bagnolet.',
  },
};
