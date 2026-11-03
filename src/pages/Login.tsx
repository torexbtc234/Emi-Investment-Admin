import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { User, Lock, Activity, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import api from '../lib/api';

export default function Login() {
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('1234nice@KK');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 3D Hover Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('', {
        endpoint: 'login',
        username,
        password
      });

      if (data.success) {
        localStorage.setItem('EM_INVEST_ADMIN_TOKEN', data.token);
        localStorage.setItem('EM_INVEST_ADMIN_DATA', JSON.stringify(data.admin));
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Connection error. Check API base URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-[420px]"
      >
        <div 
          style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
          className="bg-sidebar rounded-3xl p-10 lg:p-12 shadow-2xl relative z-10 overflow-hidden border border-card-border"
        >
          {/* Internal Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/50 to-accent" />
          
          <div className="text-center mb-10" style={{ transform: "translateZ(40px)" }}>
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/40 mx-auto mb-8 transform rotate-3">
              <Activity className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">Portal Access</h2>
            <p className="text-text-dim text-[10px] font-bold uppercase tracking-[0.2em]">Management Interface v2.0</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" style={{ transform: "translateZ(30px)" }}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-danger/10 text-danger px-4 py-3 rounded-xl text-[11px] font-bold flex items-center gap-3 border border-danger/20"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Identity</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-text text-sm transition-all focus:border-accent outline-none"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Credential</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-text text-sm transition-all focus:border-accent outline-none"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full bg-accent text-white rounded-xl py-4 font-bold text-xs uppercase tracking-widest shadow-2xl shadow-accent/30 flex items-center justify-center gap-2 hover:bg-accent/90 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Initialize Connection</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center" style={{ transform: "translateZ(10px)" }}>
            <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest opacity-40">
              EMI INVESTMENT &bull; SECURE NODES &bull; 2026
            </p>
          </div>
        </div>

        {/* Shadow floor for 3D depth */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/60 blur-2xl rounded-full" />
      </motion.div>
    </div>

  );
}
