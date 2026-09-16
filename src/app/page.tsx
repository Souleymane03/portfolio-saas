import { ArrowRight, Blocks, Eye, Palette, Sparkles } from "lucide-react";
import Link from "next/link";
import { templates } from "@/lib/templates";

export default function Home() {
  return (
    <main className="noise overflow-hidden">
      <section className="container-app grid min-h-[78vh] items-center gap-14 py-20 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <div className="mb-7 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border border-black bg-[#d8ff5f] px-4 py-2 text-sm font-bold">
            <Sparkles size={16} /> Le portfolio qui ne vous met pas dans une case
          </div>
          <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7.8rem)] font-black leading-[.83] tracking-[-.075em]">
            Montrez ce que vous savez <span className="text-[#6c5ce7]">faire.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/65">
            Un éditeur flexible pour designers, développeurs, photographes, freelances et esprits inclassables. Publiez en quelques minutes.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/signup" className="btn btn-dark">Commencer gratuitement <ArrowRight size={18} /></Link>
            <a href="#templates" className="btn btn-light">Voir les modèles</a>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-black/40">Sans carte bancaire · Modifiable à volonté</p>
        </div>
        <div className="relative mx-auto w-full max-w-[540px]">
          <div className="absolute -left-8 top-12 h-44 w-44 rounded-full bg-[#ff795e] blur-3xl opacity-45" />
          <div className="absolute -right-6 bottom-5 h-52 w-52 rounded-full bg-[#9a8cff] blur-3xl opacity-45" />
          <div className="relative rotate-[2deg] rounded-[28px] border-2 border-black bg-white p-3 shadow-[12px_12px_0_#171717]">
            <div className="flex items-center gap-2 border-b border-black/10 px-2 pb-3">
              <span className="size-3 rounded-full bg-[#ff665a]" /><span className="size-3 rounded-full bg-[#ffc04d]" /><span className="size-3 rounded-full bg-[#65c466]" />
              <span className="ml-3 rounded-md bg-black/5 px-4 py-1 text-[10px] text-black/40">folio.app/p/votre-nom</span>
            </div>
            <div className="grid min-h-[420px] place-content-center rounded-b-2xl bg-[#161616] p-10 text-white">
              <span className="mb-5 text-xs font-bold uppercase tracking-[.3em] text-[#d8ff5f]">Designer indépendant</span>
              <h2 className="text-5xl font-black leading-none">Des idées<br />qui prennent<br /><i className="font-serif font-normal">forme.</i></h2>
              <div className="mt-10 grid grid-cols-2 gap-3">
                <div className="h-24 bg-[#ff795e]" /><div className="h-24 bg-[#8b7cf6]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black bg-black py-7 text-white">
        <div className="container-app flex flex-wrap justify-center gap-x-14 gap-y-4 text-sm font-bold uppercase tracking-[.18em]">
          <span>Créatifs</span><span className="text-[#d8ff5f]">✦</span><span>Freelances</span><span className="text-[#d8ff5f]">✦</span><span>Développeurs</span><span className="text-[#d8ff5f]">✦</span><span>Photographes</span>
        </div>
      </section>

      <section id="templates" className="container-app py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div><p className="label text-[#6c5ce7]">Point de départ</p><h2 className="text-4xl font-black tracking-tight md:text-6xl">Un modèle. Votre univers.</h2></div>
          <p className="max-w-sm text-black/55">Chaque modèle est entièrement modulable : contenu, ordre, couleurs et rythme.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {templates.map((template, index) => (
            <div key={template.id} className="card group overflow-hidden">
              <div className="flex h-48 items-end p-5 transition-transform group-hover:scale-[1.02]" style={{ background: template.theme.background, color: template.theme.text }}>
                <div className="w-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: template.accent }}>{template.id.replace("_", " · ")}</span>
                  <div className="mt-3 text-3xl font-black">{index === 0 ? "Make it memorable." : index === 1 ? "STORIES / 26" : index === 2 ? "Hello, je crée." : "Vos mots comptent."}</div>
                  <div className="mt-5 h-1 w-12" style={{ background: template.accent }} />
                </div>
              </div>
              <div className="p-5"><h3 className="text-xl font-black">{template.name} <span className="text-xs font-semibold text-black/35">· {template.genre}</span></h3><p className="mt-2 text-sm leading-relaxed text-black/55">{template.description}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#6c5ce7] py-24 text-white">
        <div className="container-app">
          <p className="label text-[#d8ff5f]">Tout ce qu’il faut</p>
          <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">Simple à créer. Impossible à oublier.</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              [Blocks, "Des blocs flexibles", "Ajoutez, déplacez ou retirez chaque section selon votre histoire."],
              [Palette, "Votre identité", "Couleurs, typographie, densité : faites un site qui vous ressemble."],
              [Eye, "Toujours en direct", "Voyez chaque changement instantanément avant de le publier."],
            ].map(([Icon, title, text]) => {
              const FeatureIcon = Icon as typeof Blocks;
              return <div key={String(title)} className="border-t border-white/30 pt-6"><FeatureIcon className="mb-8 text-[#d8ff5f]" size={30} /><h3 className="text-xl font-bold">{String(title)}</h3><p className="mt-3 text-white/70">{String(text)}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section className="container-app py-24 text-center">
        <h2 className="text-5xl font-black tracking-tight md:text-7xl">Votre travail mérite<br /><span className="font-serif font-normal italic">sa propre adresse.</span></h2>
        <Link href="/signup" className="btn btn-dark mt-9">Créer mon portfolio <ArrowRight size={18} /></Link>
      </section>
    </main>
  );
}
