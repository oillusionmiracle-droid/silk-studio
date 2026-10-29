import LabsDirectory from '@/components/futurecraft/LabsDirectory';
import type { Metadata } from 'next';
import '@/components/futurecraft/living-canvas.css';
import '@/components/futurecraft/futurecraft-editorial.css';
import './labs.css';

export const metadata:Metadata={title:'The Labs | Futurecraft Academy',description:'Make prototypes, images, websites, campaigns, automations and tiny games with the Futurecraft community.',alternates:{canonical:'/futurecraft/labs'},openGraph:{title:'The Labs | Futurecraft Academy',description:'Make prototypes, images, websites, campaigns, automations and tiny games with the Futurecraft community.',url:'https://www.silkstudios.com.ng/futurecraft/labs',siteName:'Futurecraft Academy',type:'website',images:[{url:'/futurecraft/identity/share.jpg',width:1200,height:630,alt:'Futurecraft Academy — Learn by making'}]},twitter:{card:'summary_large_image',title:'The Labs | Futurecraft Academy',description:'Make prototypes, images, websites, campaigns, automations and tiny games with the Futurecraft community.',images:['/futurecraft/identity/share.jpg']}};
export default function LabsPage(){return <LabsDirectory/>;}
