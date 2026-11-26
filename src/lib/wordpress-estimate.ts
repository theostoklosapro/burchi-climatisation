import { z } from "zod";
import type { EstimatePricing } from "./estimate";

const nonNegativeNumber = z.number().finite().nonnegative();

const settingsPageSchema = z.object({
  slug: z.literal("reglages-calculateur"),
  acf: z.object({
    price_mono_under_20: nonNegativeNumber,
    price_mono_20_40: nonNegativeNumber,
    price_mono_40_60: nonNegativeNumber,
    price_multi_2: nonNegativeNumber,
    price_multi_3: nonNegativeNumber,
    price_multi_4: nonNegativeNumber,
    price_multi_5: nonNegativeNumber,
    price_gainable_base: nonNegativeNumber,
    price_gainable_per_outlet: nonNegativeNumber,
    outlets_gainable_under_20: z.number().int().positive(),
    outlets_gainable_20_60: z.number().int().positive(),
    outlets_gainable_over_60: z.number().int().positive(),
    price_maintenance_simple_indoor: nonNegativeNumber,
    price_maintenance_full_indoor: nonNegativeNumber,
    price_maintenance_outdoor: nonNegativeNumber,
  }),
});

export function parseWordPressEstimatePricing(
  payload: unknown,
): EstimatePricing {
  const pages = z.array(settingsPageSchema).parse(payload);
  const [page, ...otherPages] = pages;
  if (!page || otherPages.length > 0) {
    throw new Error(
      "WordPress did not return exactly one calculator settings page.",
    );
  }

  const fields = page.acf;
  return {
    monosplit: {
      "Moins de 20 m2": fields.price_mono_under_20,
      "De 20 à 40 m2": fields.price_mono_20_40,
      "De 40 à 60 m2": fields.price_mono_40_60,
      "Plus de 60 m2": null,
    },
    multisplit: {
      "Bi-split (2 unités)": fields.price_multi_2,
      "Tri-split (3 unités)": fields.price_multi_3,
      "Quadri-split (4 unités)": fields.price_multi_4,
      "Quintuple-split (5 unités)": fields.price_multi_5,
    },
    gainable: {
      base: fields.price_gainable_base,
      perOutlet: fields.price_gainable_per_outlet,
      outletsPerRoomSize: {
        under20: fields.outlets_gainable_under_20,
        between20And60: fields.outlets_gainable_20_60,
        over60: fields.outlets_gainable_over_60,
      },
    },
    maintenance: {
      simplePerIndoorUnit: fields.price_maintenance_simple_indoor,
      completePerIndoorUnit: fields.price_maintenance_full_indoor,
      perOutdoorUnit: fields.price_maintenance_outdoor,
    },
  };
}
