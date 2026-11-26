import { describe, expect, it } from "vitest";
import { parseWordPressGallery } from "./wordpress-gallery";

describe("Galerie WordPress", () => {
  it("récupère l'URL et le texte alternatif de l'image mise en avant", () => {
    expect(
      parseWordPressGallery([
        {
          _embedded: {
            "wp:featuredmedia": [
              {
                source_url: "https://example.com/realisation.jpg",
                alt_text: "Unité extérieure installée",
              },
            ],
          },
        },
      ]),
    ).toEqual([
      {
        src: "https://example.com/realisation.jpg",
        alt: "Unité extérieure installée",
      },
    ]);
  });

  it("ignore les réalisations sans image et utilise un texte alternatif de secours", () => {
    expect(
      parseWordPressGallery([
        {
          _embedded: {
            "wp:featuredmedia": [
              { source_url: "https://example.com/photo.jpg", alt_text: "" },
            ],
          },
        },
        { _embedded: { "wp:featuredmedia": [] } },
      ]),
    ).toEqual([
      {
        src: "https://example.com/photo.jpg",
        alt: "Réalisation Burchi Climatisation",
      },
    ]);
  });

  it("signale une réponse WordPress invalide", () => {
    expect(() => parseWordPressGallery({})).toThrow("invalid gallery response");
  });
});
