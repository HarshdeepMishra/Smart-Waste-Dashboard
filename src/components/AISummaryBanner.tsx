import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';

interface AISummaryBannerProps {
  potentialSavings: number;
  highRiskItems: number;
  storeName: string;
  darkMode?: boolean;
}

const AISummaryBanner: React.FC<AISummaryBannerProps> = ({
  potentialSavings,
  highRiskItems,
  storeName,
  darkMode = false
}) => {
  return (
    <div
      className={`glass-card glass-hover mb-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30 dark:border-green-500/30 p-6 md:p-8 relative overflow-hidden group cursor-pointer`}
    >
      <div className="absolute -right-32 -top-32 w-64 h-64 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-green-400 to-blue-400"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/30 to-blue-500/30">
              <Zap className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              AI Opportunity Summary
            </h2>
          </div>
          <TrendingUp className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
        </div>

        <p
          className={`text-lg font-semibold mb-4 ${
            darkMode ? 'text-green-300' : 'text-green-700'
          }`}
        >
          You can save <span className="font-bold">₹{potentialSavings.toLocaleString()}</span> this week by taking action on <span className="font-bold">{highRiskItems}</span> high-risk items.
        </p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className={`flex items-center space-x-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Immediate action needed on critical products</span>
          </div>
          <div className={`flex items-center space-x-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>AI strategies ready for deployment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISummaryBanner;
