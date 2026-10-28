import Link from 'next/link';
export const metadata={title:'Welcome to Genesis · Futurecraft'};
export default function Success(){return <main className="fc-success"><div><img src="/futurecraft/mascot.webp" alt="Futurecraft mascot" width="135" height="135"/><span>GENESIS · FUTURECRAFT</span><h1>YOU&apos;RE ON<br/><em>THE LIST.</em></h1><p>We’ve received your details. Look out for your confirmation and welcome emails with the next steps for the first Makers.</p><Link href="/futurecraft">BACK TO FUTURECRAFT ↗</Link></div></main>;}
