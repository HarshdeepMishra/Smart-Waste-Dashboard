import React, { useState, useEffect } from 'react';
import { X, Settings, Bell, Clock, Shield, Database, Palette, Globe, Save, Check } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
  onSettingsUpdate: (settings: any) => void;
  storeName: string;
  darkMode?: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsUpdate, 
  storeName,
  darkMode = false 
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleToggle = (category: string, setting: string) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [setting]: !localSettings[category][setting]
      }
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSliderChange = (category: string, setting: string, value: number) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [setting]: value
      }
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSettingsUpdate(localSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className={`w-full max-w-md h-full shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white'
      }`}>
        <div className={`p-6 border-b sticky top-0 z-10 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-[#0071ce]" />
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Settings
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {storeName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {hasChanges && (
            <div className={`mt-3 p-2 rounded-lg text-sm ${
              darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-800'
            }`}>
              You have unsaved changes
            </div>
          )}
        </div>
        
        <div className="p-6 space-y-8">
          {/* Display Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Palette className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Display Settings
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Dark Mode
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Switch to dark theme
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('display', 'darkMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:ring-offset-2 ${
                    localSettings.display.darkMode ? 'bg-[#0071ce]' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.display.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Compact View
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Reduce spacing and padding
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('display', 'compactView')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:ring-offset-2 ${
                    localSettings.display.compactView ? 'bg-[#0071ce]' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.display.compactView ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Auto Refresh
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Automatically update data
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('display', 'autoRefresh')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:ring-offset-2 ${
                    localSettings.display.autoRefresh ? 'bg-[#0071ce]' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.display.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {localSettings.display.autoRefresh && (
                <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Refresh Interval
                    </span>
                    <span className="text-sm font-medium text-[#0071ce]">{localSettings.display.refreshInterval}s</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="10"
                    value={localSettings.display.refreshInterval}
                    onChange={(e) => handleSliderChange('display', 'refreshInterval', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600"
                  />
                  <div className={`flex justify-between text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>10s</span>
                    <span>120s</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bell className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Critical Alerts
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    High-risk product notifications
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('notifications', 'criticalAlerts')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:ring-offset-2 ${
                    localSettings.notifications.criticalAlerts ? 'bg-[#0071ce]' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.notifications.criticalAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Daily Reports
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Daily summary notifications
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('notifications', 'dailyReports')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:ring-offset-2 ${
                    localSettings.notifications.dailyReports ? 'bg-[#0071ce]' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.notifications.dailyReports ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Peer Insights
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Best practices from network
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('notifications', 'peerInsights')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:ring-offset-2 ${
                    localSettings.notifications.peerInsights ? 'bg-[#0071ce]' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.notifications.peerInsights ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    System Updates
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Data refresh notifications
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('notifications', 'systemUpdates')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:ring-offset-2 ${
                    localSettings.notifications.systemUpdates ? 'bg-[#0071ce]' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.notifications.systemUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Alert Thresholds Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Alert Thresholds
              </h3>
            </div>
            <div className="space-y-4">
              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Critical Threshold
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    {localSettings.alerts.criticalThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="95"
                  step="5"
                  value={localSettings.alerts.criticalThreshold}
                  onChange={(e) => handleSliderChange('alerts', 'criticalThreshold', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600"
                />
                <div className={`flex justify-between text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>70%</span>
                  <span>95%</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Warning Threshold
                  </span>
                  <span className="text-sm font-medium text-yellow-600">
                    {localSettings.alerts.warningThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="80"
                  step="5"
                  value={localSettings.alerts.warningThreshold}
                  onChange={(e) => handleSliderChange('alerts', 'warningThreshold', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600"
                />
                <div className={`flex justify-between text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>40%</span>
                  <span>80%</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Advance Notice (days)
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {localSettings.alerts.advanceNotice}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={localSettings.alerts.advanceNotice}
                  onChange={(e) => handleSliderChange('alerts', 'advanceNotice', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600"
                />
                <div className={`flex justify-between text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>1 day</span>
                  <span>5 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className={`pt-4 border-t space-y-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                hasChanges 
                  ? 'bg-[#0071ce] text-white hover:bg-[#005bb5] transform hover:scale-105' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasChanges ? <Save className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              <span>{hasChanges ? 'Save Settings' : 'Settings Saved'}</span>
            </button>
            
            {hasChanges && (
              <button
                onClick={handleReset}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Reset Changes
              </button>
            )}
            
            <button
              onClick={onClose}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;