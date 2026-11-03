import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Users, Landmark, Wallet, Layers, 
  Car, ShieldCheck, Ticket, Settings as SettingsIcon,
  LogOut, Menu, X, ChevronRight, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const navItems = [
  { path: '/', label: 'Overview', icon: BarChart3 },
  { path: '/users', label: 'User Management', icon: Users },
  { path: '/deposits', label: 'Deposits', icon: Landmark },
  { path: '/withdrawals', label: 'Withdrawals', icon: Wallet },
  { path: '/plans', label: 'Investment Plans', icon: Layers },
  { path: '/cars', label: 'Car Fleet', icon: Car },
  { path: '/kyc', label: 'KYC Verification', icon: ShieldCheck },
  { path: '/tickets', label: 'Support Tickets', icon: Ticket },
  { path: '/settings', label: 'System Settings', icon: SettingsIcon },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('EM_INVEST_ADMIN_TOKEN');
    localStorage.removeItem('EM_INVEST_ADMIN_DATA');
    navigate('/login');
  };

  const adminData = JSON.parse(localStorage.getItem('EM_INVEST_ADMIN_DATA') || '{}');

  return (
    <div className="min-h-screen bg-bg flex font-sans text-text">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : { width: 240 }}
            animate={isMobile ? { x: 0 } : { width: isSidebarOpen ? 240 : 0 }}
            exit={isMobile ? { x: -300 } : { width: 0 }}
            className={cn(
              "fixed lg:relative z-50 bg-sidebar border-r border-card-border overflow-hidden shrink-0",
              isMobile ? "h-full shadow-2xl" : "h-screen"
            )}
           >
            <div className="flex flex-col h-full w-[240px]">
              {/* Logo Area */}
              <div className="h-20 flex items-center justify-between px-6 border-b border-card-border">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-accent tracking-tighter uppercase">EM INVEST</span>
                </div>
                {isMobile && (
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-white/5 rounded-md text-text-dim hover:text-text">
                    <X className="w-5 h-5" />
                  </button>
                 )}
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative text-[13px] font-medium",
                      isActive 
                        ? "bg-accent/10 text-accent border-l-2 border-accent rounded-l-none" 
                        : "text-text-dim hover:bg-white/5 hover:text-text"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 opacity-70 group-hover:opacity-100")} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-card-border">
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    {adminData.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text truncate">{adminData.full_name || 'Admin User'}</p>
                    <p className="text-[10px] text-text-dim truncate uppercase tracking-wider">{adminData.role?.replace('_', ' ') || 'Super Admin'}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-1 text-text-dim hover:text-rose-400 hover:bg-rose-400/10 rounded transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-bg border-b border-card-border flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-text-dim transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-semibold text-text">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider">Live System</span>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
