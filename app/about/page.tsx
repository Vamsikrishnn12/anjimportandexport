import { Eye, Handshake, ShieldCheck, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";

const values = [
  [ShieldCheck, "Reliability", "Practical coordination, clear updates and careful follow-through at every stage."],
  [Eye, "Transparency", "Straightforward communication on requirements, documentation and movement."],
  [Handshake, "Partnership", "Long-term relationships with suppliers, buyers and logistics partners."],
  [TrendingUp, "Progress", "A flexible network that helps businesses access new products and markets."],
];

export default function About() { return <SiteShell>
  <PageHero eyebrow="Our company" title="Built to connect opportunity with movement." intro="ANJ Global Import & Export is a Tamil Nadu-based trading company serving businesses across India and international markets." />
  <section className="section-shell about-grid section-pad">
    <div className="about-image"><img src="/anj-global-logo-square.jpeg" alt="ANJ Global logo and international trade mark" /><div className="image-caption">India rooted · Globally minded</div></div>
    <div className="about-copy"><span className="kicker">Our approach</span><h2>Trade made more human.</h2><p>Successful trade depends on more than moving goods. It requires dependable relationships, good information and careful attention from the first enquiry to final delivery.</p><p>Our team works across product categories—from fruits, vegetables and seeds to other commercial and industry goods—bringing each requirement the right sourcing and shipment approach.</p><blockquote>“Every shipment is a promise between two businesses. We help keep that promise moving.”</blockquote></div>
  </section>
  <section className="soft-section section-pad"><div className="section-shell"><div className="section-head"><div><span className="kicker">What guides us</span><h2>Grounded values. Global outlook.</h2></div></div><div className="value-grid">{values.map(([Icon, title, text]) => { const I = Icon as typeof Eye; return <article key={title as string}><I/><h3>{title as string}</h3><p>{text as string}</p></article> })}</div></div></section>
</SiteShell> }
