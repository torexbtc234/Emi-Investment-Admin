import React, { useEffect, useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, UserCheck, UserX, 
  Trash2, CreditCard, Mail, Globe, Calendar, ArrowLeftRight, ChevronLeft, ChevronRight,
  ShieldCheck, AlertCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../lib/api';
import { User } from '../types';
import { cn, formatCurrency, formatDate } from '../lib/utils';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('', { 
        params: { endpoint: 'users', search, page, limit: 10 } 
      });
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination.total_pages);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: number, status: string) => {
    setActionLoading(true);
    try {
      const { data } = await api.put('', { endpoint: 'users', id: userId, status });
      if (data.success) {
        fetchUsers();
        if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, status: status as any });
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setActionLoading(false);
    }
  };

  const adjustBalance = async (userId: number, amount: number) => {
    setActionLoading(true);
    try {
      const { data } = await api.put('', { endpoint: 'users', id: userId, adjust_balance: amount });
      if (data.success) {
        fetchUsers();
        if (selectedUser?.id === userId) setSelectedUser(prev => prev ? { ...prev, wallet_balance: prev.wallet_balance + amount } : null);
      }
    } catch (err) {
      console.error('Failed to adjust balance', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">User Management</h2>
          <p className="text-text-dim text-sm font-medium">Manage accounts, balances, and security</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm text-text"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/3 border border-white/8 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-white/2">
                <th className="px-6 py-4 font-bold text-text-dim uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-bold text-text-dim uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 font-bold text-text-dim uppercase tracking-wider">KYC Stat</th>
                <th className="px-6 py-4 font-bold text-text-dim uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-text-dim uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 font-bold text-text-dim uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {users.map((user) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={user.id} 
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold group-hover:bg-accent group-hover:text-white transition-all text-xs">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-text leading-tight">{user.full_name}</p>
                          <p className="text-[10px] text-text-dim font-medium lowercase">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-text">
                      {formatCurrency(user.wallet_balance)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                        user.kyc_status === 'approved' ? "bg-emerald-500/10 text-emerald-500" :
                        user.kyc_status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-white/5 text-text-dim"
                      )}>
                        {user.kyc_status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        user.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                      )} />
                    </td>
                    <td className="px-6 py-4 text-text-dim font-medium">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-text-dim hover:text-accent hover:bg-accent/10 rounded-lg transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/2">
          <p className="text-[11px] text-text-dim font-bold uppercase tracking-widest">
            {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-text-dim hover:text-text disabled:opacity-30 transition-all font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-text-dim hover:text-text disabled:opacity-30 transition-all font-bold"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Quick View Sidebar */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-[440px] bg-sidebar z-[60] shadow-2xl flex flex-col border-l border-card-border"
            >
              <div className="h-20 border-b border-card-border flex items-center justify-between px-8">
                <h3 className="text-lg font-bold text-text">User Profile</h3>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/5 rounded-lg text-text-dim">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-accent/20 mb-4 transform rotate-3">
                    {selectedUser.username[0].toUpperCase()}
                  </div>
                  <h4 className="text-xl font-bold text-text">{selectedUser.full_name}</h4>
                  <p className="text-text-dim text-sm font-medium lowercase">@{selectedUser.username}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/3 border border-white/5 rounded-xl">
                    <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Balance</p>
                    <p className="text-lg font-bold text-text">{formatCurrency(selectedUser.wallet_balance)}</p>
                  </div>
                  <div className="p-4 bg-white/3 border border-white/5 rounded-xl">
                    <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Profit</p>
                    <p className="text-lg font-bold text-emerald-500">{formatCurrency(selectedUser.total_profit)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-text-dim group-hover:text-accent">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Email</p>
                      <p className="text-sm font-bold text-text">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-text-dim group-hover:text-accent">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Country</p>
                      <p className="text-sm font-bold text-text">{selectedUser.country || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-4 border-t border-card-border">
                  <h5 className="text-[10px] font-bold text-text-dim mb-4 uppercase tracking-[0.2em] px-1">Management Actions</h5>
                  
                  <div className="flex gap-2">
                    {selectedUser.status === 'active' ? (
                      <button 
                        onClick={() => updateUserStatus(selectedUser.id, 'banned')}
                        disabled={actionLoading}
                        className="flex-1 bg-rose-500/10 text-rose-500 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-all border border-rose-500/20"
                      >
                        <UserX className="w-4 h-4" />
                        Ban
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateUserStatus(selectedUser.id, 'active')}
                        disabled={actionLoading}
                        className="flex-1 bg-emerald-500/10 text-emerald-500 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                      >
                        <UserCheck className="w-4 h-4" />
                        Activate
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        const amt = prompt('Amount:');
                        if (amt) adjustBalance(selectedUser.id, parseFloat(amt));
                      }}
                      className="flex-1 bg-accent/10 text-accent py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-accent/20 transition-all border border-accent/20"
                    >
                      <CreditCard className="w-4 h-4" />
                      Adjust Wallet
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function X({ className, ...props }: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
