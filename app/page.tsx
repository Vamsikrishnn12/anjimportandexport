import Link from "next/link";
import { ArrowUpRight, Check, Ship, Sprout, Wheat, PackageCheck } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

const categories = [
  { icon: Sprout, number: "01", title: "Fresh fruits", text: "Carefully sourced seasonal produce, selected for freshness and reliable transit." },
  { icon: Wheat, number: "02", title: "Vegetables & seeds", text: "Quality vegetables, agricultural seeds and planting materials for diverse requirements." },
  { icon: PackageCheck, number: "03", title: "Industry products", text: "Flexible sourcing support for general merchandise and industry-specific goods." },
];

export default function Home() {
  return (
    <SiteShell>
      <section className="hero section-shell">
        <div className="hero-copy reveal">
          <div className="eyebrow"><span /> Tamil Nadu to the world</div>
          <h1>Trade that moves <em>with purpose.</em></h1>
          <p className="hero-lede">ANJ Global connects dependable products with markets across India and beyond—from fresh produce and seeds to a broad range of commercial goods.</p>
          <div className="hero-actions">
            <Link href="/products" className="button button-gold">Explore products <ArrowUpRight size={17} /></Link>
            <Link href="/contact" className="text-link">Start an enquiry <span>↗</span></Link>
          </div>
          <div className="trust-row">
            <div><strong>Pan-India</strong><span>Trade network</span></div>
            <div><strong>Multi-sector</strong><span>Product sourcing</span></div>
            <div><strong>End-to-end</strong><span>Shipment support</span></div>
          </div>
        </div>

        <div className="hero-visual reveal delay-1">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="visual-card">
            <img src="/anj-global-logistics.jpeg" alt="Global freight by air, sea and road" />
          </div>
          <div className="floating-tag tag-top"><span className="pulse" /> Live trade routes</div>
          <div className="floating-tag tag-bottom"><Ship size={18} /> Sea · Air · Road</div>
        </div>
      </section>

      <section className="marquee" aria-label="Our capabilities"><div>FRESH PRODUCE <i>✦</i> GLOBAL SOURCING <i>✦</i> EXPORT SUPPORT <i>✦</i> QUALITY FOCUSED <i>✦</i> PAN-INDIA NETWORK <i>✦</i></div></section>

      <section className="section-shell section-pad">
        <div className="section-head">
          <div><span className="kicker">What we move</span><h2>Products with a clear path to market.</h2></div>
          <p>From farm-led categories to industry requirements, our sourcing network is built to respond with care, clarity and dependable coordination.</p>
        </div>
        <div className="category-grid">
          {categories.map(({ icon: Icon, number, title, text }) => (
            <article className="category-card" key={title}>
              <div className="card-top"><span>{number}</span><Icon /></div>
              <h3>{title}</h3><p>{text}</p>
              <Link href="/products" aria-label={`View ${title}`}>View range <ArrowUpRight size={16} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-section">
        <div className="section-shell split-story">
          <div className="story-visual">
            <img src="/anj-global-mark.jpeg" alt="ANJ Global trade identity" />
            <div className="route-line"><span /><span /><span /></div>
          </div>
          <div className="story-copy">
            <span className="kicker kicker-light">How we work</span>
            <h2>One partner.<br />Every moving part.</h2>
            <p>We bring sourcing, coordination and shipment support into one responsive workflow—so every consignment keeps moving with fewer surprises.</p>
            <ul>
              {['Requirement-led product sourcing','Quality and documentation checks','Logistics coordination across modes','Clear communication from origin to destination'].map(x => <li key={x}><Check size={15} />{x}</li>)}
            </ul>
            <Link href="/services" className="button button-light">See our process <ArrowUpRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="section-shell cta-band">
        <div><span className="kicker">Let’s move business forward</span><h2>Have a product or market in mind?</h2></div>
        <Link href="/contact" className="button button-dark">Talk to our team <ArrowUpRight size={17} /></Link>
      </section>
    </SiteShell>
  );
}
