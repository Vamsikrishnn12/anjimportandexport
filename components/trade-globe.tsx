"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

// A perspective-projected 3D route diagram. No WebGL dependency or external model.
const destinations = [{name:"Singapore",lat:1.35,lon:103.8},{name:"Dubai",lat:25.2,lon:55.3},{name:"Rotterdam",lat:51.9,lon:4.5},{name:"New York",lat:40.7,lon:-74}];
const origin={lat:13.08,lon:80.27};
const position=(lat:number,lon:number)=>{const a=lat*Math.PI/180,b=lon*Math.PI/180;return [Math.cos(a)*Math.sin(b),-Math.sin(a),Math.cos(a)*Math.cos(b)];};
// Simplified geographic point masks make the trade diagram readable at small sizes.
const regions=[[[ -17,35],[0,37],[35,30],[50,12],[40,-12],[18,-35],[10,-10],[-12,6]],[[0,38],[10,58],[30,70],[80,70],[135,50],[150,35],[120,10],[100,0],[80,8],[60,30]],[[112,-10],[150,-12],[155,-35],[135,-42],[113,-28]],[[-168,65],[-135,72],[-55,50],[-80,8],[-110,20],[-130,48]],[[-80,10],[-45,0],[-35,-15],[-70,-55],[-80,-10]],[[-52,60],[-22,75],[-40,83],[-65,75]]];
function inside(lon:number,lat:number,poly:number[][]){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [x,y]=poly[i],[px,py]=poly[j];if(((y>lat)!==(py>lat))&&(lon<(px-x)*(lat-y)/(py-y)+x))hit=!hit;}return hit;}

