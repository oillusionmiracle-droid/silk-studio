'use client';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useForm, ValidationError } from '@formspree/react';

export default function StudioBrief({ initialService = '' }: { initialService?: string }) {
  const [message, setMessage] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const [state, submitBrief, resetBrief] = useForm('projectBrief');
  function prepare(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const data = new FormData(e.currentTarget);
    setMessage(`Hi Silk, I’m ${data.get('name')}.\n\nEmail: ${data.get('email')}\nWhatsApp: ${data.get('phone') || 'Not supplied'}\nProject: ${data.get('service')}\nGoal: ${data.get('goal')}\nTiming: ${data.get('timeline') || 'Flexible / let’s discuss'}\nBudget: ${data.get('budget') || 'Let’s discuss'}\nDetails: ${data.get('details') || 'To discuss'}`);
  }
  return <form ref={form} className="studio-brief-form" onSubmit={prepare} onChange={() => { setMessage(''); if (state.succeeded) resetBrief(); }}>
    <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{display:'none'}} />
    <div className="studio-form-row"><label>Your name<input name="name" required maxLength={120} autoComplete="name" placeholder="What should we call you?" /></label><label>What are we making?<select name="service" required defaultValue={initialService}><option value="" disabled>Select a service</option><option>Website or app</option><option>AI UGC & advertising</option><option>Custom software & automation</option><option>Branding & design</option><option>Print & packaging</option><option>Apparel</option></select></label></div>
    <div className="studio-form-row"><label>Email address<input name="email" type="email" required autoComplete="email" placeholder="Where should we reply?" /></label><label>WhatsApp (optional)<input name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="+234…" /></label></div>
    <label>The idea<textarea name="goal" required maxLength={1000} rows={3} placeholder="Tell us about your business and what this should achieve." /></label><label>Timeline <span>(optional)</span><input name="timeline" maxLength={120} placeholder="A date, a launch, or let’s work it out" /></label>
    <label>Project details<textarea name="details" rows={3} maxLength={1500} placeholder={initialService.includes('UGC') ? 'Product, audience, platform, video length, references and what people should do after watching.' : initialService.includes('Website') || initialService.includes('software') ? 'Pages or features, users, integrations, existing website and examples you like.' : initialService.includes('Print') || initialService === 'Apparel' ? 'Item, quantity, size, material, artwork and delivery location.' : 'Deliverables, audience, brand personality, current assets and references.'}/></label><label>Budget range (optional)<select name="budget"><option>Let’s discuss</option><option>Under ₦50,000</option><option>₦50,000–₦150,000</option><option>₦150,000–₦500,000</option><option>₦500,000+</option></select></label>
    <button className="studio-button studio-dark" type="submit">Prepare my brief <span>↗</span></button>
    <p className="studio-form-help">Review your brief, then send it directly to Silk or continue in WhatsApp. Your details are sent through Formspree only when you press Send brief.</p>
    {message && <div className="studio-brief-review" aria-live="polite"><h3>{state.succeeded ? 'Your brief has been received.' : 'Your brief is ready.'}</h3><pre>{message}</pre>{!state.succeeded && <button type="button" className="studio-button studio-dark" disabled={state.submitting} onClick={() => { if (form.current?.reportValidity()) void submitBrief(new FormData(form.current)); }}>{state.submitting ? 'Sending…' : 'Send brief to Silk ↗'}</button>}<ValidationError errors={state.errors}/><p role="status">{state.succeeded ? 'Thank you. Silk will review your project and reply using your contact details.' : ''}</p><a className="studio-button studio-dark" href={`https://wa.me/2348188630794?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Continue in WhatsApp ↗</a></div>}
  </form>;
}
