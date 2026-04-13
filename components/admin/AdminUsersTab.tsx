'use client';
import { useState, useEffect } from 'react';
import { User, Trash, Edit, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminUsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? Their patents will also be deleted.')) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('User deleted');
      fetchUsers();
    } else {
      toast.error('Failed to delete user');
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    if (res.ok) {
      toast.success('Role updated');
      fetchUsers();
    }
  };

  if (loading) return <div className="text-center p-10">Loading users...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <User className="w-5 h-5 text-gold-400" /> Platform Users
      </h2>
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-white/5 uppercase">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{u.name || 'No name'}</div>
                  <div className="text-muted-foreground">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={u.role} 
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="bg-transparent border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-gold-500"
                  >
                    <option value="BUYER" className="bg-midnight-900">BUYER</option>
                    <option value="INVENTOR" className="bg-midnight-900">INVENTOR</option>
                    <option value="ADMIN" className="bg-midnight-900">ADMIN</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-300 p-1">
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
