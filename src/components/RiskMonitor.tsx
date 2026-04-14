import React from 'react';
import { AlertTriangle, CheckCircle, Flame, Clock, IndianRupee } from 'lucide-react';
import { Product } from '../data/mockData';
import { StoreData } from '../data/storeData';

interface RiskMonitorProps {
  products: Product[];
  stats: StoreData['stats'];
  onProductClick: (product: Product) => void;
  darkMode?: boolean;
  alertThresholds: any;
}

const RiskMonitor: React.FC<RiskMonitorProps> = ({
  products,
  onProductClick,
  darkMode = false,
  alertThresholds
}) => {
  const critical = products.filter(p => p.riskScore >= alertThresholds.criticalThreshold)
    .sort((a, b) => b.riskScore - a.riskScore);
  const warning  = products.filter(p => p.riskScore >= alertThresholds.warningThreshold && p.riskScore < alertThresholds.criticalThreshold)
    .sort((a, b) => b.riskScore - a.riskScore);
  const watch    = products.filter(p => p.riskScore < alertThresholds.warningThreshold)
    .sort((a, b) => b.riskScore - a.riskScore);

  const totalAtRisk = products
    .filter(p => p.riskScore >= alertThresholds.warningThreshold)
    .reduce((s, p) => s + p.quantity * p.costPerUnit, 0);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  const RiskColumn = ({
    title, items, color, bgGrad, badgeBg, icon: Icon, subtitle
  }: {
    title: string;
    items: Product[];
    color: string;
    bgGrad: string;
    badgeBg: string;
    icon: React.ElementType;
    subtitle: string;
  }) => (
    <div className={`flex flex-col rounded-2xl border shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Column Header — fixed */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <div>
            <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeBg}`}>
          {items.length}
        </span>
      </div>

      {/* Scrollable card list — fixed height */}
      <div
        className="overflow-y-auto p-3 space-y-2.5"
        style={{ height: '420px' }}
      >
        {items.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full rounded-xl border-2 border-dashed ${darkMode ? 'border-gray-600 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <CheckCircle className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-xs text-center font-medium">No items here</p>
            <p className="text-xs text-center opacity-70 mt-0.5">All clear ✅</p>
          </div>
        ) : (
          items.map(product => (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.99] bg-gradient-to-br ${bgGrad}`}
            >
              {/* Product name + category */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {product.name}
                  </h4>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {product.category}
                  </p>
                </div>
                {/* Risk badge */}
                <span className={`ml-2 flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                  product.riskScore >= 80 ? 'bg-red-500/20 text-red-500' :
                  product.riskScore >= 60 ? 'bg-amber-500/20 text-amber-500' :
                                            'bg-green-500/20 text-green-600'
                }`}>
                  {product.riskScore}%
                </span>
              </div>

              {/* Quantity + Expiry */}
              <div className={`flex items-center space-x-3 text-xs mb-2.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>📦 {product.quantity} units</span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span className={product.daysUntilExpiry <= 1 ? 'text-red-500 font-semibold' : ''}>
                    {product.daysUntilExpiry === 0 ? 'Expires today!' :
                     product.daysUntilExpiry === 1 ? 'Expires tomorrow' :
                     `${product.daysUntilExpiry}d left`}
                  </span>
                </span>
              </div>

              {/* Risk bar */}
              <div className={`w-full h-1.5 rounded-full mb-2.5 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    product.riskScore >= 80 ? 'bg-red-500' :
                    product.riskScore >= 60 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${product.riskScore}%` }}
                />
              </div>

              {/* Value at risk + action hint */}
              <div className={`flex items-center justify-between pt-2.5 border-t ${darkMode ? 'border-white/10' : 'border-gray-200/80'}`}>
                <div className="flex items-center space-x-1">
                  <IndianRupee className={`h-3 w-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Est. loss</span>
                </div>
                <span className={`text-sm font-bold ${color}`}>
                  {fmt(product.quantity * product.costPerUnit)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Column Footer — total value */}
      {items.length > 0 && (
        <div className={`px-4 py-2.5 border-t text-xs font-medium flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-800/80 text-gray-400' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
          <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
          <span className={`font-semibold ${color}`}>
            {fmt(items.reduce((s, p) => s + p.quantity * p.costPerUnit, 0))} total
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className={`glass-card p-5`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Risk Monitor Kanban Board
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Click any product card to view AI recommendations and take action.
            </p>
          </div>
          <div className="text-right">
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total value at risk</div>
            <div className="text-xl font-bold text-red-500">{fmt(totalAtRisk)}</div>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex items-center space-x-3 mt-4">
          {[
            { label: 'Critical', count: critical.length, color: 'bg-red-100 text-red-700' },
            { label: 'Warning',  count: warning.length,  color: 'bg-amber-100 text-amber-700' },
            { label: 'Watch',    count: watch.length,    color: 'bg-green-100 text-green-700' },
          ].map(p => (
            <span key={p.label} className={`text-xs font-semibold px-3 py-1 rounded-full ${p.color}`}>
              {p.label}: {p.count}
            </span>
          ))}
          <span className={`text-xs ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Scroll inside each column to see all items
          </span>
        </div>
      </div>

      {/* 3-column Kanban — each column independently scrollable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RiskColumn
          title="🔥 Critical"
          subtitle={`Risk ≥ ${alertThresholds.criticalThreshold}%`}
          items={critical}
          color="text-red-500"
          bgGrad={darkMode ? 'from-red-500/10 to-red-600/5 border-red-500/20' : 'from-red-50 to-red-50/30 border-red-200/60'}
          badgeBg="bg-red-500/20 text-red-500"
          icon={Flame}
        />
        <RiskColumn
          title="⚠️ Warning"
          subtitle={`Risk ${alertThresholds.warningThreshold}–${alertThresholds.criticalThreshold - 1}%`}
          items={warning}
          color="text-amber-500"
          bgGrad={darkMode ? 'from-amber-500/10 to-amber-600/5 border-amber-500/20' : 'from-amber-50 to-amber-50/30 border-amber-200/60'}
          badgeBg="bg-amber-500/20 text-amber-600"
          icon={AlertTriangle}
        />
        <RiskColumn
          title="👁️ Watch"
          subtitle={`Risk < ${alertThresholds.warningThreshold}%`}
          items={watch}
          color="text-green-500"
          bgGrad={darkMode ? 'from-green-500/10 to-green-600/5 border-green-500/20' : 'from-green-50 to-green-50/30 border-green-200/60'}
          badgeBg="bg-green-500/20 text-green-600"
          icon={CheckCircle}
        />
      </div>
    </div>
  );
};

export default RiskMonitor;
