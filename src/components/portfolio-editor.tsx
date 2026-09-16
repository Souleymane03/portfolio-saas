"use client";

import { ArrowLeft, Check, Copy, ExternalLink, GripVertical, LoaderCircle, Monitor, Palette, Plus, Rocket, Settings2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Portfolio, PortfolioSection, ProductSectionType } from "@/lib/types";
import { PortfolioView } from "./portfolio-view";

const sectionNames: Record<ProductSectionType, string> = {
  hero: "Hero", projects: "Projets", about: "À propos", contact: "Contact",
};
const fixedTypes: ProductSectionType[] = ["hero", "projects", "about", "contact"];

type EditorPortfolio = Omit<Portfolio, "createdAt" | "updatedAt">;

export function PortfolioEditor({ initialPortfolio }: { initialPortfolio: EditorPortfolio }) {
  const initial = useMemo(() => ({
    ...initialPortfolio,
    status: initialPortfolio.status === "published" ? "published" as const : "draft" as const,
    sections: normalizeSections(initialPortfolio.sections),
  }), [initialPortfolio]);
  const [portfolio, setPortfolio] = useState<EditorPortfolio>(initial);
  const [selectedId, setSelectedId] = useState(initial.sections[0]?.id);
  const [panel, setPanel] = useState<"content" | "theme" | "settings">("content");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const draggedId = useRef<string | null>(null);
  const firstRender = useRef(true);
  const selected = useMemo(() => portfolio.sections.find((item) => item.id === selectedId), [portfolio.sections, selectedId]);

  const update = (patch: Partial<EditorPortfolio>) => setPortfolio((current) => ({ ...current, ...patch }));
  const updateData = (patch: Partial<PortfolioSection["data"]>) => setPortfolio((current) => ({
    ...current,
    sections: current.sections.map((item) => item.id === selectedId ? { ...item, data: { ...item.data, ...patch } } : item),
  }));

  const save = useCallback(async (next: EditorPortfolio, visible = false) => {
    if (visible) setSaving(true);
    setSaved(false); setError("");
    const response = await fetch(`/api/portfolios/${next.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: next.title, slug: next.slug, status: next.status, theme: next.theme, sections: next.sections }),
    });
    const data = await response.json();
    if (visible) setSaving(false);
    if (!response.ok) return setError(data.error ?? "Enregistrement impossible.");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
    return true;
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = window.setTimeout(() => void save(portfolio), 500);
    return () => window.clearTimeout(timer);
  }, [portfolio, save]);

  function reorder(targetId: string) {
    if (!draggedId.current || draggedId.current === targetId) return;
    const sections = [...portfolio.sections];
    const from = sections.findIndex((item) => item.id === draggedId.current);
    const to = sections.findIndex((item) => item.id === targetId);
    const [moved] = sections.splice(from, 1);
    sections.splice(to, 0, moved);
    update({ sections: sections.map((item, order) => ({ ...item, order })) });
    draggedId.current = null;
  }

  async function publish() {
    const next = { ...portfolio, status: "published" as const };
    setPortfolio(next);
    if (!(await save(next, true))) return;
    await navigator.clipboard.writeText(`${window.location.origin}/p/${next.slug}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <main className="fixed inset-0 z-[60] flex flex-col bg-[#efede7]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/10 bg-white px-3 md:px-5">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="grid size-9 place-items-center rounded-full border border-black/15" aria-label="Retour"><ArrowLeft size={17} /></Link>
          <div><input aria-label="Nom du portfolio" className="max-w-36 font-black outline-none md:max-w-xs" value={portfolio.title} onChange={(event) => update({ title: event.target.value })} /><p className="text-[10px] font-semibold uppercase tracking-wider text-black/35">{portfolio.status === "published" ? "Publié" : "Brouillon"}</p></div>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="hidden text-xs font-semibold text-red-600 md:inline">{error}</span>}
          <span className="hidden items-center gap-1 text-xs font-semibold text-black/40 md:flex">{saving ? <LoaderCircle className="animate-spin" size={14} /> : saved ? <Check size={14} /> : null}{saving ? "Enregistrement…" : saved ? "Enregistré" : "Sauvegarde auto"}</span>
          {portfolio.status === "published" && <Link target="_blank" href={`/p/${portfolio.slug}`} className="btn btn-light !min-h-9 !px-3 !py-1"><ExternalLink size={15} /><span className="hidden sm:inline">Voir</span></Link>}
          <button onClick={publish} disabled={saving} className="btn btn-dark !min-h-9 !px-4 !py-1">{saving ? <LoaderCircle className="animate-spin" size={16} /> : copied ? <Copy size={16} /> : <Rocket size={16} />}<span className="hidden sm:inline">{copied ? "Lien copié !" : portfolio.status === "published" ? "Copier le lien" : "Publier"}</span></button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 md:grid-cols-[380px_1fr]">
        <aside className="flex min-h-0 flex-col border-r border-black/10 bg-white">
          <div className="grid grid-cols-3 border-b border-black/10 p-2">
            {([["content", Monitor, "Contenu"], ["theme", Palette, "Style"], ["settings", Settings2, "Publier"]] as const).map(([id, Icon, label]) => (
              <button key={id} onClick={() => setPanel(id)} className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-bold ${panel === id ? "bg-black text-white" : "text-black/50 hover:bg-black/5"}`}><Icon size={15} />{label}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {panel === "content" && <>
              <p className="label">Sections</p>
              <div className="space-y-2">
                {portfolio.sections.map((section) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => { draggedId.current = section.id; }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => reorder(section.id)}
                    className={`group flex cursor-grab items-center gap-1 rounded-xl border p-1.5 active:cursor-grabbing ${selectedId === section.id ? "border-black bg-[#f7f5ef]" : "border-black/10"}`}
                  >
                    <button onClick={() => setSelectedId(section.id)} className="flex min-w-0 flex-1 items-center gap-2 p-1.5 text-left text-sm font-bold"><GripVertical size={15} className="shrink-0 text-black/30" /><span className="truncate">{sectionNames[section.type as ProductSectionType]}</span></button>
                    <span className="pr-2 text-[10px] font-bold text-black/25">{(section.order ?? 0) + 1}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-black/40">Glissez-déposez pour modifier l’ordre. Les 4 sections sont fixes dans cette version.</p>
              {selected && <SectionForm section={selected} updateData={updateData} />}
            </>}
            {panel === "theme" && <ThemePanel portfolio={portfolio} update={update} />}
            {panel === "settings" && <SettingsPanel portfolio={portfolio} update={update} publish={publish} copied={copied} />}
          </div>
        </aside>
        <section className="hidden min-h-0 overflow-auto p-5 md:block">
          <div className="mx-auto min-h-full max-w-[1280px] overflow-hidden rounded-xl border border-black/15 bg-white shadow-xl">
            <PortfolioView
              title={portfolio.title}
              theme={portfolio.theme}
              sections={portfolio.sections}
              preview
              onInlineEdit={(sectionId, field, value) => setPortfolio((current) => ({
                ...current,
                sections: current.sections.map((item) => item.id === sectionId ? { ...item, data: { ...item.data, [field]: value } } : item),
              }))}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionForm({ section, updateData }: {
  section: PortfolioSection;
  updateData: (patch: Partial<PortfolioSection["data"]>) => void;
}) {
  const changeItem = (index: number, patch: Record<string, string>) => updateData({ items: (section.data.items ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  const changeLink = (index: number, patch: Record<string, string>) => updateData({ links: (section.data.links ?? []).map((link, linkIndex) => linkIndex === index ? { ...link, ...patch } : link) });
  return <div className="mt-6 border-t border-black/10 pt-5">
    <p className="label text-[#6c5ce7]">Modifier · {sectionNames[section.type as ProductSectionType]}</p>
    <p className="mb-4 text-xs text-black/40">Les textes principaux sont aussi modifiables directement dans l’aperçu.</p>
    <div className="space-y-3">
      {section.type === "hero" && <>
        <Field label="Titre" value={section.data.heading} onChange={(heading) => updateData({ heading })} />
        <Field area label="Sous-titre" value={section.data.text} onChange={(text) => updateData({ text })} />
        <Field label="Libellé du bouton" value={section.data.cta} onChange={(cta) => updateData({ cta })} />
        <Field label="Lien du bouton" value={section.data.ctaUrl} onChange={(ctaUrl) => updateData({ ctaUrl })} placeholder="#contact ou https://…" />
        <Field label="URL de l’image (optionnel)" value={section.data.image} onChange={(image) => updateData({ image })} placeholder="https://…" />
      </>}
      {section.type === "about" && <>
        <Field label="Titre" value={section.data.heading} onChange={(heading) => updateData({ heading })} />
        <Field area label="Présentation" value={section.data.text} onChange={(text) => updateData({ text })} />
        <Field label="URL de l’image (optionnel)" value={section.data.image} onChange={(image) => updateData({ image })} placeholder="https://…" />
      </>}
      {section.type === "projects" && <>
        {(section.data.items ?? []).map((item, index) => <div key={index} className="rounded-xl bg-[#f4f2ec] p-3">
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-black">Élément {index + 1}</span><button onClick={() => updateData({ items: section.data.items?.filter((_, i) => i !== index) })} className="text-red-500"><X size={14} /></button></div>
          <div className="space-y-2"><Field label="Titre" value={item.title} onChange={(title) => changeItem(index, { title })} /><Field area label="Description" value={item.description} onChange={(description) => changeItem(index, { description })} /><Field label="URL de l’image" value={item.image} onChange={(image) => changeItem(index, { image })} /><Field label="Lien du projet" value={item.url} onChange={(url) => changeItem(index, { url })} /></div>
        </div>)}
        <button onClick={() => updateData({ items: [...(section.data.items ?? []), { title: "Nouvel élément", description: "" }] })} className="btn btn-light w-full !min-h-9 !py-1"><Plus size={14} /> Ajouter un élément</button>
      </>}
      {section.type === "contact" && <>
        <Field label="E-mail" value={section.data.email} onChange={(email) => updateData({ email })} />
        <Field label="Téléphone (optionnel)" value={section.data.phone} onChange={(phone) => updateData({ phone })} />
        {(section.data.links ?? []).map((link, index) => <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 rounded-xl bg-[#f4f2ec] p-3"><Field label="Libellé" value={link.label} onChange={(label) => changeLink(index, { label })} /><Field label="URL" value={link.url} onChange={(url) => changeLink(index, { url })} /><button aria-label="Supprimer le lien" onClick={() => updateData({ links: section.data.links?.filter((_, i) => i !== index) })} className="mt-4 text-red-500"><X size={14} /></button></div>)}
        <button onClick={() => updateData({ links: [...(section.data.links ?? []), { label: "Nouveau lien", url: "https://" }] })} className="btn btn-light w-full !min-h-9 !py-1"><Plus size={14} /> Ajouter un lien</button>
        <label className="flex items-center justify-between rounded-xl border border-black/10 p-3 text-sm font-bold"><span>Activer le formulaire de message</span><input type="checkbox" checked={section.data.messageEnabled ?? false} onChange={(event) => updateData({ messageEnabled: event.target.checked })} className="size-4 accent-black" /></label>
      </>}
    </div>
  </div>;
}

function Field({ label, value = "", onChange, area, placeholder }: { label: string; value?: string; onChange: (value: string) => void; area?: boolean; placeholder?: string }) {
  const props = { className: "input !rounded-lg !p-2 text-sm", value, placeholder, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) };
  return <label className="block"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/45">{label}</span>{area ? <textarea {...props} rows={3} /> : <input {...props} />}</label>;
}

function ThemePanel({ portfolio, update }: { portfolio: EditorPortfolio; update: (patch: Partial<EditorPortfolio>) => void }) {
  const theme = portfolio.theme;
  const setTheme = (patch: Partial<typeof theme>) => update({ theme: { ...theme, ...patch } });
  return <div>
    <p className="label text-[#6c5ce7]">Identité visuelle</p><h2 className="mb-6 text-2xl font-black">Faites-le vôtre.</h2>
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2">{([["primary", "Accent"], ["background", "Fond"], ["text", "Texte"]] as const).map(([key, label]) => <label key={key}><span className="mb-1 block text-[10px] font-bold uppercase">{label}</span><input type="color" className="h-11 w-full cursor-pointer rounded-lg border border-black/10 bg-white p-1" value={theme[key]} onChange={(event) => setTheme({ [key]: event.target.value })} /></label>)}</div>
      <Choice label="Typographie" value={theme.font} choices={[["sans", "Moderne"], ["serif", "Éditoriale"], ["mono", "Technique"]]} onChange={(font) => setTheme({ font: font as typeof theme.font })} />
      <Choice label="Densité" value={theme.density} choices={[["compact", "Compacte"], ["comfortable", "Confort"], ["airy", "Aérée"]]} onChange={(density) => setTheme({ density: density as typeof theme.density })} />
      <Choice label="Arrondis" value={theme.radius} choices={[["none", "Aucun"], ["soft", "Doux"], ["round", "Ronds"]]} onChange={(radius) => setTheme({ radius: radius as typeof theme.radius })} />
    </div>
  </div>;
}

function Choice({ label, value, choices, onChange }: { label: string; value: string; choices: string[][]; onChange: (value: string) => void }) {
  return <div><p className="label">{label}</p><div className="grid grid-cols-3 gap-2">{choices.map(([id, text]) => <button key={id} onClick={() => onChange(id)} className={`rounded-lg border p-2 text-xs font-bold ${value === id ? "border-black bg-black text-white" : "border-black/10"}`}>{text}</button>)}</div></div>;
}

function SettingsPanel({ portfolio, update, publish, copied }: { portfolio: EditorPortfolio; update: (patch: Partial<EditorPortfolio>) => void; publish: () => void; copied: boolean }) {
  return <div><p className="label text-[#6c5ce7]">Visibilité</p><h2 className="mb-6 text-2xl font-black">Prêt à être vu ?</h2>
    <Field label="Adresse publique" value={portfolio.slug} onChange={(slug) => update({ slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
    <p className="mt-1 text-xs text-black/40">/p/{portfolio.slug}</p>
    <div className={`mt-6 rounded-xl border p-4 ${portfolio.status === "published" ? "border-green-300 bg-green-50" : "border-black/10 bg-[#f4f2ec]"}`}>
      <span className="block font-black">{portfolio.status === "published" ? "Portfolio publié" : "Brouillon privé"}</span>
      <span className="text-xs opacity-60">{portfolio.status === "published" ? "La page publique est accessible à tous." : "La page publique reste inaccessible jusqu’à publication."}</span>
    </div>
    <button onClick={publish} className="btn btn-dark mt-6 w-full">{copied ? <><Copy size={16} /> Lien copié !</> : portfolio.status === "published" ? <><Copy size={16} /> Copier le lien public</> : <><Rocket size={16} /> Publier maintenant</>}</button>
  </div>;
}

function normalizeSections(sections: PortfolioSection[]): PortfolioSection[] {
  const sorted = [...sections].sort((a, b) => (a.order ?? sections.indexOf(a)) - (b.order ?? sections.indexOf(b)));
  const productSections = sorted.filter((item) => fixedTypes.includes(item.type as ProductSectionType));
  const fallbacks: Record<ProductSectionType, PortfolioSection["data"]> = {
    hero: { heading: "Votre grand titre", text: "Présentez votre univers.", cta: "Voir mes projets", ctaUrl: "#projets" },
    projects: { items: [{ title: "Premier projet", description: "Présentez ce que vous avez réalisé." }] },
    about: { heading: "À propos", text: "Racontez votre parcours et votre approche." },
    contact: { email: "vous@example.com", phone: "", links: [], messageEnabled: true },
  };
  for (const type of fixedTypes) {
    if (!productSections.some((item) => item.type === type)) {
      productSections.push({ id: crypto.randomUUID(), type, title: sectionNames[type], data: fallbacks[type] });
    }
  }
  return productSections.slice(0, 4).map((item, order) => ({ ...item, order }));
}
