import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { BRAND, NAV_LINKS } from "./site-data";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/85 shadow-soft backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 md:h-[4.5rem]">
        <a href="#accueil" className="flex shrink-0 items-center" aria-label="Burchi Climatisation, retour en haut">
          <img src={BRAND.logoUrl} alt="Burchi Climatisation" className="h-12 w-auto md:h-14" width={112} height={56} />
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={cn(
                "relative rounded-full px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-primary",
                active === l.id && "text-primary",
              )}
            >
              {l.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-seasons transition-transform duration-300",
                  active === l.id && "scale-x-100",
                )}
              />
            </a>
          ))}
          <Button asChild className="ml-3 rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90">
            <a href={BRAND.phoneHref}>
              <Phone /> {BRAND.phoneDisplay}
            </a>
          </Button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="icon" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            <a href={BRAND.phoneHref} aria-label={`Appeler le ${BRAND.phoneDisplay}`}>
              <Phone />
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full" aria-label="Ouvrir le menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <img src={BRAND.logoUrl} alt="Burchi Climatisation" className="h-12 w-auto" />
              <nav aria-label="Navigation mobile" className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-3 font-display text-lg font-semibold text-foreground hover:bg-secondary",
                      active === l.id && "bg-secondary text-primary",
                    )}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
