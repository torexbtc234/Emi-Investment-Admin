import React, { useEffect, useState } from 'react';
import { 
  Plus, Edit, Trash2, Ticket, MessageCircle, Send, 
  Clock, CheckCircle, ChevronRight, User, Hash, Loader2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../lib/api';
import { SupportTicket } from '../types';
import { cn, formatDate } from '../lib/utils';

export default function Tickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('', { params: { endpoint: 'tickets' } });
      if (data.success) setTickets(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (id: number) => {
    try {
      const { data } = await api.get('', { params: { endpoint: 'tickets', id } });
      if (data.success) setSelectedTicket(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post('', { 
        endpoint: 'tickets', 
        ticket_id: selectedTicket.id, 
        message: reply 
      });
      if (data.success) {
        setReply('');
        fetchTicketDetails(selectedTicket.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex gap-8">
      {/* Scrollable list */}
      <div className="w-full lg:w-[400px] space-y-4 flex flex-col h-full">
         <div className="bg-white/3 rounded-2xl p-6 shadow-2xl border border-white/8 shrink-0">
            <h2 className="text-xl font-bold text-text">Support Tickets</h2>
            <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mt-1">Status and inquiries</p>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 pb-10">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/3 rounded-2xl p-6 h-32 animate-pulse border border-white/5" />
              ))
            ) : (
              tickets.map(ticket => (
                <motion.div
                  layout
                  key={ticket.id}
                  onClick={() => fetchTicketDetails(ticket.id)}
                  className={cn(
                    "bg-white/3 rounded-2xl p-6 shadow-2xl border cursor-pointer transition-all hover:bg-white/[0.05] group",
                    selectedTicket?.id === ticket.id ? "border-accent ring-1 ring-accent/30" : "border-white/5"
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest leading-none">ID #{ticket.id}</p>
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                      ticket.status === 'open' ? "bg-accent/10 text-accent" :
                      ticket.status === 'resolved' ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-text-dim"
                    )}>
                      {ticket.status}
                    </div>
                  </div>
                  <h4 className="font-bold text-text group-hover:text-accent transition-colors truncate text-sm">{ticket.subject}</h4>
                  <div className="flex items-center justify-between mt-4">
                     <p className="text-xs font-bold text-text-dim">@{ticket.username}</p>
                     <p className="text-[9px] font-bold text-text-dim uppercase tracking-tighter opacity-50">{formatDate(ticket.created_at)}</p>
                  </div>
                </motion.div>
              ))
            )}
         </div>
      </div>

      {/* Chat Area */}
      <div className="hidden lg:flex flex-1 bg-white/3 rounded-3xl shadow-2xl border border-white/8 flex-col overflow-hidden relative">
        {selectedTicket ? (
          <>
            {/* Chat header */}
            <div className="h-20 px-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent font-bold">
                    {selectedTicket.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-text leading-tight">{selectedTicket.subject}</h3>
                    <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest">Conversation with @{selectedTicket.username}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20">
                     Resolve
                  </button>
               </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6 bg-black/20">
               <div className="flex flex-col gap-6">
                  {/* The original message */}
                  <div className="bg-white/5 p-5 rounded-2xl rounded-tl-none border border-white/5 max-w-[80%] self-start relative">
                     <p className="text-sm font-medium text-text leading-relaxed">{selectedTicket.message || 'No description provided.'}</p>
                     <p className="text-[9px] text-text-dim font-bold uppercase mt-4 tracking-widest opacity-60">{selectedTicket.username} &bull; {formatDate(selectedTicket.created_at)}</p>
                  </div>

                  {/* Replies */}
                  {selectedTicket.replies?.map((rep: any, i: number) => (
                    <div 
                      key={rep.id} 
                      className={cn(
                        "p-5 rounded-2xl shadow-lg border max-w-[80%] relative",
                        rep.is_admin_reply 
                          ? "bg-accent text-white rounded-tr-none self-end border-accent shadow-accent/20" 
                          : "bg-white/5 text-text rounded-tl-none self-start border-white/5"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{rep.message}</p>
                      <p className={cn(
                        "text-[9px] font-bold uppercase mt-4 tracking-widest",
                        rep.is_admin_reply ? "text-white/60" : "text-text-dim"
                      )}>
                        {rep.is_admin_reply ? `ADMIN (${rep.admin_username})` : rep.user_username} &bull; {formatDate(rep.created_at)}
                      </p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Input area */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02]">
               <form onSubmit={handleReply} className="relative group">
                  <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pr-20 font-medium text-text focus:border-accent focus:bg-white/[0.08] transition-all outline-none resize-none min-h-[120px] text-sm"
                    placeholder="Type your response to the user..."
                  />
                  <button 
                    disabled={sending || !reply.trim()}
                    type="submit"
                    className="absolute right-5 bottom-5 w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center hover:bg-accent/90 shadow-xl shadow-accent/20 transition-all disabled:opacity-30"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                  </button>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
             <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 animate-pulse">
                <MessageCircle className="w-8 h-8" />
             </div>
             <h4 className="text-xl font-bold text-text mb-2">Select a Conversation</h4>
             <p className="text-xs text-text-dim max-w-sm font-medium uppercase tracking-widest">Pick a support ticket to start chatting</p>
          </div>
        )}
      </div>
    </div>

  );
}
