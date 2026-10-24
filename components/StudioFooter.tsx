'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SocialLogo from './SocialLogo';
export default function StudioFooter() {
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  async function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget, data = new FormData(form);
    if (data.get('website_url') || busy) return;
    setBusy(true); setMessage('');
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), website_url: '' }) });
      const result = await res.json(); if (!res.ok) throw new Error(result.error || 'Please try again.');
      setMessage(result.message || 'You’re on the list.'); form.reset();
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Could not subscribe. Please try again.'); }
    finally { setBusy(false); }
  }
  return <footer className="silk-footer" id="newsletter"><div className="silk-footer-main"><div><Link className="silk-footer-brand" href="/" aria-label="Silk Studio home"><Image src="/logo-white.svg" alt="" width={32} height={32} /><strong>Silk Studio</strong></Link><p>Design. Build. Make.</p><div className="silk-footer-social">{([{ name: 'Instagram', href: 'https://instagram.com/thesilkstudiong' }, { name: 'TikTok', href: 'https://tiktok.com/@thesilkstudiong' }, { name: 'Facebook', href: 'https://facebook.com/thesilkstudiong' }] as const).map(s => <a href={s.href} key={s.name} target="_blank" rel="noopener noreferrer" aria-label={`Silk Studio on ${s.name}`} title={s.name}><SocialLogo name={s.name} /></a>)}</div></div><nav aria-label="Footer"><Link href="/portfolio">Work</Link><Link href="/blog">Blog</Link><Link href="/studio">Studio</Link><Link href="/moremi">Moremi</Link><Link href="/contact">Contact</Link><Link href="/order" className="silk-footer-order">Start your order</Link></nav><div className="silk-newsletter"><h3>Good ideas. Useful reads.</h3><p>Practical reads on business, design and creating things people care about. Straight to your inbox.</p><form onSubmit={subscribe}><input name="website_url" tabIndex={-1} autoComplete="off" aria-hidden="true" className="newsletter-trap" /><div className="silk-newsletter-pill"><input name="email" type="email" required aria-label="Newsletter email address" placeholder="Your email address" autoComplete="email" /><button disabled={busy} type="submit">{busy ? 'Joining…' : 'Subscribe ↗'}</button></div><p role="status">{message}</p></form></div></div><div className="silk-footer-bottom"><span>© {new Date().getFullYear()} Silk Studio</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><button className="silk-cookie-settings" onClick={() => window.dispatchEvent(new Event('silk-cookie-settings'))}>Cookie settings</button><a href="#top">Back to top ↑</a></div></div></footer>;
}
