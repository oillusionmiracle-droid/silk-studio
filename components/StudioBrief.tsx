'use client';
import { useState } from 'react';
import type { FormEvent } from 'react';

export default function StudioBrief() {
  const [message, setMessage] = useState('');
  function prepare(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const data = new FormData(e.currentTarget);
    setMessage(`Hi Silk, I’m ${data.get('name')}.\n\nProject: ${data.get('service')}\nGoal: ${data.get('goal')}\nTiming: ${data.get('timeline') || 'Flexible / let’s discuss'}`);
  }
  return <form className="studio-brief-form" onSubmit={prepare} onChange={() => setMessage('')}>
    <div className="studio-form-row"><label>Your name<input name="name" required maxLength={120} autoComplete="name" placeholder="What should we call you?" /></label><label>What are we making?<select name="service" required defaultValue=""><option value="" disabled>Select a service</option><option>Website or app</option><option>AI UGC & advertising</option><option>Custom software & automation</option><option>Branding & design</option><option>Print & packaging</option><option>Apparel</option></select></label></div>
    <label>The idea<textarea name="goal" required maxLength={1000} rows={3} placeholder="Tell us about your business and what this should achieve." /></label><label>Timeline <span>(optional)</span><input name="timeline" maxLength={120} placeholder="A date, a launch, or let’s work it out" /></label>
    <button className="studio-button studio-dark" type="submit">Prepare my brief <span>↗</span></button>
    <p className="studio-form-help">Prepare a message, review it, then continue in WhatsApp. Nothing is sent or saved by this form.</p>
    {message && <div className="studio-brief-review" aria-live="polite"><h3>Your brief is ready.</h3><pre>{message}</pre><a className="studio-button studio-dark" href={`https://wa.me/2348188630794?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Continue in WhatsApp ↗</a></div>}
  </form>;
}
