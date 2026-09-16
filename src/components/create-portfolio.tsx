"use client";

import { ArrowRight, Check, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { templates } from "@/lib/templates";

export function CreatePortfolio({ triggerClass = "" }: { triggerClass?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(templates[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.get("title"), slug: form.get("slug"), template: selected }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Impossible de créer le portfolio.");
      setLoading(false);
      return;
    }
    router.push(`/editor/${data.id}`);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={`btn btn-dark ${triggerClass}`}>Nouveau portfolio <ArrowRight size={17} /></button>
      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/65 p-4 backdrop-blur-sm">
          <div className="mx-auto my-5 max-w-4xl rounded-3xl bg-[#f7f5ef] p-6 shadow-2xl md:p-9">
            <div className="flex items-start justify-between">
              <div><p className="label text-[#6c5ce7]">Nouveau portfolio</p><h2 className="text-3xl font-black">Choisissez votre point de départ</h2></div>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="grid size-10 place-items-center rounded-full border border-black/15 bg-white"><X /></button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {templates.map((template) => (
                <button type="button" key={template.id} onClick={() => setSelected(template.id)} className={`overflow-hidden rounded-xl border-2 text-left transition ${selected === template.id ? "border-black shadow-[4px_4px_0_#171717]" : "border-transparent"}`}>
                  <div className="h-28 p-4 text-xl font-black" style={{ background: template.theme.background, color: template.theme.text }}>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: template.accent }}>{template.genre}</span><br />{template.name}
                  </div>
                  <div className="flex items-center justify-between bg-white p-3"><span className="text-sm font-bold">{template.name}</span>{selected === template.id && <Check size={16} />}</div>
                </button>
              ))}
            </div>
            <form onSubmit={create} className="mt-8 grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]">
              <label><span className="label">Nom du portfolio</span><input className="input" name="title" required placeholder="Mon portfolio 2026" /></label>
              <label><span className="label">Adresse souhaitée (optionnel)</span><div className="flex items-center rounded-[10px] border border-[#c9c6bd] bg-white pl-3 text-sm text-black/40"><span>/p/</span><input name="slug" pattern="[a-z0-9-]*" className="w-full bg-transparent p-3 pl-1 outline-none" placeholder="camille-design" /></div></label>
              <button disabled={loading} className="btn btn-dark">{loading ? <LoaderCircle className="animate-spin" /> : "Continuer"}</button>
            </form>
            {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
