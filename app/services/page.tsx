import { Search, BadgeCheck, FileCheck2, Ship, MapPinned, ArrowDown } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";

const steps = [
  [Search,"01","Understand & source","We begin with your product, quality, volume and destination requirements, then identify suitable supply options."],
  [BadgeCheck,"02","Verify & prepare","Product specifications, packing expectations and quality requirements are aligned before movement."],
  [FileCheck2,"03","Document & coordinate","We support the paperwork and coordination needed to keep the transaction clear and organised."],
  [Ship,"04","Move by the right mode","Sea, air or road movement is coordinated around the product, destination and timeline."],
  [MapPinned,"05","Track to destination","Responsive communication helps buyers and suppliers stay informed through the shipment journey."],
];

export default function Services() { return <SiteShell>
  <PageHero eyebrow="Trade services" title="From requirement to destination, one coordinated flow." intro="ANJ Global supports the essential stages of import and export so buyers and suppliers can focus on the business ahead." />
  <section className="section-shell process section-pad"><div className="process-intro"><span className="kicker">Our process</span><h2>Five clear stages.<br/>One accountable partner.</h2><p>Every consignment is different. Our workflow stays structured while adapting to the product and market.</p></div><div className="process-list">{steps.map(([Icon,n,title,text],i)=>{ const I=Icon as typeof Search; return <article key={n as string}><div className="step-icon"><I/></div><div><span>{n as string}</span><h3>{title as string}</h3><p>{text as string}</p></div>{i<steps.length-1&&<ArrowDown className="step-arrow"/>}</article>})}</div></section>
  <section className="mode-strip"><div className="section-shell"><div><strong>Sea freight</strong><span>For planned, volume-led movement</span></div><div><strong>Air freight</strong><span>For urgent and time-sensitive goods</span></div><div><strong>Road network</strong><span>For movement across Tamil Nadu and India</span></div></div></section>
</SiteShell> }
