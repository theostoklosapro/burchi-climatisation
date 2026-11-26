import { describe, expect, it } from "vitest";
import { parseWordPressEstimatePricing } from "./wordpress-estimate";

const fields = {
  price_mono_under_20: 1100,
  price_mono_20_40: 1300,
  price_mono_40_60: 1600,
  price_multi_2: 2200,
  price_multi_3: 3100,
  price_multi_4: 4000,
  price_multi_5: 4900,
  price_gainable_base: 2500,
  price_gainable_per_outlet: 400,
  outlets_gainable_under_20: 1,
  outlets_gainable_20_60: 2,
  outlets_gainable_over_60: 3,
  price_maintenance_simple_indoor: 90,
  price_maintenance_full_indoor: 140,
  price_maintenance_outdoor: 40,
};

describe("Configuration de prix WordPress", () => {
  it("convertit les champs ACF en configuration du calculateur", () => {
    expect(
      parseWordPressEstimatePricing([
        { slug: "reglages-calculateur", acf: fields },
      ]),
    ).toEqual({
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
    });
  });

  it("refuse une configuration manquante ou invalide au lieu d'utiliser des tarifs implicites", () => {
    expect(() => parseWordPressEstimatePricing([])).toThrow(
      "exactly one calculator settings page",
    );
    expect(() =>
      parseWordPressEstimatePricing([
        { slug: "reglages-calculateur", acf: { ...fields, price_multi_2: -1 } },
      ]),
    ).toThrow();
  });
});
