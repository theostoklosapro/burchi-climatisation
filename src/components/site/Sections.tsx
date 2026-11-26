import { useState } from "react";
import { ArrowRight, CalendarCheck, HeartHandshake, Mail, MapPin, Phone, Quote, Star, ThermometerSun, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BRAND, NAV_LINKS, REVIEWS, SERVICES, STRENGTHS } from "./site-data";
import { PRESET_EVENT } from "./EstimateForm";
import type { Prestation } from "@/lib/estimate";
import type { GalleryImage } from "@/lib/wordpress-gallery";

function SectionHeading({ eyebrow, title, text, invert }: { eyebrow: string; title: string; text?: string; invert?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={invert ? "text-sm font-bold tracking-[0.18em] text-sun uppercase" : "text-sm font-bold tracking-[0.18em] text-accent uppercase"}>
        {eyebrow}
      </p>
      <h2 className={invert ? "mt-2 text-3xl font-extrabold text-navy-deep-foreground sm:text-4xl" : "mt-2 text-3xl font-extrabold text-foreground sm:text-4xl"}>
        {title}
      </h2>
      {text && <p className={invert ? "mt-3 text-lg text-navy-deep-foreground/75" : "mt-3 text-lg text-muted-foreground"}>{text}</p>}
    </div>
  );
}

function presetEstimate(p: Prestation) {
  window.dispatchEvent(new CustomEvent(PRESET_EVENT, { detail: p }));
  document.getElementById("estimation")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Nos services"
          title="Installer, entretenir, dépanner"
          text="Découvrez nos services pour améliorer votre confort, votre efficacité énergétique et la qualité de votre air intérieur."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-lift"
            >
              <div className="relative h-64 overflow-hidden bg-ice-soft">
                <img
                  src={s.image}
                  alt={`${s.title} climatisation`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 rounded-full bg-card/90 px-3 py-1 font-display text-sm font-bold text-primary backdrop-blur">
                  0{i + 1}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.intro}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => presetEstimate(s.prestation)}
                  className="mt-auto inline-flex cursor-pointer items-center gap-1.5 pt-6 text-sm font-bold text-primary transition-colors hover:text-accent"
                >
                  Estimer {s.prestation === "Depannage" ? "un dépannage" : s.prestation === "Entretien" ? "un entretien" : "une installation"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const STRENGTH_ICONS = [HeartHandshake, Wrench, ThermometerSun] as const;

export function StrengthsSection() {
  return (
    <section id="atouts" className="relative overflow-hidden bg-navy-deep py-20 text-navy-deep-foreground sm:py-28">
      <img
        src={BRAND.emblemUrl}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-28 w-[26rem] opacity-[0.07] select-none sm:w-[36rem]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          invert
          eyebrow="Pourquoi nous choisir ?"
          title="Des solutions fiables, adaptées à votre quotidien"
          text="Chauffage et climatisation : des solutions fiables, performantes et adaptées à votre confort quotidien."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-navy-deep-foreground/10 md:grid-cols-3">
          {STRENGTHS.map((s, i) => {
            const Icon = STRENGTH_ICONS[i % STRENGTH_ICONS.length] ?? HeartHandshake;
            return (
              <div key={s.title} className="bg-navy-deep p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-seasons text-primary-foreground">
                    <Icon className="size-6" />
                  </span>
                  <span className="font-display text-5xl font-extrabold text-navy-deep-foreground/10">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-navy-deep-foreground/70">{s.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function GallerySection({ gallery }: { gallery: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const current = open !== null ? gallery[open] : undefined;
  return (
    <section id="realisations" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading eyebrow="Réalisations" title="Un aperçu de notre travail" />
          <p className="max-w-sm text-muted-foreground">Cliquez sur une photo pour l'agrandir.</p>
        </div>
        <div className="mt-10 grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] md:grid-cols-4">
          {gallery.map((g, i) => (
            <button
              key={g.src}
              type="button"
              onClick={() => setOpen(i)}
              className={
                "group relative cursor-zoom-in overflow-hidden rounded-2xl bg-muted " +
                (i === 0 ? "col-span-2 row-span-2" : i === 5 ? "md:col-span-2" : "")
              }
              aria-label={`Agrandir : ${g.alt}`}
            >
              <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/15" />
            </button>
          ))}
        </div>
      </div>
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{current?.alt ?? "Photo"}</DialogTitle>
          {current && <img src={current.src} alt={current.alt} className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section id="avis" className="bg-secondary/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Avis de nos clients"
          title="Ils nous ont fait confiance"
          text="De Fayence à Montauroux, en passant par Seillans et Tourrettes."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="relative flex flex-col rounded-3xl bg-card p-7 shadow-soft">
              <Quote className="absolute top-6 right-6 size-8 text-ice/25" />
              <div className="flex gap-0.5 text-sun" aria-label="Note : 5 sur 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-foreground/85">« {r.text} »</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="grid size-10 place-items-center rounded-full bg-seasons font-display font-bold text-primary-foreground">
                  {r.name[0]}
                </span>
                <span>
                  <span className="block font-bold">{r.name}</span>
                  <span className="block text-sm text-muted-foreground">
                    {r.place} · {r.service}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const items = [
    { icon: Phone, label: "Téléphone", value: BRAND.phoneDisplay, href: BRAND.phoneHref },
    { icon: Mail, label: "E-mail", value: BRAND.email, href: `mailto:${BRAND.email}` },
    { icon: MapPin, label: "Adresse", value: `${BRAND.city.toUpperCase()}, ${BRAND.postcode}` },
  ];
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-lift lg:grid-cols-[1.1fr_1fr]">
          <div className="p-8 sm:p-12">
            <SectionHeading eyebrow="Contact" title="Contactez-nous" text="Une question, un projet ou une panne ? Appelez-nous ou écrivez-nous." />
            <ul className="mt-8 space-y-4">
              {items.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <>
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
                      <span className="block font-display text-lg font-bold">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="flex items-center gap-4 rounded-2xl transition-colors hover:text-primary">
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90">
                <a href={BRAND.phoneHref}>
                  <Phone /> Appeler maintenant
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <a href="#estimation">
                  <CalendarCheck /> Estimer mon projet
                </a>
              </Button>
            </div>
          </div>
          <div className="min-h-72 bg-muted">
            <iframe
              title="Carte : Fayence, Var"
              src="https://www.openstreetmap.org/export/embed.html?bbox=6.655%2C43.605%2C6.735%2C43.64&layer=mapnik&marker=43.6236%2C6.6947"
              className="h-full min-h-72 w-full border-0 grayscale-[30%]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
        <img src={BRAND.logoUrl} alt="Burchi Climatisation" className="h-12 w-auto" />
        <nav aria-label="Liens du pied de page" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="hover:text-primary">
              {l.label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground">© 2026 Burchi Climatisation</p>
      </div>
      <div className="h-1 bg-seasons" />
    </footer>
  );
}
