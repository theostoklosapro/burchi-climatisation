import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Minus, Pencil, Plus, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  INITIAL_ANSWERS,
  clampCounter,
  estimatePrice,
  formatPrice,
  isDetailComplete,
  selectPrestation,
  selectTypeInstallation,
  type CounterKey,
  type EstimateAnswers,
  type EstimatePricing,
  type NbMulti,
  type Prestation,
  type SurfaceMono,
  type TypeEntretien,
  type TypeInstallation,
  type TypePanne,
} from "@/lib/estimate";
import { BRAND } from "./site-data";

import imgInstallation from "@/assets/burchi/service-installation.webp.asset.json";
import imgEntretien from "@/assets/burchi/service-entretien.webp.asset.json";
import imgDepannage from "@/assets/burchi/service-depannage.webp.asset.json";
import imgMono from "@/assets/burchi/choix-monosplit.webp.asset.json";
import imgMulti from "@/assets/burchi/choix-multisplit.webp.asset.json";
import imgGainable from "@/assets/burchi/choix-gainable.webp.asset.json";
import imgS20 from "@/assets/burchi/choix-surface-20.webp.asset.json";
import imgS40 from "@/assets/burchi/choix-surface-40.webp.asset.json";
import imgS60 from "@/assets/burchi/choix-surface-60.webp.asset.json";
import imgSPlus60 from "@/assets/burchi/choix-surface-plus60.webp.asset.json";
import imgBi from "@/assets/burchi/choix-bisplit.webp.asset.json";
import imgTri from "@/assets/burchi/choix-trisplit.webp.asset.json";
import imgQuadri from "@/assets/burchi/choix-quadrisplit.webp.asset.json";
import imgQuint from "@/assets/burchi/choix-quintuplesplit.webp.asset.json";
import imgP20 from "@/assets/burchi/choix-piece-20.webp.asset.json";
import imgP2060 from "@/assets/burchi/choix-piece-20-60.webp.asset.json";
import imgPPlus60 from "@/assets/burchi/choix-piece-plus60.webp.asset.json";
import imgSimple from "@/assets/burchi/choix-nettoyage-simple.webp.asset.json";
import imgComplet from "@/assets/burchi/choix-nettoyage-complet.webp.asset.json";
import imgInt from "@/assets/burchi/choix-unite-interieure.webp.asset.json";
import imgExt from "@/assets/burchi/choix-unite-exterieure.webp.asset.json";
import imgElec from "@/assets/burchi/choix-panne-electrique.webp.asset.json";
import imgFroid from "@/assets/burchi/choix-panne-froid-chaud.webp.asset.json";
import imgAutre from "@/assets/burchi/choix-autre-panne.webp.asset.json";

type Option<T extends string> = { value: T; label: string; hint?: string; image: string };

const PRESTATIONS: Option<Prestation>[] = [
  { value: "Installation", label: "Installation", hint: "Nouvelle climatisation", image: imgInstallation.url },
  { value: "Entretien", label: "Entretien", hint: "Nettoyage de vos unités", image: imgEntretien.url },
  { value: "Depannage", label: "Dépannage", hint: "Panne ou dysfonctionnement", image: imgDepannage.url },
];
const TYPES_INSTALLATION: Option<TypeInstallation>[] = [
  { value: "Monosplit", label: "Monosplit", hint: "1 pièce", image: imgMono.url },
  { value: "Multisplit", label: "Multisplit", hint: "2 à 5 pièces", image: imgMulti.url },
  { value: "Gainable", label: "Gainable", hint: "Toute la maison", image: imgGainable.url },
];
const SURFACES: Option<SurfaceMono>[] = [
  { value: "Moins de 20 m2", label: "Moins de 20 m²", image: imgS20.url },
  { value: "De 20 à 40 m2", label: "20 à 40 m²", image: imgS40.url },
  { value: "De 40 à 60 m2", label: "40 à 60 m²", image: imgS60.url },
  { value: "Plus de 60 m2", label: "Plus de 60 m²", image: imgSPlus60.url },
];
const MULTIS: Option<NbMulti>[] = [
  { value: "Bi-split (2 unités)", label: "Bi-split", hint: "2 unités", image: imgBi.url },
  { value: "Tri-split (3 unités)", label: "Tri-split", hint: "3 unités", image: imgTri.url },
  { value: "Quadri-split (4 unités)", label: "Quadri-split", hint: "4 unités", image: imgQuadri.url },
  { value: "Quintuple-split (5 unités)", label: "Quintuple-split", hint: "5 unités", image: imgQuint.url },
];
const ENTRETIENS: Option<TypeEntretien>[] = [
  { value: "Nettoyage simple", label: "Nettoyage simple", hint: "Courant, 15 à 30 min", image: imgSimple.url },
  { value: "Nettoyage complet", label: "Nettoyage complet", hint: "Approfondi, 45 min à 1 h 30", image: imgComplet.url },
];
const PANNES: Option<TypePanne>[] = [
  { value: "Panne électrique", label: "Panne électrique", hint: "Ne s'allume pas, arrêt soudain", image: imgElec.url },
  { value: "Manque de froid ou de chaud", label: "Manque de froid ou de chaud", hint: "Performance insuffisante", image: imgFroid.url },
  { value: "Autre panne", label: "Autre panne", hint: "Bruit, fuite, odeur, code erreur…", image: imgAutre.url },
];

