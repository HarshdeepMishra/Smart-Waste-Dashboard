import React from 'react';

interface StatusBadgeProps {
  status: 'critical' | 'warning' | 'watch' | 'success';
  label: string;
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  size = 'md',
  darkMode = false 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border';
  
  const statusClasses = {
    critical: darkMode 
      ? 'bg-red-900/50 text-red-300 border-red-700' 
      : 'bg-red-100 text-red-800 border-red-200',
    warning: darkMode 
      ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200',
    watch: darkMode 
      ? 'bg-blue-900/50 text-blue-300 border-blue-700' 
      : 'bg-blue-100 text-blue-800 border-blue-200',
    success: darkMode 
      ? 'bg-green-900/50 text-green-300 border-green-700' 
      : 'bg-green-100 text-green-800 border-green-200'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
};

export default StatusBadge;