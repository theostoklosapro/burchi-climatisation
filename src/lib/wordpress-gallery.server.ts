import { createServerFn } from "@tanstack/react-start";
import { parseWordPressGallery } from "./wordpress-gallery";

const WORDPRESS_GALLERY_URL =
  "https://burchi-climatisation.fr/wp-json/wp/v2/realisations?_embed&per_page=100";

export const getWordPressGallery = createServerFn({ method: "GET" }).handler(
  async () => {
    const response = await fetch(WORDPRESS_GALLERY_URL, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `WordPress gallery request failed with status ${response.status}.`,
      );
    }

    return parseWordPressGallery(await response.json());
  },
);
