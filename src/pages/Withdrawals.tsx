import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Filter, Search, MoreVertical, 
  Wallet, ArrowUpRight, ChevronLeft, ChevronRight, Loader2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../lib/api';
import { Withdrawal } from '../types';
import { cn, formatCurrency, formatDate } from '../lib/utils';

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, [page, status]);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('', { 
        params: { endpoint: 'withdrawals', status, page, limit: 12 } 
      });
      if (data.success) {
        setWithdrawals(data.data);
        setTotalPages(data.pagination.total_pages);
      }
    } catch (err) {
      console.error('Failed to fetch withdrawals', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { data } = await api.put('', { 
        endpoint: 'withdrawals', 
        id, 
        status: newStatus,
        admin_notes: 'Processed via admin panel'
      });
      if (data.success) {
        fetchWithdrawals();
      }
    } catch (err: any) {
        alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-text">Withdrawals</h2>
          <p className="text-text-dim text-sm font-medium">Review and process user cashout requests</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
            {[
              { id: '', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'completed', label: 'Done' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setStatus(tab.id); setPage(1); }}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  status === tab.id 
                    ? "bg-accent text-white shadow-lg shadow-accent/20" 
                    : "text-text-dim hover:text-text"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-6 h-[280px] animate-pulse" />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {withdrawals.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 shadow-2xl flex flex-col justify-between group h-full hover:bg-white/[0.05] hover:border-accent/30 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      item.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                      item.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {item.status}
                    </div>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-text mb-1">{formatCurrency(item.amount)}</p>
                    <div className="flex items-center gap-2">
                       <p className="text-xs font-bold text-text-dim group-hover:text-text transition-colors">@{item.username}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-text-dim uppercase tracking-tighter">
                      <span>Method</span>
                      <span className="text-text truncate max-w-[120px]">External Bank/Crypto</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-text-dim uppercase tracking-tighter">
                      <span>Request Date</span>
                      <span className="text-text">{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  {item.status === 'pending' && (
                    <>
                      <button 
                        disabled={!!updatingId}
                        onClick={() => updateStatus(item.id, 'completed')}
                        className="flex-1 bg-amber-600 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                      >
                        {updatingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Complete'}
                      </button>
                      <button 
                        disabled={!!updatingId}
                        onClick={() => updateStatus(item.id, 'cancelled')}
                        className="p-2.5 bg-rose-500/10 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-all border border-rose-500/20"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {item.status !== 'pending' && (
                    <button className="w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-dim bg-white/5 cursor-default border border-white/5">
                      Processed
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 py-8">
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-dim hover:text-text disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>
        <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{page} / {totalPages}</span>
        <button 
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-dim hover:text-text disabled:opacity-30 transition-all"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>

  );
}
