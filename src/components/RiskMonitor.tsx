import React from 'react';
import { AlertTriangle, CheckCircle, Flame } from 'lucide-react';
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
  stats,
  onProductClick,
  darkMode = false,
  alertThresholds
}) => {
  const getCritical = () =>
    products.filter(p => p.riskScore >= alertThresholds.criticalThreshold);

  const getWarning = () =>
    products.filter(
      p =>
        p.riskScore >= alertThresholds.warningThreshold &&
        p.riskScore < alertThresholds.criticalThreshold
    );

  const getWatch = () =>
    products.filter(p => p.riskScore < alertThresholds.warningThreshold);

  const RiskColumn = ({ title, products, color, icon: Icon }: any) => (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 mb-4 px-4">
        <Icon className={`h-5 w-5 ${color}`} />
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          color.replace('text-', 'bg-').replace(/\-[0-9]{3}/, '/20')
        }`}>
          {products.length}
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {products.map(product => (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className={`glass-card glass-hover p-4 cursor-pointer min-h-24 flex flex-col justify-between bg-gradient-to-br ${
              color.includes('red')
                ? darkMode
                  ? 'from-red-500/15 to-red-600/10 border-red-500/30'
                  : 'from-red-500/15 to-red-600/10 border-red-400/30'
                : color.includes('amber')
                  ? darkMode
                    ? 'from-amber-500/15 to-amber-600/10 border-amber-500/30'
                    : 'from-amber-500/15 to-amber-600/10 border-amber-400/30'
                  : darkMode
                    ? 'from-green-500/15 to-green-600/10 border-green-500/30'
                    : 'from-green-500/15 to-green-600/10 border-green-400/30'
            }`}
          >
            <div>
              <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {product.name}
              </h4>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {product.quantity} units • Expires in {product.daysUntilExpiry} days
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Risk Score
                </p>
                <p className={`text-lg font-bold ${color}`}>
                  {product.riskScore}%
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Est. Loss
                </p>
                <p className="text-sm font-semibold">₹{(product.quantity * product.costPerUnit).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className={`flex items-center justify-center h-32 rounded-lg border-2 border-dashed ${
            darkMode ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'
          }`}>
            <p className="text-sm text-center">No items in this category</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className={`glass-card p-6`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Risk Monitor Kanban Board
        </h2>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Products organized by risk level. Click any card to view AI recommendations and take action.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskColumn
          title="Critical"
          products={getCritical()}
          color="text-red-500"
          icon={Flame}
        />
        <RiskColumn
          title="Warning"
          products={getWarning()}
          color="text-amber-500"
          icon={AlertTriangle}
        />
        <RiskColumn
          title="Watch"
          products={getWatch()}
          color="text-green-500"
          icon={CheckCircle}
        />
      </div>
    </div>
  );
};

export default RiskMonitor;
