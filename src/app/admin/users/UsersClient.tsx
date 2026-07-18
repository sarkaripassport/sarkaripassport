'use client';

import { useState } from 'react';
import { AdminUser, addCoAdmin, removeAdmin } from './actions';
import { Shield, ShieldAlert, Trash2, Plus, UserPlus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UsersClient({ users, currentRole, currentUserId, analytics = [] }: { users: AdminUser[], currentRole: string, currentUserId: string, analytics?: any[] }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setError(null);
    try {
      await addCoAdmin(email, password);
      setEmail('');
      setPassword('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;
    setIsRemoving(id);
    try {
      await removeAdmin(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsRemoving(null);
    }
  };

  const isSuperAdmin = currentRole === 'super_admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Team</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total Admins: <span className="font-bold text-blue-600">{users.length}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{u.email}</div>
                    {u.id === currentUserId && <div className="text-xs text-blue-600 font-medium">You</div>}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role === 'super_admin' ? <ShieldAlert className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                      {u.role === 'super_admin' ? 'Super Admin' : 'Co-Admin'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    {isSuperAdmin && u.id !== currentUserId && (
                      <button 
                        onClick={() => handleRemove(u.id)}
                        disabled={isRemoving === u.id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        {isRemoving === u.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isSuperAdmin ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Add Co-Admin
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                {error}
              </div>
            )}
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="coadmin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="text" 
                  required 
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                  placeholder="Generate a strong password"
                />
              </div>
              <button 
                type="submit" 
                disabled={isAdding || !email || password.length < 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Create Co-Admin
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 flex flex-col items-center text-center justify-center text-gray-500 h-fit">
            <Shield className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Read-Only View</h3>
            <p className="text-sm">Only Super Admins can add or remove team members.</p>
          </div>
        )}
      </div>

      {isSuperAdmin && analytics.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              Team Activity & Analytics
            </h2>
            <p className="text-sm text-gray-500 mt-1">Track job creation and publication by each team member.</p>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Email</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Total Created</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Published</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Drafts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analytics.map(a => (
                <tr key={a.email} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{a.email}</td>
                  <td className="p-4 text-center font-bold text-blue-600">{a.totalJobs}</td>
                  <td className="p-4 text-center text-green-600 font-medium">{a.publishedJobs}</td>
                  <td className="p-4 text-center text-yellow-600 font-medium">{a.draftJobs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
