import type { Metadata } from 'next';
import './futurecraft.css';
export const metadata: Metadata = {
 title: 'Genesis Bootcamp 1.0 | Futurecraft Academy',
 description:'Join the first free, 14-week Futurecraft Genesis Bootcamp. Learn to design, build, animate and automate with other beginners through practical Labs.',
 alternates:{canonical:'/futurecraft'},
 openGraph:{title:'Genesis Bootcamp 1.0 — Futurecraft Academy',description:'Start from zero. Build something real. Join the first free 14-week Futurecraft Academy bootcamp.',url:'https://silkstudios.com.ng/futurecraft',siteName:'Futurecraft Academy',type:'website'},
};
export default function FuturecraftLayout({children}:{children:React.ReactNode}){return <>{children}</>;}
