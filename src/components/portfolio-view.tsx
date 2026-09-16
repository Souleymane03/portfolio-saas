import type { CSSProperties } from "react";
import type { PortfolioSection, PortfolioTheme } from "@/lib/types";

const fonts = {
  sans: "Arial, Helvetica, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'Courier New', monospace",
};
const spacing = { compact: "clamp(48px, 7vw, 80px)", comfortable: "clamp(64px, 9vw, 120px)", airy: "clamp(88px, 12vw, 170px)" };
const radii = { none: "0px", soft: "16px", round: "34px" };

export function PortfolioView({ title, theme, sections, preview = false, onInlineEdit }: {
  title: string;
  theme: PortfolioTheme;
  sections: PortfolioSection[];
  preview?: boolean;
  onInlineEdit?: (sectionId: string, field: "heading" | "text", value: string) => void;
}) {
  const style = {
    "--pf-primary": theme.primary,
    "--pf-bg": theme.background,
    "--pf-text": theme.text,
    "--pf-space": spacing[theme.density],
    "--pf-radius": radii[theme.radius],
    background: theme.background,
    color: theme.text,
    fontFamily: fonts[theme.font],
  } as CSSProperties;
  return (
    <div style={style} className={`min-h-full overflow-hidden ${preview ? "text-[11px]" : ""}`}>
      <div className="mx-auto max-w-[1200px] px-[clamp(24px,6vw,80px)]">
        <header className="flex items-center justify-between border-b border-current/15 py-6">
          <strong className="tracking-tight">{title}</strong>
          <nav className="flex gap-5 text-[.72em] font-bold uppercase tracking-wider">
            {sections.slice(1, 5).map((item) => <span key={item.id}>{item.title}</span>)}
          </nav>
        </header>
        {sections.map((section) => <PortfolioSectionView section={section} key={section.id} onInlineEdit={onInlineEdit} />)}
        <footer className="flex justify-between border-t border-current/15 py-8 text-[.7em] opacity-60"><span>© {new Date().getFullYear()} {title}</span><span>Créé avec folio.</span></footer>
      </div>
    </div>
  );
}

