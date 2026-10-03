'use client';
/* Moremi waitlist page — ported from the approved HTML preview.
   Styles live in ./moremi.css, scoped under .moremi-scope (imported by layout). */
import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

declare global {
  interface Window {
    __motionOn?: boolean;
    __startFloaties?: () => void;
  }
}

export default function MoremiPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    window.__motionOn = true;
    window.__startFloaties = function(){
        if(!gsap) return;
        document.querySelectorAll('.floaty').forEach(function(el, i){
          gsap.to(el, {y:'-=16', rotation: i%2 ? 9 : -9, duration: 2 + i*.45,
            yoyo:true, repeat:-1, ease:'sine.inOut', overwrite:'auto'});
        });
      };
    /* ====== NAV HIDE ON SCROLL ====== */
    (function(){
      var nav = document.querySelector('.nav')!;
      if(!nav) return;
      var lastY = window.scrollY || 0;
      var ticking = false;
      function onScroll(){
        var y = window.scrollY || 0;
        if(y > lastY && y > 140){
          nav.classList.add('nav-hidden');
        }else if(y < lastY){
          nav.classList.remove('nav-hidden');
        }
        lastY = y;
        ticking = false;
      }
      window.addEventListener('scroll', function(){
        if(!ticking){ ticking = true; requestAnimationFrame(onScroll); }
      }, {passive:true});
    })();
    /* ====== MOBILE HAMBURGER MENU ====== */
    (function(){
      var btn = document.getElementById('menuBtn')!;
      var menu = document.getElementById('mobileMenu')!;
      if(!btn || !menu) return;
      btn.addEventListener('click', function(){
        var open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
      menu.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){
          menu.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
        });
      });
    })();
    /* ====== WAITLIST BACKEND — connected ======
       Formspree form ID wired in 2026-10-03. Signups land in the
       Formspree inbox + email. Endpoint: https://formspree.io/f/mqparavo
    */
    const FORMSPREE_ID = "mqparavo";

    const tabParent = document.getElementById('tabParent')!;
    const tabSchool = document.getElementById('tabSchool')!;
    const parentFields = document.getElementById('parentFields')!;
    const schoolFields = document.getElementById('schoolFields')!;
    const audience = document.getElementById('audience')! as HTMLInputElement;

    function setAudience(who: string){
      const isParent = who === 'parent';
      tabParent.setAttribute('aria-pressed', String(isParent));
      tabSchool.setAttribute('aria-pressed', String(!isParent));
      parentFields.hidden = !isParent;
      schoolFields.hidden = isParent;
      audience.value = who;
      parentFields.querySelectorAll('input,select').forEach(el=>{ (el as HTMLInputElement).required = isParent && el.id!=='p-phone'; })
      schoolFields.querySelectorAll('input,select').forEach(el=>{ (el as HTMLInputElement).required = !isParent && el.id!=='s-role' && el.id!=='s-pupils'; })
    }
    tabParent.addEventListener('click', ()=>setAudience('parent'));
    tabSchool.addEventListener('click', ()=>setAudience('school'));
    document.querySelectorAll('[data-who="school"]').forEach(a=>{
      a.addEventListener('click', ()=>setAudience('school'));
    });
    setAudience('parent');

    const form = document.getElementById('waitlistForm')! as HTMLFormElement;
    const errorMsg = document.getElementById('errorMsg')!;
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      errorMsg.style.display='none';
      if(!form.checkValidity()){ form.reportValidity(); return; }
      const btn = document.getElementById('submitBtn')! as HTMLButtonElement;
      btn.disabled = true; btn.classList.add('loading');
      try{
        const data = Object.fromEntries(new FormData(form).entries());
        const res = await fetch("https://formspree.io/f/"+FORMSPREE_ID,{
          method:"POST", headers:{"Accept":"application/json","Content-Type":"application/json"},
          body: JSON.stringify(data)
        });
        if(!res.ok) throw new Error("submit failed");
        btn.classList.remove('loading'); btn.classList.add('done');
        setTimeout(function(){
          document.getElementById('formWrap')!.style.display='none';
          document.getElementById('successMsg')!.style.display='block';
          document.getElementById('successMsg')!.scrollIntoView({behavior:'smooth',block:'center'});
        }, 750);
      }catch(err){
        errorMsg.textContent = "Something went wrong sending your signup. Please try again in a moment.";
        errorMsg.style.display='block';
        btn.disabled = false; btn.classList.remove('loading');
      }
    });
    /* ====== LIVELY MOTION (GSAP) ======
       Everything uses gsap.from(), so if GSAP fails to load the page
       simply appears static — content is never hidden by default. */
    (function(){
      if(!gsap || !window.__motionOn) return;
      gsap.registerPlugin(ScrollTrigger);
      if(SplitText){ gsap.registerPlugin(SplitText); }

      /* hero entrance — Popcorn Pop on the headline */
      if(SplitText){
        var heroSplit = SplitText.create('.hero h1', {type:'chars'});
        gsap.from(heroSplit.chars, {
          scale:0, y:30,
          rotation:function(){ return gsap.utils.random(-20, 20); },
          stagger:{each:0.04, from:'random'},
          duration:0.4, ease:'back.out(2)'
        });
      }else{
        gsap.from('.hero h1', {y:44, opacity:0, duration:.8, ease:'back.out(1.6)'});
      }
      gsap.from('.hero .lead', {y:26, opacity:0, duration:.7, delay:.15});
      gsap.from('.hero-cta .btn', {y:22, opacity:0, duration:.5, stagger:.1, delay:.3, ease:'back.out(2)'});
      gsap.from('.film', {scale:.94, opacity:0, duration:.8, delay:.45, ease:'power3.out'});
      gsap.from('.fact', {y:14, opacity:0, duration:.4, stagger:.07, delay:.7, ease:'back.out(2)'});

      /* floating stickers */
      document.querySelectorAll('.floaty').forEach(function(el, i){
        gsap.to(el, {y:'-=16', rotation: i%2 ? 9 : -9, duration: 2 + i*.45,
          yoyo:true, repeat:-1, ease:'sine.inOut'});
      });

      /* scroll reveals — bubbly bouncy pop on section heads (block-level, text-safe) */
      gsap.utils.toArray<HTMLElement>('.sec-head').forEach(function(el){
        var h = el.querySelector('h2');
        var p = el.querySelector('p');
        if(h){
          gsap.from(h, {y:50, scale:.7, opacity:0, duration:.9, ease:'back.out(2.2)',
            scrollTrigger:{trigger:el, start:'top 88%'}});
        }
        if(p){
          gsap.from(p, {y:20, opacity:0, duration:.6, delay:.35, ease:'power3.out',
            scrollTrigger:{trigger:el, start:'top 88%'}});
        }
      });
      gsap.utils.toArray<HTMLElement>('.trust-item').forEach(function(el, i){
        gsap.from(el, {y:36, opacity:0, duration:.6, delay:(i%4)*.08, ease:'back.out(1.6)',
          scrollTrigger:{trigger:el, start:'top 90%'}});
      });
      gsap.utils.toArray<HTMLElement>('.tile').forEach(function(el){
        gsap.from(el, {y:56, opacity:0, duration:.7, ease:'back.out(1.4)', clearProps:'transform,opacity',
          scrollTrigger:{trigger:el, start:'top 88%'}});
      });
      gsap.utils.toArray<HTMLElement>('.step').forEach(function(el, i){
        gsap.from(el, {y:44, opacity:0, duration:.6, ease:'back.out(1.5)',
          scrollTrigger:{trigger:el, start:'top 88%'}});
      });
      gsap.from('.teacher', {x:-60, opacity:0, duration:.8, ease:'back.out(1.4)',
        scrollTrigger:{trigger:'.classroom', start:'top 78%'}});
      gsap.from('.board', {x:60, opacity:0, duration:.8, ease:'power3.out',
        scrollTrigger:{trigger:'.classroom', start:'top 78%'}});
      gsap.from('.board li', {x:-26, opacity:0, duration:.45, stagger:.09, ease:'power2.out',
        scrollTrigger:{trigger:'.board', start:'top 75%'}});
      gsap.from('.band', {y:50, opacity:0, scale:.97, duration:.8, ease:'power3.out',
        scrollTrigger:{trigger:'.band', start:'top 85%'}});
      gsap.from('.waitlist-card', {y:50, opacity:0, duration:.8, ease:'back.out(1.3)',
        scrollTrigger:{trigger:'.waitlist-card', start:'top 85%'}});
      gsap.utils.toArray<HTMLElement>('.faq details').forEach(function(el){
        gsap.from(el, {y:24, opacity:0, duration:.5, ease:'power2.out',
          scrollTrigger:{trigger:el, start:'top 92%'}});
      });

      /* springy button press — goes down, bounces back */
      document.querySelectorAll('.btn').forEach(function(btn){
        btn.addEventListener('pointerdown', function(){
          gsap.to(btn, {scale:.92, y:5, duration:.1, ease:'power2.in'});
        });
        var release = function(){
          gsap.to(btn, {scale:1, y:0, duration:.55, ease:'elastic.out(1,.45)'});
        };
        btn.addEventListener('pointerup', release);
        btn.addEventListener('pointerleave', release);
      });

      /* teacher gives a little wave-nod when her board scrolls in */
      ScrollTrigger.create({
        trigger:'.classroom', start:'top 70%', once:true,
        onEnter:function(){
          gsap.fromTo('.teacher', {rotation:0}, {rotation:2.5, duration:.35, yoyo:true, repeat:3, ease:'sine.inOut'});
        }
      });
    })();
    /* ====== EXPANDABLE BENTO TILES ======
       Plain CSS grid animation — works with or without GSAP. */
    (function(){
      var tiles = document.querySelectorAll('.tile');
      function refreshScroll(){
        if(ScrollTrigger){ setTimeout(function(){ ScrollTrigger.refresh(); }, 500); }
      }
      function toggle(tile: HTMLElement){
        var isOpen = tile.classList.contains('open');
        tiles.forEach(function(t){
          t.classList.remove('open');
          t.classList.remove('dimmed');
          t.setAttribute('aria-expanded','false');
        });
        if(!isOpen){
          tile.classList.add('open');
          tile.setAttribute('aria-expanded','true');
          tiles.forEach(function(t){ if(t !== tile) t.classList.add('dimmed'); });
        }
        refreshScroll();
      }
      tiles.forEach(function(t){ const tile = t as HTMLElement;
        tile.addEventListener('click', function(){ toggle(tile); });
        tile.addEventListener('keydown', function(e: KeyboardEvent){
          if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(tile); }
        });
      });
    })();

    return () => {
      try {
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.globalTimeline.clear();
        gsap.killTweensOf('*');
      } catch (e) {}
    };
  }, []);

  return (
    <div className="moremi-scope">


<nav className="nav">
  <div className="wrap nav-inner">
    <a className="wordmark" href="#top">more<span>mi</span></a>
    
    <div className="nav-links"><a href="/">Silk Studio</a>
      <a href="#what">What it does</a>
      <a href="#schools">Schools</a>
      <a href="#faq">FAQ</a>
      <a className="btn" href="#waitlist" style={{fontSize: '16px', padding: '10px 22px'}}>Join the waitlist</a>
    </div>
    <div className="nav-actions">
      <button className="hamburglar" id="menuBtn" aria-label="Open menu" aria-expanded="false">
        <span className="burger-icon" aria-hidden="true"><span className="burger-container">
          <span className="burger-bun-top"></span>
          <span className="burger-filling"></span>
          <span className="burger-bun-bot"></span>
        </span></span>
        <span className="burger-ring" aria-hidden="true">
          <svg className="svg-ring" viewBox="0 0 68 68">
            <path className="path" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" d="M 34 2 C 16.3 2 2 16.3 2 34 s 14.3 32 32 32 s 32 -14.3 32 -32 S 51.7 2 34 2"/>
          </svg>
        </span>
      </button>
    </div>
  </div>
  <div className="mobile-menu" id="mobileMenu"><a href="/" className="back-home">← Silk Studio</a>
    <a href="#what">What it does</a>
    <a href="#how">How it works</a>
    <a href="#gains">Classroom</a>
    <a href="#schools">Schools</a>
    <a href="#faq">FAQ</a>
    <a href="#waitlist" className="btn">Join the waitlist</a>
  </div>
</nav>

<header className="hero" id="top">
  <div className="wrap">
    <h1>Stop scrolling. <span className="hl">Start building.</span></h1>
    <p className="lead">A Nigeria-first AI playground where kids build real apps, games, and stories with AI — guided by Moremi, their mischievous little builder buddy.</p>
    <div className="hero-cta">
      <span className="btn-3d"><a className="btn" href="#waitlist">Join the waitlist</a></span>
    </div>
    <div className="film-wrap"><div className="film-video"><iframe src="https://www.youtube-nocookie.com/embed/ZL52Dsv2qpg?rel=0" title="Watch the Moremi film" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div></div>
    <div className="facts">
      <span className="fact">Ages 8–12</span>
      <span className="fact">12 challenges in version one</span>
      <span className="fact">Made for Africa first</span>
      <span className="fact">New drops every month</span>
    </div>
  </div>
  <svg className="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0,48 C240,90 480,0 720,36 C960,72 1200,90 1440,40 L1440,80 L0,80 Z" fill="#F2B705"/>
  </svg>
</header>

<section className="trust-band" aria-label="Safety promises">
  <div className="wrap">
    <div className="trust-grid">
      <div className="trust-item">
        <div className="trust-img"><img src="/moremi/moremi-car-cut.png" alt="Moremi driving her police car"/></div>
        <p>Safe by design</p>
      </div>
      <div className="trust-item">
        <div className="trust-img"><img src="/moremi/moremi-sign-cut.png" alt="Moremi holding up a blank sign"/></div>
        <p>No ads</p>
      </div>
      <div className="trust-item">
        <div className="trust-img"><img src="/moremi/moremi-playsafe-cut.png" alt="Moremi holding up one finger"/></div>
        <p>No chatting with strangers</p>
      </div>
      <div className="trust-item">
        <div className="trust-img"><img src="/moremi/moremi-backpack-cut.png" alt="Moremi wearing a colorful backpack"/></div>
        <p>Made for ages 8–12</p>
      </div>
    </div>
  </div>
  <svg className="t-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" style={{background: '#F2B705'}}><path fill="#2E2078" d="M0,48 C240,90 480,0 720,36 C960,72 1200,90 1440,40 L1440,80 L0,80 Z"/></svg>
</section>

<section id="what">
  <div className="wrap">
    <div className="sec-head">
      <h2>Not another app to watch. A world to build.</h2>
      <p>Kids don&apos;t just use Moremi — they make things with it. Every challenge ends with something they built themselves, with AI doing the heavy lifting. No coding needed.</p>
    </div>
    <div className="bento" id="bentoGrid">
      <article className="tile wide" style={{'--g1': '#DCD2FF', '--g2': '#BFA9F2'} as CSSProperties} tabIndex={0} role="button" aria-expanded="false" aria-label="Build apps — tap to expand">
        <span className="tile-plus" aria-hidden="true"></span>
        <span className="tile-num">01</span>
        <h3>Build apps</h3>
        <p>Kids build real working apps with AI — they describe what they want, Moremi helps them make it. No coding knowledge required.</p>
        <div className="detail"><div className="detail-inner"><div className="detail-pad">
          <ul>
            <li><b>Describe it in plain words</b> — they say what they want, AI builds it with them</li>
            <li><b>Real working apps</b> — they can open, use, and show off</li>
            <li><b>Example challenges</b> — a tap counter, a family quiz, a greeting-card app</li>
          </ul>
        </div></div></div>
            <img className="tile-char char-apps" src="/moremi/moremi-apps-cut.png" alt=""/>
</article>
      <article className="tile" style={{'--g1': '#FFC9DE', '--g2': '#F49AC0'} as CSSProperties} tabIndex={0} role="button" aria-expanded="false" aria-label="Build games — tap to expand">
        <span className="tile-plus" aria-hidden="true"></span>
        <span className="tile-num">02</span>
        <h3>Build games</h3>
        <p>Playable tap games and arcade challenges they design themselves.</p>
        <div className="detail"><div className="detail-inner"><div className="detail-pad">
          <ul>
            <li><b>Design it themselves</b> — characters, rules, and levels</li>
            <li><b>Play instantly</b> — every game works the moment it&apos;s built</li>
            <li><b>Earn their wins</b> — tickets, scores, and high-five moments</li>
          </ul>
        </div></div></div>
            <img className="tile-char char-games" src="/moremi/moremi-games-cut.png" alt=""/>
</article>
      <article className="tile" style={{'--g1': '#E9F38C', '--g2': '#CBD946'} as CSSProperties} tabIndex={0} role="button" aria-expanded="false" aria-label="Create stories — tap to expand">
        <span className="tile-plus" aria-hidden="true"></span>
        <span className="tile-num">03</span>
        <h3>Create stories</h3>
        <p>Branching storybooks created with AI, where their choices shape what happens next.</p>
        <div className="detail"><div className="detail-inner"><div className="detail-pad">
          <ul>
            <li><b>Their choices shape the tale</b> — branching paths, different endings</li>
            <li><b>Living story worlds</b> — magical lands that react to what they decide</li>
            <li><b>Read, choose, create</b> — then tell it back in their own words</li>
          </ul>
        </div></div></div>
            <img className="tile-char char-stories" src="/moremi/moremi-stories-cut.png" alt=""/>
</article>
      <article className="tile wide" style={{'--g1': '#FFF082', '--g2': '#F6D63E'} as CSSProperties} tabIndex={0} role="button" aria-expanded="false" aria-label="Fresh drops every month — tap to expand">
        <span className="tile-plus" aria-hidden="true"></span>
        <span className="tile-num">04</span>
        <h3>Fresh drops, every month</h3>
        <p>A brand-new challenge lands every month — 12 in version one. The waitlist always gets invited first.</p>
        <div className="detail"><div className="detail-inner"><div className="detail-pad">
          <ul>
            <li><b>12 challenges</b> in version one — apps, games, and stories</li>
            <li><b>Waitlist first</b> — invites go out in signup order</li>
            <li><b>Always something new</b> — boredom doesn&apos;t stand a chance</li>
          </ul>
        </div></div></div>
            <img className="tile-char char-drops" src="/moremi/moremi-celebrate-cut.png" alt=""/>
</article>
    </div>
  </div>
  <svg className="t-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" style={{background: '#2E2078'}}><path fill="#FFFBF2" d="M0,48 C240,90 480,0 720,36 C960,72 1200,90 1440,40 L1440,80 L0,80 Z"/></svg>
</section>

<section id="how" style={{paddingTop: 0}}>
  <div className="wrap">
    <div className="sec-head">
      <h2>Getting in is simple</h2>
    </div>
    <div className="steps">
      <div className="step">
        <h3>Join the waitlist</h3>
        <p>Tell us if you&apos;re a parent or a school. It takes one minute.</p>
      </div>
      <div className="step">
        <h3>Get your invite</h3>
        <p>New challenges drop every month. The waitlist gets invited first.</p>
      </div>
      <div className="step">
        <h3>Start building</h3>
        <p>One simple one-time price. No subscriptions, no ads, no nonsense.</p>
      </div>
    </div>
  </div>
</section>

<section id="gains" className="tint-sky" style={{paddingTop: '72px'}}>
  <div className="wrap">
    <div className="sec-head">
      <h2>Listen up. Class is in session.</h2>
      <p>Teacher Moremi has the syllabus. Here&apos;s what your child walks away with.</p>
    </div>
    <div className="classroom">
      <img className="teacher" src="/moremi/moremi-teacher-cut.png" alt="Moremi dressed as a teacher with cat-eye glasses, pointing at the class board"/>
      <img className="teacher-peek" src="/moremi/moremi-teacher-peek-cut.png" alt="Moremi wearing a graduation cap"/>
      <div className="board">
        <h3>What your child gains</h3>
        <ul>
          <li><b>Real problem-solving</b> — they think, test, and fix things themselves</li>
          <li><b>Confidence</b> — every challenge ends with something they built</li>
          <li><b>Creativity</b> — their apps, their games, their story endings</li>
          <li><b>AI fluency</b> — they learn to command AI instead of just consuming it</li>
          <li><b>Focus</b> — deep, satisfying work instead of endless scrolling</li>
          <li><b>Pride</b> — something real to show mum and dad</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="schools" style={{paddingTop: 0}}>
  <div className="wrap">
    <div className="band">
      <div>
        <h2>Bring Moremi to your school.</h2>
        <p>Hands-on workshops where pupils build apps and games with AI — led by our network of AI educators visiting schools across Nigeria. Real skills, real projects, huge smiles.</p>
        <span className="btn-3d"><a className="btn yellow" href="#waitlist" data-who="school">Join as a school</a></span>
      </div>
      <div className="band-art">
        <img src="/moremi/field.jpg" alt="Moremi and a young builder running through a field, laughing"/>
      </div>
    </div>
  </div>
</section>

<section id="waitlist" style={{paddingTop: '72px'}}>
  <div className="wrap">
    <div className="waitlist-card">
      <span className="perf perf-x perf-top" aria-hidden="true"></span>
      <span className="perf perf-x perf-bot" aria-hidden="true"></span>
      <span className="perf perf-y perf-l" aria-hidden="true"></span>
      <span className="perf perf-y perf-r" aria-hidden="true"></span>
      <div id="formWrap">
        <h2>Get your invite first.</h2>
        <p>Join the waitlist — parents and schools welcome.</p>
        <div className="toggle" role="group" aria-label="I am joining as">
          <button type="button" id="tabParent" aria-pressed="true">I&apos;m a parent</button>
          <button type="button" id="tabSchool" aria-pressed="false">I&apos;m a school</button>
        </div>
        <div className="error-msg" id="errorMsg"></div>
        <form id="waitlistForm" noValidate>
          <div id="parentFields">
            <div className="grid2">
              <div className="field"><label htmlFor="p-name">Your name</label><input id="p-name" name="name" type="text" required autoComplete="name" placeholder="Amina Bello"/></div>
              <div className="field"><label htmlFor="p-email">Email</label><input id="p-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com"/></div>
            </div>
            <div className="grid2">
              <div className="field"><label htmlFor="p-phone">Phone <span style={{fontWeight: 600, color: 'var(--ink-soft)'}}>(optional)</span></label><input id="p-phone" name="phone" type="tel" autoComplete="tel" placeholder="0803 000 0000"/></div>
              <div className="field"><label htmlFor="p-age">Child&apos;s age</label>
                <select id="p-age" name="child_age" required>
                  <option value="" disabled selected>Select age</option>
                  <option>7 and below</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13 and above</option>
                </select>
              </div>
            </div>
            <div className="field"><label htmlFor="p-city">City</label><input id="p-city" name="city" type="text" required autoComplete="address-level2" placeholder="Lagos"/></div>
          </div>
          <div id="schoolFields" hidden>
            <div className="grid2">
              <div className="field"><label htmlFor="s-school">School name</label><input id="s-school" name="school_name" type="text" autoComplete="organization" placeholder="Sunshine Schools"/></div>
              <div className="field"><label htmlFor="s-name">Your name</label><input id="s-name" name="name" type="text" autoComplete="name" placeholder="Amina Bello"/></div>
            </div>
            <div className="grid2">
              <div className="field"><label htmlFor="s-role">Your role</label>
                <select id="s-role" name="role">
                  <option value="" disabled selected>Select role</option>
                  <option>Head of School / Principal</option><option>Teacher</option><option>Administrator</option><option>Parent-Teacher Association</option><option>Other</option>
                </select>
              </div>
              <div className="field"><label htmlFor="s-pupils">Number of pupils</label>
                <select id="s-pupils" name="pupils">
                  <option value="" disabled selected>Select range</option>
                  <option>Under 100</option><option>100 – 300</option><option>300 – 600</option><option>600 – 1,000</option><option>Over 1,000</option>
                </select>
              </div>
            </div>
            <div className="grid2">
              <div className="field"><label htmlFor="s-email">Email</label><input id="s-email" name="email" type="email" autoComplete="email" placeholder="school@example.com"/></div>
              <div className="field"><label htmlFor="s-phone">Phone</label><input id="s-phone" name="phone" type="tel" autoComplete="tel" placeholder="0803 000 0000"/></div>
            </div>
            <div className="field"><label htmlFor="s-state">State</label><input id="s-state" name="state" type="text" autoComplete="address-level1" placeholder="Lagos"/></div>
          </div>
          <input type="hidden" name="audience" id="audience" value="parent"/>
          <button className="submit-btn" type="submit" id="submitBtn">
            <span className="sb-text">Join the waitlist</span>
            <span className="sb-fill" aria-hidden="true"></span>
            <svg className="sb-check" viewBox="0 0 25 30" aria-hidden="true"><path d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2"/></svg>
          </button>
          <p className="form-note">We&apos;ll only email you about Moremi. No spam, ever.</p>
        </form>
      </div>
      <div className="success" id="successMsg">
        <div className="big">🎉</div>
        <h3>You&apos;re on the list!</h3>
        <p>Watch your inbox — your invite is coming.</p>
      </div>
    </div>
  </div>
</section>

<section id="faq" style={{paddingTop: 0}}>
  <div className="wrap">
    <div className="sec-head"><h2>Got questions?</h2></div>
    <div className="faq">
      <details><summary>What ages is Moremi for?</summary><p>It&apos;s made for kids aged 8 to 12 — but younger and older children can use it too. The challenges are designed to stretch young builders without overwhelming them.</p></details>
      <details><summary>What does my child need to start?</summary><p>A smartphone or tablet and an internet connection. That&apos;s it — everything runs in the browser.</p></details>
      <details><summary>How much does it cost?</summary><p>One simple one-time price. No subscriptions, no hidden fees, no ads.</p></details>
      <details><summary>When does it launch?</summary><p>New challenges drop every month, twelve in version one. The waitlist gets invited first, in order.</p></details>
      <details><summary>Is it safe for kids?</summary><p>Moremi is built for kids first: no ads, no chatting with strangers, and nothing they can stumble into that you wouldn&apos;t approve of.</p></details>
      <details><summary>I&apos;m a teacher — how do school workshops work?</summary><p>Join the waitlist as a school and tell us your pupil count. Our AI educators run hands-on workshops where pupils build real projects — we&apos;ll reach out about your area.</p></details>
    </div>
  </div>
</section>

<section style={{paddingTop: 0}}>
  <div className="wrap">
    <div className="cta-band">
      <h2>Ready to stop scrolling?</h2>
      <p>Join the waitlist — parents and schools welcome.</p>
      <a className="btn ghost" href="#waitlist">Join the waitlist</a>
    </div>
  </div>
</section>

<footer>
  <img className="foot-sticker fs-left" src="/moremi/moremi-sticker-footer.png" alt="Moremi smiling"/>
  <div className="wrap">
    <div className="foot">
      <div>
        <a className="wordmark" href="#top">more<span>mi</span></a>
        <p>A Nigeria-first AI playground for young builders. A product of Silk Studio, Lagos.</p>
      </div>
      <div className="foot-links">
        <a href="https://silkstudios.com.ng">Silk Studio</a>
        <a href="mailto:thesilkstudiong@gmail.com">Email us</a>
        <a href="https://instagram.com/thesilkstudiong">Instagram</a>
      </div>
    </div>
    <div className="copy">
      <span>© 2026 Silk Studio Nigeria Limited. All rights reserved.</span>
      <span>Stop scrolling. Start building.</span>
    </div>
  </div>
</footer>

    </div>
  );
}
