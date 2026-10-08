"use client";

// Adapted from the React Bits ScrollExpand source supplied with this project.
import { useCallback, useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import "./scroll-expand.css";

const clamp = (v:number, a:number, b:number) => Math.min(b, Math.max(a, v));
const smoothstep = (a:number, b:number, x:number) => { const t=clamp((x-a)/(b-a||1e-6),0,1); return t*t*(3-2*t); };
type ScrollExpandProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  src:string; mediaType?:"image"|"video"; poster?:string; alt?:string;
  title?:ReactNode; scrollHint?:string; startWidth?:number; startHeight?:number;
  startRadius?:number; endRadius?:number; mediaZoom?:number; scrollDistance?:number;
  holdDistance?:number; smoothing?:number; overlayScrim?:number; useWindowScroll?:boolean; enabled?:boolean;
};

export default function ScrollExpand({src,mediaType="image",poster="",alt="",title,scrollHint="",
  startWidth=42,startHeight=58,startRadius=24,endRadius=0,mediaZoom=1.35,
  scrollDistance=1.2,holdDistance=.35,smoothing=.1,overlayScrim=.45,
  useWindowScroll=false,enabled=true,children,className="",style,...rest}:ScrollExpandProps) {
  const rootRef=useRef<HTMLDivElement>(null),trackRef=useRef<HTMLDivElement>(null),stageRef=useRef<HTMLDivElement>(null);
  const frameRef=useRef<HTMLDivElement>(null),mediaRef=useRef<HTMLDivElement>(null),titleRef=useRef<HTMLDivElement>(null);
  const overlayRef=useRef<HTMLDivElement>(null),scrimRef=useRef<HTMLDivElement>(null),hintRef=useRef<HTMLDivElement>(null);
  const propsRef=useRef({startWidth,startHeight,startRadius,endRadius,mediaZoom,scrollDistance,holdDistance,smoothing,overlayScrim,enabled});
  useEffect(()=>{propsRef.current={startWidth,startHeight,startRadius,endRadius,mediaZoom,scrollDistance,holdDistance,smoothing,overlayScrim,enabled};},[startWidth,startHeight,startRadius,endRadius,mediaZoom,scrollDistance,holdDistance,smoothing,overlayScrim,enabled]);

  const applyProgress=useCallback((p:number)=>{
    const frame=frameRef.current,media=mediaRef.current;
    if(!frame||!media)return;
    const c=propsRef.current,e=smoothstep(0,1,p);
    const ix=Math.max(0,(100-clamp(c.startWidth,0,100))/2)*(1-e);
    const iy=Math.max(0,(100-clamp(c.startHeight,0,100))/2)*(1-e);
    frame.style.clipPath=`inset(${iy}% ${ix}% ${iy}% ${ix}% round ${c.startRadius+(c.endRadius-c.startRadius)*e}px)`;
    media.style.transform=`scale(${c.mediaZoom+(1-c.mediaZoom)*e})`;
    if(scrimRef.current)scrimRef.current.style.opacity=String(c.overlayScrim*e);
    const out=smoothstep(.4,.88,p),inn=smoothstep(.68,1,p),gone=smoothstep(0,.12,p);
    if(titleRef.current){titleRef.current.style.opacity=String(1-out);titleRef.current.style.transform=`translate3d(0,${-28*out}px,0) scale(${1+.06*out})`;}
    if(hintRef.current){hintRef.current.style.opacity=String(1-gone);hintRef.current.style.transform=`translate3d(0,${8*gone}px,0)`;}
    if(overlayRef.current){overlayRef.current.style.opacity=String(inn);overlayRef.current.style.transform=`translate3d(0,${18*(1-inn)}px,0)`;overlayRef.current.inert=inn<.95;}
  },[]);

  useEffect(()=>{
    const root=rootRef.current,track=trackRef.current,stage=stageRef.current;
    if(!root||!track||!stage)return;
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf=0,current=0,target=0,stageH=0,offset=0,lastTime=0;
    const isStatic=()=>motion.matches||!propsRef.current.enabled;
    const readProgress=()=>{
      if(isStatic())return 1;
      const span=stageH*Math.max(.01,propsRef.current.scrollDistance);
      return clamp((useWindowScroll?offset-track.getBoundingClientRect().top:root.scrollTop)/span,0,1);
    };
    const tick=(time:number)=>{
      const delta=lastTime?Math.min((time-lastTime)/1000,.05):1/60;lastTime=time;
      const follow=propsRef.current.smoothing;
      current+=(target-current)*(follow<=0?1:1-Math.exp(-delta/follow));
      if(Math.abs(target-current)<.0004)current=target;
      applyProgress(current);
      raf=current===target?0:requestAnimationFrame(tick);
    };
    const onScroll=()=>{
      target=readProgress();
      if(isStatic()||propsRef.current.smoothing<=0){if(raf)cancelAnimationFrame(raf);raf=0;current=target;applyProgress(current);}
      else if(!raf){lastTime=0;raf=requestAnimationFrame(tick);}
    };
    const measure=()=>{
      const c=propsRef.current;
      offset=useWindowScroll?parseFloat(getComputedStyle(stage).top)||0:0;
      stageH=useWindowScroll?window.innerHeight-offset:root.clientHeight;
      if(stageH<=0)return;
      root.dataset.static=String(isStatic());root.dataset.ready="true";
      stage.style.height=`${stageH}px`;
      track.style.height=isStatic()?"auto":`${stageH*(1+Math.max(0,c.scrollDistance)+Math.max(0,c.holdDistance))}px`;
      if(isStatic())stage.style.height="auto";
      if(raf)cancelAnimationFrame(raf);raf=0;
      current=target=readProgress();applyProgress(current);
    };
    measure();
    const scroller=useWindowScroll?window:root;
    scroller.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",measure);motion.addEventListener("change",measure);
    // Observe width changes only: track-height updates must not trigger a resize loop.
    let measuredWidth=root.clientWidth;
    const observer=new ResizeObserver(()=>{if(root.clientWidth!==measuredWidth){measuredWidth=root.clientWidth;measure();}});observer.observe(root);
    return()=>{if(raf)cancelAnimationFrame(raf);scroller.removeEventListener("scroll",onScroll);window.removeEventListener("resize",measure);motion.removeEventListener("change",measure);observer.disconnect();};
  },[applyProgress,useWindowScroll,enabled,startWidth,startHeight,startRadius,endRadius,mediaZoom,scrollDistance,holdDistance,smoothing,overlayScrim]);

  const initialStyle={"--se-inset-x":`${(100-startWidth)/2}%`,"--se-inset-y":`${(100-startHeight)/2}%`,"--se-radius":`${startRadius}px`,...style} as CSSProperties;
  return <div ref={rootRef} className={`scroll-expand ${useWindowScroll?"":"scroll-expand--scroller"} ${className}`.trim()} style={initialStyle} {...rest}>
    <div ref={trackRef} className="scroll-expand__track"><div ref={stageRef} className="scroll-expand__stage">
      <div ref={frameRef} className="scroll-expand__frame">
        <div ref={mediaRef} className="scroll-expand__media-wrap">{mediaType==="video"?<video className="scroll-expand__media" src={src} poster={poster} aria-label={alt} autoPlay muted loop playsInline disablePictureInPicture/>:<img className="scroll-expand__media" src={src} alt={alt} draggable={false}/>}</div>
        <div ref={scrimRef} className="scroll-expand__scrim"/>
        {children&&<div ref={overlayRef} className="scroll-expand__overlay">{children}</div>}
      </div>
      {title&&<div ref={titleRef} className="scroll-expand__title">{title}</div>}
      {scrollHint&&<div ref={hintRef} className="scroll-expand__hint">{scrollHint}</div>}
    </div></div>
  </div>;
}
