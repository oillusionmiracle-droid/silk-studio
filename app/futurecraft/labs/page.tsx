import LabsDirectory from '@/components/futurecraft/LabsDirectory';
import type { Metadata } from 'next';
import '@/components/futurecraft/living-canvas.css';
import '@/components/futurecraft/futurecraft-editorial.css';
import './labs.css';

export const metadata:Metadata={title:'The Labs | Futurecraft Academy',description:'Make prototypes, images, websites, campaigns, automations and tiny games with the Futurecraft community.',alternates:{canonical:'/futurecraft/labs'}};
export default function LabsPage(){return <LabsDirectory/>;}
