'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, FolderOpen, UserRound, MessageCircle, Heart } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useWishlist } from '@/lib/WishlistContext';
import { supabase } from '@/lib/supabase';
import { dashboardMetrics, initials, money, type DashboardOrder } from '@/lib/dashboard';
import { Metric, OrderList, PageIntro } from '@/components/dashboard/OverviewParts';
export default function AccountOverviewPage() {
  const { user, profile } = useAuth();
  const { totalItems: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setLoading(true); setError('');
    async function load() {
      try {
        const loaded: DashboardOrder[] = [];
        for (let offset = 0; ; offset += 500) {
          const { data, error: queryError } = await supabase.from('orders').select('id,paystack_ref,type,total,status,created_at,payment_state,paid_amount_kobo,inventory_state').eq('user_id', user!.id).order('created_at', { ascending: false }).order('id', { ascending: false }).range(offset, offset + 499);
          if (queryError) throw queryError;
          loaded.push(...(data || []));
          if (!mounted || !data || data.length < 500) break;
        }
        if (mounted) setOrders(loaded);
      } catch { if (mounted) setError('We couldn’t load your orders. Please try again.'); }
      finally { if (mounted) setLoading(false); }
    }
    void load(); return () => { mounted = false; };
  }, [user, retry]);
  const metrics = dashboardMetrics(orders);
  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
  const setup = [{ label: 'Your name', complete: Boolean(profile?.full_name) }, { label: 'Contact number', complete: Boolean(profile?.phone) }, { label: 'Delivery details', complete: Boolean(profile?.default_address && profile?.default_area) }];
  const done = setup.filter(item => item.complete).length;
  return <>
    <PageIntro eyebrow="YOUR ACCOUNT / SILK STUDIO" title={`Hello, ${name.split(' ')[0]}.`} description="A home for your projects, orders and next good idea." action={<Link href="/order" className="dash-button dash-dark">Make something new <ArrowUpRight size={17}/></Link>}/>
    {error && <div className="dash-notice" role="alert">{error}<button onClick={() => setRetry(value => value + 1)}>Try again</button></div>}
    <div className="dash-customer-grid"><section className="dash-profile-card"><div className="dash-profile-top"><span className="dash-avatar">{initials(name)}</span><Link href="/account/settings" aria-label="Edit your profile"><ArrowUpRight size={21}/></Link></div><span className="dash-kicker">YOUR PROFILE</span><h2>{name}</h2><p>{user?.email}</p><div className="dash-profile-detail"><UserRound size={16}/><span>{profile?.phone || 'Add a contact number'}</span></div><div className="dash-profile-detail"><FolderOpen size={16}/><span>{profile?.default_area ? `Delivery: ${profile.default_area}` : 'Add your delivery details'}</span></div><Link href="/account/settings" className="dash-button dash-lime">Manage your profile <ArrowUpRight size={16}/></Link></section>
    <section className="dash-feature-card"><span className="dash-kicker">FROM IDEA TO OUT IN THE WORLD</span><h2>Your next thing.<br/><em>Made with Silk.</em></h2><p>Design, websites, apps, ads or something you can hold. Start with an idea; we’ll help shape the rest.</p><div><Link href="/?brief=Website%20or%20app#brief" className="dash-text-link">Send a project brief ↗</Link><Link href="/portfolio" className="dash-text-link">Find a little inspiration ↗</Link></div><span className="dash-feature-mark" aria-hidden="true">S.</span></section></div>
    <div className="dash-metrics"><Metric label="Active orders" value={loading || error ? '—' : metrics.active} detail="Confirmed, in production or on the way"/><Metric label="Delivered" value={loading || error ? '—' : metrics.delivered} detail="Completed orders"/><Metric label="Payments received" value={loading || error ? '—' : money(metrics.received)} detail="Your recorded full payments and deposits"/><Metric label="Saved pieces" value={wishlistCount} detail="In your wishlist"/></div>
    <div className="dash-two-column"><section className="dash-panel"><div className="dash-panel-heading"><div><span className="dash-kicker">THE LATEST</span><h2>Your orders</h2></div><Link href="/account/orders" className="dash-text-link">View all ↗</Link></div>{loading ? <p className="dash-loading" role="status">Loading your orders…</p> : error ? <p className="dash-loading">Orders are temporarily unavailable.</p> : <OrderList orders={orders.slice(0, 4)}/>}</section><section className="dash-panel dash-setup"><span className="dash-kicker">READY FOR NEXT TIME</span><h2>Your details, sorted.</h2><p>{done === setup.length ? 'You’re ready for a smoother checkout.' : 'A few details make your next order easier.'}</p><div className="dash-setup-progress" role="progressbar" aria-label="Profile details completed" aria-valuenow={done} aria-valuemin={0} aria-valuemax={setup.length}><span style={{ width: `${done / setup.length * 100}%` }}/></div>{setup.map(item => <Link key={item.label} href="/account/settings"><span className={item.complete ? 'complete' : ''}><Check size={14}/></span>{item.label}<small>{item.complete ? 'Added' : 'Add'}</small></Link>)}</section></div>
    <div className="dash-shortcuts"><Link href="/account/files"><FolderOpen size={20}/><div><strong>Project files</strong><span>References and assets, together.</span></div><ArrowUpRight size={17}/></Link><Link href="/account/wishlist"><Heart size={20}/><div><strong>Saved for later</strong><span>A place for things you love.</span></div><ArrowUpRight size={17}/></Link><a href="https://wa.me/2347064829776" target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/><div><strong>Need a hand?</strong><span>Talk to the studio on WhatsApp.</span></div><ArrowUpRight size={17}/></a></div>
  </>;
}
