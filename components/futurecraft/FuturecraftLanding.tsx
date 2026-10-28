/* eslint-disable react/no-unescaped-entities -- marketing copy uses natural apostrophes */
'use client';

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowDown, Check, Play, Sparkles, Menu, X, ArrowRight } from 'lucide-react';

const tracks = [
 { n: '01', label: 'ART & DESIGN', title: 'Make it\nlook unreal.', desc: 'Create professional flyers, brand visuals, banners and social campaigns with AI.', tags: ['Flyers', 'Brand identity', 'Social content'], image: '/images/blog/colour-swatches.jpg', color: '#eab6fa' },
 { n: '02', label: 'VIDEO & ADS', title: 'Bring ideas\nto life.', desc: 'Generate, direct and edit standout videos, motion pieces and advertising.', tags: ['AI films', 'Reels', 'Ad lab'], image: '/images/blog/camera-and-phone.jpg', color: '#d7f778' },
 { n: '03', label: 'GAME MAKING', title: 'Build worlds.\nMake them play.', desc: 'Turn an idea into characters, mechanics and a game someone can actually play.', tags: ['Characters', 'Game worlds', 'Playable projects'], image: '/images/blog/ai-seven-day-experiment.jpg', color: '#ffb36d' },
 { n: '04', label: 'AI AUTOMATION', title: 'Let systems\ndo the work.', desc: 'Build practical automations that help businesses reply faster and waste less time.', tags: ['Workflows', 'AI agents', 'Business tools'], image: '/images/blog/customer-messages.jpg', color: '#a2dafa' },
];
const faqs = [
 ['Is Genesis really free?', 'Yes. The first Genesis Bootcamp is free to join. If we introduce optional paid programmes later, they will be clearly labelled.'],
 ['Do I need to know how to code?', 'No. Genesis is designed for complete beginners. Curiosity and a willingness to experiment are the starting point.'],
 ['How long does Genesis last?', 'Fourteen weeks, with practical two-hour sessions. The exact dates and session timetable will be shared after they are confirmed.'],
 ['What will I need?', 'An internet-connected device and the willingness to make something. Individual activities may recommend a laptop; device requirements will be shared ahead of each session.'],
 ['Will there be guest mentors?', 'Futurecraft plans to invite working AI creators, designers, developers and other practitioners to share practical workflows. Individual mentors will be announced only once confirmed.'],
 ['What happens after I sign up?', 'We will confirm that your registration was received and send a separate welcome email introducing Futurecraft and explaining the next steps.'],
];

function MagneticLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
 const ref = useRef<HTMLAnchorElement>(null);
 function move(e: MouseEvent<HTMLAnchorElement>) { if (!ref.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return; const rect = ref.current.getBoundingClientRect(); gsap.to(ref.current, { x: (e.clientX - rect.left - rect.width / 2) * .12, y: (e.clientY - rect.top - rect.height / 2) * .15, duration: .5, ease:'power3.out' }); }
 function reset() { if (ref.current) gsap.to(ref.current, { x:0, y:0, duration:.5, ease:'elastic.out(1,.5)' }); }
 return <a ref={ref} href={href} className={secondary ? 'fc-btn fc-btn-outline' : 'fc-btn'} onMouseMove={move} onMouseLeave={reset}>{children}<ArrowUpRight size={19} aria-hidden="true" /></a>;
}

