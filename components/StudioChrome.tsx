'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import StudioMotion from '@/components/StudioMotion';
import MobileBottomNav from '@/components/MobileBottomNav';
const GeminiAssistant = dynamic(() => import('@/components/GeminiAssistant'), { ssr: false });
export function StudioLoading() { const path = usePathname(); return ['/', '/portfolio', '/moremi', '/studio'].includes(path) ? null : <LoadingScreen />; }
export default function StudioChrome() {
  const path = usePathname();
  if (['/', '/portfolio', '/studio'].includes(path)) return <><StudioMotion /><GeminiAssistant /><footer className="studio-footer"><a href="/" aria-label="Silk Studio home"><Image src="/logo-white.svg" alt="Silk Studio" width={100} height={34} /></a><span>Design. Build. Make. / Lagos, Nigeria</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="#top">Back to top ↑</a></div></footer></>;
  if (path === "/moremi") return <StudioMotion />;
  return <><StudioMotion /><Footer /><WhatsAppButton /><CustomCursor /><MobileBottomNav /><GeminiAssistant /></>;
}
