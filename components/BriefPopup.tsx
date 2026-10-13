'use client';
import { useEffect, useRef, useState } from 'react';
import { FormspreeProvider } from '@formspree/react';
import StudioBrief from '@/components/StudioBrief';
const services = ['Website or app','AI UGC & advertising','Custom software & automation','Branding & design','Print & packaging','Apparel'];
export default function BriefPopup() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [service, setService] = useState(services[0]);
  function open(value?: string) { if (value && services.includes(value)) setService(value); dialog.current?.showModal(); }
  useEffect(() => {
    const check = () => { const value = new URLSearchParams(window.location.search).get('brief'); if (value) open(value); };
    check(); window.addEventListener('popstate', check);
    const click = (e: MouseEvent) => { const link = (e.target as Element).closest('a'); if (link?.getAttribute('href') === '#brief' || link?.getAttribute('href')?.includes('?brief=')) { e.preventDefault(); const href = link.getAttribute('href')!; open(href.includes('?') ? new URL(href, location.origin).searchParams.get('brief') || undefined : undefined); }};
    document.addEventListener('click', click);
    return () => { window.removeEventListener('popstate', check); document.removeEventListener('click', click); };
  }, []);
  return <><button className="studio-button studio-dark" onClick={() => open()}>Tell us your idea ↗</button><dialog ref={dialog} className="studio-dialog brief-popup" aria-labelledby="brief-title" onClick={e => {if(e.target===e.currentTarget) dialog.current?.close();}}><div className="studio-dialog-bar"><span>YOUR NEXT GREAT THING</span><button aria-label="Close brief" onClick={() => dialog.current?.close()}>×</button></div><div className="studio-dialog-content"><h2 id="brief-title">A little idea.<br /><em>Big possibilities.</em></h2><p>Pick your direction. We’ll ask the right questions.</p><div className="brief-services" role="group" aria-label="Choose your project direction">{services.map(s => <button key={s} aria-pressed={service===s} onClick={() => setService(s)}>{s}</button>)}</div><FormspreeProvider project="3111554656879247341"><StudioBrief key={service} initialService={service}/></FormspreeProvider></div></dialog></>;
}
