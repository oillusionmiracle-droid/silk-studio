'use client';
import StudioFooter from '@/components/StudioFooter';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import StudioMotion from '@/components/StudioMotion';
import MobileBottomNav from '@/components/MobileBottomNav';
const SilkGuide = dynamic(() => import('@/components/SilkGuide'), { ssr: false });
export function StudioLoading() { const path = usePathname(); return (['/', '/portfolio', '/moremi', '/studio', '/website-offer'].includes(path) || path.startsWith('/blog') || path.startsWith('/account') || path.startsWith('/admin')) ? null : <LoadingScreen />; }
export default function StudioChrome() {
  const path = usePathname();
  if (path.startsWith('/account') || path.startsWith('/admin')) return null;
  if (!path.startsWith('/apparel') && !path.startsWith('/moremi')) return <><StudioMotion /><SilkGuide /><StudioFooter /></>;
  if (path.startsWith("/moremi")) return <StudioMotion />;
  return <><StudioMotion /><Footer /><WhatsAppButton /><CustomCursor /><MobileBottomNav /><SilkGuide /></>;
}
