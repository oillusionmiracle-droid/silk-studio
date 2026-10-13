'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const Lottie=dynamic(()=>import('lottie-react'),{ssr:false});
export default function NotFound(){
 const [animationData,setAnimationData]=useState<object|null>(null);
 useEffect(()=>{const c=new AbortController();fetch('/animations/404.json',{signal:c.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(setAnimationData).catch(()=>{});return()=>c.abort();},[]);
 return <main className="studio-page lost-page" id="top"><div><span className="studio-eyebrow">404 / A SMALL DETOUR</span><h1>This idea<br/>went <em>wandering.</em></h1><p>We couldn’t find this page. Let’s get you back to something good.</p><div className="studio-inline-actions"><Link href="/" className="studio-button studio-lime">Back to Silk ↗</Link><Link href="/order" className="studio-text-link">Start an order ↗</Link><Link href="/portfolio" className="studio-text-link">Explore the work ↗</Link></div></div><div className="lost-animation" id="lottie-404-container">{animationData?<Lottie animationData={animationData} loop/>:<span>404</span>}</div></main>;
}
