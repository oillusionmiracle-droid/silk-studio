'use client';
import {useEffect,useState} from 'react';
export default function MotionPreference(){
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{try{const value=localStorage.getItem('futurecraft-motion');setReduced(value==='reduced'||(value===null&&window.matchMedia('(prefers-reduced-motion: reduce)').matches));document.documentElement.dataset.fcMotion=value||'system';}catch{}},[]);
 return <button className="fc-motion-preference" type="button" aria-pressed={reduced} onClick={()=>{try{localStorage.setItem('futurecraft-motion',reduced?'full':'reduced');window.location.reload();}catch{}}}>{reduced?'Motion reduced':'Reduce motion'}</button>;
}
