'use client';
import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export function AdminLogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(r => r.json())
      .then(d => { setLogs(d); setLoading(false); });
  }, []);

  if (loading) return <div className="text-center p-10">Loading logs...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Activity className="w-5 h-5 text-gold-400" /> Platform Activity Logs
      </h2>
      <div className="glass rounded-xl overflow-hidden p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">No activity recorded yet.</p>
        ) : logs.map((l) => (
          <div key={l.id} className="flex flex-col sm:flex-row gap-2 py-3 border-b border-white/5 last:border-0">
            <div className="min-w-[150px] text-xs text-muted-foreground whitespace-nowrap">
              {new Date(l.createdAt).toLocaleString()}
            </div>
            <div className="flex-1">
              <span className="font-semibold text-gold-200">[{l.action}]</span>{' '}
              <span className="text-sm">{l.details}</span>
              <div className="text-xs text-muted-foreground mt-1">
                By: {l.user?.name || l.user?.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
