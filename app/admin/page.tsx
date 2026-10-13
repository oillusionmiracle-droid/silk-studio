'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, RefreshCw, Package, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { dashboardMetrics, money, type DashboardOrder } from '@/lib/dashboard';
import { Metric, OrderList, PageIntro } from '@/components/dashboard/OverviewParts';
export default function AdminOverviewPage() {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [customers, setCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [updated, setUpdated] = useState('');
  useEffect(() => {
    if (!user || !isAdmin) return;
    let mounted = true;
    setLoading(true); setError('');
    async function load() {
      try {
        const customerRequest = supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer');
        const loadOrders = async () => {
          const loaded: DashboardOrder[] = [];
          for (let offset = 0; ; offset += 500) {
            const { data, error: queryError } = await supabase.from('orders').select('id,paystack_ref,customer_name,type,total,status,created_at,payment_state,paid_amount_kobo,inventory_state').order('created_at', { ascending: false }).order('id', { ascending: false }).range(offset, offset + 499);
            if (queryError) throw queryError;
            loaded.push(...(data || []));
            if (!mounted || !data || data.length < 500) break;
          }
          return loaded;
        };
        const [loaded, customerResult] = await Promise.all([loadOrders(), customerRequest]);
        if (customerResult.error) throw customerResult.error;
        if (mounted) { setOrders(loaded); setCustomers(customerResult.count || 0); setUpdated(new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })); }
      } catch { if (mounted) setError('Studio data couldn’t be loaded. Please refresh to try again.'); }
      finally { if (mounted) setLoading(false); }
    }
    void load(); return () => { mounted = false; };
  }, [user, isAdmin, refresh]);
  const metrics = dashboardMetrics(orders);
  const waiting = orders.filter(order => !['cancelled', 'delivered'].includes(order.status) && (['pending', 'quote_requested'].includes(order.status) || order.inventory_state === 'review')).slice(0, 5);
  const value = (amount: string | number) => loading || error ? '—' : amount;
  const pipeline = [{ label: 'Awaiting payment / quote', count: metrics.awaiting }, { label: 'In production', count: metrics.production }, { label: 'Ready for dispatch', count: orders.filter(order => order.status === 'ready').length }, { label: 'On the way', count: orders.filter(order => order.status === 'shipped').length }, { label: 'Delivered', count: metrics.delivered }];
  return <><PageIntro eyebrow="STUDIO OPERATIONS" title="A clear view of the studio." description="Orders, customers and the work that needs your attention." action={<button className="dash-button dash-dark" disabled={loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={16} className={loading ? 'dash-spinner' : ''}/>{loading ? 'Refreshing…' : 'Refresh data'}</button>}/>{error && <p className="dash-notice" role="alert">{error}</p>}
    <div className="dash-metrics"><Metric label="Payments received" value={value(money(metrics.received))} detail="Recorded full payments and deposits"/><Metric label="Orders" value={value(metrics.total)} detail="Across print, apparel and studio projects"/><Metric label="In production" value={value(metrics.production)} detail="Work currently underway"/><Metric label="Customers" value={value(customers)} detail="Registered customer accounts"/></div>
    <section className="dash-attention"><div><span className="dash-kicker">YOUR NEXT MOVES</span><h2>{loading || error ? 'Checking the queue.' : metrics.review ? `${metrics.review} order${metrics.review === 1 ? '' : 's'} need review.` : `${metrics.awaiting} order${metrics.awaiting === 1 ? '' : 's'} awaiting payment or a quote.`}</h2><p>{metrics.review ? 'Review these paid orders before you confirm production or delivery.' : 'Open an order to review the brief, payment and next step.'}</p></div><Link href="/admin/orders" className="dash-button dash-lime">Open the order queue <ArrowUpRight size={17}/></Link></section>
    <div className="dash-two-column"><section className="dash-panel"><div className="dash-panel-heading"><div><span className="dash-kicker">KEEP THINGS MOVING</span><h2>Needs attention</h2></div><Link href="/admin/orders" className="dash-text-link">All orders ↗</Link></div>{loading ? <p className="dash-loading" role="status">Loading the queue…</p> : error ? <p className="dash-loading">The queue is temporarily unavailable.</p> : waiting.length ? <OrderList orders={waiting} admin/> : <div className="dash-empty"><Package size={28}/><h3>You’re up to date.</h3><p>No pending orders or payment reviews in the queue.</p></div>}</section><section className="dash-panel"><span className="dash-kicker">ORDER FLOW</span><h2>The production picture.</h2><div className="dash-pipeline">{pipeline.map(stage => <div key={stage.label}><span>{stage.label}</span><strong>{value(stage.count)}</strong><span className="dash-pipeline-track"><i style={{ width: `${metrics.total ? stage.count / metrics.total * 100 : 0}%` }}/></span></div>)}</div></section></div>
    <section className="dash-panel"><div className="dash-panel-heading"><div><span className="dash-kicker">RECENT ACTIVITY</span><h2>Latest orders</h2></div><span className="dash-updated">{updated && !error ? `Updated ${updated}` : 'Refresh to load the latest data'}</span></div>{loading ? <p className="dash-loading">Loading recent orders…</p> : error ? <p className="dash-loading">Recent orders are temporarily unavailable.</p> : <OrderList orders={orders.slice(0, 5)} admin/>}</section>
    <div className="dash-shortcuts"><Link href="/admin/products"><Package size={20}/><div><strong>Products & stock</strong><span>Keep the catalogue ready.</span></div><ArrowUpRight size={17}/></Link><Link href="/admin/customers"><Users size={20}/><div><strong>Customer directory</strong><span>Orders, details and relationships.</span></div><ArrowUpRight size={17}/></Link><Link href="/admin/messages"><MessageSquare size={20}/><div><strong>Messages</strong><span>See what customers need.</span></div><ArrowUpRight size={17}/></Link></div>
  </>;
}
