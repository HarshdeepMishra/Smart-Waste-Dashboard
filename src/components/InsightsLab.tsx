import React from 'react';
import { TrendingUp, TrendingDown, Award, Lightbulb, AlertTriangle, BarChart3 } from 'lucide-react';
import AnalyticsSection from './AnalyticsSection';
import { Product } from '../data/mockData';

interface InsightsLabProps {
  products: Product[];
  darkMode?: boolean;
  storeId?: string;
  storeName?: string;
}

const InsightsLab: React.FC<InsightsLabProps> = ({ products, darkMode = false, storeId, storeName }) => {

  // ── Compute real insights from actual product data ──────────────────────
  const criticalProducts = products.filter(p => p.riskScore >= 80);
  const warningProducts  = products.filter(p => p.riskScore >= 60 && p.riskScore < 80);
  const totalValueAtRisk = products
    .filter(p => p.riskScore >= 60)
    .reduce((s, p) => s + p.quantity * p.costPerUnit, 0);

  // Category with most at-risk value
  const categoryRisk: Record<string, number> = {};
  products.filter(p => p.riskScore >= 60).forEach(p => {
    categoryRisk[p.category] = (categoryRisk[p.category] || 0) + p.quantity * p.costPerUnit;
  });
  const worstCategory = Object.entries(categoryRisk).sort((a, b) => b[1] - a[1])[0];

  // Expiring soonest
  const expiringSoon = [...products].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry).slice(0, 3);

  // Category trending worst (highest risk concentration)
  const categoryAvgRisk: Record<string, { total: number; count: number }> = {};
  products.forEach(p => {
    if (!categoryAvgRisk[p.category]) categoryAvgRisk[p.category] = { total: 0, count: 0 };
    categoryAvgRisk[p.category].total += p.riskScore;
    categoryAvgRisk[p.category].count++;
  });
  const highestRiskCategory = Object.entries(categoryAvgRisk)
    .map(([cat, v]) => ({ cat, avg: v.total / v.count }))
    .sort((a, b) => b.avg - a.avg)[0];

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  const insights = [
    {
      icon: criticalProducts.length > 0 ? AlertTriangle : Award,
      title: criticalProducts.length > 0
        ? `${criticalProducts.length} Critical Item${criticalProducts.length > 1 ? 's' : ''} Need Action`
        : 'No Critical Items — Great Job!',
      description: criticalProducts.length > 0
        ? `${criticalProducts[0]?.name} (Risk: ${criticalProducts[0]?.riskScore}%) expires in ${criticalProducts[0]?.daysUntilExpiry} day${criticalProducts[0]?.daysUntilExpiry === 1 ? '' : 's'}`
        : 'All products are within acceptable risk levels.',
      recommendation: criticalProducts.length > 0
        ? `Apply 30% markdown or arrange NGO donation immediately for top ${Math.min(criticalProducts.length, 3)} items`
        : 'Maintain current ordering and storage practices.',
      color: criticalProducts.length > 0
        ? 'from-red-500/20 to-red-600/10 border-red-400/30'
        : 'from-green-500/20 to-green-600/10 border-green-400/30',
    },
    {
      icon: worstCategory ? TrendingDown : TrendingUp,
      title: worstCategory
        ? `${worstCategory[0]} — Highest Value at Risk`
        : 'All Categories Healthy',
      description: worstCategory
        ? `${fmt(worstCategory[1])} at risk in ${worstCategory[0]} across ${products.filter(p => p.category === worstCategory[0] && p.riskScore >= 60).length} products`
        : 'Inventory balanced across all categories.',
      recommendation: worstCategory
        ? `Focus markdowns on ${worstCategory[0]} first — highest ROI category for waste recovery`
        : 'Continue balanced inventory management.',
      color: 'from-amber-500/20 to-amber-600/10 border-amber-400/30',
    },
    {
      icon: Lightbulb,
      title: highestRiskCategory
        ? `${highestRiskCategory.cat} Avg Risk: ${Math.round(highestRiskCategory.avg)}%`
        : 'Risk Distribution Normal',
      description: warningProducts.length > 0
        ? `${warningProducts.length} products in warning zone — act within 48 hours to prevent escalation`
        : 'No products currently in warning zone.',
      recommendation: expiringSoon.length > 0
        ? `Priority: ${expiringSoon[0]?.name} expires ${expiringSoon[0]?.daysUntilExpiry === 0 ? 'today' : `in ${expiringSoon[0]?.daysUntilExpiry} day(s)`} — consider bundle promotion`
        : 'Run weekend bundle promotions to boost sell-through.',
      color: 'from-blue-500/20 to-blue-600/10 border-blue-400/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            🔬 Insights Lab
          </h2>
          <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {storeName || 'Current Store'} — Real-time analysis of {products.length} products
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{criticalProducts.length}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">{warningProducts.length}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Warning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">{fmt(totalValueAtRisk)}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>At Risk</div>
          </div>
        </div>
      </div>

      {/* AI Insights — computed from real data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div key={i} className={`glass-card glass-hover bg-gradient-to-br ${insight.color} border p-5 cursor-pointer group`}>
              <div className={`p-2 rounded-lg w-fit mb-3 ${darkMode ? 'bg-white/10' : 'bg-white/50'} group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {insight.title}
              </h3>
              <p className={`text-xs mb-3 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {insight.description}
              </p>
              <div className={`text-xs p-2 rounded border font-medium ${darkMode ? 'bg-white/5 border-white/10 text-green-300' : 'bg-white/50 border-white/30 text-slate-700'}`}>
                💡 {insight.recommendation}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expiring Soon Table */}
      {expiringSoon.length > 0 && (
        <div className={`rounded-xl border shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`px-5 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              ⏰ Expiring Soonest — Immediate Attention
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {products
              .filter(p => p.daysUntilExpiry <= 3)
              .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
              .slice(0, 6)
              .map((p, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-3 text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                  <div>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{p.name}</span>
                    <span className={`ml-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{p.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      p.daysUntilExpiry === 0 ? 'bg-red-100 text-red-700' :
                      p.daysUntilExpiry === 1 ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.daysUntilExpiry === 0 ? 'Expires Today' : `${p.daysUntilExpiry}d left`}
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {fmt(p.quantity * p.costPerUnit)}
                    </span>
                    <span className={`text-xs ${p.riskScore >= 80 ? 'text-red-500' : 'text-amber-500'} font-medium`}>
                      {p.riskScore}% risk
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Analytics Section — real products passed through */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Data Visualizations</h2>
        </div>
        <AnalyticsSection compactView={false} darkMode={darkMode} products={products} storeId={storeId} />
      </div>
    </div>
  );
};

export default InsightsLab;
