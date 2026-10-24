'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { answerStudioQuestion, guideQuestions, type GuideAnswer } from '@/lib/studioGuide';
export default function SilkGuide() {
  const { isAuthModalOpen } = useAuth();
  const [open, setOpen] = useState(false), [input, setInput] = useState('');
  const [answer, setAnswer] = useState<GuideAnswer | null>(null);
  const field = useRef<HTMLInputElement>(null), launcher = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) field.current?.focus(); }, [open]);
  useEffect(() => { const show = () => setOpen(true); window.addEventListener('open-gemini-chat', show); return () => window.removeEventListener('open-gemini-chat', show); }, []);
  function close() { setOpen(false); requestAnimationFrame(() => launcher.current?.focus()); }
  function ask(text: string) { setAnswer(answerStudioQuestion(text)); setInput(''); }
  function submit(e: FormEvent) { e.preventDefault(); if (input.trim()) ask(input.trim()); }
  if (isAuthModalOpen) return null;
  return <><button ref={launcher} className="gemini-launcher silk-guide-launcher" aria-label="Open Silk Guide" aria-expanded={open} onClick={() => setOpen(!open)}><Image src="/logo-white.svg" alt="" width={27} height={27} /></button>{open && <section className="gemini-panel silk-guide-panel" role="dialog" aria-label="Silk Guide" onKeyDown={e => { if (e.key === 'Escape') close(); }}><header><div className="gemini-brand"><Image src="/logo-white.svg" alt="" width={27} height={27} /><div><h2>Silk Guide</h2><span>Current services. Straight answers.</span></div></div><div><button onClick={close} aria-label="Close Silk Guide">×</button></div></header><div className="gemini-messages"><p className="silk-guide-intro">What would you like to make?</p><div className="gemini-suggestions">{guideQuestions.map(q => <button key={q} onClick={() => ask(q)}>{q} ↗</button>)}</div>{answer && <div className="silk-guide-answer" role="status"><p>{answer.text}</p><div>{answer.links.map(link => <Link key={link.href} href={link.href} onClick={close}>{link.label} ↗</Link>)}</div></div>}</div><form onSubmit={submit}><div className="gemini-input"><input ref={field} value={input} onChange={e => setInput(e.target.value)} maxLength={500} placeholder="Ask about services or prices" aria-label="Ask Silk Guide" /><button aria-label="Ask Silk Guide" disabled={!input.trim()}>↑</button></div><small>A site guide, not a generative AI chat. Personal project advice? <Link href="/contact" onClick={close}>Talk to the studio.</Link></small></form></section>}</>;
}