export function TradeGlobe(){
  const canvas=useRef<HTMLCanvasElement>(null),spin=useRef(-1.04),drag=useRef<{x:number;rotation:number}|null>(null),pausedRef=useRef(false);
  const [paused,setPaused]=useState(false),[route,setRoute]=useState(0); const routeRef=useRef(0);
  useEffect(()=>{pausedRef.current=paused;routeRef.current=route;},[paused,route]);
  useEffect(()=>{
    const el=canvas.current;if(!el)return;const ctx=el.getContext("2d");if(!ctx)return;
    const media=matchMedia("(prefers-reduced-motion: reduce)");let reduced=media.matches,visible=true,frame=0,last=0,t=0,w=600,h=600;
    const dots:number[][]=[];for(let lat=-57;lat<80;lat+=3){for(let lon=-180;lon<180;lon+=3){if(regions.some(p=>inside(lon,lat,p)))dots.push(position(lat,lon));}}
    const observer=new ResizeObserver(()=>{const rect=el.getBoundingClientRect();w=rect.width;h=rect.height;const dpr=Math.min(devicePixelRatio,2);el.width=w*dpr;el.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);});observer.observe(el);
    const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});io.observe(el);
    const change=()=>{reduced=media.matches;};media.addEventListener("change",change);
    const draw=(now:number)=>{
      frame=requestAnimationFrame(draw);if(now-last<32)return;const dt=Math.min(now-last,50);last=now;if(!visible||document.hidden)return;
      if(!reduced&&!pausedRef.current&&!drag.current){spin.current+=dt*.000065;t+=dt*.00014;}
      ctx.clearRect(0,0,w,h);const r=Math.min(w,h)*.355,cx=w/2,cy=h/2,c=Math.cos(spin.current),s=Math.sin(spin.current);
      const project=(v:number[],scale=1)=>{const x=v[0]*c+v[2]*s,z=-v[0]*s+v[2]*c;const tilt=.12,y=v[1]*Math.cos(tilt)-z*Math.sin(tilt),zz=v[1]*Math.sin(tilt)+z*Math.cos(tilt);return [cx+x*r*scale,cy+y*r*scale,zz];};
      const glow=ctx.createRadialGradient(cx,cy,r*.3,cx,cy,r*1.45);glow.addColorStop(0,"rgba(35,111,135,.15)");glow.addColorStop(1,"rgba(35,111,135,0)");ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
      const ocean=ctx.createRadialGradient(cx-r*.3,cy-r*.4,0,cx,cy,r);ocean.addColorStop(0,"#153d4b");ocean.addColorStop(.75,"#0c2634");ocean.addColorStop(1,"#071a27");ctx.fillStyle=ocean;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(140,210,217,.2)";ctx.stroke();
      const line=(points:number[][],color:string)=>{ctx.strokeStyle=color;ctx.lineWidth=.55;ctx.beginPath();let pen=false;for(const v of points){const p=project(v);if(p[2]<0){pen=false;continue;}if(pen)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);pen=true;}ctx.stroke();};
      for(let lat=-60;lat<=60;lat+=20){const pts=[];for(let lon=-180;lon<=180;lon+=3)pts.push(position(lat,lon));line(pts,"rgba(132,196,205,.11)");}for(let lon=-180;lon<180;lon+=30){const pts=[];for(let lat=-90;lat<=90;lat+=3)pts.push(position(lat,lon));line(pts,"rgba(132,196,205,.11)");}
      for(const d of dots){const p=project(d);if(p[2]<0)continue;ctx.fillStyle=`rgba(127,195,200,${.24+p[2]*.62})`;ctx.beginPath();ctx.arc(p[0],p[1],Math.max(1,r*.006),0,Math.PI*2);ctx.fill();}
      const start=position(origin.lat,origin.lon);
      destinations.forEach((dest,index)=>{const end=position(dest.lat,dest.lon),angle=Math.acos(Math.max(-1,Math.min(1,start.reduce((sum,v,i)=>sum+v*end[i],0)))),active=index===routeRef.current;
        const point=(u:number)=>{const a=Math.sin((1-u)*angle)/Math.sin(angle),b=Math.sin(u*angle)/Math.sin(angle);return project(start.map((v,i)=>a*v+b*end[i]),1+Math.sin(u*Math.PI)*.28);};
        ctx.beginPath();let pen=false;for(let i=0;i<=80;i++){const p=point(i/80);if(p[2]<-.1){pen=false;continue;}if(pen)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);pen=true;}ctx.strokeStyle=active?"#ff955e":"rgba(140,205,210,.24)";ctx.lineWidth=active?1.7:.7;ctx.stroke();
        if(active){const u=reduced?.46:(t%1),p=point(u),next=point(Math.min(u+.01,1));if(p[2]>-.1){ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(Math.atan2(next[1]-p[1],next[0]-p[0]));ctx.fillStyle="#ffd5ac";ctx.shadowBlur=13;ctx.shadowColor="#ff955e";ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-4);ctx.lineTo(-2,0);ctx.lineTo(-5,4);ctx.closePath();ctx.fill();ctx.restore();}}
        const p=project(end);if(p[2]>0){ctx.fillStyle=active?"#ffb784":"#78a6b3";ctx.beginPath();ctx.arc(p[0],p[1],active?3.5:2,0,Math.PI*2);ctx.fill();}
      });
      const p=project(start);if(p[2]>0){ctx.strokeStyle="#ff985f";ctx.lineWidth=1;ctx.beginPath();ctx.arc(p[0],p[1],9+(reduced?0:Math.sin(t*7)*2),0,Math.PI*2);ctx.stroke();ctx.fillStyle="#ffb784";ctx.beginPath();ctx.arc(p[0],p[1],4,0,Math.PI*2);ctx.fill();ctx.font="600 11px Arial";ctx.fillText("CHENNAI, IN",p[0]+15,p[1]+4);}
    };frame=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(frame);observer.disconnect();io.disconnect();media.removeEventListener("change",change);};
  },[]);
  return <div className="globe-module"><div className="globe-coordinate">13.0827° N / 80.2707° E</div><canvas ref={canvas} className="trade-globe" aria-label="Interactive 3D globe showing illustrative trade routes from Chennai" onPointerDown={e=>{drag.current={x:e.clientX,rotation:spin.current};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(drag.current)spin.current=drag.current.rotation+(e.clientX-drag.current.x)*.007;}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}/><div className="globe-caption"><span>ROTATE TO EXPLORE</span><div><button aria-label={paused?"Play globe animation":"Pause globe animation"} onClick={()=>setPaused(!paused)}>{paused?<Play size={14}/>:<Pause size={14}/>}</button><button aria-label="Reset globe position" onClick={()=>{spin.current=-1.04;}}><RotateCcw size={14}/></button></div></div><div className="route-switch" aria-label="Explore illustrative trade routes">{destinations.map((d,i)=><button key={d.name} aria-pressed={route===i} onClick={()=>{setRoute(i);spin.current=-1.04;}}>{d.name}</button>)}</div><p className="route-disclaimer">Illustrative routes · availability confirmed per enquiry</p></div>;
}