function PortfolioSectionView({ section, onInlineEdit }: { section: PortfolioSection; onInlineEdit?: (sectionId: string, field: "heading" | "text", value: string) => void }) {
  const { data, type } = section;
  if (type === "hero") return (
    <section id="hero" style={{ paddingBlock: "var(--pf-space)" }} className="relative min-h-[60vh] content-center">
      {data.image && <div className="absolute inset-y-[8%] right-0 -z-0 w-[42%] bg-cover bg-center opacity-30" style={{ borderRadius: "var(--pf-radius)", backgroundImage: `url("${data.image.replaceAll('"', "%22")}")` }} />}
      <div className="relative z-10">
      {data.eyebrow && <p className="mb-[1.5em] text-[.72em] font-bold uppercase tracking-[.2em]" style={{ color: "var(--pf-primary)" }}>{data.eyebrow}</p>}
      <InlineText tag="h1" className="max-w-[950px] text-[clamp(3.4em,8vw,8.5em)] font-black leading-[.9] tracking-[-.055em]" value={data.heading} sectionId={section.id} field="heading" onEdit={onInlineEdit} />
      {data.text && <InlineText tag="p" className="mt-[2em] max-w-[650px] text-[clamp(1em,1.5vw,1.35em)] leading-relaxed opacity-70" value={data.text} sectionId={section.id} field="text" onEdit={onInlineEdit} />}
      {data.cta && <a href={data.ctaUrl || "#contact"} onClick={(event) => onInlineEdit && event.preventDefault()} className="mt-[2.2em] inline-block border-b-2 pb-1 text-[.85em] font-bold" style={{ borderColor: "var(--pf-primary)" }}>{data.cta} ↗</a>}
      </div>
    </section>
  );
  if (type === "projects") return (
    <section id="projets" style={{ paddingBlock: "var(--pf-space)" }}>
      <SectionTitle title={section.title} />
      <div className="grid grid-cols-1 gap-[clamp(18px,3vw,40px)] md:grid-cols-2">
        {(data.items ?? []).map((item, index) => (
          <article key={index} className={index === 0 && (data.items?.length ?? 0) > 2 ? "md:col-span-2" : ""}>
            {item.image && <div className="aspect-[4/3] bg-cover bg-center" style={{ borderRadius: "var(--pf-radius)", backgroundImage: `url("${item.image.replaceAll('"', "%22")}")` }} />}
            <p className="mt-[1em] text-[.7em] font-bold uppercase tracking-widest opacity-55">{item.subtitle}</p>
            <h3 className="mt-[.3em] text-[clamp(1.5em,3vw,2.6em)] font-bold">{item.url ? <a href={item.url} onClick={(event) => onInlineEdit && event.preventDefault()}>{item.title} ↗</a> : item.title}</h3>
            {item.description && <p className="mt-[.6em] max-w-xl leading-relaxed opacity-65">{item.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
  if (type === "skills") return (
    <section style={{ paddingBlock: "var(--pf-space)" }}><SectionTitle title={section.title} />
      <div className="flex flex-wrap gap-[.7em]">{(data.items ?? []).map((item, index) => <span key={index} className="rounded-full border border-current/25 px-[1.2em] py-[.7em] font-bold">{item.title}</span>)}</div>
    </section>
  );
  if (type === "experience" || type === "testimonials") return (
    <section style={{ paddingBlock: "var(--pf-space)" }}><SectionTitle title={section.title} />
      <div className="divide-y divide-current/15 border-y border-current/15">
        {(data.items ?? []).map((item, index) => <article key={index} className="grid gap-[1em] py-[2em] md:grid-cols-[1fr_2fr]"><div><h3 className="text-[1.2em] font-bold">{item.title}</h3><p className="mt-1 text-[.75em] opacity-50">{item.subtitle}</p></div><p className="max-w-2xl leading-relaxed opacity-70">{item.description}</p></article>)}
      </div>
    </section>
  );
  if (type === "contact") return (
    <section id="contact" style={{ paddingBlock: "var(--pf-space)" }} className="text-center">
      <p className="text-[.72em] font-bold uppercase tracking-[.2em]" style={{ color: "var(--pf-primary)" }}>{section.title}</p>
      <h2 className="mx-auto mt-[.5em] max-w-4xl text-[clamp(3em,7vw,7em)] font-black leading-none">{data.text ?? "Parlons de votre projet."}</h2>
      {data.email && <a className="mt-[2em] inline-block text-[1.1em] font-bold underline underline-offset-8" href={`mailto:${data.email}`}>{data.email}</a>}
      {data.phone && <a className="ml-[1.5em] mt-[2em] inline-block text-[1.1em] font-bold underline underline-offset-8" href={`tel:${data.phone}`}>{data.phone}</a>}
      {!!data.links?.length && <div className="mt-[2em] flex justify-center gap-[1.5em]">{data.links.map((link, index) => <a key={index} className="text-[.8em] font-bold uppercase tracking-wider" href={link.url}>{link.label} ↗</a>)}</div>}
      {data.messageEnabled && <form action={`mailto:${data.email ?? ""}`} method="post" encType="text/plain" className="mx-auto mt-[3em] grid max-w-xl gap-[1em] text-left" onSubmit={onInlineEdit ? (event) => event.preventDefault() : undefined}><input name="email" type="email" required placeholder="Votre e-mail" className="rounded-[var(--pf-radius)] border border-current/20 bg-transparent p-[1em]" /><textarea name="message" required placeholder="Votre message" rows={3} className="rounded-[var(--pf-radius)] border border-current/20 bg-transparent p-[1em]" /><button className="justify-self-start rounded-full px-[1.4em] py-[.8em] font-bold" style={{ background: "var(--pf-primary)", color: "var(--pf-bg)" }}>Envoyer</button></form>}
    </section>
  );
  if (type === "about") return (
    <section id="apropos" style={{ paddingBlock: "var(--pf-space)" }} className="grid gap-[2em] md:grid-cols-[1fr_2fr]">
      <SectionTitle title={section.title} />
      <div>
        {data.heading && <InlineText tag="h3" className="mb-[.7em] text-[clamp(2em,4vw,4em)] font-bold leading-tight" value={data.heading} sectionId={section.id} field="heading" onEdit={onInlineEdit} />}
        <InlineText tag="p" className="whitespace-pre-line text-[clamp(1em,1.5vw,1.3em)] leading-relaxed opacity-70" value={data.text} sectionId={section.id} field="text" onEdit={onInlineEdit} />
        {data.image && <div className="mt-[2em] aspect-video bg-cover bg-center" style={{ borderRadius: "var(--pf-radius)", backgroundImage: `url("${data.image.replaceAll('"', "%22")}")` }} />}
      </div>
    </section>
  );
  return (
    <section style={{ paddingBlock: "var(--pf-space)" }} className="grid gap-[2em] md:grid-cols-[1fr_2fr]">
      <SectionTitle title={section.title} />
      <div>{data.heading && <h3 className="mb-[.7em] text-[clamp(2em,4vw,4em)] font-bold leading-tight">{data.heading}</h3>}<p className="whitespace-pre-line text-[clamp(1em,1.5vw,1.3em)] leading-relaxed opacity-70">{data.text}</p>
      {data.image && <div className="mt-[2em] aspect-video bg-cover bg-center" style={{ borderRadius: "var(--pf-radius)", backgroundImage: `url("${data.image.replaceAll('"', "%22")}")` }} />}</div>
    </section>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="mb-[2em] text-[.72em] font-bold uppercase tracking-[.22em]" style={{ color: "var(--pf-primary)" }}>{title}</h2>;
}

function InlineText({ tag: Tag, className, value = "", sectionId, field, onEdit }: {
  tag: "h1" | "h3" | "p";
  className: string;
  value?: string;
  sectionId: string;
  field: "heading" | "text";
  onEdit?: (sectionId: string, field: "heading" | "text", value: string) => void;
}) {
  return (
    <Tag
      className={`${className} ${onEdit ? "cursor-text rounded-sm outline-none transition hover:ring-2 hover:ring-[var(--pf-primary)] focus:ring-2 focus:ring-[var(--pf-primary)]" : ""}`}
      contentEditable={Boolean(onEdit)}
      suppressContentEditableWarning
      onBlur={(event) => onEdit?.(sectionId, field, event.currentTarget.textContent ?? "")}
    >
      {value}
    </Tag>
  );
}
