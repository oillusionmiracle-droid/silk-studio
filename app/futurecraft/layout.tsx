import type { Metadata } from 'next';
import './futurecraft.css';
export const metadata: Metadata = {
 title: 'Futurecraft — Genesis Bootcamp | Learn AI by Making Things',
 description:'Join Genesis, Futurecraft’s free 14-week beginner bootcamp. Make AI-powered designs, videos, games and automations with a community of Makers.',
 alternates:{canonical:'/futurecraft'},
 openGraph:{title:'Futurecraft — Stop Watching. Start Making.',description:'Genesis: a free 14-week bootcamp for beginners who want to build real things with AI.',url:'https://silkstudios.com.ng/futurecraft',siteName:'Futurecraft',type:'website'},
};
export default function FuturecraftLayout({children}:{children:React.ReactNode}){return <>{children}</>;}
