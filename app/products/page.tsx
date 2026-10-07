import { Apple, Carrot, Flower2, Package, Wheat, Factory, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";

const products = [
  [Apple,"Fresh fruits",["Banana & mango","Pomegranate & grapes","Seasonal varieties"]],
  [Carrot,"Vegetables",["Onion & potato","Leafy and field vegetables","Requirement-based sourcing"]],
  [Flower2,"Seeds",["Vegetable seeds","Agricultural seeds","Commercial planting needs"]],
  [Wheat,"Food & spices",["Whole spices","Grains and pulses","Packaged food goods"]],
  [Factory,"Industry goods",["Business supplies","Industrial products","Buyer-specified goods"]],
  [Package,"Other products",["General merchandise","Custom sourcing","Mixed consignments"]],
];

export default function Products() { return <SiteShell>
  <PageHero eyebrow="Product portfolio" title="Sourcing across seasons, sectors and markets." intro="Our broad network lets us respond to everyday staples, specialist requirements and buyer-led sourcing requests." />
  <section className="section-shell section-pad product-grid">{products.map(([Icon,title,items],i)=>{ const I=Icon as typeof Apple; return <article className="product-card" key={title as string}><div className="product-icon"><I/></div><span>0{i+1}</span><h2>{title as string}</h2><ul>{(items as string[]).map(x=><li key={x}><Check size={14}/>{x}</li>)}</ul></article>})}</section>
  <section className="dark-section product-note"><div className="section-shell"><div><span className="kicker kicker-light">Need something else?</span><h2>Tell us what you are looking for.</h2></div><p>Our portfolio is not limited to the categories shown here. Share the specification, volume and destination, and our team can explore the right sourcing path.</p><a className="button button-light" href="/contact">Request sourcing</a></div></section>
</SiteShell> }
