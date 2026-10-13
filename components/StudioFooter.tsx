'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const TurnstileWidget = dynamic(() => import('@/components/TurnstileWidget'), {ssr:false});
export default function StudioFooter() {
  const [token,setToken] = useState<string|null>(null);
  const [reset,setReset] = useState(0);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  async function subscribe(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form=e.currentTarget; const data=new FormData(form);
    if(data.get('website_url') || busy) return;
    setBusy(true); setMessage('');
    try {
      const res=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.get('email'),website_url:'',turnstile_token:token})});
      const result=await res.json(); if(!res.ok) throw new Error(result.error || 'Please try again.');
      setMessage(result.message || 'You’re on the list.'); form.reset();
    } catch(err) {setMessage(err instanceof Error ? err.message : 'Could not subscribe. Please try again.');}
    finally {setBusy(false);setToken(null);setReset(n=>n+1);}
  }
  return <footer className="silk-footer"><div className="silk-footer-main"><div><Link className="silk-footer-brand" href="/" aria-label="Silk Studio home"><Image src="/logo-white.svg" alt="" width={32} height={32}/><strong>Silk Studio</strong></Link><p>Design. Build. Make.</p><div className="silk-footer-social"><a href="https://instagram.com/thesilkstudiong" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="https://tiktok.com/@thesilkstudiong" target="_blank" rel="noopener noreferrer">TikTok ↗</a></div></div><nav aria-label="Footer"><Link href="/portfolio">Work</Link><Link href="/studio">Studio</Link><Link href="/moremi">Moremi</Link><Link href="/order">Place an order ↗</Link></nav><div className="silk-newsletter"><h3>A little inspiration in your inbox.</h3><p>New work, useful finds and studio updates. Sent monthly.</p><form onSubmit={subscribe}><input name="website_url" tabIndex={-1} autoComplete="off" aria-hidden="true" className="newsletter-trap"/><div className="silk-newsletter-pill"><input name="email" type="email" required aria-label="Newsletter email address" placeholder="Your email address" autoComplete="email"/><button disabled={busy} type="submit">{busy ? 'Joining…' : 'Subscribe ↗'}</button></div><TurnstileWidget onToken={setToken} resetKey={reset}/><p role="status">{message}</p></form></div></div><div className="silk-footer-bottom"><span>© {new Date().getFullYear()} Silk Studio</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="#top">Back to top ↑</a></div></div></footer>;
}
