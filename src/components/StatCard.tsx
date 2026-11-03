import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subValue?: string;
  trend?: number;
  color?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'rose';
  loading?: boolean;
}

const colorMap = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', shadow: 'shadow-indigo-100', iconBg: 'bg-indigo-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', shadow: 'shadow-emerald-100', iconBg: 'bg-emerald-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', shadow: 'shadow-amber-100', iconBg: 'bg-amber-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', shadow: 'shadow-blue-100', iconBg: 'bg-blue-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', shadow: 'shadow-rose-100', iconBg: 'bg-rose-600' },
};

export default function StatCard({ title, value, icon: Icon, subValue, trend, color = 'indigo', loading }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "bg-white/3 border border-white/8 rounded-[16px] p-5 shadow-2xl transition-all flex flex-col justify-between h-full group",
        "hover:bg-white/[0.05] hover:border-accent/30"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:scale-110 group-hover:rotate-3 transition-all">
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
            trend > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
          )}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-text-dim font-bold text-[11px] uppercase tracking-wider mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
          ) : (
            <span className="text-2xl font-bold text-text">{value}</span>
          )}
        </div>
        {subValue && <p className="text-[12px] text-text-dim mt-1.5">{subValue}</p>}
      </div>
    </motion.div>
  );
}