const STEP_LABELS = ["Prestation", "Type", "Détails", "Coordonnées"];

const PRESTATION_LABEL: Record<Prestation, string> = {
  Installation: "Installation",
  Entretien: "Entretien",
  Depannage: "Dépannage",
};

export const PRESET_EVENT = "burchi:estimate-preset";

export function EstimateForm({ pricing }: { pricing: EstimatePricing }) {
  const [answers, setAnswers] = useState<EstimateAnswers>(INITIAL_ANSWERS);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [zoom, setZoom] = useState<{ src: string; label: string } | null>(null);
  const advanceTimer = useRef<number | undefined>(undefined);

  const price = useMemo(() => estimatePrice(answers, pricing), [answers, pricing]);

  const goTo = (s: number) => {
    window.clearTimeout(advanceTimer.current);
    setStep(s);
  };
  const advance = (to: number) => {
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => setStep(to), 260);
  };

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  // Les boutons « Estimer » de la section Services présélectionnent une prestation.
  useEffect(() => {
    const onPreset = (e: Event) => {
      const prestation = (e as CustomEvent<Prestation>).detail;
      setSubmitted(false);
      setAnswers((a) => selectPrestation(a, prestation));
      goTo(1);
    };
    window.addEventListener(PRESET_EVENT, onPreset);
    return () => window.removeEventListener(PRESET_EVENT, onPreset);
  }, []);

  const summary = buildSummary(answers);
  const detailComplete = isDetailComplete(answers);
  const maxReachable = !answers.prestation ? 0 : !hasType(answers) ? 1 : !detailComplete ? 2 : 3;

  const setCounter = (key: CounterKey, delta: number) =>
    setAnswers((a) => ({ ...a, [key]: clampCounter(key, a[key] + delta) }));

  const reset = () => {
    setAnswers(INITIAL_ANSWERS);
    setSubmitted(false);
    goTo(0);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
      <div className="h-1.5 bg-seasons" aria-hidden />

      {/* En-tête : progression + prix en direct */}
      <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:px-7 md:flex-row md:items-center md:justify-between">
        <ol className="flex items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm" aria-label="Étapes">
          {STEP_LABELS.map((label, i) => {
            const done = submitted || i < step;
            const current = !submitted && i === step;
            const reachable = !submitted && i <= maxReachable;
            return (
              <li key={label} className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => goTo(i)}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1 transition-colors",
                    current ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    reachable && !current && "hover:bg-secondary hover:text-secondary-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-5 place-items-center rounded-full text-[0.7rem]",
                      current ? "bg-primary-foreground text-primary" : done ? "bg-success text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={cn(!current && "hidden sm:inline")}>{label}</span>
                </button>
                {i < STEP_LABELS.length - 1 && <span className="h-px w-3 bg-border sm:w-5" aria-hidden />}
              </li>
            );
          })}
        </ol>

        <div
          className="flex items-center justify-between gap-3 rounded-2xl bg-secondary px-4 py-2 md:justify-end"
          aria-live="polite"
        >
          <span className="text-xs font-semibold tracking-wide text-secondary-foreground/70 uppercase">Votre tarif</span>
          <span
            key={formatPrice(price)}
            className={cn(
              "animate-step-in font-display text-lg font-bold whitespace-nowrap",
              price.kind === "none" ? "text-muted-foreground" : "text-primary",
            )}
          >
            {price.kind === "none" ? "À partir de : —" : formatPrice(price)}
          </span>
        </div>
      </div>

      {/* Récapitulatif des choix (cliquable pour modifier) */}
      {summary.length > 0 && !submitted && (
        <div className="flex flex-wrap items-center gap-2 px-5 pt-4 sm:px-7">
          {summary.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => goTo(s.step)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:border-primary hover:text-primary"
            >
              {s.label}
              <Pencil className="size-3 opacity-50 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      <div className="px-5 py-5 sm:px-7 sm:py-6">
        {submitted ? (
          <Confirmation answers={answers} priceLabel={formatPrice(price)} onReset={reset} />
        ) : (
          <div key={`${step}-${answers.prestation}-${answers.typeInstallation}`} className="animate-step-in">
            {step === 0 && (
              <Question title="Quel type de prestation souhaitez-vous ?">
                <OptionGrid
                  options={PRESTATIONS}
                  value={answers.prestation}
                  cols={3}
                  onZoom={setZoom}
                  onSelect={(v) => {
                    setAnswers((a) => selectPrestation(a, v));
                    advance(1);
                  }}
                />
              </Question>
            )}

            {step === 1 && answers.prestation === "Installation" && (
              <Question title="Quel type d'installation souhaitez-vous ?" onBack={() => goTo(0)}>
                <OptionGrid
                  options={TYPES_INSTALLATION}
                  value={answers.typeInstallation}
                  cols={3}
                  onZoom={setZoom}
                  onSelect={(v) => {
                    setAnswers((a) => selectTypeInstallation(a, v));
                    advance(2);
                  }}
                />
              </Question>
            )}
            {step === 1 && answers.prestation === "Entretien" && (
              <Question title="Quel type d'entretien souhaitez-vous ?" onBack={() => goTo(0)}>
                <OptionGrid
                  options={ENTRETIENS}
                  value={answers.typeEntretien}
                  cols={2}
                  onZoom={setZoom}
                  onSelect={(v) => {
                    setAnswers((a) => ({ ...a, typeEntretien: v }));
                    advance(2);
                  }}
                />
              </Question>
            )}
            {step === 1 && answers.prestation === "Depannage" && (
              <Question title="Quel problème rencontrez-vous ?" onBack={() => goTo(0)}>
                <OptionGrid
                  options={PANNES}
                  value={answers.typePanne}
                  cols={3}
                  onZoom={setZoom}
                  onSelect={(v) => {
                    setAnswers((a) => ({ ...a, typePanne: v }));
                    advance(2);
                  }}
                />
              </Question>
            )}

            {step === 2 && answers.typeInstallation === "Monosplit" && (
              <Question title="Quelle est la superficie de la pièce à climatiser ?" onBack={() => goTo(1)}>
                <OptionGrid
                  options={SURFACES}
                  value={answers.surfaceMono}
                  cols={4}
                  onZoom={setZoom}
                  onSelect={(v) => {
                    setAnswers((a) => ({ ...a, surfaceMono: v }));
                    advance(3);
                  }}
                />
              </Question>
            )}
            {step === 2 && answers.typeInstallation === "Multisplit" && (
              <Question title="Combien d'unités intérieures souhaitez-vous installer ?" onBack={() => goTo(1)}>
                <OptionGrid
                  options={MULTIS}
                  value={answers.nbMulti}
                  cols={4}
                  onZoom={setZoom}
                  onSelect={(v) => {
                    setAnswers((a) => ({ ...a, nbMulti: v }));
                    advance(3);
                  }}
                />
              </Question>
            )}
            {step === 2 && answers.typeInstallation === "Gainable" && (
              <Question
                title="Combien de pièces de chaque superficie souhaitez-vous climatiser ?"
                onBack={() => goTo(1)}
                onNext={() => goTo(3)}
                nextDisabled={!detailComplete}
                nextHint={!detailComplete ? "Ajoutez au moins une pièce" : undefined}
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <Counter label="Moins de 20 m²" image={imgP20.url} value={answers.gainable20} min={0} onChange={(d) => setCounter("gainable20", d)} onZoom={setZoom} />
                  <Counter label="Entre 20 et 60 m²" image={imgP2060.url} value={answers.gainable20to60} min={0} onChange={(d) => setCounter("gainable20to60", d)} onZoom={setZoom} />
                  <Counter label="Plus de 60 m²" image={imgPPlus60.url} value={answers.gainablePlus60} min={0} onChange={(d) => setCounter("gainablePlus60", d)} onZoom={setZoom} />
                </div>
              </Question>
            )}
            {step === 2 && answers.prestation === "Entretien" && (
              <Question title="Combien d'unités souhaitez-vous entretenir ?" onBack={() => goTo(1)} onNext={() => goTo(3)}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Counter label="Unités intérieures" hint="Le climatiseur mural" image={imgInt.url} value={answers.nbInterieures} min={1} onChange={(d) => setCounter("nbInterieures", d)} onZoom={setZoom} />
                  <Counter label="Unités extérieures" hint="Le groupe à l'extérieur" image={imgExt.url} value={answers.nbExterieures} min={1} onChange={(d) => setCounter("nbExterieures", d)} onZoom={setZoom} />
                </div>
              </Question>
            )}
            {step === 2 && answers.prestation === "Depannage" && (
              <Question title="Précisez votre problème" onBack={() => goTo(1)} onNext={() => goTo(3)} nextLabel="Continuer">
                <Textarea
                  value={answers.descriptionPanne}
                  maxLength={2000}
                  rows={3}
                  onChange={(e) => setAnswers((a) => ({ ...a, descriptionPanne: e.target.value }))}
                  placeholder="Décrivez la panne rencontrée (code erreur, bruit, fuite…) — facultatif"
                  className="resize-none bg-background"
                />
                <p className="mt-2 text-sm text-muted-foreground">Tarif : sur devis, après diagnostic.</p>
              </Question>
            )}

            {step === 3 && (
              <ContactStep priceLabel={formatPrice(price)} onBack={() => goTo(2)} onSubmit={() => setSubmitted(true)} />
            )}
          </div>
        )}
      </div>

      <Dialog open={!!zoom} onOpenChange={(o) => !o && setZoom(null)}>
        <DialogContent className="max-w-md p-3">
          <DialogTitle className="sr-only">{zoom?.label}</DialogTitle>
          {zoom && <img src={zoom.src} alt={zoom.label} className="max-h-[80vh] w-full rounded-lg object-contain" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function hasType(a: EstimateAnswers) {
  if (a.prestation === "Installation") return !!a.typeInstallation;
  if (a.prestation === "Entretien") return !!a.typeEntretien;
  if (a.prestation === "Depannage") return !!a.typePanne;
  return false;
}

function buildSummary(a: EstimateAnswers): { step: number; label: string }[] {
  const out: { step: number; label: string }[] = [];
  if (!a.prestation) return out;
  out.push({ step: 0, label: PRESTATION_LABEL[a.prestation] });
  if (a.prestation === "Installation" && a.typeInstallation) {
    out.push({ step: 1, label: a.typeInstallation });
    if (a.surfaceMono) out.push({ step: 2, label: SURFACES.find((s) => s.value === a.surfaceMono)!.label });
    if (a.nbMulti) out.push({ step: 2, label: a.nbMulti });
    const rooms = a.gainable20 + a.gainable20to60 + a.gainablePlus60;
    if (a.typeInstallation === "Gainable" && rooms > 0)
      out.push({ step: 2, label: `${rooms} pièce${rooms > 1 ? "s" : ""}` });
  }
  if (a.prestation === "Entretien" && a.typeEntretien) {
    out.push({ step: 1, label: a.typeEntretien });
    out.push({ step: 2, label: `${a.nbInterieures} int. · ${a.nbExterieures} ext.` });
  }
  if (a.prestation === "Depannage" && a.typePanne) out.push({ step: 1, label: a.typePanne });
  return out;
}

function Question({
  title,
  children,
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continuer",
  nextHint,
}: {
  title: string;
  children: ReactNode;
  onBack?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  nextDisabled?: boolean | undefined;
  nextLabel?: string | undefined;
  nextHint?: string | undefined;
}) {
  return (
    <fieldset>
      <legend className="mb-4 font-display text-xl font-bold text-foreground sm:text-2xl">{title}</legend>
      {children}
      {(onBack || onNext) && (
        <div className="mt-5 flex items-center justify-between gap-3">
          {onBack ? (
            <Button type="button" variant="ghost" onClick={onBack} className="rounded-full text-muted-foreground">
              <ArrowLeft /> Retour
            </Button>
          ) : (
            <span />
          )}
          {onNext && (
            <div className="flex items-center gap-3">
              {nextHint && <span className="hidden text-sm text-muted-foreground sm:inline">{nextHint}</span>}
              <Button type="button" onClick={onNext} disabled={nextDisabled} className="rounded-full px-6">
                {nextLabel} <ArrowRight />
              </Button>
            </div>
          )}
        </div>
      )}
    </fieldset>
  );
}

function OptionGrid<T extends string>({
  options,
  value,
  onSelect,
  cols,
  onZoom,
}: {
  options: Option<T>[];
  value?: T | undefined;
  onSelect: (v: T) => void;
  cols: 2 | 3 | 4;
  onZoom: (z: { src: string; label: string }) => void;
}) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "grid gap-2 sm:gap-3",
        cols === 2 && "grid-cols-2",
        cols === 3 && "grid-cols-3",
        cols === 4 && "grid-cols-2 sm:grid-cols-4",
      )}
    >
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <div key={o.value} className="relative">
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(o.value)}
              className={cn(
                "group flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 bg-background text-left transition-all duration-200",
                selected
                  ? "border-primary shadow-soft"
                  : "border-border hover:-translate-y-0.5 hover:border-ice hover:shadow-soft",
              )}
            >
              <span className="block h-20 overflow-hidden bg-ice-soft sm:h-32">
                <img
                  src={o.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover object-[50%_30%] transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="flex flex-1 items-start justify-between gap-2 p-2.5 sm:p-3">
                <span>
                  <span className="block text-xs leading-tight font-bold text-foreground sm:text-base">{o.label}</span>
                  {o.hint && <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{o.hint}</span>}
                </span>
                <span
                  className={cn(
                    "mt-0.5 hidden size-5 shrink-0 place-items-center sm:grid rounded-full border-2 transition-colors",
                    selected ? "border-primary bg-primary text-primary-foreground" : "border-input",
                  )}
                  aria-hidden
                >
                  {selected && <Check className="size-3" strokeWidth={3} />}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onZoom({ src: o.image, label: o.label })}
              aria-label={`Voir le détail : ${o.label}`}
              className="absolute top-1.5 right-1.5 grid size-6 sm:top-2 sm:right-2 sm:size-7 place-items-center rounded-full bg-card/90 text-foreground/70 shadow-soft backdrop-blur transition-colors hover:text-primary"
            >
              <ZoomIn className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Counter({
  label,
  hint,
  image,
  value,
  min,
  onChange,
  onZoom,
}: {
  label: string;
  hint?: string | undefined;
  image: string;
  value: number;
  min: number;
  onChange: (delta: number) => void;
  onZoom: (z: { src: string; label: string }) => void;
}) {
  const active = value > 0;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border-2 bg-background p-2.5 transition-colors",
        active ? "border-primary/70" : "border-border",
      )}
    >
      <button
        type="button"
        onClick={() => onZoom({ src: image, label })}
        aria-label={`Voir le détail : ${label}`}
        className="size-16 shrink-0 overflow-hidden rounded-xl bg-ice-soft"
      >
        <img src={image} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-tight font-bold text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:border-muted-foreground disabled:text-muted-foreground disabled:opacity-100"
          disabled={value <= min}
          onClick={() => onChange(-1)}
          aria-label={`Retirer : ${label}`}
        >
          <Minus />
        </Button>
        <span className="w-6 text-center font-display text-lg font-bold tabular-nums text-foreground" aria-live="polite">
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:border-muted-foreground disabled:text-muted-foreground disabled:opacity-100"
          disabled={value >= 10}
          onClick={() => onChange(1)}
          aria-label={`Ajouter : ${label}`}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}

