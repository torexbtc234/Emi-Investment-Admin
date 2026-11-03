import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, CheckCircle, XCircle, Eye, 
  ExternalLink, FileText, User, Calendar, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../lib/api';
import { KYCDocument } from '../types';
import { cn, formatDate } from '../lib/utils';

export default function KYC() {
  const [docs, setDocs] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('', { params: { endpoint: 'kyc' } });
      if (data.success) setDocs(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string, reason?: string) => {
    setUpdating(true);
    try {
      await api.put('', { endpoint: 'kyc', id, status, rejection_reason: reason });
      fetchDocs();
      setSelectedDoc(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text">KYC Verification</h2>
        <p className="text-text-dim text-sm font-medium">Identity verification and compliance review</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="bg-white/3 rounded-2xl p-10 h-64 animate-pulse border border-white/5" />
          ))
        ) : (
          docs.map(doc => (
            <motion.div
              key={doc.id}
              whileHover={{ y: -5 }}
              className="bg-white/3 rounded-2xl p-8 shadow-2xl border border-white/8 relative group flex flex-col justify-between hover:bg-white/[0.05] hover:border-accent/30 transition-all"
            >
              <div className="space-y-6">
                 <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent transition-transform group-hover:scale-110 group-hover:rotate-3">
                       <FileText className="w-6 h-6" />
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                      doc.status === 'approved' ? "bg-emerald-500/10 text-emerald-500" :
                      doc.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {doc.status}
                    </div>
                 </div>

                 <div>
                    <h4 className="text-lg font-bold text-text mb-1">{doc.full_name}</h4>
                    <p className="text-xs font-bold text-text-dim lowercase group-hover:text-accent transition-colors cursor-pointer">@{doc.username}</p>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                 <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">
                    {formatDate(doc.created_at)}
                 </p>
                 <button 
                  onClick={() => setSelectedDoc(doc)}
                  className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest hover:text-white transition-all"
                 >
                    Review
                    <Eye className="w-3.5 h-3.5" />
                 </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-md" 
               onClick={() => setSelectedDoc(null)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-sidebar rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-card-border"
            >
               {/* Preview */}
               <div className="flex-1 bg-black/40 relative group min-h-[300px]">
                  <img 
                    src={selectedDoc.document_front || 'https://picsum.photos/seed/doc/800/1000'} 
                    alt="Document Front"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-white font-bold text-[9px] tracking-widest uppercase">
                     FRONT VIEW
                  </div>
               </div>

               {/* Controls */}
               <div className="w-full md:w-[360px] p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-text">Identity Verification</h3>
                      <p className="text-xs text-text-dim font-medium uppercase tracking-widest mt-1">Doc ID: #{selectedDoc.id}</p>
                    </div>

                    <div className="space-y-3">
                       <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                          <User className="w-4 h-4 text-text-dim" />
                          <span className="text-xs font-bold text-text">{selectedDoc.full_name}</span>
                       </div>
                       <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-text-dim" />
                          <span className="text-xs font-bold text-text">Joined {formatDate(selectedDoc.created_at)}</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-8">
                    <button 
                      onClick={() => updateStatus(selectedDoc.id, 'approved')}
                      disabled={updating}
                      className="w-full bg-emerald-500 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve'}
                    </button>
                    <button 
                       onClick={() => {
                        const r = prompt('Reason for rejection:');
                        if (r) updateStatus(selectedDoc.id, 'rejected', r);
                       }}
                      disabled={updating}
                      className="w-full bg-rose-500/10 text-rose-500 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                    >
                      Reject
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}
