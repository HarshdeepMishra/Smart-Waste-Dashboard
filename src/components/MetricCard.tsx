import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
  compactView?: boolean;
  darkMode?: boolean;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-[#0071ce]',
  className = '',
  compactView = false,
  darkMode = false,
  onClick
}) => {
  return (
    <div 
      className={`
        rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group
        ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        ${compactView ? 'p-4' : 'p-6'}
        ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`font-medium mb-1 ${
            compactView ? 'text-xs' : 'text-sm'
          } ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {title}
          </h3>
          <p className={`font-bold mb-2 ${
            compactView ? 'text-xl' : 'text-3xl'
          } ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-[#0071ce] transition-colors`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className="flex items-center">
              {change.type === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)} {change.label}
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <Icon className={`${compactView ? 'h-8 w-8' : 'h-12 w-12'} ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
        </div>
      </div>
      {onClick && (
        <div className={`mt-3 text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Click for detailed breakdown
        </div>
      )}
    </div>
  );
};

export default MetricCard;