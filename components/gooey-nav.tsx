"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import "./gooey-nav.css";

export type GooeyNavItem = { label: string; href: string };

type GooeyNavProps = {
  items: GooeyNavItem[];
  activeHref?: string;
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
};

type Particle = {
  start: [number, number]; end: [number, number]; time: number;
  scale: number; color: number; rotate: number;
};

export default function GooeyNav({
  items,
  activeHref,
  animationTime = 500,
  particleCount = 12,
  particleDistances = [70, 8],
  particleR = 90,
  timeVariance = 220,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
}: GooeyNavProps) {
  const initialIndex = Math.max(0, items.findIndex(item => item.href === activeHref));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<number[]>([]);

  const noise = (value = 1) => value / 2 - Math.random() * value;
  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  const createParticle = (index: number, time: number, distances: [number, number], radius: number): Particle => {
    const rotate = noise(radius / 10);
    return {
      start: getXY(distances[0], particleCount - index, particleCount),
      end: getXY(distances[1] + noise(7), particleCount - index, particleCount),
      time,
      scale: 1 + noise(.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + radius / 20) * 10 : (rotate - radius / 20) * 10,
    };
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const position = element.getBoundingClientRect();
    const styles = { left:`${position.x-containerRect.x}px`, top:`${position.y-containerRect.y}px`, width:`${position.width}px`, height:`${position.height}px` };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const makeParticles = (element: HTMLElement) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);
    for (let index = 0; index < particleCount; index++) {
      const time = animationTime * 2 + noise(timeVariance * 2);
      const particleData = createParticle(index, time, particleDistances, particleR);
      element.classList.remove("active");
      const createTimer = window.setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.className = "gooey-particle";
        point.className = "gooey-point";
        particle.style.setProperty("--start-x", `${particleData.start[0]}px`);
        particle.style.setProperty("--start-y", `${particleData.start[1]}px`);
        particle.style.setProperty("--end-x", `${particleData.end[0]}px`);
        particle.style.setProperty("--end-y", `${particleData.end[1]}px`);
        particle.style.setProperty("--time", `${particleData.time}ms`);
        particle.style.setProperty("--scale", `${particleData.scale}`);
        particle.style.setProperty("--color", `var(--color-${particleData.color}, #f28b57)`);
        particle.style.setProperty("--rotate", `${particleData.rotate}deg`);
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add("active"));
        const removeTimer = window.setTimeout(() => particle.remove(), time);
        timersRef.current.push(removeTimer);
      }, 30);
      timersRef.current.push(createTimer);
    }
  };

  const activate = (element: HTMLElement, index: number) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(element);
    filterRef.current?.querySelectorAll(".gooey-particle").forEach(particle => particle.remove());
    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }
    if (filterRef.current) makeParticles(filterRef.current);
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const item = event.currentTarget.parentElement;
    if (item) activate(item, index);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.key === " ") event.preventDefault();
    const item = event.currentTarget.parentElement;
    if (item) activate(item, index);
  };

  useEffect(() => {
    const nextIndex = Math.max(0, items.findIndex(item => item.href === activeHref));
    setActiveIndex(nextIndex);
    setMobileOpen(false);
  }, [activeHref, items]);

  useEffect(() => {
    const container = containerRef.current;
    const activeItem = navRef.current?.querySelectorAll("li")[activeIndex] as HTMLElement | undefined;
    if (!container || !activeItem) return;
    updateEffectPosition(activeItem);
    textRef.current?.classList.add("active");
    const observer = new ResizeObserver(() => {
      const item = navRef.current?.querySelectorAll("li")[activeIndex] as HTMLElement | undefined;
      if (item) updateEffectPosition(item);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [activeIndex]);

  useEffect(() => () => timersRef.current.forEach(timer => clearTimeout(timer)), []);

  return <div className="gooey-nav-shell">
    <div className="gooey-nav-container" ref={containerRef}>
      <nav aria-label="Primary navigation"><ul ref={navRef}>{items.map((item,index)=><li key={item.href} className={activeIndex===index?"active":""}>
        <Link href={item.href} onClick={event=>handleClick(event,index)} onKeyDown={event=>handleKeyDown(event,index)} aria-current={activeIndex===index?"page":undefined}>{item.label}</Link>
      </li>)}</ul></nav>
      <span className="gooey-effect gooey-filter" ref={filterRef}/>
      <span className="gooey-effect gooey-text" ref={textRef}/>
    </div>
    <button className="gooey-mobile-toggle" type="button" aria-label={mobileOpen?"Close navigation":"Open navigation"} aria-expanded={mobileOpen} onClick={()=>setMobileOpen(open=>!open)}><span/><span/></button>
    {mobileOpen&&<nav className="gooey-mobile-menu" aria-label="Mobile navigation">{items.map(item=><Link key={item.href} href={item.href} className={item.href===activeHref?"active":""} aria-current={item.href===activeHref?"page":undefined}>{item.label}</Link>)}</nav>}
  </div>;
}
