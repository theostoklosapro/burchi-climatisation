/**
 * Logique du formulaire d'estimation Burchi Climatisation.
 * Les tarifs sont chargés depuis les réglages WordPress.
 */

export type Prestation = "Installation" | "Entretien" | "Depannage";
export type TypeInstallation = "Monosplit" | "Multisplit" | "Gainable";
export type SurfaceMono = "Moins de 20 m2" | "De 20 à 40 m2" | "De 40 à 60 m2" | "Plus de 60 m2";
export type NbMulti =
  | "Bi-split (2 unités)"
  | "Tri-split (3 unités)"
  | "Quadri-split (4 unités)"
  | "Quintuple-split (5 unités)";
export type TypeEntretien = "Nettoyage simple" | "Nettoyage complet";
export type TypePanne = "Panne électrique" | "Manque de froid ou de chaud" | "Autre panne";

export interface EstimateAnswers {
  prestation?: Prestation | undefined;
  typeInstallation?: TypeInstallation | undefined;
  surfaceMono?: SurfaceMono | undefined;
  nbMulti?: NbMulti | undefined;
  gainable20: number;
  gainable20to60: number;
  gainablePlus60: number;
  typeEntretien?: TypeEntretien | undefined;
  nbInterieures: number;
  nbExterieures: number;
  typePanne?: TypePanne | undefined;
  descriptionPanne: string;
}

export interface EstimatePricing {
  monosplit: Record<SurfaceMono, number | null>;
  multisplit: Record<NbMulti, number>;
  gainable: {
    base: number;
    perOutlet: number;
    outletsPerRoomSize: {
      under20: number;
      between20And60: number;
      over60: number;
    };
  };
  maintenance: {
    simplePerIndoorUnit: number;
    completePerIndoorUnit: number;
    perOutdoorUnit: number;
  };
}

export const INITIAL_ANSWERS: EstimateAnswers = {
  gainable20: 0,
  gainable20to60: 0,
  gainablePlus60: 0,
  nbInterieures: 1,
  nbExterieures: 1,
  descriptionPanne: "",
};

export const COUNTER_MAX = 10;
/** Minimum autorisé pour chaque compteur (les unités d'entretien commencent à 1). */
export const COUNTER_MIN = {
  gainable20: 0,
  gainable20to60: 0,
  gainablePlus60: 0,
  nbInterieures: 1,
  nbExterieures: 1,
} as const;
export type CounterKey = keyof typeof COUNTER_MIN;

export function clampCounter(key: CounterKey, value: number): number {
  return Math.min(COUNTER_MAX, Math.max(COUNTER_MIN[key], Math.round(value)));
}

export type PriceResult = { kind: "none" } | { kind: "quote" } | { kind: "from"; amount: number };

/** Nombre de bouches de soufflage : 1 par petite pièce, 2 pour 20–60 m², 3 au-delà. */
export function gainableOutlets(
  a: Pick<EstimateAnswers, "gainable20" | "gainable20to60" | "gainablePlus60">,
  pricing: EstimatePricing["gainable"]["outletsPerRoomSize"],
) {
  return (
    a.gainable20 * pricing.under20 +
    a.gainable20to60 * pricing.between20And60 +
    a.gainablePlus60 * pricing.over60
  );
}

export function estimatePrice(
  a: EstimateAnswers,
  pricing: EstimatePricing,
): PriceResult {
  switch (a.prestation) {
    case "Depannage":
      return { kind: "quote" };
    case "Installation": {
      if (a.typeInstallation === "Monosplit") {
        if (!a.surfaceMono) return { kind: "none" };
        const p = pricing.monosplit[a.surfaceMono];
        return p === null ? { kind: "quote" } : { kind: "from", amount: p };
      }
      if (a.typeInstallation === "Multisplit") {
        if (!a.nbMulti) return { kind: "none" };
        return { kind: "from", amount: pricing.multisplit[a.nbMulti] };
      }
      if (a.typeInstallation === "Gainable") {
        const rooms = a.gainable20 + a.gainable20to60 + a.gainablePlus60;
        if (rooms <= 0) return { kind: "none" };
        return {
          kind: "from",
          amount:
            pricing.gainable.base +
            gainableOutlets(a, pricing.gainable.outletsPerRoomSize) *
              pricing.gainable.perOutlet,
        };
      }
      return { kind: "none" };
    }
    case "Entretien": {
      if (!a.typeEntretien) return { kind: "none" };
      if (a.nbInterieures <= 0 && a.nbExterieures <= 0) return { kind: "none" };
      const perUnit =
        a.typeEntretien === "Nettoyage simple"
          ? pricing.maintenance.simplePerIndoorUnit
          : pricing.maintenance.completePerIndoorUnit;
      return {
        kind: "from",
        amount:
          a.nbInterieures * perUnit +
          a.nbExterieures * pricing.maintenance.perOutdoorUnit,
      };
    }
    default:
      return { kind: "none" };
  }
}

export function formatEuro(amount: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
    .format(amount)
    .replace(/\u202f|\u00a0/g, " ") + " €";
}

export function formatPrice(p: PriceResult) {
  if (p.kind === "quote") return "Sur devis";
  if (p.kind === "from") return `À partir de ${formatEuro(p.amount)}`;
  return "—";
}

/** Changer un choix efface les réponses qui en dépendaient. */
export function selectPrestation(a: EstimateAnswers, prestation: Prestation): EstimateAnswers {
  if (a.prestation === prestation) return a;
  return { ...INITIAL_ANSWERS, prestation };
}

export function selectTypeInstallation(a: EstimateAnswers, t: TypeInstallation): EstimateAnswers {
  if (a.typeInstallation === t) return a;
  return {
    ...a,
    typeInstallation: t,
    surfaceMono: undefined,
    nbMulti: undefined,
    gainable20: 0,
    gainable20to60: 0,
    gainablePlus60: 0,
  };
}

/** Le détail (3e étape) est-il suffisamment rempli pour passer aux coordonnées ? */
export function isDetailComplete(a: EstimateAnswers): boolean {
  if (a.prestation === "Installation") {
    if (a.typeInstallation === "Monosplit") return !!a.surfaceMono;
    if (a.typeInstallation === "Multisplit") return !!a.nbMulti;
    if (a.typeInstallation === "Gainable")
      return a.gainable20 + a.gainable20to60 + a.gainablePlus60 > 0;
    return false;
  }
  if (a.prestation === "Entretien") return !!a.typeEntretien;
  if (a.prestation === "Depannage") return !!a.typePanne;
  return false;
}
