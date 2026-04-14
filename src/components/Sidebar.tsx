import React, { useState } from 'react';
import { LayoutDashboard, AlertCircle, BarChart3, Lightbulb, Settings, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
  darkMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onSettingsClick,
  darkMode = false
}) => {
  const [expanded, setExpanded] = useState(false);

  const tabs = [
    { name: 'Command Center', icon: LayoutDashboard, id: 'Dashboard' },
    { name: 'Risk Monitor', icon: AlertCircle, id: 'Alerts' },
    { name: 'Insights Lab', icon: BarChart3, id: 'Analytics' },
    { name: 'AI Assistant', icon: Lightbulb, id: 'Insights' }
  ];

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`fixed left-0 top-0 h-full transition-all duration-300 z-40 ${
        expanded ? 'w-64' : 'w-20'
      } ${
        darkMode
          ? 'bg-gradient-to-b from-slate-900 to-slate-800 border-r border-white/10'
          : 'bg-gradient-to-b from-white to-slate-50 border-r border-green-100/20'
      }`}
    >
      <div className="pt-8 px-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? darkMode
                    ? 'bg-gradient-to-r from-green-500/30 to-blue-500/30 text-green-400 border border-green-500/30'
                    : 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-600 border border-green-200/50'
                  : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Icon className={`h-6 w-6 flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
              {expanded && (
                <>
                  <span className="flex-1 text-sm font-medium text-left">{tab.name}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </button>
          );
        })}

        <div className="pt-8 mt-8 border-t border-white/10">
          <button
            onClick={onSettingsClick}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
              darkMode
                ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Settings className="h-6 w-6 flex-shrink-0 group-hover:rotate-90 transition-transform" />
            {expanded && <span className="flex-1 text-sm font-medium text-left">Settings</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
