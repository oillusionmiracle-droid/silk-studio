'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import ReferenceUpload from '@/components/ReferenceUpload';
import {
  FolderOpen,
  FileText,
  ExternalLink,
  Download,
  Clock,
  Loader2,
  Package,
} from 'lucide-react';

interface FileRecord {
  url: string;
  orderRef: string;
  orderId: string;
  createdAt: string;
}

export default function AccountFilesPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const currentUserId = user.id;

    async function loadFiles() {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('id, paystack_ref, reference_files, created_at')
          .eq('user_id', currentUserId);

        if (error) {
          console.warn('Could not load user files:', error.message);
        } else if (orders) {
          const collected: FileRecord[] = [];
          for (const ord of orders) {
            if (Array.isArray(ord.reference_files)) {
              for (const f of ord.reference_files) {
                if (typeof f === 'string' && f.trim()) {
                  collected.push({
                    url: f,
                    orderRef: ord.paystack_ref,
                    orderId: ord.id,
                    createdAt: ord.created_at,
                  });
                }
              }
            }
          }
          setFiles(collected);
        }
      } catch (err) {
        console.warn('Files exception:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void loadFiles();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Upload Box */}
      <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-semibold tracking-tight text-neutral-950 dark:text-white mb-1">
          Upload Reference Assets
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          Upload high-resolution logos, vector graphics, or sample mockups for your upcoming custom studio projects.
        </p>
        <ReferenceUpload
          onUpload={(newUrl) => {
            if (newUrl) {
              setFiles((prev) => [
                {
                  url: newUrl,
                  orderRef: 'Manual Upload',
                  orderId: '',
                  createdAt: new Date().toISOString(),
                },
                ...prev,
              ]);
            }
          }}
        />
      </div>

      {/* Files Grid */}
      <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-semibold tracking-tight text-neutral-950 dark:text-white mb-1">
          Associated Project Assets
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          All design files uploaded across your Silk Studio apparel and custom print orders.
        </p>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto stroke-[2]" />
            <p className="text-xs text-neutral-400 mt-2">Loading files...</p>
          </div>
        ) : files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {files.map((file, idx) => {
                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.url);

                return (
                  <motion.div
                    key={file.url + idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-neutral-800/40 p-4 shadow-xs flex flex-col justify-between hover:border-neutral-400 dark:hover:border-white/30 transition-all"
                  >
                    <div>
                      <div className="h-32 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-3 flex items-center justify-center border border-neutral-200/40 dark:border-white/5">
                        {isImage ? (
                          <img
                            src={file.url}
                            alt="Reference"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FileText className="h-10 w-10 text-neutral-400 stroke-[1.5]" />
                        )}
                      </div>

                      <div className="truncate">
                        <p className="text-xs font-semibold text-neutral-950 dark:text-white truncate">
                          Reference Asset {idx + 1}
                        </p>
                        {file.orderId ? (
                          <Link
                            href={`/account/orders/${file.orderId}`}
                            className="text-[11px] font-mono text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          >
                            Order: {file.orderRef}
                          </Link>
                        ) : (
                          <span className="text-[11px] text-neutral-400">{file.orderRef}</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-neutral-400">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-neutral-950 dark:text-white hover:underline"
                      >
                        <span>Open</span>
                        <ExternalLink className="h-3 w-3 stroke-[2]" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-12 text-center">
            <FolderOpen className="h-8 w-8 text-neutral-300 dark:text-neutral-700 mx-auto mb-3 stroke-[1.5]" />
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              No design assets stored yet
            </p>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Any reference images or vector files attached to your custom print orders will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
