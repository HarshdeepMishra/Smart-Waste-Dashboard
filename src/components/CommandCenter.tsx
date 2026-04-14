import React from 'react';
import { Zap, AlertTriangle, TrendingUp, Leaf, Package, Clock } from 'lucide-react';
import FloatingKPICard from './FloatingKPICard';
import AISummaryBanner from './AISummaryBanner';
import AlertsFeed from './AlertsFeed';
import { Product } from '../data/mockData';
import { StoreData } from '../data/storeData';

interface CommandCenterProps {
  stats: StoreData['stats'];
  products: Product[];
  onProductClick: (product: Product) => void;
  storeName: string;
  darkMode?: boolean;
  alertThresholds: any;
  onKPINavigate?: (kpi: string) => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({
  stats,
  products,
  onProductClick,
  storeName,
  darkMode = false,
  alertThresholds,
  onKPINavigate
}) => {
  const criticalProducts = products.filter(p => p.riskScore >= alertThresholds.criticalThreshold).length;
  const wasteReductionChange = (stats.wasteReduction || 0) > 18 ? 8 : -3;

  return (
    <div className="space-y-8">
      <AISummaryBanner
        potentialSavings={stats.potentialSavings}
        highRiskItems={stats.highRiskItems}
        storeName={storeName}
        darkMode={darkMode}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FloatingKPICard
          icon={<Package className="h-6 w-6" />}
          label="Items Tracked"
          value={stats.totalItems}
          change={2}
          changeLabel="this week"
          actionText="View all inventory →"
          color="blue"
          darkMode={darkMode}
          onClick={() => onKPINavigate?.('items')}
        />
        <FloatingKPICard
          icon={<AlertTriangle className="h-6 w-6" />}
          label="Critical Items"
          value={criticalProducts}
          change={-15}
          changeLabel="from last week"
          actionText="Open Risk Monitor →"
          color="red"
          darkMode={darkMode}
          onClick={() => onKPINavigate?.('critical')}
        />
        <FloatingKPICard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Potential Savings"
          value={`₹${stats.potentialSavings.toLocaleString('en-IN')}`}
          change={22}
          changeLabel="from baseline"
          actionText="See opportunities →"
          color="green"
          darkMode={darkMode}
          onClick={() => onKPINavigate?.('savings')}
        />
        <FloatingKPICard
          icon={<Leaf className="h-6 w-6" />}
          label="Waste Reduction"
          value={`${stats.wasteReduction || 0}%`}
          change={wasteReductionChange}
          changeLabel="vs last month"
          actionText="Explore strategies →"
          color="green"
          darkMode={darkMode}
          onClick={() => onKPINavigate?.('waste')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`glass-card mb-4 flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              <Zap className={`h-5 w-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Active Alerts
              </h3>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              darkMode
                ? 'bg-red-500/20 text-red-300'
                : 'bg-red-100 text-red-700'
            }`}>
              {stats.highRiskItems} items
            </span>
          </div>
          <AlertsFeed
            products={products}
            onProductClick={onProductClick}
            darkMode={darkMode}
            alertThresholds={alertThresholds}
            limit={5}
          />
        </div>

        <div>
          <div className={`glass-card h-full`}>
            <div className="flex items-center space-x-2 mb-6">
              <Clock className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Next Steps
              </h3>
            </div>

            <div className="space-y-3">
              <button onClick={() => onKPINavigate?.('critical')} className={`w-full text-left p-4 rounded-lg transition-all hover:scale-[1.02] ${darkMode ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20' : 'bg-red-50 hover:bg-red-100 border border-red-100'}`}>
                <h4 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>🔴 Act on Critical Items</h4>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Apply markdowns or donate {stats.highRiskItems} at-risk products → Risk Monitor</p>
              </button>
              <button onClick={() => onKPINavigate?.('savings')} className={`w-full text-left p-4 rounded-lg transition-all hover:scale-[1.02] ${darkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/10' : 'bg-blue-50 hover:bg-blue-100 border border-blue-100'}`}>
                <h4 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>📊 Review Analytics</h4>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>₹{stats.potentialSavings.toLocaleString('en-IN')} savings opportunity → Insights Lab</p>
              </button>
              <button onClick={() => onKPINavigate?.('waste')} className={`w-full text-left p-4 rounded-lg transition-all hover:scale-[1.02] ${darkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/10' : 'bg-purple-50 hover:bg-purple-100 border border-purple-100'}`}>
                <h4 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>🤝 Network Coordination</h4>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Discover best practices from all 5 partner stores → AI Assistant</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
