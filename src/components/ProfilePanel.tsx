import React from 'react';
import { X, User, MapPin, Clock, BarChart3, Settings, LogOut, Leaf, TrendingUp, Mail } from 'lucide-react';

interface RecentActivity {
  action: string;
  store: string;
  time: string;
  timestamp: Date;
  productName?: string;
}

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentStore: string;
  darkMode?: boolean;
  recentActivity?: RecentActivity[];
  onQuickAction?: (action: string) => void;
  onSignOut?: () => void;
  userName?: string;
  userEmail?: string;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  isOpen, onClose, currentStore, darkMode = false, recentActivity = [],
  onQuickAction, onSignOut, userName = 'Store Manager', userEmail = 'manager@ecotrack.in'
}) => {
  const storePerformance: Record<string, { savings: number; reduction: number; efficiency: number }> = {
    'Reliance Fresh - Connaught Place':  { savings: 28470,  reduction: 47, efficiency: 89 },
    'BigBasket Express - Koramangala':   { savings: 32400, reduction: 67, efficiency: 95 },
    'D-Mart - Bandra West':              { savings: 21800, reduction: 41, efficiency: 87 },
    'More Megastore - Salt Lake':        { savings: 18900, reduction: 38, efficiency: 82 },
    "Spencer's Retail - Anna Nagar":     { savings: 26500, reduction: 52, efficiency: 91 },
  };

  const totalSavings = Object.values(storePerformance).reduce((s, v) => s + v.savings, 0);
  const avgReduction = Math.round(Object.values(storePerformance).reduce((s, v) => s + v.reduction, 0) / 5);
  const perf = storePerformance[currentStore] || { savings: 0, reduction: 0, efficiency: 0 };

  const quickActions = [
    { id: 'analytics', label: 'Insights Lab', icon: BarChart3, color: 'blue' },
    { id: 'alerts', label: 'Risk Monitor', icon: TrendingUp, color: 'red' },
    { id: 'insights', label: 'AI Assistant', icon: Leaf, color: 'green' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'slate' },
  ];

  const defaultActivity = [
    { action: 'Reviewed daily analytics report', store: currentStore, time: '1 hour ago', timestamp: new Date() },
    { action: 'Applied 30% markdown on Paneer', store: currentStore, time: '3 hours ago', timestamp: new Date() },
    { action: 'Coordinated transfer to partner store', store: 'BigBasket Express - Koramangala', time: '1 day ago', timestamp: new Date() },
    { action: 'Donation scheduled with Akshaya Patra', store: currentStore, time: '2 days ago', timestamp: new Date() },
  ];

  const displayActivity = recentActivity.length > 0 ? recentActivity : defaultActivity;

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${darkMode ? 'bg-black/40' : 'bg-black/30'}`} onClick={onClose}>
      <div className="glass-card w-full max-w-md h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 sticky top-0 glass-card backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-500/20' : 'bg-green-100/50'}`}>
                <Leaf className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Profile</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-3xl font-black">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{userName}</h3>
            <div className={`flex items-center justify-center space-x-1 mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Mail className="h-3.5 w-3.5" />
              <span>{userEmail}</span>
            </div>
            <div className={`flex items-center justify-center space-x-1 mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <MapPin className="h-4 w-4" />
              <span>Regional Manager — All India Network</span>
            </div>
            <div className={`flex items-center justify-center space-x-1 mt-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              <Leaf className="h-4 w-4" />
              <span>Viewing: {currentStore}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.id} onClick={() => onQuickAction?.(a.id)} className="glass-card glass-hover p-4 text-center group">
                    <Icon className={`h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform ${
                      a.color === 'blue' ? (darkMode ? 'text-blue-400' : 'text-blue-600') :
                      a.color === 'red'  ? (darkMode ? 'text-red-400' : 'text-red-600') :
                      a.color === 'green'? (darkMode ? 'text-green-400' : 'text-green-600') :
                      (darkMode ? 'text-slate-400' : 'text-slate-600')
                    }`} />
                    <span className={`text-xs font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 text-center bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-400/30">
              <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>5</div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Stores Managed</div>
            </div>
            <div className="glass-card p-4 text-center bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-400/30">
              <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹{(totalSavings / 1000).toFixed(0)}K</div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Savings</div>
            </div>
            <div className="glass-card p-4 text-center bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-400/30">
              <div className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{avgReduction}%</div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Avg. Reduction</div>
            </div>
            <div className="glass-card p-4 text-center bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-400/30">
              <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{perf.efficiency}%</div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Efficiency</div>
            </div>
          </div>

          {/* Current Store Performance */}
          <div className="glass-card p-4 border-green-400/30">
            <h4 className={`text-sm font-bold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <Leaf className={`h-4 w-4 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              {currentStore.split(' - ')[0]} Performance
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>₹{perf.savings.toLocaleString('en-IN')}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Savings</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{perf.reduction}%</div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Reduction</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{perf.efficiency}%</div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Efficiency</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Clock className="h-4 w-4 mr-2" />Recent Activity
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {displayActivity.slice(0, 6).map((a, i) => (
                <div key={i} className="glass-card glass-hover p-3">
                  <div className="flex items-start space-x-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${darkMode ? 'bg-green-400' : 'bg-green-600'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{a.action}</p>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{a.store.split(' - ')[0]} • {a.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => { onSignOut?.(); onClose(); }}
              className="w-full flex items-center justify-center space-x-2 p-3 glass-card glass-hover text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-xl">
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;