type ContactErrors = Partial<Record<"nom" | "telephone" | "email" | "rgpd", string>>;

function ContactStep({
  priceLabel,
  onBack,
  onSubmit,
}: {
  priceLabel: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [rgpd, setRgpd] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nom = String(data.get("nom") ?? "").trim();
    const tel = String(data.get("telephone") ?? "").replace(/[\s.\-]/g, "");
    const email = String(data.get("email") ?? "").trim();
    const next: ContactErrors = {};
    if (nom.length < 2) next.nom = "Indiquez votre nom et prénom.";
    if (!/^(\+33|0)[1-9]\d{8}$/.test(tel)) next.telephone = "Numéro de téléphone invalide.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Adresse e-mail invalide.";
    if (!rgpd) next.rgpd = "Merci d'accepter l'utilisation de vos informations.";
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3 className="mb-4 font-display text-xl font-bold text-foreground sm:text-2xl">Vos coordonnées</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="nom" label="Nom et prénom" error={errors.nom} required>
          <Input id="nom" name="nom" maxLength={100} autoComplete="name" placeholder="Votre nom et prénom" className="bg-background" />
        </Field>
        <Field id="telephone" label="Téléphone" error={errors.telephone} required>
          <Input id="telephone" name="telephone" type="tel" maxLength={20} autoComplete="tel" placeholder="06 12 34 56 78" className="bg-background" />
        </Field>
        <Field id="email" label="Adresse e-mail" error={errors.email} required>
          <Input id="email" name="email" type="email" maxLength={255} autoComplete="email" placeholder="vous@exemple.fr" className="bg-background" />
        </Field>
        <Field id="adresse" label="Adresse du chantier">
          <Input id="adresse" name="adresse" maxLength={200} autoComplete="street-address" placeholder="Ville et adresse" className="bg-background" />
        </Field>
        <div className="sm:col-span-2">
          <Field id="message" label="Informations complémentaires">
            <Textarea id="message" name="message" rows={2} maxLength={2000} placeholder="Vos précisions…" className="resize-none bg-background" />
          </Field>
        </div>
      </div>

      <div className="mt-4">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-foreground">
          <Checkbox checked={rgpd} onCheckedChange={(v) => setRgpd(v === true)} className="mt-0.5" aria-invalid={!!errors.rgpd} />
          J'accepte que mes informations soient utilisées pour répondre à ma demande.
        </label>
        {errors.rgpd && <p className="mt-1 text-sm text-destructive">{errors.rgpd}</p>}
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack} className="rounded-full text-muted-foreground">
          <ArrowLeft /> Retour
        </Button>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-center text-sm text-muted-foreground">
            Estimation : <strong className="text-foreground">{priceLabel}</strong>
          </span>
          <Button type="submit" size="lg" className="rounded-full bg-accent px-7 text-accent-foreground hover:bg-accent/90">
            Envoyer ma demande de devis
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-accent"> *</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function Confirmation({
  answers,
  priceLabel,
  onReset,
}: {
  answers: EstimateAnswers;
  priceLabel: string;
  onReset: () => void;
}) {
  const items = buildSummary(answers).map((s) => s.label);
  return (
    <div className="animate-step-in flex flex-col items-center py-4 text-center">
      <CheckCircle2 className="size-14 text-success" strokeWidth={1.75} />
      <h3 className="mt-4 font-display text-2xl font-bold">Merci, votre demande est bien enregistrée !</h3>
      <p className="mt-2 max-w-md text-muted-foreground">
        Nous revenons vers vous rapidement pour affiner votre devis. Pour une urgence, appelez-nous au{" "}
        <a href={BRAND.phoneHref} className="font-semibold text-primary underline-offset-4 hover:underline">
          {BRAND.phoneDisplay}
        </a>
        .
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {items.map((i) => (
          <span key={i} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {i}
          </span>
        ))}
        <span className="rounded-full bg-sun-soft px-3 py-1 text-xs font-bold text-foreground">{priceLabel}</span>
      </div>
      <Button variant="outline" className="mt-6 rounded-full" onClick={onReset}>
        Faire une nouvelle estimation
      </Button>
    </div>
  );
}
