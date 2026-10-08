"use client";

// Adapted from the React Bits ClickSpark source supplied by the user.
// A viewport-sized canvas keeps long pages lightweight and preserves sticky layout.
import { useEffect, useRef, type ReactNode } from "react";

type Spark = { x:number; y:number; angle:number; startTime:number };
type ClickSparkProps = {
  sparkColor?:string;
  sparkSize?:number;
  sparkRadius?:number;
  sparkCount?:number;
  duration?:number;
  easing?:"linear"|"ease-in"|"ease-out"|"ease-in-out";
  extraScale?:number;
  children:ReactNode;
};

export default function ClickSpark({sparkColor="#fff",sparkSize=10,sparkRadius=15,
  sparkCount=8,duration=400,easing="ease-out",extraScale=1,children}:ClickSparkProps) {
  const rootRef=useRef<HTMLDivElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const sparksRef=useRef<Spark[]>([]);

  useEffect(()=>{
    const root=rootRef.current,canvas=canvasRef.current;
    if(!root||!canvas)return;
    const ctx=canvas.getContext("2d");
    if(!ctx)return;
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationId=0,width=0,height=0;
    const clear=()=>{
      if(animationId)cancelAnimationFrame(animationId);
      animationId=0;sparksRef.current=[];
      ctx.clearRect(0,0,width,height);
    };
    const resize=()=>{
      clear();
      const dpr=Math.min(window.devicePixelRatio||1,2);
      width=document.documentElement.clientWidth;height=window.innerHeight;
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    const ease=(t:number)=>{
      if(easing==="linear")return t;
      if(easing==="ease-in")return t*t;
      if(easing==="ease-in-out")return t<.5?2*t*t:-1+(4-2*t)*t;
      return t*(2-t);
    };
    const draw=(timestamp:number)=>{
      ctx.clearRect(0,0,width,height);
      sparksRef.current=sparksRef.current.filter(spark=>{
        const elapsed=timestamp-spark.startTime;
        if(elapsed>=duration)return false;
        const progress=ease(Math.min(1,Math.max(0,elapsed/duration)));
        const distance=progress*sparkRadius*extraScale;
        const length=sparkSize*(1-progress);
        const cos=Math.cos(spark.angle),sin=Math.sin(spark.angle);
        ctx.strokeStyle=sparkColor;ctx.lineWidth=2;ctx.lineCap="round";
        ctx.beginPath();ctx.moveTo(spark.x+distance*cos,spark.y+distance*sin);
        ctx.lineTo(spark.x+(distance+length)*cos,spark.y+(distance+length)*sin);ctx.stroke();
        return true;
      });
      // Stop entirely at rest, instead of running a permanent animation loop.
      animationId=sparksRef.current.length?requestAnimationFrame(draw):0;
    };
    const click=(event:MouseEvent)=>{
      // Keyboard activation has no pointer location; never invent a burst at (0, 0).
      if(motion.matches||event.detail===0||event.button!==0||duration<=0)return;
      const count=Math.min(64,Math.max(0,Math.floor(sparkCount)));
      const now=performance.now();
      const rect=canvas.getBoundingClientRect();
      const burst=Array.from({length:count},(_,i)=>({x:event.clientX-rect.left,y:event.clientY-rect.top,angle:2*Math.PI*i/count,startTime:now}));
      sparksRef.current=[...sparksRef.current,...burst].slice(-256);
      if(!animationId&&burst.length)animationId=requestAnimationFrame(draw);
    };
    resize();
    root.addEventListener("click",click,{capture:true,passive:true});
    window.addEventListener("resize",resize);
    // Clear before the page moves, so a fixed overlay never leaves misplaced sparks.
    window.addEventListener("scroll",clear,{passive:true});
    document.addEventListener("visibilitychange",clear);
    motion.addEventListener("change",clear);
    return()=>{
      clear();root.removeEventListener("click",click,true);
      window.removeEventListener("resize",resize);window.removeEventListener("scroll",clear);
      document.removeEventListener("visibilitychange",clear);motion.removeEventListener("change",clear);
    };
  },[sparkColor,sparkSize,sparkRadius,sparkCount,duration,easing,extraScale]);

  return <div ref={rootRef} className="click-spark" style={{position:"relative",width:"100%"}}>
    {children}
    <canvas ref={canvasRef} className="click-spark__canvas" aria-hidden="true"
      style={{position:"fixed",inset:0,width:"100%",height:"100%",display:"block",pointerEvents:"none",userSelect:"none",zIndex:90}}/>
  </div>;
}
