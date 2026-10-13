'use client';
import { useState } from 'react';
import { FormspreeProvider } from '@formspree/react';
import StudioBrief from './StudioBrief';
const services = ['Website or app', 'AI UGC & advertising', 'Custom software & automation', 'Branding & design', 'Print & packaging', 'Apparel'];
export default function ContactBrief() {
  const [service, setService] = useState(services[0]);
  return <section className="contact-brief" id="project-enquiry" aria-labelledby="enquiry-title"><span className="studio-eyebrow">YOUR PROJECT</span><h2 id="enquiry-title">Tell us what’s<br /><em>on your mind.</em></h2><p>Choose a direction, share your idea, then review your brief before sending.</p><label className="contact-direction" htmlFor="contact-service">What can we help with?<select id="contact-service" value={service} onChange={event => setService(event.target.value)}>{services.map(value => <option key={value}>{value}</option>)}</select></label><FormspreeProvider project="3111554656879247341"><StudioBrief key={service} initialService={service}/></FormspreeProvider></section>;
}
