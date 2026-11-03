import React, { useEffect, useState } from 'react';
import { 
  Plus, Edit, Trash2, Layers, DollarSign, 
  BarChart, Clock, ShieldCheck, ToggleLeft, ToggleRight, X, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../lib/api';
import { Plan } from '../types';
import { cn, formatCurrency } from '../lib/utils';

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('', { params: { endpoint: 'plans' } });
      if (data.success) setPlans(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this plan?')) return;
    try {
      await api.delete('', { data: { endpoint: 'plans', id } });
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-text">Investment Plans</h2>
          <p className="text-text-dim text-sm font-medium">Create and customize passive income packages</p>
        </div>
        <button 
          onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
          className="bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
        >
          <Plus className="w-4 h-4 " />
          New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/3 rounded-2xl h-[400px] animate-pulse border border-white/5" />
          ))
        ) : (
          plans.map(plan => (
            <motion.div
              layout
              key={plan.id}
              className={cn(
                "group relative bg-white/3 rounded-2xl p-8 shadow-2xl border border-white/8 transition-all hover:bg-white/[0.05] hover:border-accent/30",
                !plan.is_active && "opacity-40 grayscale"
              )}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <Layers className="w-6 h-6" />
                </div>
                {!plan.is_active && <div className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-rose-500/20">Inactive</div>}
                
                <div className="flex gap-2">
                   <button onClick={() => { setEditingPlan(plan); setIsModalOpen(true); }} className="p-2.5 bg-white/5 text-text-dim hover:text-accent transition-colors rounded-xl border border-white/5">
                      <Edit className="w-4 h-4 " />
                   </button>
                   <button onClick={() => deletePlan(plan.id)} className="p-2.5 bg-white/5 text-text-dim hover:text-rose-500 transition-colors rounded-xl border border-white/5">
                      <Trash2 className="w-4 h-4 " />
                   </button>
                </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <h3 className="text-xl font-bold text-text mb-1">{plan.name}</h3>
                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest opacity-60">ID: {plan.slug}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                       <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest mb-1">Weekly ROI</p>
                       <p className="text-xl font-bold text-accent">{plan.weekly_roi}%</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                       <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest mb-1">Duration</p>
                       <p className="text-xl font-bold text-text">{plan.duration_weeks}w</p>
                    </div>
                 </div>

                 <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                       <span className="text-text-dim">Min Stake</span>
                       <span className="text-text">{formatCurrency(plan.min_amount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                       <span className="text-text-dim">Max Stake</span>
                       <span className="text-text">{plan.max_amount ? formatCurrency(plan.max_amount) : 'Unlimited'}</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-md" 
               onClick={() => setIsModalOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-sidebar rounded-3xl p-10 shadow-2xl overflow-hidden border border-card-border"
            >
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-text">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                     <X className="w-5 h-5 text-text-dim" />
                  </button>
               </div>

               <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); /* Handle Save */ setIsModalOpen(false); }}>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Plan Name</label>
                     <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-text text-sm transition-all focus:border-accent outline-none" placeholder="Growth Pack" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Slug ID</label>
                     <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-text text-sm transition-all focus:border-accent outline-none font-mono tracking-widest uppercase" placeholder="GP_01" />
                  </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Min. Stake ($)</label>
                     <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-text text-sm transition-all focus:border-accent outline-none" defaultValue={500} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Weekly ROI (%)</label>
                     <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-accent text-sm transition-all focus:border-accent outline-none" defaultValue={10} />
                  </div>

                  <div className="md:col-span-2 pt-6">
                     <button className="w-full bg-accent text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Plan
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}
