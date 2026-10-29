import type { Metadata } from 'next';
import './futurecraft.css';
const title='Genesis Bootcamp 1.0 | Futurecraft Academy';
const description='Join the first free, 14-week Futurecraft Genesis Bootcamp. Learn to design, build, animate and automate with other beginners through practical Labs.';
const image={url:'/futurecraft/identity/share.jpg',width:1200,height:630,alt:'Futurecraft Academy — The future isn’t waiting. Design. Build. Create. Automate.'};
export const metadata: Metadata = {
 title,description,
 applicationName:'Futurecraft Academy',
 authors:[{name:'Futurecraft Academy'}],creator:'Futurecraft Academy',publisher:'Futurecraft Academy',
 category:'Education',keywords:['Futurecraft Academy','Genesis Bootcamp','AI learning','creative technology','learn by making'],
 alternates:{canonical:'/futurecraft'},
 manifest:'/futurecraft/manifest.webmanifest',
 appleWebApp:{capable:true,statusBarStyle:'default',title:'Futurecraft Academy'},
 icons:{icon:[{url:'/futurecraft/identity/icon.svg',type:'image/svg+xml'},{url:'/futurecraft/identity/icon-32.png',type:'image/png',sizes:'32x32'}],shortcut:'/futurecraft/identity/icon-32.png',apple:[{url:'/futurecraft/identity/icon-180.png',sizes:'180x180',type:'image/png'}]},
 openGraph:{title,description,url:'https://www.silkstudios.com.ng/futurecraft',siteName:'Futurecraft Academy',type:'website',images:[image]},
 twitter:{card:'summary_large_image',title,description,images:[image]},
};
export default function FuturecraftLayout({children}:{children:React.ReactNode}){return <>{children}</>;}
