import { describe, expect, it } from "vitest";
import {
  INITIAL_ANSWERS,
  clampCounter,
  estimatePrice,
  formatPrice,
  selectPrestation,
  selectTypeInstallation,
  type EstimateAnswers,
  type EstimatePricing,
} from "./estimate";

const base = (patch: Partial<EstimateAnswers>): EstimateAnswers => ({ ...INITIAL_ANSWERS, ...patch });
const pricing: EstimatePricing = {
  monosplit: {
    "Moins de 20 m2": 1100,
    "De 20 à 40 m2": 1300,
    "De 40 à 60 m2": 1600,
    "Plus de 60 m2": null,
  },
  multisplit: {
    "Bi-split (2 unités)": 2200,
    "Tri-split (3 unités)": 3100,
    "Quadri-split (4 unités)": 4000,
    "Quintuple-split (5 unités)": 4900,
  },
  gainable: {
    base: 2500,
    perOutlet: 400,
    outletsPerRoomSize: { under20: 1, between20And60: 2, over60: 3 },
  },
  maintenance: {
    simplePerIndoorUnit: 90,
    completePerIndoorUnit: 140,
    perOutdoorUnit: 40,
  },
};
const estimate = (answers: EstimateAnswers) => estimatePrice(answers, pricing);

describe("Calculateur d'estimation", () => {
  it("monosplit : prix selon la surface, sur devis au-delà de 60 m²", () => {
    const mono = (surfaceMono: NonNullable<EstimateAnswers["surfaceMono"]>) =>
      estimate(base({ prestation: "Installation", typeInstallation: "Monosplit", surfaceMono }));
    expect(mono("Moins de 20 m2")).toEqual({ kind: "from", amount: 1100 });
    expect(mono("De 20 à 40 m2")).toEqual({ kind: "from", amount: 1300 });
    expect(mono("De 40 à 60 m2")).toEqual({ kind: "from", amount: 1600 });
    expect(mono("Plus de 60 m2")).toEqual({ kind: "quote" });
  });

  it("multisplit : prix selon le nombre d'unités intérieures", () => {
    const multi = (nbMulti: NonNullable<EstimateAnswers["nbMulti"]>) =>
      estimate(base({ prestation: "Installation", typeInstallation: "Multisplit", nbMulti }));
    expect(multi("Bi-split (2 unités)")).toEqual({ kind: "from", amount: 2200 });
    expect(multi("Tri-split (3 unités)")).toEqual({ kind: "from", amount: 3100 });
    expect(multi("Quadri-split (4 unités)")).toEqual({ kind: "from", amount: 4000 });
    expect(multi("Quintuple-split (5 unités)")).toEqual({ kind: "from", amount: 4900 });
  });

  it("gainable : 2 500 € + 400 € par bouche (1, 2 ou 3 bouches selon la pièce)", () => {
    const a = base({
      prestation: "Installation",
      typeInstallation: "Gainable",
      gainable20: 2,
      gainable20to60: 1,
      gainablePlus60: 1,
    });
    // bouches = 2 + 2 + 3 = 7 → 2500 + 7 × 400
    expect(estimate(a)).toEqual({ kind: "from", amount: 5300 });
  });

  it("gainable sans pièce : pas de prix", () => {
    expect(
      estimate(base({ prestation: "Installation", typeInstallation: "Gainable" })),
    ).toEqual({ kind: "none" });
  });

  it("entretien simple : 90 € par unité intérieure + 40 € par unité extérieure", () => {
    const a = base({ prestation: "Entretien", typeEntretien: "Nettoyage simple", nbInterieures: 3, nbExterieures: 1 });
    expect(estimate(a)).toEqual({ kind: "from", amount: 310 });
  });

  it("entretien complet : 140 € par unité intérieure + 40 € par unité extérieure", () => {
    const a = base({ prestation: "Entretien", typeEntretien: "Nettoyage complet", nbInterieures: 2, nbExterieures: 2 });
    expect(estimate(a)).toEqual({ kind: "from", amount: 360 });
  });

  it("dépannage : toujours sur devis", () => {
    expect(estimate(base({ prestation: "Depannage" }))).toEqual({ kind: "quote" });
  });

  it("applique les tarifs reçus de WordPress", () => {
    const updatedPricing: EstimatePricing = {
      ...pricing,
      monosplit: { ...pricing.monosplit, "Moins de 20 m2": 1450 },
    };
    expect(
      estimatePrice(
        base({
          prestation: "Installation",
          typeInstallation: "Monosplit",
          surfaceMono: "Moins de 20 m2",
        }),
        updatedPricing,
      ),
    ).toEqual({ kind: "from", amount: 1450 });
  });

  it("compteurs : entre 0 et 10, au moins 1 unité pour l'entretien", () => {
    expect(clampCounter("gainable20", 11)).toBe(10);
    expect(clampCounter("gainable20", -1)).toBe(0);
    expect(clampCounter("nbInterieures", 0)).toBe(1);
    expect(clampCounter("nbExterieures", 0)).toBe(1);
  });

  it("changer de prestation ou de type efface les choix dépendants", () => {
    const a = base({ prestation: "Installation", typeInstallation: "Monosplit", surfaceMono: "De 20 à 40 m2" });
    expect(selectTypeInstallation(a, "Gainable").surfaceMono).toBeUndefined();
    expect(selectPrestation(a, "Entretien").typeInstallation).toBeUndefined();
  });

  it("affichage du prix", () => {
    expect(formatPrice({ kind: "from", amount: 1300 })).toBe("À partir de 1 300 €");
    expect(formatPrice({ kind: "quote" })).toBe("Sur devis");
  });
});
