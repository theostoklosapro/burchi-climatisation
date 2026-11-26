export type GalleryImage = {
  src: string;
  alt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseWordPressGallery(payload: unknown): GalleryImage[] {
  if (!Array.isArray(payload)) {
    throw new Error("WordPress returned an invalid gallery response.");
  }

  return payload.flatMap((item): GalleryImage[] => {
    if (!isRecord(item) || !isRecord(item._embedded)) return [];

    const media = item._embedded["wp:featuredmedia"];
    if (
      !Array.isArray(media) ||
      !isRecord(media[0]) ||
      typeof media[0].source_url !== "string"
    )
      return [];

    const alt =
      typeof media[0].alt_text === "string" ? media[0].alt_text.trim() : "";
    return [
      {
        src: media[0].source_url,
        alt: alt || "Réalisation Burchi Climatisation",
      },
    ];
  });
}
