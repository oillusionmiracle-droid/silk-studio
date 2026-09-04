'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Users,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const customerId = params?.id as string;

  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;

    async function loadCustomer() {
      try {
        const { data: profile, error: pErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', customerId)
          .single();

        const { data: ords, error: oErr } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', customerId)
          .order('created_at', { ascending: false });

        if (profile) {
          setCustomer(profile);
          setOrders(ords || []);
        }
      } catch (err) {
        console.warn('Customer detail error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void loadCustomer();
  }, [customerId]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-16 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto stroke-[2]" />
        <p className="text-xs text-neutral-400 mt-2">Loading customer details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-12 text-center">
        <p className="text-sm font-medium text-white">Customer profile not found.</p>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-xl bg-white text-neutral-950 text-xs font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" />
          <span>Back to Customers</span>
        </Link>
      </div>
    );
  }

  const totalSpent = orders
    .filter((o) => ['paid', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered'].includes(o.status))
    .reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  const cleanPhone = (customer.phone || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3 stroke-[2]" />
            <span>Back to Customers</span>
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              {customer.full_name || 'Studio Customer'}
            </h2>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300">
              {customer.role}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Registered: {new Date(customer.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-left sm:text-right">
            <p className="text-xs text-neutral-400">Total Spend</p>
            <p className="text-xl font-bold text-white">
              ₦{totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-neutral-400">Orders</p>
            <p className="text-xl font-bold text-white">{orders.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Contact info */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold tracking-tight text-white">
              Customer Details
            </h3>
            <div className="text-xs space-y-2.5 text-neutral-300">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-neutral-400 stroke-[1.75]" />
                <span>{customer.phone || 'No phone recorded'}</span>
              </div>
              <div className="flex items-start gap-2.5 pt-2 border-t border-white/10">
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5 stroke-[1.75]" />
                <div>
                  <p>{customer.default_address || 'No address set'}</p>
                  <p>{customer.default_area ? `${customer.default_area}, Lagos` : 'Lagos'}</p>
                </div>
              </div>
            </div>

            {customer.phone && (
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="h-3 w-3 stroke-[2]" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Order History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-6 shadow-xs">
            <h3 className="text-sm font-semibold tracking-tight text-white mb-4">
              Order History ({orders.length})
            </h3>

            {orders.length > 0 ? (
              <div className="divide-y divide-white/10">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="py-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">
                          {ord.paystack_ref}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300">
                          {ord.type}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] capitalize bg-neutral-800 text-neutral-200">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {new Date(ord.created_at).toLocaleDateString()} • {ord.area || 'Lagos'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">
                        {ord.total > 0 ? `₦${Number(ord.total).toLocaleString()}` : 'Quote'}
                      </span>
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 stroke-[2]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">No orders placed under this customer ID.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
