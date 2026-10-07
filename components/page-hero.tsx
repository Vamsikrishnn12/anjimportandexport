export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <section className="page-hero section-shell"><div className="eyebrow"><span />{eyebrow}</div><h1>{title}</h1><p>{intro}</p><div className="page-hero-orbit" /></section>
}
