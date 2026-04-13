import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminPatentRow } from '@/components/admin/AdminPatentRow';
import { ShieldCheck, Clock, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

export const metadata: Metadata = { title: 'Admin Panel' };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/unauthorized');

  const [pending, verified, rejected, total] = await Promise.all([
    prisma.patent.findMany({
      where:   { status: 'PENDING' },
      include: { inventor: { select: { name: true, email: true, country: true } } },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.patent.count({ where: { status: 'VERIFIED' } }),
    prisma.patent.count({ where: { status: 'REJECTED' } }),
    prisma.patent.count(),
  ]);

  const STATS = [
    { label: 'Queue',    value: pending.length, icon: Clock,         color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    { label: 'Verified', value: verified,        icon: CheckCircle,   color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    { label: 'Rejected', value: rejected,        icon: XCircle,       color: 'text-red-400 bg-red-400/10 border-red-400/20' },
    { label: 'Total',    value: total,           icon: BarChart3,     color: 'text-gold-400 bg-gold-400/10 border-gold-400/20' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h1 className="text-3xl font-display">Admin <span className="text-gold-gradient">Panel</span></h1>
          <p className="text-muted-foreground text-sm">Patent verification queue</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-xl p-5 space-y-2">
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Queue */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          Pending Review ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-semibold">All clear!</h3>
            <p className="text-muted-foreground">No patents awaiting review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(patent => (
              <AdminPatentRow key={patent.id} patent={patent as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
