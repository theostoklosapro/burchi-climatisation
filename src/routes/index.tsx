import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  CalendarCheck,
  Phone,
  ShieldCheck,
  Snowflake,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { EstimateForm } from "@/components/site/EstimateForm";
import {
  ContactSection,
  GallerySection,
  ReviewsSection,
  ServicesSection,
  SiteFooter,
  StrengthsSection,
} from "@/components/site/Sections";
import { BRAND } from "@/components/site/site-data";
import { getWordPressGallery } from "@/lib/wordpress-gallery.server";
import { getWordPressEstimatePricing } from "@/lib/wordpress-estimate.server";

const TITLE = "Burchi Climatisation — Installation, entretien et dépannage à Fayence (83)";
const DESCRIPTION =
  "Climatisation et chauffage à Fayence et alentours : installation monosplit, multisplit et gainable, entretien et dépannage. Estimez votre projet en ligne.";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [gallery, pricing] = await Promise.all([
      getWordPressGallery(),
      getWordPressEstimatePricing(),
    ]);
    return { gallery, pricing };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { gallery, pricing } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <section
          id="estimation"
          className="relative z-10 -mt-20 overflow-hidden bg-navy-deep px-4 pt-12 pb-16 text-navy-deep-foreground sm:-mt-24 sm:px-6 sm:pt-16 sm:pb-20"
        >
          <div
            className="pointer-events-none absolute -top-20 right-0 size-80 rounded-full bg-seasons opacity-15 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-5xl">
            <header className="mb-8 max-w-3xl sm:mb-10">
              <p className="inline-flex items-center gap-2 rounded-full bg-navy-deep-foreground/10 px-3 py-1 text-xs font-bold tracking-[0.16em] text-sun uppercase">
                <CalendarCheck className="size-4" />
                Estimation en ligne
              </p>
              <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
                Estimez votre projet en quelques étapes
              </h2>
              <p className="mt-3 max-w-2xl text-base text-navy-deep-foreground/75 sm:text-lg">
                Installation, entretien ou dépannage : indiquez votre besoin
                pour obtenir une première estimation personnalisée.
              </p>
            </header>
            <EstimateForm pricing={pricing} />
          </div>
        </section>
        <ServicesSection />
        <StrengthsSection />
        <GallerySection gallery={gallery} />
        <ReviewsSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <a
        href={BRAND.phoneHref}
        aria-label={`Appeler le ${BRAND.phoneDisplay}`}
        className="fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-lift transition-transform hover:scale-105 md:hidden"
      >
        <Phone className="size-6" />
      </a>
    </div>
  );
}

function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden bg-hero-glow pt-28 pb-36 sm:pt-36 sm:pb-44">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-sm font-semibold text-foreground/80 backdrop-blur">
            <Snowflake className="size-4 text-ice" />
            Installation · Entretien · Dépannage
            <Sun className="size-4 text-sun" />
          </p>
          <h1 className="mt-6 text-5xl leading-[0.95] font-extrabold text-foreground sm:text-6xl lg:text-7xl">
            Votre confort <br className="hidden sm:block" />
            en <span className="bg-seasons bg-clip-text text-transparent">toutes saisons</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Nous installons, entretenons et réparons vos systèmes de chauffage et climatisation pour un confort
            durable en toute saison.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
              <a href="#estimation">
                Estimer mon projet <ArrowDown />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-card/60 px-6 text-base">
              <a href={BRAND.phoneHref}>
                <Phone /> {BRAND.phoneDisplay}
              </a>
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-success" />
            Intervention à {BRAND.city} et alentours · Particuliers et professionnels
          </p>
        </div>
        <div className="relative hidden lg:block" aria-hidden>
          <div className="absolute inset-8 rounded-full bg-seasons opacity-20 blur-3xl" />
          <img src={BRAND.emblemUrl} alt="" className="relative mx-auto w-full max-w-sm drop-shadow-xl" />
        </div>
      </div>
    </section>
  );
}
