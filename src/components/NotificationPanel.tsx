import React from 'react';
import { X, Bell, Clock, AlertTriangle, CheckCircle, Info, ChevronRight } from 'lucide-react';

interface Notification {
  id: number;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  actionRequired?: string; // Which tab/section to navigate to
  storeId?: string; // Which store this notification belongs to
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  storeName: string;
  darkMode?: boolean;
  onNotificationClick?: (actionRequired?: string, notificationId?: number) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  isOpen, 
  onClose, 
  notifications, 
  storeName,
  darkMode = false,
  onNotificationClick
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotificationClick = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification.actionRequired, notification.id);
    }
  };

  const getActionBadgeColor = (actionRequired?: string) => {
    switch (actionRequired) {
      case 'Dashboard':
        return darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'Alerts':
        return darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800';
      case 'Analytics':
        return darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800';
      case 'Insights':
        return darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800';
      default:
        return darkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${darkMode ? 'bg-black/40' : 'bg-black/30'}`} onClick={onClose}>
      <div
        className={`glass-card w-full max-w-md h-full transform transition-transform duration-300 ease-in-out overflow-hidden backdrop-blur-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b glass-card border-white/10`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100/50'}`}>
                <Bell className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Notifications
                </h2>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {storeName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/10`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {unreadCount > 0 && (
            <div className={`mt-3 text-xs font-bold px-2 py-1 rounded-full inline-block ${
              darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
            }`}>
              {unreadCount} unread
            </div>
          )}
        </div>
        
        <div className="overflow-y-auto h-full pb-20 px-4 pt-4 space-y-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className={`h-12 w-12 mx-auto mb-4 ${
                darkMode ? 'text-slate-600' : 'text-slate-300'
              }`} />
              <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>
                No notifications
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`glass-card glass-hover p-4 transition-all duration-200 group ${
                  notification.unread ? (darkMode ? 'border-blue-500/50' : 'border-blue-400/50') : ''
                } ${notification.actionRequired ? 'cursor-pointer' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm font-semibold truncate ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {notification.unread && (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                        {notification.actionRequired && (
                          <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                            darkMode ? 'text-slate-500' : 'text-slate-400'
                          }`} />
                        )}
                      </div>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${
                      darkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {notification.message}
                    </p>
                    <div className={`flex items-center justify-between mt-2 pt-2 border-t border-white/10`}>
                      <div className={`flex items-center text-xs ${
                        darkMode ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{notification.time}</span>
                      </div>
                      {notification.actionRequired && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          getActionBadgeColor(notification.actionRequired)
                        }`}>
                          {notification.actionRequired}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;