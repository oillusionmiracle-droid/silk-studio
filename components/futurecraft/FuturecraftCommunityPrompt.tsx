'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
const KEY='futurecraft-whatsapp-invitation-v1';
const CHANNEL='https://whatsapp.com/channel/0029VbDswxf1NCrdDeaZac3j';
export default function FuturecraftCommunityPrompt({blocked}:{blocked:boolean}){
 const [ready,setReady]=useState(false),[open,setOpen]=useState(false),[dismissed,setDismissed]=useState(false);
 useEffect(()=>{
  try{if(sessionStorage.getItem(KEY)){setDismissed(true);return;}}catch{}
  const timer=window.setTimeout(()=>setReady(true),15000);
  return()=>window.clearTimeout(timer);
 },[]);
 useEffect(()=>{
  if(!ready||blocked||dismissed||open)return;
  const tryOpen=()=>{
   // Do not interrupt a modal, an active form field, or a background tab.
   if(document.visibilityState!=='visible'||document.querySelector('dialog[open]')||document.activeElement?.matches('input,textarea,select,[contenteditable="true"]'))return;
   setOpen(true);
  };
  tryOpen();const timer=window.setInterval(tryOpen,1000);
  return()=>window.clearInterval(timer);
 },[ready,blocked,dismissed,open]);
 function dismiss(){setOpen(false);setDismissed(true);try{sessionStorage.setItem(KEY,'dismissed');}catch{}}
 useEffect(()=>{
  if(!open)return;
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!document.querySelector('dialog[open]'))dismiss();};
  window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);
 },[open]);
 if(!open||blocked||dismissed)return null;
 return createPortal(<aside className="fc-community-prompt" aria-labelledby="fc-community-title"><button type="button" className="fc-cookie-close" aria-label="Dismiss WhatsApp invitation" onClick={dismiss}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></button><span className="fc-prompt-symbol" aria-hidden="true">✳</span><span className="fc-prompt-kicker">FUTURECRAFT / ON WHATSAPP</span><h2 id="fc-community-title">Make it with us.</h2><p>Follow the Futurecraft Academy channel for Genesis announcements, creative experiments and what’s next.</p><a className="fc-community-join" href={CHANNEL} target="_blank" rel="noopener noreferrer" onClick={dismiss}>Follow on WhatsApp</a><button type="button" className="fc-community-later" onClick={dismiss}>Maybe later</button></aside>,document.body);
}
