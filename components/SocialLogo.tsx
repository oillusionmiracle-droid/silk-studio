import { useId } from 'react';
export default function SocialLogo({name}:{name:'Instagram'|'Facebook'|'TikTok'}) {
 const id=useId();
 if(name==='Instagram') return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><defs><linearGradient id={id} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#ffd776"/><stop offset=".32" stopColor="#f56040"/><stop offset=".65" stopColor="#c13584"/><stop offset="1" stopColor="#5851db"/></linearGradient></defs><rect width="24" height="24" rx="6" fill={`url(#${id})`}/><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#fff" strokeWidth="1.8"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="#fff" strokeWidth="1.8"/><circle cx="17" cy="7" r="1" fill="#fff"/></svg>;
 if(name==='Facebook') return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#0866ff"/><path d="M13.6 24v-9.2h3.1l.5-3.6h-3.6V9c0-1 .3-1.7 1.8-1.7h1.9V4.1c-.3 0-1.5-.1-2.8-.1-2.8 0-4.6 1.7-4.6 4.7v2.5H7v3.6h2.9V24z" fill="#fff"/></svg>;
 const note='M14 4v11.2a3.6 3.6 0 1 1-3-3.5v2.8a1 1 0 1 0 .4.8V4h2.6c.2 2.3 1.5 3.6 4 3.8v2.7a7 7 0 0 1-4-1.4';
 return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#101010"/><path d={note} fill="#25f4ee" transform="translate(-.65 .3)"/><path d={note} fill="#fe2c55" transform="translate(.65 .75)"/><path d={note} fill="#fff"/></svg>;
}
