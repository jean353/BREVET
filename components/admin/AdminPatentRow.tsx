'use client';
import { useState } from 'react';
import { formatDate, formatPrice } from '@/lib/utils';
import { StatusBadge, CategoryBadge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Loader2, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Patent {
  id:          string;
  title:       string;
  description: string;
  category:    string;
  status:      string;
  price:       number;
  currency:    string;
  country:     string;
  createdAt:   string;
  inventor: { name: string | null; email: string; country: string | null };
}

export function AdminPatentRow({ patent }: { patent: Patent }) {
  const [status,   setStatus]   = useState(patent.status);
  const [expanded, setExpanded] = useState(false);
  const [loading,  setLoading]  = useState<'approve' | 'reject' | null>(null);

  const update = async (action: 'approve' | 'reject') => {
    setLoading(action);
    const newStatus = action === 'approve' ? 'VERIFIED' : 'REJECTED';
    try {
      const res = await fetch(`/api/patents/${patent.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setStatus(newStatus);
      toast.success(`Patent ${action === 'approve' ? 'verified' : 'rejected'} successfully!`);
    } catch {
      toast.error('Action failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const isActioned = status !== 'PENDING';

  return (
    <div className={cn('glass rounded-xl overflow-hidden transition-all', isActioned && 'opacity-60')}>
      <div className="p-5 flex items-start gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold truncate">{patent.title}</h3>
            <StatusBadge status={status} />
            <CategoryBadge category={patent.category} />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{patent.inventor.name} · {patent.inventor.email}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{patent.country}</span>
            <span>{formatDate(patent.createdAt)}</span>
            <span className="text-gold-400 font-medium">{formatPrice(patent.price, patent.currency)}</span>
          </div>
          {expanded && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 border-t border-white/5 pt-3">
              {patent.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {!isActioned && (
            <>
              <button
                id={`reject-${patent.id}`}
                onClick={() => update('reject')}
                disabled={!!loading}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                {loading === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                Reject
              </button>
              <button
                id={`approve-${patent.id}`}
                onClick={() => update('approve')}
                disabled={!!loading}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              >
                {loading === 'approve' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
