import { createServerFn } from "@tanstack/react-start";
import { parseWordPressEstimatePricing } from "./wordpress-estimate";

const WORDPRESS_ESTIMATE_URL =
  "https://burchi-climatisation.fr/wp-json/wp/v2/pages?slug=reglages-calculateur&_fields=slug,acf";

export const getWordPressEstimatePricing = createServerFn({
  method: "GET",
}).handler(async () => {
  const response = await fetch(WORDPRESS_ESTIMATE_URL, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `WordPress calculator settings request failed with status ${response.status}.`,
    );
  }

  return parseWordPressEstimatePricing(await response.json());
});
