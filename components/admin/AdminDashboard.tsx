'use client';

import { useState } from 'react';
import { Clock, Users, FileText, Activity } from 'lucide-react';
import { AdminPatentRow } from '@/components/admin/AdminPatentRow';
import { AdminUsersTab } from '@/components/admin/AdminUsersTab';
import { AdminPatentsTab } from '@/components/admin/AdminPatentsTab';
import { AdminLogsTab } from '@/components/admin/AdminLogsTab';

export function AdminDashboard({ pendingPatents }: { pendingPatents: any[] }) {
  const [activeTab, setActiveTab] = useState<'queue'|'users'|'patents'|'logs'>('queue');

  const TABS = [
    { id: 'queue', label: 'Review Queue', icon: Clock },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'patents', label: 'All Patents', icon: FileText },
    { id: 'logs', label: 'Activity Logs', icon: Activity },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 glass rounded-xl w-fit overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id ? 'bg-gold-500/20 text-gold-400' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Pending Review ({pendingPatents.length})
            </h2>
            {pendingPatents.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center space-y-2">
                <h3 className="text-xl font-semibold">All clear!</h3>
                <p className="text-muted-foreground">No patents awaiting review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPatents.map((patent) => (
                  <AdminPatentRow key={patent.id} patent={patent} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && <AdminUsersTab />}
        {activeTab === 'patents' && <AdminPatentsTab />}
        {activeTab === 'logs' && <AdminLogsTab />}
      </div>
    </div>
  );
}
