import React from 'react';
import { Product } from '../data/mockData';
import AlertItem from './AlertItem';
import { getRiskLevel } from '../utils/dateUtils';

interface AlertsFeedProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  compactView?: boolean;
  darkMode?: boolean;
  limit?: number;
  alertThresholds?: {
    criticalThreshold: number;
    warningThreshold: number;
    advanceNotice: number;
  };
}

const AlertsFeed: React.FC<AlertsFeedProps> = ({ 
  products, 
  onProductClick, 
  compactView = false,
  darkMode = false,
  limit,
  alertThresholds = { criticalThreshold: 80, warningThreshold: 60, advanceNotice: 2 }
}) => {
  const applyLimit = (arr: any[]) => limit ? arr.slice(0, limit) : arr;
  const criticalProducts = applyLimit(products.filter(p => p.riskScore >= alertThresholds.criticalThreshold));
  const warningProducts = applyLimit(products.filter(p => 
    p.riskScore >= alertThresholds.warningThreshold && p.riskScore < alertThresholds.criticalThreshold
  ));
  const watchProducts = applyLimit(products.filter(p => p.riskScore < alertThresholds.warningThreshold));

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`border-b p-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Live Alerts
        </h2>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Products requiring immediate attention
        </p>
        <div className="mt-2 text-xs text-gray-500">
          Thresholds: Critical ≥{alertThresholds.criticalThreshold}% • Warning ≥{alertThresholds.warningThreshold}%
        </div>
      </div>
      
      <div className={`p-6 max-h-96 overflow-y-auto ${compactView ? 'p-4' : 'p-6'}`}>
        {criticalProducts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Critical ({criticalProducts.length})
            </h3>
            <div className={`space-y-3 ${compactView ? 'space-y-2' : 'space-y-3'}`}>
              {criticalProducts.map(product => (
                <AlertItem 
                  key={product.id} 
                  product={product} 
                  onClick={onProductClick}
                  compactView={compactView}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        )}
        
        {warningProducts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-600 mb-3 flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Warning ({warningProducts.length})
            </h3>
            <div className={`space-y-3 ${compactView ? 'space-y-2' : 'space-y-3'}`}>
              {warningProducts.map(product => (
                <AlertItem 
                  key={product.id} 
                  product={product} 
                  onClick={onProductClick}
                  compactView={compactView}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        )}
        
        {watchProducts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Watch ({watchProducts.length})
            </h3>
            <div className={`space-y-3 ${compactView ? 'space-y-2' : 'space-y-3'}`}>
              {watchProducts.map(product => (
                <AlertItem 
                  key={product.id} 
                  product={product} 
                  onClick={onProductClick}
                  compactView={compactView}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsFeed;