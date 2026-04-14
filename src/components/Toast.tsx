import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'warning';
  isVisible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose,
  darkMode = false 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    if (darkMode) {
      switch (type) {
        case 'success': return 'bg-green-900/90 border-green-700 text-green-100';
        case 'warning': return 'bg-yellow-900/90 border-yellow-700 text-yellow-100';
        default: return 'bg-blue-900/90 border-blue-700 text-blue-100';
      }
    } else {
      switch (type) {
        case 'success': return 'bg-green-50 border-green-200 text-green-800';
        case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        default: return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border-2 shadow-lg max-w-sm transform transition-all duration-300 ${getBgColor()} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <p className="text-sm font-medium flex-1 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className={`flex-shrink-0 transition-colors ${
            darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;