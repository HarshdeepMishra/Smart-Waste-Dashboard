import React from 'react';
import { Package, Calendar, TrendingUp, DollarSign, Tag, Gift, MapPin } from 'lucide-react';
import { Product } from '../data/mockData';
import { getRiskLevel, getRiskColor } from '../utils/dateUtils';
import StatusBadge from './StatusBadge';

interface AlertItemProps {
  product: Product;
  onClick: (product: Product) => void;
  compactView?: boolean;
  darkMode?: boolean;
}

const AlertItem: React.FC<AlertItemProps> = ({ 
  product, 
  onClick, 
  compactView = false,
  darkMode = false 
}) => {
  const riskLevel = getRiskLevel(product.riskScore);

  const handleQuickAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(product);
  };

  const getBorderColor = () => {
    switch (riskLevel) {
      case 'critical': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div 
      className={`
        rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 hover:scale-[1.02] group
        ${getBorderColor()}
        ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}
        ${compactView ? 'p-3' : 'p-4'}
      `}
      onClick={() => onClick(product)}
    >
      <div className={`flex items-start ${compactView ? 'space-x-3' : 'space-x-4'}`}>
        <div 
          className={`rounded-lg flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 ${
            compactView ? 'w-12 h-12' : 'w-16 h-16'
          }`}
          style={{ backgroundColor: product.imageColor }}
        >
          <Package className={`text-white ${compactView ? 'h-6 w-6' : 'h-8 w-8'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold truncate group-hover:text-[#0071ce] transition-colors ${
              compactView ? 'text-base' : 'text-lg'
            } ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {product.name}
            </h3>
            <StatusBadge 
              status={riskLevel} 
              label={`${product.riskScore}% Risk`}
              size="sm"
              darkMode={darkMode}
            />
          </div>
          
          <div className={`grid grid-cols-2 gap-2 mb-3 ${
            compactView ? 'text-xs' : 'text-sm'
          } ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center">
              <Package className={`mr-1 text-gray-400 ${compactView ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span>{product.quantity} units</span>
            </div>
            <div className="flex items-center">
              <Calendar className={`mr-1 text-gray-400 ${compactView ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span>Expires in {product.daysUntilExpiry} day{product.daysUntilExpiry !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className={`mr-1 text-gray-400 ${compactView ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span>${product.costPerUnit}/unit</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className={`mr-1 text-gray-400 ${compactView ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span className="capitalize">{product.category}</span>
            </div>
          </div>
          
          {!compactView && (
            <div className="mb-3">
              <div className={`flex items-center justify-between text-xs mb-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <span>Risk Level</span>
                <span>{product.riskScore}%</span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${
                darkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    riskLevel === 'critical' ? 'bg-red-500' :
                    riskLevel === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${product.riskScore}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={(e) => handleQuickAction(e, 'discount')}
              className={`inline-flex items-center rounded-full text-xs hover:scale-105 transition-all duration-200 ${
                compactView ? 'px-2 py-1' : 'px-3 py-1'
              } ${darkMode 
                ? 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-900/70' 
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              <Tag className={`mr-1 ${compactView ? 'h-2 w-2' : 'h-3 w-3'}`} />
              Discount
            </button>
            <button 
              onClick={(e) => handleQuickAction(e, 'donate')}
              className={`inline-flex items-center rounded-full text-xs hover:scale-105 transition-all duration-200 ${
                compactView ? 'px-2 py-1' : 'px-3 py-1'
              } ${darkMode 
                ? 'bg-green-900/50 text-green-300 hover:bg-green-900/70' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              <Gift className={`mr-1 ${compactView ? 'h-2 w-2' : 'h-3 w-3'}`} />
              Donate
            </button>
            <button 
              onClick={(e) => handleQuickAction(e, 'transfer')}
              className={`inline-flex items-center rounded-full text-xs hover:scale-105 transition-all duration-200 ${
                compactView ? 'px-2 py-1' : 'px-3 py-1'
              } ${darkMode 
                ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-900/70' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              <MapPin className={`mr-1 ${compactView ? 'h-2 w-2' : 'h-3 w-3'}`} />
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;