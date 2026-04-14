import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Leaf, Mail, Lock, User, Eye, ArrowRight, Monitor, Globe, ShieldCheck, Cpu
} from 'lucide-react';
import { api } from '../services/api';
import Globe3D from './landing/Globe3D';

const RevealText = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.2em] py-1">
          <motion.span
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.33, 1, 0.68, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

interface LandingPageProps {
  onAuth: (user: { name: string; email: string; role: string; token: string }) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'landing' | 'signin' | 'signup'>('landing');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const result = mode === 'signin'
        ? await api.auth.signin(form.email, form.password)
        : await api.auth.signup(form.name, form.email, form.password);
      if (!result) { setLoginError('Connection failure.'); setLoading(false); return; }
      if (result.error) { setLoginError(result.error); setLoading(false); return; }
      localStorage.setItem('ecotrack_token', result.token);
      localStorage.setItem('ecotrack_user', JSON.stringify(result.user));
      onAuth({ ...result.user, token: result.token });
    } catch { setLoginError('Error occurred.'); }
    setLoading(false);
  };

  const partnerLogos = ['Reliance', 'BigBasket', 'D-Mart', 'Spencer\'s', 'More'];

  return (
    <div className="bg-[#020617] min-h-screen text-white selection:bg-mint selection:text-black font-sans overflow-x-hidden">
      <Globe3D />
      
      {/* Scroll Progress Indicator */}
      <motion.div 
        style={{ scaleX: scaleProgress }} 
        className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mint to-transparent z-[100] origin-left" 
      />

      <nav className="fixed top-0 left-0 w-full z-50 px-12 py-10 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 cursor-pointer group"
          onClick={() => setMode('landing')}
        >
          <div className="p-3 rounded-2xl bg-white shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Leaf className="h-6 w-6 text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">EcoTrack <span className="text-mint">AI</span></span>
        </motion.div>

        <div className="flex items-center space-x-12">
          <button onClick={() => setMode('signin')} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">Portal Access</button>
          <button 
            onClick={() => setMode('signup')}
            className="px-10 py-4 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
          >
            Join Network
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-8">
          <motion.div style={{ opacity }} className="max-w-7xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center space-x-4 mb-12">
              <span className="h-px w-10 bg-mint/30" />
              <span className="text-[10px] font-black tracking-[0.6em] uppercase text-mint">Enterprise Intelligence</span>
              <span className="h-px w-10 bg-mint/30" />
            </motion.div>
            
            <h1 className="text-[8vw] font-black leading-[0.8] tracking-tighter mb-16 text-white uppercase italic">
              <RevealText text="Predict. Prevent." className="block" />
              <RevealText text="Preserve." className="text-transparent border-text stroke-white" />
            </h1>

            <p className="text-2xl text-white/30 max-w-3xl mx-auto font-medium leading-relaxed mb-20 italic">
              "Indian retail loses ₹1.2Cr+ to waste annually. <br /> We're here to reclaim it."
            </p>

            <button 
              onClick={() => setMode('signup')}
              className="group flex items-center space-x-6 px-14 py-8 rounded-full bg-mint text-black font-black text-2xl shadow-[0_0_70px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 transition-all"
            >
              <RevealText text="INITIATE PROTOCOL" />
              <ArrowRight className="h-8 w-8 group-hover:translate-x-3 transition-transform" />
            </button>
          </motion.div>
        </section>

        {/* LOGIC SECTION */}
        <section className="py-60 px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-32 items-center">
            <div className="lg:w-1/2">
              <RevealText text="The Intelligence Layer" className="text-xs font-black tracking-[0.4em] text-mint mb-8 uppercase block" />
              <h2 className="text-7xl font-black mb-10 leading-[0.9] tracking-tighter uppercase italic">Groq Powered <br />Supply Chains.</h2>
              <p className="text-2xl text-white/20 leading-relaxed font-medium mb-12 italic">
                Our proprietary LLM logic processes real-time inventory at 300 tokens/sec, identifying expiry risks before they appear on your dashboard.
              </p>
              <div className="flex space-x-8">
                 <div className="flex flex-col items-center"><Monitor className="text-mint h-8 w-8 mb-2"/><span className="text-[8px] font-bold uppercase tracking-widest text-white/30">Pulse OS</span></div>
                 <div className="flex flex-col items-center"><Globe className="text-mint h-8 w-8 mb-2"/><span className="text-[8px] font-bold uppercase tracking-widest text-white/30">Geo-Route</span></div>
                 <div className="flex flex-col items-center"><Cpu className="text-mint h-8 w-8 mb-2"/><span className="text-[8px] font-bold uppercase tracking-widest text-white/30">Edge AI</span></div>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 gap-8">
              {[
                 { t: 'DYNAMIC FORECASTING', d: '98.5% accuracy in spoilage prediction for fresh produce.' },
                 { t: 'REVENUE RECOVERY', d: 'Automated discount triggers to prevent 100% loss.' }
              ].map((c, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.05] transition-all"
                  key={i}
                >
                  <h3 className="text-lg font-black text-mint mb-4 tracking-tighter uppercase">{c.t}</h3>
                  <p className="text-white/40 text-sm font-medium leading-relaxed italic">{c.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* NETWORK SECTION */}
        <section className="py-60 px-8 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mint/5 blur-[150px] rounded-full" />
          <div className="max-w-7xl mx-auto text-center">
            <RevealText text="UNIFIED PARTNER GRID" className="text-xs font-black tracking-[0.5em] text-white/20 mb-20 uppercase block" />
            <div className="flex flex-wrap items-center justify-center gap-24 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
              {partnerLogos.map(p => (
                <span key={p} className="text-7xl font-black italic tracking-tighter">{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-60 px-8 text-center bg-gradient-to-t from-mint/5 to-transparent">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[10vw] font-black mb-12 tracking-tighter uppercase italic text-white/80">RECLAIM <br /> THE EARTH.</h2>
            <button 
              onClick={() => setMode('signup')}
              className="px-16 py-8 rounded-full bg-white text-black font-black text-2xl shadow-[0_0_80px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
            >
              DEPLOY ECOTRACK
            </button>
            <div className="mt-40 flex items-center justify-center space-x-12 text-[8px] font-black uppercase tracking-[0.5em] text-white/10">
              <span>GDPR COMPLIANT</span>
              <ShieldCheck className="h-4 w-4" />
              <span>ISO 14001 READY</span>
            </div>
          </div>
        </footer>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {mode !== 'landing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem] shadow-2xl">
              <div className="bg-[#020617] rounded-[2.8rem] p-12 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-mint/20" />
                <h2 className="text-4xl font-black text-white text-center mb-16 tracking-tighter italic uppercase">{mode === 'signin' ? 'AUTHORIZE' : 'RECRUIT'}</h2>
                
                {loginError && (
                  <div className="mb-8 p-4 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {mode === 'signup' && (
                    <div className="relative group">
                      <User className="absolute left-6 top-6 h-5 w-5 text-mint/20 group-focus-within:text-mint transition-colors" />
                      <input 
                        type="text" placeholder="ORG_ID" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full pl-16 pr-8 py-6 rounded-2xl bg-white/[0.03] border border-white/5 text-sm font-bold uppercase tracking-widest focus:bg-white/5 outline-none transition-all placeholder:text-white/10" 
                      />
                    </div>
                  )}
                  <div className="relative group">
                    <Mail className="absolute left-6 top-6 h-5 w-5 text-mint/20 group-focus-within:text-mint transition-colors" />
                    <input 
                      type="email" placeholder="ADMIN_EMAIL" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full pl-16 pr-8 py-6 rounded-2xl bg-white/[0.03] border border-white/5 text-sm font-bold uppercase tracking-widest focus:bg-white/5 outline-none transition-all placeholder:text-white/10" 
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-6 h-5 w-5 text-mint/20 group-focus-within:text-mint transition-colors" />
                    <input 
                      type={showPassword ? 'text' : 'password'} placeholder="SECRET_KEY" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full pl-16 pr-16 py-6 rounded-2xl bg-white/[0.03] border border-white/5 text-sm font-bold uppercase tracking-widest focus:bg-white/5 outline-none transition-all placeholder:text-white/10" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-6 text-mint/10 hover:text-mint"><Eye className="h-6 w-6" /></button>
                  </div>
                  <button type="submit" className="w-full py-6 rounded-2xl bg-mint text-black font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(16,185,129,0.3)]">{loading ? "LINKING..." : "EXECUTE"}</button>
                </form>
                <div className="mt-12 text-center text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-6">
                  <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-mint/30 hover:text-white transition-colors">{mode === 'signin' ? 'CREATE_ACCOUNT' : 'EXISTING_MEMBER'}</button>
                  <button onClick={() => setMode('landing')} className="text-white/5 hover:text-white transition-colors">TERMINATE_SESSION</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`.border-text { -webkit-text-stroke: 1px rgba(255,255,255,0.1); color: transparent; }`}</style>
    </div>
  );
};

export default LandingPage;
