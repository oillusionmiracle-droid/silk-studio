import { pageMetadata } from '@/lib/siteMetadata';
export const metadata = pageMetadata('About Silk Studio — Lagos Design, Print & Digital Studio', 'Silk Studio is a Lagos design, print and digital studio connecting businesses to 100+ vetted Lagos printers, with websites, apps, branding, AI ads and apparel delivered in 48 hours.', '/about', '/og-about.jpg');
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
