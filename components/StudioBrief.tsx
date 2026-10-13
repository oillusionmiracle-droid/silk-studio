'use client';
import { useRef, useState, type FormEvent } from 'react';
import { useForm, ValidationError } from '@formspree/react';
type Field = {name:string; label:string; placeholder?:string; options?:string[]};
const directions:Record<string,{title:string;note:string;fields:Field[]}> = {
  'Website or app': {title:'A home for your next idea.',note:'Tell us what visitors should be able to do.',fields:[{name:'format',label:'What are we building?',options:['Business website','Online store','Mobile / web app','Landing page']},{name:'features',label:'Must-have pages or features',placeholder:'Booking, payments, accounts, dashboard…'}]},
  'AI UGC & advertising': {title:'Give people a reason to stop.',note:'Choose a format. Creator content and campaigns need different briefs.',fields:[{name:'format',label:'Content direction',options:['Creator-style UGC','Product commercial','Ad campaign','AI product imagery']},{name:'product',label:'Product or offer',placeholder:'What are we showing, and why should people care?'},{name:'platform',label:'Where will it run?',options:['Instagram / Facebook','TikTok','YouTube','Website','Multiple platforms']}]},
  'Custom software & automation': {title:'Less repetitive work.',note:'Start with the workflow you want to improve.',fields:[{name:'workflow',label:'What takes too much time?',placeholder:'Describe the task your team repeats'},{name:'tools',label:'Tools to connect',placeholder:'Spreadsheets, CRM, WhatsApp, inventory…'}]},
  'Branding & design': {title:'Make it unmistakably yours.',note:'An identity built around what your business stands for.',fields:[{name:'deliverables',label:'What do you need?',options:['Brand identity','Logo design','Packaging design','Campaign graphics']},{name:'personality',label:'Three words for your brand',placeholder:'Playful, bold, refined…'}]},
  'Print & packaging': {title:'From a file to something real.',note:'Let’s plan the materials, quantity and delivery.',fields:[{name:'item',label:'What are we printing?',placeholder:'Business cards, packaging, banners…'},{name:'quantity',label:'Quantity and size',placeholder:'500 cards, A5 flyers…'},{name:'delivery',label:'Delivery location',placeholder:'City or collection preference'}]},
  'Apparel': {title:'Something they’ll want to wear.',note:'Share the garment, fit and production details.',fields:[{name:'garment',label:'Garment type',options:['T-shirts','Hoodies','Uniforms','Caps / accessories','Other']},{name:'sizes',label:'Quantity and sizes',placeholder:'20 pieces, S–XL…'},{name:'finish',label:'Print or embroidery?',options:['Print','Embroidery','Help me choose']}]}
};
export default function StudioBrief({initialService='Website or app'}:{initialService?:string}) {
  const [message,setMessage]=useState('');
  const [format,setFormat]=useState('Creator-style UGC');
  const form=useRef<HTMLFormElement>(null);
  const [state,submitBrief,resetBrief]=useForm('projectBrief');
  const config=directions[initialService] || directions['Website or app'];
  const isUgc=initialService==='AI UGC & advertising';
  const specific:Field[]=isUgc ? format==='Creator-style UGC' ? [{name:'creator',label:'Creator style',placeholder:'Talking head, hands-only, tutorial, unboxing…'},{name:'length',label:'Video length and number of videos',placeholder:'3 × 30-second videos'}] : [{name:'campaign',label:'Campaign objective',options:['Drive sales','Launch a product','Build awareness','Generate leads']},{name:'hook',label:'Key message or offer',placeholder:'The one thing viewers should remember'}] : [];
  function prepare(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();const data=new FormData(e.currentTarget);
    const details=[...config.fields,...specific].map(f=>`${f.label}: ${data.get(f.name)||'To discuss'}`).join('\n');
    data.set('details',details);
    const hidden=e.currentTarget.elements.namedItem('details') as HTMLInputElement; hidden.value=details;
    setMessage(`Hi Silk, I’m ${data.get('name')}.\n\nProject: ${initialService}\nEmail: ${data.get('email')}\nWhatsApp: ${data.get('phone')||'Not supplied'}\nGoal: ${data.get('goal')}\n\n${details}\n\nTiming: ${data.get('timeline')||'Flexible'}\nBudget: ${data.get('budget')}`);
  }
  const renderField=(field:Field)=><label key={field.name}>{field.label}{field.options ? <select name={field.name} defaultValue={field.options[0]} onChange={field.name==='format' ? e=>setFormat(e.target.value) : undefined}>{field.options.map(v=><option key={v}>{v}</option>)}</select> : <input name={field.name} maxLength={200} placeholder={field.placeholder}/>}</label>;
  return <form ref={form} className="studio-brief-form" onSubmit={prepare} onChange={()=>{setMessage('');if(state.succeeded)resetBrief();}}>
    <input name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{display:'none'}}/>
    <input type="hidden" name="service" value={initialService}/><input type="hidden" name="details"/>
    <div className="brief-direction"><h3>{config.title}</h3><p>{config.note}</p></div>
    <div className="brief-specific-fields">{config.fields.map(renderField)}{specific.map(renderField)}</div>
    <label>What should this achieve?<textarea name="goal" required maxLength={1000} rows={2} placeholder="The outcome you’re hoping for…"/></label>
    <div className="studio-form-row"><label>Your name<input name="name" required maxLength={120} autoComplete="name" placeholder="What should we call you?"/></label><label>Email address<input name="email" type="email" required autoComplete="email" placeholder="you@company.com"/></label></div>
    <div className="studio-form-row"><label>WhatsApp <span>(optional)</span><input name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="+234…"/></label><label>Timeline <span>(optional)</span><input name="timeline" maxLength={120} placeholder="A date, or let’s work it out"/></label></div>
    <label>Budget range <span>(optional)</span><select name="budget"><option>Let’s discuss</option><option>Under ₦50,000</option><option>₦50,000–₦150,000</option><option>₦150,000–₦500,000</option><option>₦500,000+</option></select></label>
    <button className="studio-button brief-primary" type="submit">Review my brief ↗</button>
    <p className="studio-form-help">Free to enquire. Review first, then choose how to send.</p>
    {message && <div className="studio-brief-review" aria-live="polite"><h3>{state.succeeded ? 'Your brief has been received.' : 'Ready when you are.'}</h3><pre>{message}</pre>{!state.succeeded && <button type="button" className="studio-button brief-primary" disabled={state.submitting} onClick={()=>{if(form.current?.reportValidity())void submitBrief(new FormData(form.current));}}>{state.submitting ? 'Sending…' : 'Send brief to Silk ↗'}</button>}<ValidationError errors={state.errors}/><p role="status">{state.succeeded ? 'Thank you. We’ll reply using your contact details.' : ''}</p><a className="brief-whatsapp-link" href={`https://wa.me/2348188630794?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Continue in WhatsApp ↗</a></div>}
  </form>;
}
