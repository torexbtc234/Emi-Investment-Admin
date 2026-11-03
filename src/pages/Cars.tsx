import React, { useEffect, useState } from 'react';
import { 
  Car as CarIcon, Plus, Edit, Trash2, Fuel, 
  Users, Gauge, Luggage, Star, ChevronRight, Save, X, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../lib/api';
import { Car } from '../types';
import { cn, formatCurrency } from '../lib/utils';

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('', { params: { endpoint: 'cars' } });
      if (data.success) setCars(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-text">Fleet Management</h2>
          <p className="text-text-dim text-sm font-medium">Manage investment-backed vehicle assets</p>
        </div>
        <button 
           onClick={() => { setEditingCar(null); setIsModalOpen(true); }}
           className="bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
        >
          <Plus className="w-4 h-4 " />
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="bg-white/3 rounded-2xl h-[500px] animate-pulse border border-white/5" />
          ))
        ) : (
          cars.map(car => (
            <motion.div
              layout
              key={car.id}
              className="bg-white/3 rounded-2xl overflow-hidden shadow-2xl border border-white/8 flex flex-col group transition-all hover:border-accent/30"
            >
              {/* Image Area */}
              <div className="h-56 relative overflow-hidden bg-black/40">
                 <img 
                    src={car.image_url || `https://picsum.photos/seed/${car.model}/600/400`} 
                    alt={car.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                       {car.model}
                    </div>
                 </div>
                 <div className="absolute bottom-4 right-4 space-x-2">
                    <button onClick={() => { setEditingCar(car); setIsModalOpen(true); }} className="p-2.5 bg-white/10 backdrop-blur hover:bg-accent hover:text-white rounded-xl shadow-xl transition-all border border-white/10">
                       <Edit className="w-4 h-4 " />
                    </button>
                 </div>
              </div>

              {/* Info Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                 <div>
                    <h3 className="text-lg font-bold text-text mb-2 group-hover:text-accent transition-colors">{car.name}</h3>
                    <div className="flex items-center gap-4 text-text-dim font-bold text-[10px] uppercase tracking-widest mb-6 opacity-60">
                       <div className="flex items-center gap-1.5">
                          <Fuel className="w-3.5 h-3.5 " />
                          <span>400mi</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 " />
                          <span>2.5s</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                          <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest mb-1">Asset Value</p>
                          <p className="text-lg font-bold text-text">{formatCurrency(car.price)}</p>
                       </div>
                       <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl">
                          <p className="text-[9px] text-accent font-bold uppercase tracking-widest mb-1">Fleet APY</p>
                          <p className="text-lg font-bold text-accent">{car.apy}%</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className={cn("w-2 h-2 rounded-full", car.is_active ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-rose-500")} />
                       <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest">{car.is_active ? 'Active' : 'Offline'}</span>
                    </div>
                    <button className="text-accent font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all">Details</button>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-10">
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
              className="relative w-full max-w-4xl bg-sidebar rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-card-border"
            >
               {/* Forms left side */}
               <div className="flex-1 p-10 overflow-y-auto custom-scrollbar space-y-10">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold text-text">{editingCar ? 'Update Registry' : 'Register Vehicle'}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Asset Name</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-text text-sm transition-all focus:border-accent outline-none" defaultValue={editingCar?.name} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Model Year/Type</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-text text-sm transition-all focus:border-accent outline-none uppercase" defaultValue={editingCar?.model} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Asset Value ($)</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-text text-sm transition-all focus:border-accent outline-none" defaultValue={editingCar?.price} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Target APY (%)</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-accent text-sm transition-all focus:border-accent outline-none" defaultValue={editingCar?.apy} />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Fleet Description</label>
                     <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-medium text-text min-h-[120px] focus:border-accent outline-none transition-all text-sm" placeholder="Enter vehicle investment details..." />
                  </div>

                   <button className="w-full bg-accent text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2">
                      <Save className="w-4 h-4 " />
                      Sync Registry
                   </button>
               </div>

               {/* Right side helper */}
               <div className="w-full md:w-[320px] bg-black/40 p-10 text-text flex flex-col justify-between border-l border-white/5">
                  <div className="space-y-8">
                     <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                        <ImageIcon className="w-6 h-6 text-accent" />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold mb-2">Media Upload</h4>
                        <p className="text-xs text-text-dim leading-relaxed">Ensure high-resolution vehicle imagery for investor confidence.</p>
                     </div>
                     <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-[9px] font-mono text-accent uppercase tracking-widest">
                        MAX 5MB (JPG, WEBP, PNG)
                     </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="py-3.5 bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5 transition-all">
                     Discard
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}
