import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Globe, Shield, CreditCard, Bell, 
  Database, RefreshCw, Save, AlertCircle, CheckCircle2, ChevronRight, Activity, Trash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api, { getBaseUrl, setBaseUrl } from '../lib/api';
import { cn } from '../lib/utils';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [baseUrlInput, setBaseUrlInput] = useState(getBaseUrl());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleBaseUrlChange = (e: React.FormEvent) => {
    e.preventDefault();
    setBaseUrl(baseUrlInput);
    setSuccess('Base URL updated successfully. App will reload.');
    setTimeout(() => window.location.reload(), 1500);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'gateways', label: 'Payment Gateways', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Email & Alerts', icon: Bell },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text">System Settings</h2>
        <p className="text-text-dim text-sm font-medium">Global configuration and API endpoints</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Rail */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-xs transition-all text-left uppercase tracking-wider",
                activeTab === tab.id 
                  ? "bg-accent text-white shadow-lg shadow-accent/20" 
                  : "text-text-dim hover:bg-white/5 hover:text-text"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}

          <div className="pt-8 space-y-4">
             <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/10 space-y-3">
               <div className="flex items-center gap-2 text-rose-500 font-bold mb-1">
                 <AlertCircle className="w-4 h-4" />
                 <span className="text-[10px] uppercase tracking-widest">Danger Zone</span>
               </div>
               <button className="w-full bg-rose-500/10 text-rose-500 py-2.5 rounded-xl border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                  Maintenance Mode
               </button>
             </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 space-y-6">
           <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Base URL Override */}
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-8 shadow-2xl">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                           <Globe className="w-5 h-5 " />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-text">Endpoint Configuration</h3>
                           <p className="text-xs text-text-dim font-medium">Critical system base URL override</p>
                        </div>
                     </div>

                     <form onSubmit={handleBaseUrlChange} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Current Base URL</label>
                          <input 
                            type="url" 
                            value={baseUrlInput}
                            onChange={(e) => setBaseUrlInput(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-sm text-text focus:border-accent focus:bg-white/10 transition-all outline-none"
                            placeholder="https://example.com/api/admin/index.php"
                          />
                        </div>
                        
                        {success && (
                          <div className="p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold flex items-center gap-3">
                             <CheckCircle2 className="w-4 h-4" />
                             {success}
                          </div>
                        )}

                        <button 
                          type="submit"
                          className="w-full sm:w-auto px-8 py-3.5 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                     </form>
                  </div>

                  <div className="bg-white/3 border border-white/8 rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-lg font-bold text-text mb-8">Branding & Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Site Title</label>
                          <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-text text-sm" defaultValue="EM Investment" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Support Email</label>
                          <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-bold text-text text-sm" defaultValue="support@emi.com" />
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'gateways' && (
                <motion.div
                  key="gateways"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                   <div className="bg-white/3 border border-white/8 rounded-2xl p-8 shadow-2xl">
                      <h3 className="text-lg font-bold text-text mb-8">NOWPayments Configuration</h3>
                      <div className="space-y-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">API Key</label>
                           <input type="password" placeholder="••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-text" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">IPN Secret</label>
                           <input type="password" placeholder="••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-text" />
                         </div>
                         <button className="bg-accent text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20">Save Gateway Config</button>
                      </div>
                   </div>

                   <div className="bg-white/3 border border-white/8 rounded-2xl p-8 shadow-2xl">
                      <h3 className="text-lg font-bold text-text mb-8">Alternative Methods</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {['PayPal', 'CashApp', 'Venmo', 'Manual Crypto'].map(m => (
                           <div key={m} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                              <span className="font-bold text-text text-xs">{m}</span>
                              <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer ring-1 ring-white/10 group-hover:bg-accent transition-colors duration-300">
                                 <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
