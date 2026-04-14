import React from 'react';
import { BarChart3, TrendingUp, Lightbulb, Award } from 'lucide-react';
import AnalyticsSection from './AnalyticsSection';
import { Stats, Product } from '../data/mockData';

interface InsightsLabProps {
  stats: Stats;
  products: Product[];
  darkMode?: boolean;
}

const InsightsLab: React.FC<InsightsLabProps> = ({
  stats,
  products,
  darkMode = false
}) => {
  const aiInsights = [
    {
      icon: TrendingUp,
      title: 'Dairy Waste Trend',
      description: 'Dairy waste increased 12% due to overstocking',
      recommendation: 'Consider reducing dairy order quantities by 15%',
      color: 'from-blue-500/20 to-blue-600/10 border-blue-400/30'
    },
    {
      icon: Award,
      title: 'Produce Strategy Success',
      description: 'Bundle deals on expiring produce show 85% sell-through',
      recommendation: 'Expand bundle promotions to other categories',
      color: 'from-green-500/20 to-green-600/10 border-green-400/30'
    },
    {
      icon: Lightbulb,
      title: 'Timing Optimization',
      description: 'Morning bakery discounts increase sell-through by 60%',
      recommendation: 'Implement early-morning price reduction schedule',
      color: 'from-amber-500/20 to-amber-600/10 border-amber-400/30'
    }
  ];

  return (
    <div className="space-y-8">
      <div className={`glass-card grid grid-cols-1 md:grid-cols-3 gap-4`}>
        {aiInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`glass-card glass-hover bg-gradient-to-br ${insight.color} border p-5 cursor-pointer group`}
            >
              <div className={`p-2 rounded-lg w-fit mb-3 ${darkMode ? 'bg-white/10' : 'bg-white/50'} group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className={`font-bold text-sm mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {insight.title}
              </h3>
              <p className={`text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {insight.description}
              </p>
              <div className={`text-xs p-2 rounded border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/20'}`}>
                {insight.recommendation}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Data Visualizations
          </h2>
        </div>
        <AnalyticsSection
          compactView={false}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default InsightsLab;
