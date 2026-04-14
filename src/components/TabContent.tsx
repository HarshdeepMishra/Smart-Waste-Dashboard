import React from 'react';
import StatsGrid from './StatsGrid';
import AlertsFeed from './AlertsFeed';
import AnalyticsSection from './AnalyticsSection';
import PeerInsights from './PeerInsights';
import InsightsLab from './InsightsLab';
import AIAssistant from './AIAssistant';
import { Product } from '../data/mockData';

interface TabContentProps {
  activeTab: string;
  stats: any;
  products: Product[];
  onProductClick: (product: Product) => void;
  storeName: string;
  compactView?: boolean;
  darkMode?: boolean;
  alertThresholds?: {
    criticalThreshold: number;
    warningThreshold: number;
    advanceNotice: number;
  };
}

const TabContent: React.FC<TabContentProps> = ({ 
  activeTab, 
  stats, 
  products, 
  onProductClick, 
  storeName,
  compactView = false,
  darkMode = false,
  alertThresholds = { criticalThreshold: 80, warningThreshold: 60, advanceNotice: 2 }
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <StatsGrid 
              stats={stats} 
              products={products}
              storeName={storeName}
              compactView={compactView}
              darkMode={darkMode}
            />
            <div className={`grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8 ${compactView ? 'gap-4' : 'gap-8'}`}>
              <div className="xl:col-span-2">
                <AlertsFeed 
                  products={products} 
                  onProductClick={onProductClick}
                  compactView={compactView}
                  darkMode={darkMode}
                  alertThresholds={alertThresholds}
                />
              </div>
              <div>
                <PeerInsights 
                  compactView={compactView}
                  darkMode={darkMode}
                />
              </div>
            </div>
            <AnalyticsSection 
              compactView={compactView}
              darkMode={darkMode}
            />
          </>
        );
      
      case 'Alerts':
        return (
          <div className="space-y-8">
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Alert Management
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Monitor and manage all product alerts for {storeName}
              </p>
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
                  <strong>Alert Thresholds:</strong> Critical: {alertThresholds.criticalThreshold}% • 
                  Warning: {alertThresholds.warningThreshold}% • 
                  Advance Notice: {alertThresholds.advanceNotice} days
                </p>
              </div>
            </div>
            <StatsGrid 
              stats={stats} 
              products={products}
              storeName={storeName}
              compactView={compactView}
              darkMode={darkMode}
            />
            <AlertsFeed 
              products={products} 
              onProductClick={onProductClick}
              compactView={compactView}
              darkMode={darkMode}
              alertThresholds={alertThresholds}
            />
          </div>
        );
      
      case 'Analytics':
        return (
          <InsightsLab
            stats={stats}
            products={products}
            darkMode={darkMode}
          />
        );
      
      case 'Insights':
        return (
          <AIAssistant
            products={products}
            stats={stats}
            onProductClick={onProductClick}
            darkMode={darkMode}
            storeName={storeName}
          />
        );
      
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default TabContent;