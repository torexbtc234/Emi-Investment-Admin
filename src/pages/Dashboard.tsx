import React, { useEffect, useState } from 'react';
import { 
  Users, Landmark, Wallet, Layers, 
  ArrowUpRight, ArrowDownRight, Clock, ShieldAlert,
  Calendar, Download, Filter, Car, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import api from '../lib/api';
import { DashboardStats } from '../types';
import StatCard from '../components/StatCard';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('', { params: { endpoint: 'dashboard' } });
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (!stats && !loading) return <div className="text-center py-20 text-text-dim">Failed to load system stats. Check connection.</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Admin Overview</h2>
          <p className="text-text-dim text-sm font-medium">Real-time platform metrics and system health</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-text hover:bg-white/10 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-text-dim" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Stats
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.users.total || 0}
          icon={Users}
          subValue={`↑ ${stats?.users.new_this_month} this month`}
          color={"indigo"}
          loading={loading}
        />
        <StatCard
          title="Pending Deposits"
          value={formatCurrency(stats?.deposits.pending_amount || 0)}
          icon={Landmark}
          subValue={stats ? `${stats.deposits.pending_count} Waiting Approval` : ''}
          color="amber"
          loading={loading}
        />
        <StatCard
          title="Active Cars"
          value={stats?.investments.active_count || 0}
          icon={Car}
          subValue={`Average 14.2% APY`}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="System Health"
          value="99.9%"
          icon={Activity}
          subValue={`All Gateways Online`}
          color="emerald"
          loading={loading}
        />
      </div>

      {/* Secondary Stats & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6 shadow-2xl relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-text flex items-center gap-2">
                Finance Trends
                <span className="px-2 py-0.5 rounded-full bg-accent text-[10px] text-white">LIVE</span>
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-dim">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>Deposits</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-dim">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Withdrawals</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.charts.deposits.map((d, i) => ({
                date: formatDate(d.date),
                deposits: parseFloat(d.total),
                withdrawals: parseFloat(stats?.charts.withdrawals[i]?.total || 0)
              })) || []}>
                <defs>
                  <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141822', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '700' }}
                  labelStyle={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="deposits" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDeposits)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="withdrawals" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorWithdrawals)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pending Actions & Recent Activity */}
        <div className="space-y-6">
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xs font-bold text-text mb-4 uppercase tracking-widest text-text-dim">GATEWAY STATUS</h3>
            <div className="space-y-4">
              {[
                { name: 'PayPal API', status: 'Active', color: 'text-emerald-500' },
                { name: 'NOWPayments', status: 'Active', color: 'text-emerald-500' },
                { name: 'Coinbase', status: 'Issues', color: 'text-rose-500' }
              ].map(gw => (
                <div key={gw.name} className="flex justify-between items-center text-xs">
                  <span className="text-text font-medium">{gw.name}</span>
                  <span className={cn("font-bold flex items-center gap-1.5", gw.color)}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", gw.color.replace('text', 'bg'))} />
                    {gw.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 shadow-2xl flex-1 min-h-[200px]">
            <h3 className="text-xs font-bold text-text mb-4 uppercase tracking-widest text-text-dim">RECENT ACTIVITY</h3>
            <div className="space-y-5">
              {[
                { label: 'Withdrawal', msg: 'approved for User #4412', time: '2 mins ago', border: 'border-accent' },
                { label: 'KYC Submitted', msg: 'by User #9982', time: '14 mins ago', border: 'border-amber-500' },
                { label: 'New User', msg: 'Registered: Tommy V.', time: '1 hr ago', border: 'border-emerald-500' }
              ].map((log, i) => (
                <div key={i} className={cn("pl-3 border-l-2 text-[11px] space-y-0.5", log.border)}>
                  <p className="text-text">
                    <strong className="font-bold">{log.label}</strong> {log.msg}
                  </p>
                  <p className="text-text-dim font-medium">{log.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
