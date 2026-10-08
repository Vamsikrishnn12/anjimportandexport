"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import "./flowing-menu.css";

export type FlowingMenuItem = { link: string; text: string; image: string };

type FlowingMenuProps = {
  items?: FlowingMenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
};

export default function FlowingMenu({
  items = [], speed = 15, textColor = "#f6f7f4", bgColor = "#091d28",
  marqueeBgColor = "#f28b57", marqueeTextColor = "#091d28",
  borderColor = "rgba(255,255,255,.16)",
}: FlowingMenuProps) {
  return <div className="flowing-menu-wrap" style={{backgroundColor:bgColor}}>
    <nav className="flowing-menu" aria-label="Product categories">{items.map(item=><FlowingMenuRow
      key={item.text} {...item} speed={speed} textColor={textColor}
      marqueeBgColor={marqueeBgColor} marqueeTextColor={marqueeTextColor} borderColor={borderColor}/>)}</nav>
  </div>;
}

function FlowingMenuRow({link,text,image,speed,textColor,marqueeBgColor,marqueeTextColor,borderColor}:
  FlowingMenuItem & Required<Pick<FlowingMenuProps,"speed"|"textColor"|"marqueeBgColor"|"marqueeTextColor"|"borderColor">>) {
  const itemRef=useRef<HTMLDivElement>(null),marqueeRef=useRef<HTMLDivElement>(null),innerRef=useRef<HTMLDivElement>(null);
  const animationRef=useRef<gsap.core.Tween|null>(null);
  const [repetitions,setRepetitions]=useState(4);

  useEffect(()=>{
    const calculate=()=>{const content=innerRef.current?.querySelector<HTMLElement>(".flowing-marquee__part");if(content?.offsetWidth)setRepetitions(Math.max(4,Math.ceil(window.innerWidth/content.offsetWidth)+2));};
    calculate();window.addEventListener("resize",calculate);return()=>window.removeEventListener("resize",calculate);
  },[text,image]);

  useEffect(()=>{
    const timer=window.setTimeout(()=>{const inner=innerRef.current,content=inner?.querySelector<HTMLElement>(".flowing-marquee__part");if(!inner||!content?.offsetWidth)return;animationRef.current?.kill();if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;animationRef.current=gsap.to(inner,{x:-content.offsetWidth,duration:speed,ease:"none",repeat:-1});},50);
    return()=>{clearTimeout(timer);animationRef.current?.kill();};
  },[text,image,repetitions,speed]);

  const closestEdge=(event:MouseEvent<HTMLAnchorElement>)=>{const rect=itemRef.current?.getBoundingClientRect();if(!rect)return"bottom";const x=event.clientX-rect.left,y=event.clientY-rect.top;return(x-rect.width/2)**2+y**2<(x-rect.width/2)**2+(y-rect.height)**2?"top":"bottom";};
  const reveal=(event:MouseEvent<HTMLAnchorElement>)=>{if(!marqueeRef.current||!innerRef.current)return;const edge=closestEdge(event);gsap.timeline({defaults:{duration:.55,ease:"expo.out"}}).set(marqueeRef.current,{y:edge==="top"?"-101%":"101%"},0).set(innerRef.current,{y:edge==="top"?"101%":"-101%"},0).to([marqueeRef.current,innerRef.current],{y:"0%"},0);};
  const hide=(event:MouseEvent<HTMLAnchorElement>)=>{if(!marqueeRef.current||!innerRef.current)return;const edge=closestEdge(event);gsap.timeline({defaults:{duration:.55,ease:"expo.out"}}).to(marqueeRef.current,{y:edge==="top"?"-101%":"101%"},0).to(innerRef.current,{y:edge==="top"?"101%":"-101%"},0);};
  const marqueeStyle={backgroundColor:marqueeBgColor} as CSSProperties;
  return <div className="flowing-menu__item" ref={itemRef} style={{borderColor}}>
    <Link className="flowing-menu__item-link" href={link} onMouseEnter={reveal} onMouseLeave={hide} style={{color:textColor}}>{text}</Link>
    <div className="flowing-marquee" ref={marqueeRef} style={marqueeStyle} aria-hidden="true"><div className="flowing-marquee__inner-wrap"><div className="flowing-marquee__inner" ref={innerRef}>
      {Array.from({length:repetitions},(_,index)=><div className="flowing-marquee__part" key={index} style={{color:marqueeTextColor}}><span>{text}</span><span className="flowing-marquee__img" style={{backgroundImage:`url(${image})`}}/></div>)}
    </div></div></div>
  </div>;
}
