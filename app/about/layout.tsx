import { pageMetadata } from '@/lib/siteMetadata';
export const metadata = pageMetadata('About Silk Studio — Design, Development & Creative Production', 'Meet Silk Studio: design, development and creative production for brands, websites, apps, custom software, AI ads, print and apparel. Based in Nigeria, working worldwide.', '/about', '/og-about.jpg');
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
