import React, { useState } from 'react';
import { X, Package, Calendar, TrendingUp, CheckCircle, DollarSign, Users, MapPin, Megaphone, Clock } from 'lucide-react';
import { Product, Recommendation } from '../data/mockData';
import ActionButton from './ActionButton';
import StatusBadge from './StatusBadge';

interface RecommendationModalProps {
  product: Product | null;
  onClose: () => void;
  onActionTaken: (action: string) => void;
  darkMode?: boolean;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({ 
  product, 
  onClose, 
  onActionTaken,
  darkMode = false 
}) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [actionTaken, setActionTaken] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleActionClick = async (recommendation: Recommendation) => {
    setLoading(true);
    setSelectedRecommendation(recommendation);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setActionTaken(true);
    onActionTaken(recommendation.type);
    
    // Auto-close after 3 seconds if user doesn't manually close
    setTimeout(() => {
      if (actionTaken) {
        onClose();
      }
    }, 3000);
  };

  const handleSuccessModalClose = () => {
    setActionTaken(false);
    setSelectedRecommendation(null);
    onClose();
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'price_cut': return DollarSign;
      case 'donate': return Users;
      case 'relocate': return MapPin;
      case 'promote': return Megaphone;
      default: return TrendingUp;
    }
  };

  const getRecommendationColor = (type: string) => {
    if (darkMode) {
      switch (type) {
        case 'price_cut': return 'bg-yellow-900/30 border-yellow-700 text-yellow-300 hover:bg-yellow-900/50';
        case 'donate': return 'bg-green-900/30 border-green-700 text-green-300 hover:bg-green-900/50';
        case 'relocate': return 'bg-blue-900/30 border-blue-700 text-blue-300 hover:bg-blue-900/50';
        case 'promote': return 'bg-purple-900/30 border-purple-700 text-purple-300 hover:bg-purple-900/50';
        default: return 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600';
      }
    } else {
      switch (type) {
        case 'price_cut': return 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100';
        case 'donate': return 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100';
        case 'relocate': return 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100';
        case 'promote': return 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100';
        default: return 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100';
      }
    }
  };

  const totalPotentialValue = product.quantity * product.costPerUnit;

  if (actionTaken) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`glass-card p-8 max-w-md w-full text-center relative`}>
          {/* Cross button */}
          <button
            onClick={handleSuccessModalClose}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/10`}
          >
            <X className="h-5 w-5" />
          </button>

          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Action Implemented!
          </h3>
          <p className={`mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {selectedRecommendation?.type === 'price_cut' && 'Price reduction has been applied and is now live in the system.'}
            {selectedRecommendation?.type === 'donate' && 'Donation pickup has been scheduled and partner notified.'}
            {selectedRecommendation?.type === 'relocate' && 'Transfer request has been sent to the destination store.'}
            {selectedRecommendation?.type === 'promote' && 'Promotion has been activated and featured in displays.'}
          </p>
          <div className={`p-4 rounded-lg border glass-card bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-400/30`}>
            <p className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
              Expected savings: <span className="text-lg font-bold">₹{(selectedRecommendation?.savings || 0).toLocaleString('en-IN')}</span>
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              Implementation time: 2-5 minutes
            </p>
          </div>

          <div className={`mt-4 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            This modal will close automatically in 3 seconds
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 p-6 border-b glass-card border-white/10`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                AI Recommendations
              </h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Smart strategies to optimize inventory and reduce waste
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/10`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className={`flex items-start space-x-6 mb-8 p-4 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div 
              className="w-24 h-24 rounded-lg flex items-center justify-center shadow-lg"
              style={{ backgroundColor: product.imageColor }}
            >
              <Package className="h-12 w-12 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </h3>
                <StatusBadge 
                  status={product.riskScore >= 80 ? 'critical' : product.riskScore >= 60 ? 'warning' : 'watch'}
                  label={`${product.riskScore}% Risk`}
                  darkMode={darkMode}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Package className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Quantity:</span>
                  <span className="font-semibold">{product.quantity} units</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Expires:</span>
                  <span className="font-semibold">{product.daysUntilExpiry} day{product.daysUntilExpiry !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Unit Cost:</span>
                  <span className="font-semibold">₹{product.costPerUnit}/unit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Value:</span>
                  <span className="font-semibold">₹{totalPotentialValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Smart Recommendations
              </h4>
              <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Clock className="h-4 w-4 mr-1" />
                <span>Updated 2 minutes ago</span>
              </div>
            </div>
            
            {product.recommendations.map((recommendation, index) => {
              const IconComponent = getRecommendationIcon(recommendation.type);
              
              return (
                <div key={index} className={`p-6 rounded-lg border-2 transition-all duration-300 ${getRecommendationColor(recommendation.type)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-2 rounded-lg shadow-sm ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-semibold capitalize mb-2">
                          {recommendation.type.replace('_', ' ')} Strategy
                        </h5>
                        <p className="text-sm mb-3 leading-relaxed">{recommendation.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {recommendation.expectedSales && (
                            <div className="flex items-center">
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Expected sales:</span>
                              <span className="font-semibold ml-1">{recommendation.expectedSales} units</span>
                            </div>
                          )}
                          
                          {recommendation.organization && (
                            <div className="flex items-center">
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Partner:</span>
                              <span className="font-semibold ml-1">{recommendation.organization}</span>
                            </div>
                          )}
                          
                          {recommendation.timeSlot && (
                            <div className="flex items-center">
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Available:</span>
                              <span className="font-semibold ml-1">{recommendation.timeSlot}</span>
                            </div>
                          )}
                          
                          {recommendation.store && (
                            <div className="flex items-center">
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Location:</span>
                              <span className="font-semibold ml-1">{recommendation.store}</span>
                            </div>
                          )}
                          
                          {recommendation.distance && (
                            <div className="flex items-center">
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Distance:</span>
                              <span className="font-semibold ml-1">{recommendation.distance}</span>
                            </div>
                          )}
                          
                          {recommendation.demand && (
                            <div className="flex items-center">
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Demand:</span>
                              <span className="font-semibold ml-1">{recommendation.demand}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ₹{(recommendation.savings || 0).toLocaleString('en-IN')}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Est. savings
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <ActionButton
                      icon={IconComponent}
                      label="Implement Now"
                      onClick={() => handleActionClick(recommendation)}
                      variant="primary"
                      loading={loading && selectedRecommendation === recommendation}
                      disabled={loading}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;