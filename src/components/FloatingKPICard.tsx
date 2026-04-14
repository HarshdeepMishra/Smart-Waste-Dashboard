import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface FloatingKPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  actionText?: string;
  color?: 'green' | 'blue' | 'amber' | 'red';
  onClick?: () => void;
  darkMode?: boolean;
  className?: string;
}

const FloatingKPICard: React.FC<FloatingKPICardProps> = ({
  icon,
  label,
  value,
  change,
  changeLabel,
  actionText,
  color = 'blue',
  onClick,
  darkMode = false,
  className = ''
}) => {
  const colorClass = {
    green: darkMode
      ? 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400'
      : 'from-green-500/20 to-green-600/10 border-green-400/30 text-green-600',
    blue: darkMode
      ? 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400'
      : 'from-blue-500/20 to-blue-600/10 border-blue-400/30 text-blue-600',
    amber: darkMode
      ? 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400'
      : 'from-amber-500/20 to-amber-600/10 border-amber-400/30 text-amber-600',
    red: darkMode
      ? 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400'
      : 'from-red-500/20 to-red-600/10 border-red-400/30 text-red-600'
  };

  const trendColor = change && change > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div
      onClick={onClick}
      className={`glass-card glass-hover group cursor-pointer min-h-40 flex flex-col justify-between backdrop-blur-xl bg-gradient-to-br ${colorClass[color]} border transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-white/50'} group-hover:scale-110 transition-transform`}>
          <div className="text-2xl">{icon}</div>
        </div>
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            {change > 0 ? (
              <TrendingUp className={`h-4 w-4 ${trendColor}`} />
            ) : (
              <TrendingDown className={`h-4 w-4 ${trendColor}`} />
            )}
            <span className={`text-sm font-semibold ${trendColor}`}>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {label}
        </p>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-3xl font-bold">{value}</h3>
          {changeLabel && <span className="text-xs opacity-75">{changeLabel}</span>}
        </div>
      </div>

      {actionText && (
        <div className="flex items-center space-x-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity mt-2">
          <span>{actionText}</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

export default FloatingKPICard;
