'use client';

import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { X, Download, RotateCcw, MoveLeft, MoveRight, MoveUp, MoveDown } from 'lucide-react';
import './creative-experiment.css';

type Piece = { id:string; label:string; x:number; y:number; angle:number; scale:number; kind:'text'|'image'|'star'; text?:string };
const initial:Piece[]=[
 {id:'star',label:'Star',kind:'star',x:75,y:27,angle:8,scale:1},
 {id:'art',label:'Illustrated hand',kind:'image',x:53,y:58,angle:-10,scale:1},
 {id:'title',label:'Headline',kind:'text',text:'MAKE',x:45,y:25,angle:-8,scale:1},
 {id:'subtitle',label:'Second word',kind:'text',text:'SOMETHING.',x:49,y:79,angle:6,scale:1},
];
const palettes=[{name:'Violet',bg:'#7e3bed',ink:'#ffffff',accent:'#c6ff34'},{name:'Paper',bg:'#eee9df',ink:'#171020',accent:'#7e3bed'},{name:'Lime',bg:'#c6ff34',ink:'#170c29',accent:'#7e3bed'}];
const bounds=(piece:Piece)=>piece.kind==='image'?{w:58*piece.scale,h:46*piece.scale}:piece.kind==='star'?{w:26*piece.scale,h:21*piece.scale}:{w:Math.min(90,(piece.text?.length||4)*9*piece.scale),h:14*piece.scale};
const clamp=(v:number)=>Math.min(90,Math.max(10,v));