function Registration() {
 const [state,setState] = useState<'idle'|'sending'|'done'|'error'>('idle');
 const [message,setMessage] = useState('');
 async function submit(e:FormEvent<HTMLFormElement>) {
   e.preventDefault();
   if(state==='sending')return;
   const form=e.currentTarget;
   const data=new FormData(form);
   const payload={name:String(data.get('name')||''),email:String(data.get('email')||''),phone:String(data.get('phone')||''),experience:String(data.get('experience')||''),interest:String(data.get('interest')||''),consent:data.get('consent')==='yes',website_url:String(data.get('website_url')||'')};
   setState('sending');setMessage('');
   try {
     const res=await fetch('/api/futurecraft/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
     const result=await res.json();
     if(!res.ok)throw new Error(result.error || 'Registration could not be completed.');
     if(result.alreadyRegistered) { setState('done');setMessage('You are already on the Genesis list. Check your email for updates.'); return; }
     window.location.assign('/futurecraft/success');
   } catch(err) {setState('error');setMessage(err instanceof Error?err.message:'Something went wrong. Please try again.');}
 }
 return <form onSubmit={submit} className="fc-form" noValidate={false}>
  <div className="fc-form-head"><span>01 / 02 · YOUR DETAILS</span><span>IT STARTS HERE <Sparkles size={14}/></span></div>
  <div className="fc-field-grid">
   <label>Full name<input name="name" required minLength={2} maxLength={90} autoComplete="name" placeholder="What should we call you?" /></label>
   <label>Email address<input name="email" required type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" /></label>
  </div>
  <label>WhatsApp number <small>(optional)</small><input name="phone" type="tel" autoComplete="tel" maxLength={28} placeholder="+234 …" /></label>
  <div className="fc-field-grid">
   <label>Where are you starting?<select name="experience" required defaultValue=""><option value="" disabled>Choose your level</option><option value="complete_beginner">Completely new</option><option value="exploring">I've tried a few AI tools</option><option value="building">I already make things</option></select></label>
   <label>What excites you most?<select name="interest" required defaultValue=""><option value="" disabled>Pick your first curiosity</option><option value="design">Design with AI</option><option value="video">AI Video & Ads</option><option value="games">AI Games</option><option value="automation">AI Automation</option><option value="everything">A bit of everything</option></select></label>
  </div>
  <div className="fc-honeypot" aria-hidden="true"><label>Leave this blank<input tabIndex={-1} autoComplete="off" name="website_url"/></label></div>
  <label className="fc-consent"><input type="checkbox" name="consent" value="yes" required /><span>I agree to receive Genesis registration and programme emails. Read the <Link href="/futurecraft/privacy" target="_blank">privacy policy</Link>.</span></label>
  {message&&<p role="alert" className={state==='error'?'fc-form-error':'fc-form-message'}>{message}</p>}
  <button type="submit" disabled={state==='sending'||state==='done'} className="fc-submit"><span>{state==='sending'?'SUBMITTING…':state==='done'?'YOU’RE ON THE LIST':'JOIN GENESIS — FREE'}</span><ArrowUpRight size={22}/></button>
  <p className="fc-form-note">No payment details. No fake countdown. We will email you the confirmed dates and next steps.</p>
 </form>;
}

export default function FuturecraftLanding() {
 const root=useRef<HTMLDivElement>(null);
 const mascot=useRef<HTMLImageElement>(null);
 const [menu,setMenu]=useState(false);
 const [openFaq,setOpenFaq]=useState<number|null>(0);
 useEffect(()=>{
  if(!root.current || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  const ctx=gsap.context(()=>{
    gsap.from('.fc-hero .fc-word',{yPercent:125,rotationX:-35,stagger:.1,duration:1.15,ease:'expo.out'});
    gsap.from('.fc-hero .fc-intro-item',{opacity:0,y:25,stagger:.13,duration:1,ease:'power3.out',delay:.4});
    gsap.to('.fc-mascot',{y:-24,rotation:4,repeat:-1,yoyo:true,duration:3.2,ease:'sine.inOut'});
    gsap.to('.fc-orbit',{rotation:360,duration:38,repeat:-1,ease:'none'});
    gsap.utils.toArray<HTMLElement>('.fc-reveal').forEach(el=>gsap.from(el,{opacity:0,y:56,rotateX:4,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 89%',once:true}}));
    gsap.to('.fc-big-type',{xPercent:-9,ease:'none',scrollTrigger:{trigger:'.fc-manifesto',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.from('.fc-track',{opacity:0,y:58,stagger:.1,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.fc-tracks-grid',start:'top 88%',once:true}});
  },root);
  return()=>ctx.revert();
 },[]);
 useEffect(()=>{if(!menu)return;const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[menu]);
 return <div className="fc-site" ref={root}>
  <a className="fc-skip" href="#fc-main">Skip to content</a>
  <header className="fc-nav">
   <a href="/futurecraft" className="fc-brand" aria-label="Futurecraft home"><img src="/futurecraft/mascot.webp" alt="" width="40" height="40" /><strong>futurecraft<span>®</span></strong></a>
   <nav className={menu?'fc-nav-links is-open':'fc-nav-links'} aria-label="Futurecraft navigation">
    <a href="#why" onClick={()=>setMenu(false)}>THE IDEA</a><a href="#tracks" onClick={()=>setMenu(false)}>WHAT YOU'LL MAKE</a><a href="#experience" onClick={()=>setMenu(false)}>THE EXPERIENCE</a><a href="#faq" onClick={()=>setMenu(false)}>FAQ</a>
   </nav>
   <a href="#join" className="fc-nav-cta">JOIN GENESIS <ArrowUpRight size={17}/></a>
   <button type="button" className="fc-menu" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>
  <main id="fc-main">
   <section className="fc-hero" id="top">
    <div className="fc-hero-grid" aria-hidden="true"/>
    <div className="fc-hero-meta fc-intro-item"><span><i/> CREATIVE TECHNOLOGY ACADEMY</span><span>THE FIRST GENERATION OF MAKERS</span></div>
    <div className="fc-hero-content">
     <div className="fc-kicker fc-intro-item"><span className="fc-dot"/> FOR THE CURIOUS. THE CREATORS. THE BUILDERS.</div>
     <h1><span className="fc-line"><span className="fc-word">DON'T JUST</span></span><span className="fc-line"><span className="fc-word">WATCH THE</span></span><span className="fc-line"><span className="fc-word fc-hero-accent">FUTURE<span className="fc-asterisk">✳</span></span></span><span className="fc-line"><span className="fc-word fc-hero-quiet">MAKE IT.</span></span></h1>
     <div className="fc-hero-bottom fc-intro-item"><p>Learn AI by making actual things. Design, video, games and automation. Start at zero. Build with people like you.</p><div className="fc-actions"><MagneticLink href="#join">JOIN GENESIS — FREE</MagneticLink><MagneticLink href="#tracks" secondary>EXPLORE THE TRACKS</MagneticLink></div></div>
    </div>
    <div className="fc-mascot-stage" aria-label="Futurecraft's friendly robot mascot"><div className="fc-orbit"/><img className="fc-mascot" ref={mascot} src="/futurecraft/mascot.webp" alt="Futurecraft's friendly robot head" width="256" height="256"/><span className="fc-mascot-spark">✦</span></div>
    <div className="fc-hero-footer"><span>SCROLL TO MAKE SOMETHING</span><ArrowDown size={17}/><span>FUTURECRAFT · GENESIS 001</span></div>
   </section>
   <div className="fc-running" aria-label="Make, break, fix and show your work"><div>{Array.from({length:4},(_,i)=><span key={i}>INSPIRE <b>✳</b> BUILD <b>✳</b> BREAK <b>✳</b> FIX <b>✳</b> SHOW <b>✳</b> </span>)}</div></div>
   <section className="fc-problem fc-pad" id="why"><div className="fc-section-top"><span>01 / THE PROBLEM</span><span>YOU KNOW THIS FEELING.</span></div>
    <div className="fc-problem-grid"><div className="fc-reveal"><h2>One more tutorial.<br/>One more save.<br/><em>Zero projects.</em></h2><p>Another prompt. Another tab. Another “I'll try this later.” The problem isn't that you can't learn AI. It's that watching isn't the same as making.</p><a href="#join" className="fc-underline">LET'S CHANGE THAT <ArrowUpRight size={17}/></a></div>
    <div className="fc-window fc-reveal"><div className="fc-window-top"><i/><i/><i/><small>your browser · today</small></div><div className="fc-window-body"><span>HOW TO BUILD ANYTHING WITH AI</span><div className="fc-window-video"><Play size={32} fill="currentColor"/></div><div className="fc-window-rows"><span/><span/><span/></div><div className="fc-saved">SAVED FOR LATER <Check size={16}/></div><div className="fc-window-stamp">STILL NOT STARTED.</div></div></div></div>
   </section>
   <section className="fc-genesis fc-pad" id="genesis"><div className="fc-section-top"><span>02 / THIS IS YOUR START</span><span>GENESIS · THE FIRST BOOTCAMP</span></div>
    <div className="fc-genesis-layout"><div className="fc-reveal"><span className="fc-overline">SOMETHING NEW IS BEGINNING.</span><h2>MEET<br/><em>GENESIS</em><sup>01</sup></h2><p>Futurecraft's first bootcamp. Fourteen weeks of practical creative technology, made for complete beginners. No perfect starting point required.</p><MagneticLink href="#join">CLAIM YOUR FREE PLACE</MagneticLink></div>
    <div className="fc-stat-grid fc-reveal"><div><strong>14</strong><span>WEEKS<br/>OF MAKING</span></div><div><strong>2<small>H</small></strong><span>PRACTICAL<br/>SESSIONS</span></div><div className="fc-stat-highlight"><strong>₦0</strong><span>TO JOIN<br/>GENESIS</span></div><div className="fc-stat-image"><img src="/images/blog/creative-desk.jpg" alt="Creative workspace with tools and project materials" loading="lazy"/><span>YOUR IDEAS BELONG OUT HERE ↗</span></div></div></div>
   </section>
   <section className="fc-tracks fc-pad" id="tracks"><div className="fc-section-top"><span>03 / FOUR WAYS TO MAKE</span><span>NOT SOFTWARE LESSONS. REAL OUTPUTS.</span></div><div className="fc-tracks-head fc-reveal"><h2>YOUR IDEAS,<br/><em>OUT IN THE WORLD.</em></h2><p>Pick a curiosity. Explore the possibilities. Leave with projects you can show.</p></div>
   <div className="fc-tracks-grid">{tracks.map(t=><article key={t.n} className="fc-track" style={{'--track-color':t.color} as React.CSSProperties}><div className="fc-track-image"><Image src={t.image} alt={t.label+' creative project inspiration'} fill sizes="(max-width: 800px) 90vw, 50vw" /><span className="fc-track-index">{t.n} / 04</span><span className="fc-track-label">{t.label}</span></div><div className="fc-track-body"><h3>{t.title.split('\n').map((v,i)=><span key={i}>{v}<br/></span>)}</h3><p>{t.desc}</p><div className="fc-tags">{t.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div></article>)}</div></section>
   <section className="fc-manifesto" id="experience"><div className="fc-manifesto-image" role="img" aria-label="A creative desk and tools ready for practical work"/><div className="fc-manifesto-overlay"><span>04 / THE EXPERIENCE</span><h2>LESS TALKING.<br/><em>MORE MAKING.</em></h2><p>Bring your curiosity. Build with other beginners. Make mistakes. Get unstuck. Show the work.</p><div className="fc-method"><span>INSPIRE</span><ArrowRight/><span>BUILD</span><ArrowRight/><span>BREAK</span><ArrowRight/><span>FIX</span><ArrowRight/><span>SHOW</span></div></div><div className="fc-big-type" aria-hidden="true">NOT A NORMAL CLASSROOM ·</div></section>
   <section className="fc-community fc-pad" id="community"><div className="fc-section-top"><span>05 / PEOPLE MAKE THE DIFFERENCE</span><span>YOU WON'T DO THIS ALONE.</span></div><div className="fc-community-grid"><div className="fc-reveal"><span className="fc-overline">THE MAKER COMMUNITY</span><h2>GOOD IDEAS<br/>GROW <em>TOGETHER.</em></h2><p>Get feedback, ask the questions you think are silly, meet other first-timers and learn from people already doing the work.</p><ul><li><Check/> Build alongside other beginners</li><li><Check/> Show actual project progress</li><li><Check/> Learn from guest AI creators and practitioners</li></ul></div><div className="fc-community-art fc-reveal"><img src="/images/blog/ai-seven-day-experiment.jpg" alt="AI experimentation and digital creative work" loading="lazy"/><span>THE FUTURE HAS A GROUP PROJECT.</span><div className="fc-sticker">YOU<br/>BELONG<br/>HERE ✳</div></div></div></section>
   <section className="fc-faq fc-pad" id="faq"><div className="fc-section-top"><span>06 / YOUR QUESTIONS</span><span>STRAIGHT ANSWERS.</span></div><div className="fc-faq-grid"><h2 className="fc-reveal">GOOD<br/><em>QUESTION.</em></h2><div className="fc-faq-items">{faqs.map(([q,a],i)=><div key={q} className="fc-faq-item"><button type="button" aria-expanded={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?null:i)}><span>{String(i+1).padStart(2,'0')}</span><strong>{q}</strong><span>{openFaq===i?'−':'+'}</span></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>
   <section className="fc-join fc-pad" id="join"><div className="fc-section-top"><span>07 / THE FIRST STEP</span><span>GENESIS · FREE · 14 WEEKS</span></div><div className="fc-join-grid"><div className="fc-join-copy fc-reveal"><span className="fc-overline">BECOME A MAKER.</span><h2>YOU'VE<br/>WATCHED<br/><em>ENOUGH.</em></h2><p>Start from zero. Make things with AI. Find your people. Register your interest for the first Genesis Bootcamp.</p><div className="fc-join-note"><Sparkles size={20}/> THIS IS WHERE YOU START MAKING.</div></div><Registration/></div></section>
  </main>
  <footer className="fc-footer"><div className="fc-footer-top"><a href="#top" className="fc-brand"><img src="/futurecraft/mascot.webp" alt="" width="42" height="42"/>futurecraft®</a><a href="#top">BACK TO TOP ↑</a></div><div className="fc-footer-type">MAKE IT<span>✳</span></div><div className="fc-footer-bottom"><span>FUTURECRAFT · A CREATIVE TECHNOLOGY ACADEMY</span><span>AN INDEPENDENT CO-FOUNDED INITIATIVE</span><span><a href="/futurecraft/privacy">PRIVACY</a> · LEARN THE FUTURE BY MAKING IT.</span></div></footer>
 </div>;
}