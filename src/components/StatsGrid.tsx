import React, { useState } from 'react';
import { Package, AlertTriangle, DollarSign, Recycle } from 'lucide-react';
import MetricCard from './MetricCard';
import MetricDetailPanel from './MetricDetailPanel';
import { Product } from '../data/mockData';

interface StatsGridProps {
  stats: {
    totalItems: number;
    totalItemsChange: number;
    highRiskItems: number;
    potentialSavings: number;
    potentialSavingsChange: number;
    wasteReduction: number;
  };
  products: Product[];
  storeName: string;
  compactView?: boolean;
  darkMode?: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  products, 
  storeName, 
  compactView = false, 
  darkMode = false 
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'totalItems' | 'highRisk' | 'savings' | 'wasteReduction' | null>(null);

  const handleMetricClick = (metricType: 'totalItems' | 'highRisk' | 'savings' | 'wasteReduction') => {
    setSelectedMetric(metricType);
  };

  const handleClosePanel = () => {
    setSelectedMetric(null);
  };

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8 ${compactView ? 'gap-3' : 'gap-6'}`}>
        <MetricCard
          title="Total Items Tracked"
          value={stats.totalItems}
          change={{
            value: stats.totalItemsChange,
            label: "from yesterday",
            type: "increase"
          }}
          icon={Package}
          iconColor="text-[#0071ce]"
          compactView={compactView}
          darkMode={darkMode}
          onClick={() => handleMetricClick('totalItems')}
        />

        <MetricCard
          title="High-Risk Items"
          value={stats.highRiskItems}
          icon={AlertTriangle}
          iconColor="text-red-500"
          className="border-l-4 border-l-red-500"
          compactView={compactView}
          darkMode={darkMode}
          onClick={() => handleMetricClick('highRisk')}
        />

        <MetricCard
          title="Today's Potential Savings"
          value={`$${stats.potentialSavings.toLocaleString()}`}
          change={{
            value: stats.potentialSavingsChange,
            label: "today",
            type: "increase"
          }}
          icon={DollarSign}
          iconColor="text-green-500"
          compactView={compactView}
          darkMode={darkMode}
          onClick={() => handleMetricClick('savings')}
        />

        <MetricCard
          title="Waste Reduction"
          value={`${stats.wasteReduction}%`}
          change={{
            value: 12,
            label: "this month",
            type: "increase"
          }}
          icon={Recycle}
          iconColor="text-green-500"
          compactView={compactView}
          darkMode={darkMode}
          onClick={() => handleMetricClick('wasteReduction')}
        />
      </div>

      <MetricDetailPanel
        isOpen={selectedMetric !== null}
        onClose={handleClosePanel}
        metricType={selectedMetric}
        stats={stats}
        products={products}
        storeName={storeName}
        darkMode={darkMode}
      />
    </>
  );
};

export default StatsGrid;