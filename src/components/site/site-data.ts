import logo from "@/assets/burchi/logo-burchi-clean.webp.asset.json";
import embleme from "@/assets/burchi/embleme-burchi-transparent.webp.asset.json";
import serviceInstallation from "@/assets/burchi/service-installation.webp.asset.json";
import serviceEntretien from "@/assets/burchi/service-entretien.webp.asset.json";
import serviceDepannage from "@/assets/burchi/service-depannage.webp.asset.json";
import type { Prestation } from "@/lib/estimate";

export const BRAND = {
  name: "Burchi Climatisation",
  logoUrl: logo.url,
  emblemUrl: embleme.url,
  phoneDisplay: "06 16 13 30 56",
  phoneHref: "tel:+33616133056",
  email: "contact@burchi.fr",
  city: "Fayence",
  postcode: "83440",
};

export const NAV_LINKS = [
  { id: "estimation", label: "Estimation" },
  { id: "services", label: "Services" },
  { id: "atouts", label: "Pourquoi nous" },
  { id: "realisations", label: "Réalisations" },
  { id: "avis", label: "Avis" },
  { id: "contact", label: "Contact" },
] as const;

export const SERVICES: {
  prestation: Prestation;
  title: string;
  image: string;
  intro: string;
  points: string[];
}[] = [
  {
    prestation: "Installation",
    title: "Installation",
    image: serviceInstallation.url,
    intro: "Monosplit, multisplit ou gainable : une solution dimensionnée pour votre logement.",
    points: [
      "Étude et conseil (puissance, emplacement, type de clim)",
      "Pose complète des unités intérieures et extérieures",
      "Mise en service et tests de fonctionnement",
    ],
  },
  {
    prestation: "Entretien",
    title: "Entretien",
    image: serviceEntretien.url,
    intro: "Un nettoyage régulier pour un air sain, moins de pannes et une clim qui dure.",
    points: [
      "Nettoyage des filtres et de l'unité intérieure",
      "Vérification des performances",
      "Contrôle de l'unité extérieure",
    ],
  },
  {
    prestation: "Depannage",
    title: "Dépannage",
    image: serviceDepannage.url,
    intro: "Panne, manque de froid ou code erreur : nous intervenons rapidement.",
    points: [
      "Diagnostic de la panne (électrique, froid/chaud, fuite…)",
      "Réparation ou remplacement des pièces défectueuses",
      "Tests et remise en service",
    ],
  },
];

export const STRENGTHS = [
  {
    title: "Un accompagnement personnalisé",
    text: "Nous étudions chaque projet avec attention afin de proposer une installation parfaitement adaptée à votre logement, vos usages et vos priorités.",
  },
  {
    title: "Une maintenance réactive",
    text: "Un entretien régulier préserve vos équipements et limite les pannes. Nous intervenons avec méthode pour maintenir votre installation en excellent état.",
  },
  {
    title: "Un confort toute saison",
    text: "Chauffage performant en hiver, climatisation efficace en été : nous créons une ambiance intérieure agréable, stable et saine toute l'année.",
  },
];

// Avis temporaires, à remplacer par de vrais avis clients.
export const REVIEWS = [
  {
    name: "Martine R.",
    place: "Seillans",
    service: "Installation bi-split",
    text: "Devis clair, pose propre en une journée dans notre maison de village. Les unités sont discrètes et la maison reste fraîche même en plein mois d'août.",
  },
  {
    name: "Laurent G.",
    place: "Montauroux",
    service: "Entretien complet",
    text: "Nettoyage complet de nos trois splits, à l'heure et sans laisser de trace. Bonnes explications sur l'entretien, et on sent tout de suite la différence.",
  },
  {
    name: "Sophie et Marc D.",
    place: "Tourrettes",
    service: "Dépannage",
    text: "Clim en panne en pleine canicule : rappelés dans l'heure, diagnostic rapide et réparation le lendemain. Réactif, honnête et de bon conseil.",
  },
];
