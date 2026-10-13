import Link from 'next/link';
import { ArrowUpRight, Package } from 'lucide-react';
import { dateLabel, money, statusLabel, type DashboardOrder } from '@/lib/dashboard';
export function Metric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return <article className="dash-metric"><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}
export function OrderList({ orders, admin = false }: { orders: DashboardOrder[]; admin?: boolean }) {
  if (!orders.length) return <div className="dash-empty"><Package size={30}/><h3>{admin ? 'No orders to show yet.' : 'Your next idea starts here.'}</h3><p>{admin ? 'New customer orders will appear here.' : 'Place an order or send a project brief. We’ll keep the details together.'}</p>{!admin && <Link href="/order" className="dash-button dash-dark">Start an order <ArrowUpRight size={16}/></Link>}</div>;
  return <div className="dash-order-list">{orders.map(order => <Link key={order.id} href={`${admin ? '/admin' : '/account'}/orders/${order.id}`} className="dash-order-row"><span className="dash-order-icon"><Package size={19}/></span><div><strong>{admin ? order.customer_name || 'Customer order' : order.type === 'apparel' ? 'Apparel & merchandise' : 'Studio project'}</strong><span>{order.paystack_ref || order.id.slice(0, 8)} · {dateLabel(order.created_at)}</span></div><span className={`dash-status status-${order.inventory_state === 'review' ? 'review' : order.status}`}>{order.inventory_state === 'review' ? 'Needs review' : statusLabel(order.status)}</span><strong className="dash-order-total">{money(Number(order.total) || 0)}</strong><ArrowUpRight size={17}/></Link>)}</div>;
}
export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="dash-intro"><div><span className="dash-kicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}
