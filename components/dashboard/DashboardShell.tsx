'use client';
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, LayoutDashboard, Package, Heart, FolderOpen, UserRound, LogOut, Menu, X, ShieldCheck, ShoppingBag, Users, MessageSquare, FileText, Mail, Settings, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { initials } from '@/lib/dashboard';
const customerNav = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Your orders', icon: Package },
  { href: '/account/files', label: 'Project files', icon: FolderOpen },
  { href: '/account/wishlist', label: 'Saved pieces', icon: Heart },
  { href: '/account/settings', label: 'Your profile', icon: UserRound },
];
const adminNav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/variants', label: 'Stock & variants', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
];
const contentNav = ['home', 'banners', 'apparel', 'services', 'about', 'testimonials', 'faq', 'portfolio'];
export default function DashboardShell({ admin = false, children }: { admin?: boolean; children: ReactNode }) {
  const { user, profile, isLoading, isAdmin, signOut, openAuthModal } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const allowed = Boolean(user && (!admin || (isAdmin && profile?.id === user.id)));
  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Silk member';
  const nav = admin ? adminNav : customerNav;
  const active = (href: string) => pathname === href || (href !== (admin ? '/admin' : '/account') && pathname.startsWith(`${href}/`));
  async function logout() { setSigningOut(true); try { await signOut(); } finally { setSigningOut(false); } }
  if (isLoading || !allowed) return <main className="dash-gate"><Link href="/" className="dash-brand"><img src="/logo-white.svg" alt="" width={34} height={34}/>Silk Studio</Link><section className="dash-gate-card">{isLoading ? <><Loader2 className="dash-spinner" size={30}/><h1>Opening your workspace.</h1><p>Just a moment while we check your account.</p></> : <><span className="dash-gate-icon">{admin ? <ShieldCheck size={28}/> : <Lock size={28}/>}</span><span className="dash-kicker">{admin ? 'STUDIO ACCESS' : 'YOUR SILK WORKSPACE'}</span><h1>{admin ? 'The studio, behind the scenes.' : 'Good ideas. All in one place.'}</h1><p>{admin ? (user ? 'Your account does not have administrator access.' : 'Sign in with your administrator account to manage the studio.') : 'Track your orders, keep your project files together, and make the next thing.'}</p>{!user && <button className="dash-button dash-lime" onClick={() => openAuthModal('sign_in')}>Sign in to continue <ArrowUpRight size={17}/></button>}<Link className="dash-text-link" href={admin ? '/account' : '/'}>{admin ? 'Go to your customer account' : 'Back to Silk Studio'} ↗</Link></>}</section></main>;
  return <div className={`silk-dashboard ${admin ? 'dash-admin' : 'dash-customer'}`}>
    <a className="dash-skip" href="#workspace-content">Skip to workspace</a>
    <header className="dash-mobile-header"><Link href="/" className="dash-brand"><img src="/logo-white.svg" alt="" width={28} height={28}/>Silk Studio</Link><button onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? 'Close workspace menu' : 'Open workspace menu'} aria-expanded={menuOpen} aria-controls="workspace-navigation">{menuOpen ? <X/> : <Menu/>}</button></header>
    <aside className={`dash-sidebar ${menuOpen ? 'is-open' : ''}`} id="workspace-navigation"><Link href="/" className="dash-brand"><img src="/logo-white.svg" alt="" width={34} height={34}/>Silk Studio</Link><span className="dash-sidebar-label">{admin ? 'STUDIO WORKSPACE' : 'YOUR WORKSPACE'}</span><nav aria-label={admin ? 'Admin workspace' : 'Customer workspace'}>{nav.map(item => <Link href={item.href} key={item.href} aria-current={active(item.href) ? 'page' : undefined} onClick={() => setMenuOpen(false)}><item.icon size={18}/><span>{item.label}</span>{active(item.href) && <span className="dash-nav-dot"/>}</Link>)}{admin && <><details open={contentNav.some(page => pathname === `/admin/${page}`)}><summary><FileText size={18}/>Site content</summary><div>{contentNav.map(page => <Link key={page} href={`/admin/${page}`} aria-current={active(`/admin/${page}`) ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{page === 'home' ? 'Homepage' : page === 'faq' ? 'FAQ' : page.charAt(0).toUpperCase() + page.slice(1)}</Link>)}</div></details><Link href="/admin/newsletter" aria-current={active('/admin/newsletter') ? 'page' : undefined} onClick={() => setMenuOpen(false)}><Mail size={18}/>Newsletter</Link><Link href="/admin/users" aria-current={active('/admin/users') ? 'page' : undefined} onClick={() => setMenuOpen(false)}><Users size={18}/>Team & users</Link><Link href="/admin/profile" aria-current={active('/admin/profile') ? 'page' : undefined} onClick={() => setMenuOpen(false)}><Settings size={18}/>Your profile</Link></>}</nav><div className="dash-sidebar-bottom"><Link href={admin ? '/account' : '/order'} className="dash-sidebar-cta">{admin ? 'Customer workspace' : 'Start something new'}<ArrowUpRight size={17}/></Link>{!admin && isAdmin && <Link href="/admin" className="dash-admin-link"><ShieldCheck size={15}/>Open admin workspace</Link>}<button onClick={() => void logout()} disabled={signingOut}><LogOut size={17}/>{signingOut ? 'Signing out…' : 'Sign out'}</button></div></aside>
    <div className="dash-workspace"><header className="dash-topbar"><span>{admin ? 'Studio /' : 'Your account /'} <b>{nav.find(item => active(item.href))?.label || (pathname.endsWith('/profile') ? 'Your profile' : 'Workspace')}</b></span><Link href={admin ? '/admin/profile' : '/account/settings'} className="dash-user"><span className="dash-avatar dash-avatar-small">{initials(name)}</span><span>{name}</span></Link></header><main className="dash-content" id="workspace-content">{children}</main><footer className="dash-footer"><span>© {new Date().getFullYear()} Silk Studio</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/">Visit the studio ↗</Link></div></footer></div>
  </div>;
}
