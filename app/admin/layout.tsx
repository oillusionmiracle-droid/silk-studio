'use client';
import DashboardShell from '@/components/dashboard/DashboardShell';
import '@/app/dashboard.css';
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <DashboardShell admin>{children}</DashboardShell>; }
