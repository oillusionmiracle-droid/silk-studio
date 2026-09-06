'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Search,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Package,
} from 'lucide-react';

interface CustomerProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  default_address: string | null;
  default_area: string | null;
  role: string;
  created_at: string;
  orders_count?: number;
  total_spent?: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      try {
        const { data: profiles, error: profErr } = await supabase
          .from('profiles')
          .select('id, full_name, phone, default_address, default_area, role, created_at')
          .order('created_at', { ascending: false });

        const { data: orders, error: ordErr } = await supabase
          .from('orders')
          .select('user_id, total, status');

        if (profiles) {
          const spendMap = new Map<string, { count: number; spend: number }>();
          if (orders) {
            for (const ord of orders) {
              if (ord.user_id) {
                const cur = spendMap.get(ord.user_id) || { count: 0, spend: 0 };
                cur.count += 1;
                if (['paid', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered'].includes(ord.status)) {
                  cur.spend += Number(ord.total) || 0;
                }
                spendMap.set(ord.user_id, cur);
              }
            }
          }

          const decorated = profiles.map((p) => {
            const agg = spendMap.get(p.id) || { count: 0, spend: 0 };
            return {
              ...p,
              orders_count: agg.count,
              total_spent: agg.spend,
            };
          });

          setCustomers(decorated);
        }
      } catch (err) {
        console.warn('Customer load error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.default_area || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-neutral-900">
              Customer Directory ({filteredCustomers.length})
            </h2>
            <p className="text-[13px] text-neutral-500 mt-0.5">
              Verified customer accounts and lifetime studio value.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 focus-within:bg-white focus-within:border-neutral-900 transition-all">
          <Search className="h-4 w-4 text-neutral-400 stroke-[2]" />
          <input
            type="text"
            placeholder="Search by customer name, phone number, or LGA area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto stroke-[2]" />
          <p className="text-[13px] text-neutral-400 mt-2">Loading customer accounts...</p>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredCustomers.map((c) => {
              const initials = (c.full_name || 'Customer')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[22px] bg-white border border-neutral-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white font-bold text-sm shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-bold text-neutral-900 leading-snug">
                              {c.full_name || 'Anonymous User'}
                            </h3>
                            {c.role === 'admin' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-white">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-neutral-400">
                            Member since {new Date(c.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 text-[13px] text-neutral-600">
                      {c.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-neutral-400" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                      {c.default_area && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                          <span>{c.default_area}, Lagos</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[12px]">
                    <div>
                      <p className="text-neutral-400">Total Orders</p>
                      <p className="text-[14px] font-bold text-neutral-900">
                        {c.orders_count || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-neutral-400">Total Spent</p>
                      <p className="text-[14px] font-bold text-neutral-900">
                        ₦{(c.total_spent || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-[24px] bg-white border border-neutral-200/80 p-12 text-center">
          <p className="text-[14px] text-neutral-500">
            No customers match your search.
          </p>
        </div>
      )}
    </div>
  );
}
