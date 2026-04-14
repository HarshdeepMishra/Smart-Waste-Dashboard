import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, Leaf, X, Package, AlertTriangle, BarChart3 } from 'lucide-react';
import { Product } from '../data/mockData';
import { STORE_LIST } from '../data/storeData';

interface TopNavProps {
  selectedStore: string;
  onStoreChange: (store: string) => void;
  onNotificationClick: () => void;
  onProfileClick: () => void;
  notificationCount: number;
  darkMode?: boolean;
  products?: Product[];
  onProductClick?: (product: Product) => void;
  onTabChange?: (tab: string) => void;
  userName?: string;
}

const TopNav: React.FC<TopNavProps> = ({
  selectedStore,
  onStoreChange,
  onNotificationClick,
  onProfileClick,
  notificationCount,
  darkMode = false,
  products = [],
  onProductClick,
  onTabChange,
  userName = 'Manager',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const lower = q.toLowerCase();
    const results = products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      (p.riskScore >= 80 && lower.includes('critical')) ||
      (p.riskScore >= 60 && lower.includes('warning')) ||
      (p.daysUntilExpiry <= 2 && lower.includes('expir'))
    ).slice(0, 6);
    setSearchResults(results);
  };

  const handleResultClick = (product: Product) => {
    if (onProductClick) onProductClick(product);
    if (onTabChange) onTabChange('Alerts');
    setSearchQuery('');
    setSearchResults([]);
    setSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setSearchQuery(''); setSearchResults([]); setSearchFocused(false); }
    if (e.key === 'Enter' && searchResults.length > 0) handleResultClick(searchResults[0]);
  };

  const getRiskColor = (score: number) => score >= 80 ? 'text-red-400' : score >= 60 ? 'text-amber-400' : 'text-green-400';

  return (
    <nav className={`fixed top-0 left-20 right-0 h-20 transition-all duration-300 z-30 border-b ${
      darkMode
        ? 'bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-white/10 backdrop-blur-xl'
        : 'bg-gradient-to-r from-white/90 to-slate-50/90 border-green-100/20 backdrop-blur-xl'
    }`}>
      <div className="h-full px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8 flex-1">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-500/20' : 'bg-green-100/50'}`}>
              <Leaf className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>EcoTrack AI</h1>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md">
            <div className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-300 ${
              searchFocused
                ? darkMode ? 'bg-white/15 border border-green-500/50 shadow-lg' : 'bg-white/80 border border-green-400/50 shadow-lg'
                : darkMode ? 'bg-white/10 border border-white/20' : 'bg-white/50 border border-white/40'
            }`}>
              <Search className={`h-4 w-4 flex-shrink-0 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, categories, 'expiring', 'critical'..."
                className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'}`}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-slate-400 hover:text-slate-200">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {searchFocused && (searchResults.length > 0 || searchQuery.length > 0) && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border overflow-hidden shadow-2xl z-50 ${
                darkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'
              }`}>
                {searchResults.length === 0 && searchQuery.length > 0 ? (
                  <div className={`p-4 text-sm text-center ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    No products found for "{searchQuery}"
                  </div>
                ) : (
                  <>
                    <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500 bg-slate-900/50' : 'text-slate-400 bg-slate-50'}`}>
                      {searchResults.length} products found
                    </div>
                    {searchResults.map(product => (
                      <button key={product.id} onClick={() => handleResultClick(product)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors text-left ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50'}`}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: product.imageColor + '30' }}>
                          <Package className="h-4 w-4" style={{ color: product.imageColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {product.category} • {product.quantity} units • Expires in {product.daysUntilExpiry}d
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {product.riskScore >= 80 && <AlertTriangle className="h-4 w-4 text-red-400" />}
                          <span className={`text-xs font-bold ${getRiskColor(product.riskScore)}`}>{product.riskScore}%</span>
                        </div>
                      </button>
                    ))}
                    <button onClick={() => { if (onTabChange) onTabChange('Alerts'); setSearchFocused(false); }}
                      className={`w-full flex items-center space-x-2 px-4 py-3 text-sm font-medium border-t transition-colors ${
                        darkMode ? 'border-white/10 text-emerald-400 hover:bg-white/5' : 'border-slate-100 text-emerald-600 hover:bg-emerald-50'
                      }`}>
                      <BarChart3 className="h-4 w-4" />
                      <span>View all in Risk Monitor →</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6">
          {/* Store Selector */}
          <div className="hidden md:block">
            <div className="relative">
              <select
                value={selectedStore}
                onChange={e => onStoreChange(e.target.value)}
                className={`appearance-none pl-4 pr-10 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  darkMode ? 'bg-white/10 border border-white/20 text-white hover:bg-white/15' : 'bg-white/60 border border-white/50 text-slate-900 hover:bg-white/80'
                }`}>
                {STORE_LIST.map(store => (
                  <option key={store} value={store} className="bg-slate-900 text-white">{store}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none opacity-60" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button onClick={onNotificationClick}
              className={`relative p-2.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-white/60 text-slate-600 hover:text-slate-900'}`}>
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button onClick={onProfileClick}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-white/60 text-slate-600 hover:text-slate-900'}`}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium hidden sm:block">{userName}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
