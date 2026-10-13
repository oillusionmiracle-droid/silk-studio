'use client';
import DashboardShell from '@/components/dashboard/DashboardShell';
import '@/app/dashboard.css';
export default function AccountLayout({ children }: { children: React.ReactNode }) { return <DashboardShell>{children}</DashboardShell>; }
