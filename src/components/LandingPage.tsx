import React, { useState } from 'react';
import { Leaf, Mail, Lock, User, Eye, EyeOff, ArrowRight, Zap, BarChart3, Shield, TrendingUp, Package } from 'lucide-react';
import { api } from '../services/api';

interface LandingPageProps {
  onAuth: (user: { name: string; email: string; role: string; token: string }) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'landing' | 'signin' | 'signup'>('landing');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'signin' ? '/auth/signin' : '/auth/signup';
      const body = mode === 'signin'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const result = await fetch(`http://localhost:3001/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(r => r.json());

      if (result.error) { setError(result.error); setLoading(false); return; }

      localStorage.setItem('ecotrack_token', result.token);
      localStorage.setItem('ecotrack_user', JSON.stringify(result.user));
      onAuth({ ...result.user, token: result.token });
    } catch {
      // Offline fallback — allow demo login
      if (form.email === 'admin@ecotrack.in' || form.password.length >= 6) {
        const demoUser = { name: form.name || 'Admin Manager', email: form.email, role: 'admin', token: 'demo_token' };
        localStorage.setItem('ecotrack_token', 'demo_token');
        localStorage.setItem('ecotrack_user', JSON.stringify(demoUser));
        onAuth(demoUser);
      } else {
        setError('Backend offline. Use admin@ecotrack.in with any 6+ char password for demo.');
      }
    }
    setLoading(false);
  };

  const features = [
    { icon: Zap, title: 'Real-Time Risk Alerts', desc: 'AI-powered alerts for expiring products across 5 partner stores', color: 'text-yellow-400' },
    { icon: BarChart3, title: 'Live Analytics', desc: 'Track waste reduction, savings and category trends in real time', color: 'text-blue-400' },
    { icon: Shield, title: 'Smart Recommendations', desc: 'Groq LLM gives actionable strategies with % success rates', color: 'text-purple-400' },
    { icon: TrendingUp, title: 'Network Insights', desc: 'Compare performance across all 5 Indian partner stores', color: 'text-green-400' },
  ];

  const stats = [
    { value: '₹1.2L+', label: 'Monthly Savings' },
    { value: '5', label: 'Partner Stores' },
    { value: '47%', label: 'Avg Waste Reduction' },
    { value: '135+', label: 'Products Tracked' },
  ];

  if (mode === 'signin' || mode === 'signup') {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)' }}>
        {/* 3D floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, #10b981, transparent)', top: '-10%', left: '-5%' }} />
          <div className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, #6366f1, transparent)', bottom: '-5%', right: '-5%', animationDelay: '1s' }} />
          <div className="absolute w-64 h-64 rounded-full opacity-10 blur-2xl" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', top: '40%', left: '60%' }} />
          {/* Grid lines */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 w-full max-w-md mx-4">
          {/* Card */}
          <div className="rounded-2xl p-8 border" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)', borderColor: 'rgba(16,185,129,0.3)', boxShadow: '0 0 60px rgba(16,185,129,0.15), 0 25px 50px rgba(0,0,0,0.5)' }}>
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 20px rgba(16,185,129,0.5)' }}>
                <Leaf className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">EcoTrack AI</h1>
                <p className="text-xs text-emerald-400">Smart Waste Management</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white text-center mb-2">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-sm text-center mb-8">
              {mode === 'signin' ? 'Sign in to your store dashboard' : 'Join India\'s leading waste reduction platform'}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                  <><span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span><ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-slate-400 text-sm">{mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}</span>
              <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors">
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>

            <button onClick={() => setMode('landing')} className="mt-4 w-full text-center text-slate-500 text-xs hover:text-slate-400 transition-colors">
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Landing page
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 40%, #0f172a 100%)' }}>
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #10b981, transparent)', top: '-20%', left: '-10%', animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #6366f1, transparent)', bottom: '-10%', right: '-10%', animation: 'pulse 6s ease-in-out infinite' }} />
        <div className="absolute w-96 h-96 rounded-full opacity-15 blur-2xl" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'pulse 5s ease-in-out infinite' }} />
        {/* Grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-40"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`, animationDelay: `${Math.random() * 3}s` }} />
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 15px rgba(16,185,129,0.5)' }}>
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">EcoTrack AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setMode('signin')} className="px-4 py-2 text-sm font-medium text-emerald-400 hover:text-white transition-colors">Sign In</button>
          <button onClick={() => setMode('signup')} className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 15px rgba(16,185,129,0.4)' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-8 pt-16 pb-24">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm text-emerald-300 mb-8 border" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' }}>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>Live across 5 Indian retail stores</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          Reduce Food Waste<br />
          <span className="inline-block" style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Powered by AI
          </span>
        </h1>

        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          EcoTrack AI uses Groq LLM to give real-time, ₹-backed recommendations for Indian grocery managers — reducing waste, recovering revenue, saving the environment.
        </p>

        <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
          <button onClick={() => setMode('signup')} className="flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 30px rgba(16,185,129,0.5)' }}>
            <span>Start Free Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <button onClick={() => setMode('signin')} className="flex items-center space-x-2 px-8 py-4 rounded-2xl font-medium text-white text-lg transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span>Sign In</span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl border text-center" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-3xl font-black" style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-8 pb-24 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Everything You Need</h2>
        <p className="text-slate-400 text-center mb-12 text-lg">One platform to manage waste, track savings, and get AI-backed insights</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl border group hover:scale-105 transition-all duration-300 cursor-default"
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div className="mb-4 p-3 rounded-xl inline-block" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <f.icon className={`h-6 w-6 ${f.color}`} />
              </div>
              <h3 className="text-white font-bold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stores preview */}
        <div className="mt-16 p-8 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div className="flex items-center space-x-3 mb-6">
            <Package className="h-5 w-5 text-emerald-400" />
            <h3 className="text-white font-bold">Partner Stores Network</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Reliance Fresh\nConnaught Place', 'BigBasket Express\nKoramangala', 'D-Mart\nBandra West', 'More Megastore\nSalt Lake', "Spencer's Retail\nAnna Nagar"].map((store, i) => {
              const [name, loc] = store.split('\n');
              return (
                <div key={i} className="p-4 rounded-xl border text-center" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.15)' }}>
                  <div className="text-emerald-400 font-bold text-sm">{name}</div>
                  <div className="text-slate-500 text-xs mt-1">{loc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center px-8 pb-24">
        <div className="max-w-2xl mx-auto p-12 rounded-3xl border" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)', boxShadow: '0 0 60px rgba(16,185,129,0.1)' }}>
          <h2 className="text-4xl font-bold text-white mb-4">Start Reducing Waste Today</h2>
          <p className="text-slate-400 mb-8">Free for all store managers. No credit card required.</p>
          <button onClick={() => setMode('signup')} className="px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}>
            Sign Up — It's Free
          </button>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