export default function CreativeExperiment({onClose}:{onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),canvas=useRef<HTMLCanvasElement>(null),image=useRef<HTMLImageElement|null>(null),drag=useRef<{id:string;startX:number;startY:number;x:number;y:number;width:number;height:number}|null>(null);
 const [pieces,setPieces]=useState<Piece[]>(initial.map(p=>({...p}))),[selected,setSelected]=useState('title'),[palette,setPalette]=useState(0),[ready,setReady]=useState(false),[status,setStatus]=useState(''),[saving,setSaving]=useState(false);
 const chosen=pieces.find(p=>p.id===selected)!;
 useEffect(()=>{
  const el=dialog.current;if(!el)return;
  const focus=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';el.showModal();
  if(localStorage.getItem('futurecraft-motion')!=='reduced'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo(el,{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:'power3.out'});
  return()=>{el.close();document.body.style.overflow=overflow;focus?.focus();};
 },[]);
 useEffect(()=>{let live=true;const img=new Image();img.src='/futurecraft/playground/design.webp';img.onload=()=>{image.current=img;document.fonts.load('700 100px "Futurecraft Outfit"').then(()=>{if(live)setReady(true);});};img.onerror=()=>{if(live){setReady(true);setStatus('The illustration could not load. You can still make a type poster.');}};return()=>{live=false;};},[]);
 useEffect(()=>{
  const ctx=canvas.current?.getContext('2d');if(!ctx)return;
  const colors=palettes[palette];ctx.fillStyle=colors.bg;ctx.fillRect(0,0,1080,1350);
  ctx.fillStyle=colors.ink;ctx.font='500 23px "Futurecraft Outfit", sans-serif';ctx.fillText('FUTURECRAFT / EXPERIMENT 001',54,66);
  ctx.save();ctx.beginPath();ctx.rect(25,100,1030,1140);ctx.clip();
  for(const p of pieces){ctx.save();ctx.translate(p.x*10.8,p.y*13.5);ctx.rotate(p.angle*Math.PI/180);ctx.scale(p.scale,p.scale);
   if(p.kind==='image'&&image.current){const w=626,h=w*image.current.height/image.current.width;ctx.drawImage(image.current,-w/2,-h/2,w,h);}
   if(p.kind==='text'){ctx.fillStyle=colors.ink;ctx.font='700 135px "Futurecraft Outfit", sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';const text=p.text||'MAKE';const width=ctx.measureText(text).width;ctx.scale(Math.min(1,970/width),1);ctx.fillText(text,0,0);}
   if(p.kind==='star'){ctx.fillStyle=colors.accent;ctx.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,r=i%2===0?140:65;const x=Math.cos(a)*r,y=Math.sin(a)*r;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.closePath();ctx.fill();}
   ctx.restore();
  }ctx.restore();ctx.fillStyle=colors.ink;ctx.font='400 22px "Futurecraft Outfit", sans-serif';ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText('MADE BY A FIRST MAKER.',54,1290);
 },[pieces,palette,ready]);
 function update(id:string,change:Partial<Piece>){setPieces(previous=>previous.map(p=>p.id===id?{...p,...change}:p));}
 function move(dx:number,dy:number){update(selected,{x:clamp(chosen.x+dx),y:clamp(chosen.y+dy)});}
 function begin(e:PointerEvent<HTMLButtonElement>,p:Piece){e.preventDefault();setSelected(p.id);e.currentTarget.focus();e.currentTarget.setPointerCapture(e.pointerId);const box=e.currentTarget.parentElement!.getBoundingClientRect();drag.current={id:p.id,startX:e.clientX,startY:e.clientY,x:p.x,y:p.y,width:box.width,height:box.height};}
 function pointerMove(e:PointerEvent<HTMLButtonElement>){const d=drag.current;if(!d)return;update(d.id,{x:clamp(d.x+(e.clientX-d.startX)/d.width*100),y:clamp(d.y+(e.clientY-d.startY)/d.height*100)});}
 function key(e:KeyboardEvent<HTMLButtonElement>,p:Piece){const direction:Record<string,number[]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};const d=direction[e.key];if(!d)return;e.preventDefault();const step=e.shiftKey?5:1;setSelected(p.id);update(p.id,{x:clamp(p.x+d[0]*step),y:clamp(p.y+d[1]*step)});}
 async function save(){if(!canvas.current||saving)return;setSaving(true);setStatus('');try{const blob=await new Promise<Blob>((resolve,reject)=>canvas.current!.toBlob(b=>b?resolve(b):reject(new Error('Could not save the poster.')),'image/png'));const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='futurecraft-my-first-poster.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Your poster is ready. Keep making.');}catch{setStatus('Could not save this time. Please try again.');}finally{setSaving(false);}}
 return <dialog ref={dialog} className="creative-dialog" aria-labelledby="experiment-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
  <div className="creative-shell"><header className="creative-header"><div><span>THE FUTURECRAFT EXPERIMENT</span><h2 id="experiment-title">Make it your own.</h2></div><button type="button" className="creative-close" onClick={onClose} aria-label="Close creative experiment"><X size={22}/></button></header>
  <div className="creative-workspace"><div><div className="creative-poster" role="group" aria-label="Your mini poster. Drag an object or select it and use the arrow keys."><canvas ref={canvas} width={1080} height={1350} aria-label="Poster preview"/>{pieces.map(p=>{const b=bounds(p);return <button key={p.id} className={`creative-object ${selected===p.id?'is-selected':''}`} style={{left:`${p.x}%`,top:`${p.y}%`,width:`${b.w}%`,height:`${b.h}%`,transform:`translate(-50%,-50%) rotate(${p.angle}deg)`}} aria-label={`Move ${p.label}. Use arrow keys; hold Shift for bigger steps.`} aria-pressed={selected===p.id} onFocus={()=>setSelected(p.id)} onPointerDown={e=>begin(e,p)} onPointerMove={pointerMove} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onKeyDown={e=>key(e,p)}><span className="fc-sr-only">{p.label}</span></button>})}</div><p className="creative-help">Drag to compose. Tap a piece to select it.<br/>Keyboard: arrow keys move, Shift moves further.</p></div>
  <aside className="creative-tools"><p className="creative-brief">The challenge: make one word feel loud.<br/><span>Move the pieces, change the words, find your balance.</span></p>
   <fieldset><legend>Choose a piece</legend><div className="creative-pieces">{pieces.map(p=><button type="button" key={p.id} aria-pressed={selected===p.id} onClick={()=>setSelected(p.id)}>{p.label}</button>)}</div></fieldset>
   {chosen.kind==='text'&&<label className="creative-text-label">Your words<input value={chosen.text} maxLength={14} onChange={e=>update(selected,{text:e.target.value.toUpperCase()})}/></label>}
   <fieldset><legend>Move {chosen.label.toLowerCase()}</legend><div className="creative-direction">{[[MoveLeft,-3,0,'Move left'],[MoveUp,0,-3,'Move up'],[MoveDown,0,3,'Move down'],[MoveRight,3,0,'Move right']].map(([Icon,dx,dy,label])=>{const I=Icon as typeof MoveLeft;return <button type="button" key={String(label)} aria-label={String(label)} onClick={()=>move(Number(dx),Number(dy))}><I size={18}/></button>;})}</div></fieldset>
   <label>Rotation <span>{chosen.angle}°</span><input type="range" min={-45} max={45} value={chosen.angle} onChange={e=>update(selected,{angle:Number(e.target.value)})}/></label>
   <label>Size<input type="range" min={.6} max={1.4} step={.05} value={chosen.scale} onChange={e=>update(selected,{scale:Number(e.target.value)})}/></label>
   <fieldset><legend>Set the mood</legend><div className="creative-palettes">{palettes.map((p,i)=><button type="button" key={p.name} aria-pressed={palette===i} onClick={()=>setPalette(i)}><span style={{background:p.bg}}/>{p.name}</button>)}</div></fieldset>
   <div className="creative-save"><button type="button" onClick={save} disabled={!ready||saving}><Download size={17}/>{saving?'Saving…':'Save my poster'}</button><button type="button" aria-label="Reset poster" onClick={()=>{setPieces(initial.map(p=>({...p})));setPalette(0);setStatus('Poster reset. Try another composition.');}}><RotateCcw size={17}/></button></div>
   <p className="creative-status" role="status">{status||'Your poster stays on your device. No signup needed.'}</p>
  </aside></div></div>
 </dialog>;
}
