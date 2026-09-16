"use client";

import { ArrowDown, ArrowLeft, ArrowUp, Check, ExternalLink, GripVertical, LoaderCircle, Monitor, Palette, Plus, Save, Settings2, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { defaultSection } from "@/lib/templates";
import type { Portfolio, PortfolioSection, PortfolioStatus, SectionType } from "@/lib/types";
import { PortfolioView } from "./portfolio-view";

const sectionNames: Record<SectionType, string> = {
  hero: "Hero", about: "À propos", projects: "Projets / Galerie", experience: "Expérience",
  skills: "Compétences", testimonials: "Témoignages", contact: "Contact", custom: "Texte / Image",
};
const itemSections: SectionType[] = ["projects", "experience", "skills", "testimonials"];

type EditorPortfolio = Omit<Portfolio, "createdAt" | "updatedAt">;

export function PortfolioEditor({ initialPortfolio }: { initialPortfolio: EditorPortfolio }) {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [selectedId, setSelectedId] = useState(initialPortfolio.sections[0]?.id);
  const [panel, setPanel] = useState<"content" | "theme" | "settings">("content");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const selected = useMemo(() => portfolio.sections.find((item) => item.id === selectedId), [portfolio.sections, selectedId]);

  const update = (patch: Partial<EditorPortfolio>) => setPortfolio((current) => ({ ...current, ...patch }));
  const updateSection = (patch: Partial<PortfolioSection>) => update({ sections: portfolio.sections.map((item) => item.id === selectedId ? { ...item, ...patch } : item) });
  const updateData = (patch: Partial<PortfolioSection["data"]>) => selected && updateSection({ data: { ...selected.data, ...patch } });

  function move(id: string, direction: -1 | 1) {
    const sections = [...portfolio.sections];
    const from = sections.findIndex((item) => item.id === id);
    const to = from + direction;
    if (to < 0 || to >= sections.length) return;
    [sections[from], sections[to]] = [sections[to], sections[from]];
    update({ sections });
  }

  function addSection(type: SectionType) {
    const created = defaultSection(type);
    update({ sections: [...portfolio.sections, created] });
    setSelectedId(created.id);
  }

  function removeSection(id: string) {
    const sections = portfolio.sections.filter((item) => item.id !== id);
    update({ sections });
    if (selectedId === id) setSelectedId(sections[0]?.id);
  }

  async function save() {
    setSaving(true); setSaved(false); setError("");
    const response = await fetch(`/api/portfolios/${portfolio.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: portfolio.title, slug: portfolio.slug, status: portfolio.status, theme: portfolio.theme, sections: portfolio.sections }),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) return setError(data.error ?? "Enregistrement impossible.");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <main className="fixed inset-0 z-[60] flex flex-col bg-[#efede7]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/10 bg-white px-3 md:px-5">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="grid size-9 place-items-center rounded-full border border-black/15" aria-label="Retour"><ArrowLeft size={17} /></Link>
          <div><input aria-label="Nom du portfolio" className="max-w-36 font-black outline-none md:max-w-xs" value={portfolio.title} onChange={(event) => update({ title: event.target.value })} /><p className="text-[10px] font-semibold uppercase tracking-wider text-black/35">{portfolio.status === "published" ? "Publié" : portfolio.status === "unlisted" ? "Non répertorié" : "Brouillon"}</p></div>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="hidden text-xs font-semibold text-red-600 md:inline">{error}</span>}
          {portfolio.status !== "draft" && <Link target="_blank" href={`/p/${portfolio.slug}`} className="btn btn-light !min-h-9 !px-3 !py-1"><ExternalLink size={15} /><span className="hidden sm:inline">Voir</span></Link>}
          <button onClick={save} disabled={saving} className="btn btn-dark !min-h-9 !px-4 !py-1">{saving ? <LoaderCircle className="animate-spin" size={16} /> : saved ? <Check size={16} /> : <Save size={16} />}<span className="hidden sm:inline">{saved ? "Enregistré" : "Enregistrer"}</span></button>
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
                {portfolio.sections.map((section, index) => (
                  <div key={section.id} className={`group flex items-center gap-1 rounded-xl border p-1.5 ${selectedId === section.id ? "border-black bg-[#f7f5ef]" : "border-black/10"}`}>
                    <button onClick={() => setSelectedId(section.id)} className="flex min-w-0 flex-1 items-center gap-2 p-1.5 text-left text-sm font-bold"><GripVertical size={15} className="shrink-0 text-black/30" /><span className="truncate">{section.title || sectionNames[section.type]}</span></button>
                    <button onClick={() => move(section.id, -1)} disabled={index === 0} className="p-1 disabled:opacity-20" aria-label="Monter"><ArrowUp size={14} /></button>
                    <button onClick={() => move(section.id, 1)} disabled={index === portfolio.sections.length - 1} className="p-1 disabled:opacity-20" aria-label="Descendre"><ArrowDown size={14} /></button>
                    <button onClick={() => removeSection(section.id)} className="p-1 text-red-500" aria-label="Supprimer"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <details className="mt-3">
                <summary className="btn btn-light w-full list-none !min-h-10 !py-1"><Plus size={15} /> Ajouter une section</summary>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-[#f4f2ec] p-2">
                  {(Object.keys(sectionNames) as SectionType[]).map((type) => <button key={type} onClick={() => addSection(type)} className="rounded-lg bg-white p-2 text-left text-xs font-bold hover:bg-[#d8ff5f]">{sectionNames[type]}</button>)}
                </div>
              </details>
              {selected && <SectionForm section={selected} updateSection={updateSection} updateData={updateData} />}
            </>}
            {panel === "theme" && <ThemePanel portfolio={portfolio} update={update} />}
            {panel === "settings" && <SettingsPanel portfolio={portfolio} update={update} save={save} />}
          </div>
        </aside>
        <section className="hidden min-h-0 overflow-auto p-5 md:block">
          <div className="mx-auto min-h-full max-w-[1280px] overflow-hidden rounded-xl border border-black/15 bg-white shadow-xl">
            <PortfolioView title={portfolio.title} theme={portfolio.theme} sections={portfolio.sections} preview />
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionForm({ section, updateSection, updateData }: {
  section: PortfolioSection;
  updateSection: (patch: Partial<PortfolioSection>) => void;
  updateData: (patch: Partial<PortfolioSection["data"]>) => void;
}) {
  const changeItem = (index: number, patch: Record<string, string>) => updateData({ items: (section.data.items ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  return <div className="mt-6 border-t border-black/10 pt-5">
    <p className="label text-[#6c5ce7]">Modifier · {sectionNames[section.type]}</p>
    <div className="space-y-3">
      <Field label="Titre de section" value={section.title} onChange={(value) => updateSection({ title: value })} />
      {section.type === "hero" && <Field label="Sur-titre" value={section.data.eyebrow} onChange={(eyebrow) => updateData({ eyebrow })} />}
      {!itemSections.includes(section.type) && section.type !== "contact" && <Field label="Grand titre" value={section.data.heading} onChange={(heading) => updateData({ heading })} />}
      {!itemSections.includes(section.type) && <Field area label="Texte" value={section.data.text} onChange={(text) => updateData({ text })} />}
      {(section.type === "hero") && <Field label="Appel à l’action" value={section.data.cta} onChange={(cta) => updateData({ cta })} />}
      {(section.type === "about" || section.type === "custom") && <Field label="URL de l’image" value={section.data.image} onChange={(image) => updateData({ image })} placeholder="https://…" />}
      {section.type === "contact" && <><Field label="E-mail" value={section.data.email} onChange={(email) => updateData({ email })} /><Field label="Lieu" value={section.data.location} onChange={(location) => updateData({ location })} /></>}
      {itemSections.includes(section.type) && <>
        {(section.data.items ?? []).map((item, index) => <div key={index} className="rounded-xl bg-[#f4f2ec] p-3">
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-black">Élément {index + 1}</span><button onClick={() => updateData({ items: section.data.items?.filter((_, i) => i !== index) })} className="text-red-500"><X size={14} /></button></div>
          <div className="space-y-2"><Field label="Titre" value={item.title} onChange={(title) => changeItem(index, { title })} /><Field label="Sous-titre" value={item.subtitle} onChange={(subtitle) => changeItem(index, { subtitle })} /><Field area label="Description" value={item.description} onChange={(description) => changeItem(index, { description })} />{section.type === "projects" && <Field label="URL de l’image" value={item.image} onChange={(image) => changeItem(index, { image })} />}</div>
        </div>)}
        <button onClick={() => updateData({ items: [...(section.data.items ?? []), { title: "Nouvel élément", description: "" }] })} className="btn btn-light w-full !min-h-9 !py-1"><Plus size={14} /> Ajouter un élément</button>
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

function SettingsPanel({ portfolio, update, save }: { portfolio: EditorPortfolio; update: (patch: Partial<EditorPortfolio>) => void; save: () => void }) {
  return <div><p className="label text-[#6c5ce7]">Visibilité</p><h2 className="mb-6 text-2xl font-black">Prêt à être vu ?</h2>
    <Field label="Adresse publique" value={portfolio.slug} onChange={(slug) => update({ slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
    <p className="mt-1 text-xs text-black/40">/p/{portfolio.slug}</p>
    <div className="mt-6 space-y-2">{([
      ["draft", "Brouillon", "Visible par vous uniquement."],
      ["unlisted", "Non répertorié", "Accessible avec le lien, absent des moteurs de recherche."],
      ["published", "Publié", "Public et indexable."],
    ] as [PortfolioStatus, string, string][]).map(([status, title, text]) => <button key={status} onClick={() => update({ status })} className={`w-full rounded-xl border p-4 text-left ${portfolio.status === status ? "border-black bg-[#d8ff5f]" : "border-black/10"}`}><span className="block font-black">{title}</span><span className="text-xs opacity-60">{text}</span></button>)}</div>
    <button onClick={save} className="btn btn-dark mt-6 w-full">{portfolio.status === "published" ? "Enregistrer la publication" : "Enregistrer"}</button>
  </div>;
}
