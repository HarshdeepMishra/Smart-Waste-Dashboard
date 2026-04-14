import React from 'react';
import { Store, Award, Users, TrendingUp } from 'lucide-react';

interface PeerInsightsProps {
  compactView?: boolean;
  darkMode?: boolean;
}

const PeerInsights: React.FC<PeerInsightsProps> = ({ 
  compactView = false,
  darkMode = false 
}) => {
  const insights = [
    {
      id: 1,
      type: 'success',
      icon: <Store className="h-5 w-5" />,
      title: 'BigBasket Express - Koramangala saved ₹32,400 this month',
      description: 'Combined price markdowns + Akshaya Patra donations led to 67% waste reduction — highest in network',
      color: darkMode ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-green-50 border-green-200 text-green-800'
    },
    {
      id: 2,
      type: 'best_practice',
      icon: <Award className="h-5 w-5" />,
      title: 'Best Practice: D-Mart Bandra West Dairy Strategy',
      description: '2-day 30% markdown on dairy products showing 80% sell-through rate — adopted from Koramangala playbook',
      color: darkMode ? 'bg-blue-900/30 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      id: 3,
      type: 'network',
      icon: <Users className="h-5 w-5" />,
      title: 'Transfer Opportunity: Excess Fresh Paneer',
      description: "Spencer's Retail - Anna Nagar has high demand for paneer. Transfer from D-Mart could save ₹4,200",
      color: darkMode ? 'bg-purple-900/30 border-purple-700 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-800'
    },
    {
      id: 4,
      type: 'trending',
      icon: <TrendingUp className="h-5 w-5" />,
      title: 'Weekend Produce Bundle — 85% Success Rate',
      description: 'All 5 partner stores reporting strong sell-through on Saturday morning produce combo bundles',
      color: darkMode ? 'bg-yellow-900/30 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
  ];

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`border-b p-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Peer Insights
        </h2>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Success stories and best practices from your network
        </p>
      </div>
      
      <div className={`${compactView ? 'p-4' : 'p-6'}`}>
        <div className={`space-y-4 ${compactView ? 'space-y-3' : 'space-y-4'}`}>
          {insights.map((insight) => (
            <div key={insight.id} className={`p-4 rounded-lg border-2 ${insight.color}`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${compactView ? 'text-sm' : 'text-sm'}`}>
                    {insight.title}
                  </h3>
                  <p className={`mt-1 opacity-90 ${compactView ? 'text-xs' : 'text-sm'}`}>
                    {insight.description}
                  </p>
                </div>
                <button className={`text-xs px-3 py-1 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors ${
                  compactView ? 'px-2 py-0.5' : 'px-3 py-1'
                }`}>
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeerInsights;