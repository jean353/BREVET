'use client';
import { useState, useEffect } from 'react';
import { FileText, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminPatentsTab() {
  const [patents, setPatents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatents = async () => {
    const res = await fetch('/api/admin/patents');
    if (res.ok) setPatents(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchPatents(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this patent? This action is irreversible.')) return;
    const res = await fetch(`/api/admin/patents?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Patent deleted');
      fetchPatents();
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch('/api/admin/patents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success('Status updated');
      fetchPatents();
    }
  };

  if (loading) return <div className="text-center p-10">Loading patents...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <FileText className="w-5 h-5 text-gold-400" /> Platform Patents
      </h2>
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-white/5 uppercase">
            <tr>
              <th className="px-6 py-3">Patent Title</th>
              <th className="px-6 py-3">Inventor</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patents.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium">{p.title}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.inventor?.name || p.inventor?.email}</td>
                <td className="px-6 py-4">
                  <select 
                    value={p.status} 
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    className="bg-transparent border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-gold-500"
                  >
                    <option value="DRAFT" className="bg-midnight-900">DRAFT</option>
                    <option value="PENDING" className="bg-midnight-900">PENDING</option>
                    <option value="VERIFIED" className="bg-midnight-900">VERIFIED</option>
                    <option value="REJECTED" className="bg-midnight-900">REJECTED</option>
                    <option value="UNDER_CONTRACT" className="bg-midnight-900">UNDER_CONTRACT</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
