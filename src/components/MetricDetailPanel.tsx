import React, { useState } from 'react';
import { X, Package, AlertTriangle, DollarSign, Recycle, TrendingUp, TrendingDown, Calendar, Clock, BarChart3, ChevronRight, Filter } from 'lucide-react';
import { Product } from '../data/mockData';

interface MetricDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: 'totalItems' | 'highRisk' | 'savings' | 'wasteReduction' | null;
  stats: any;
  products: Product[];
  storeName: string;
  darkMode?: boolean;
}

const MetricDetailPanel: React.FC<MetricDetailPanelProps> = ({
  isOpen,
  onClose,
  metricType,
  stats,
  products,
  storeName,
  darkMode = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  if (!isOpen || !metricType) return null;

  const getMetricDetails = () => {
    switch (metricType) {
      case 'totalItems':
        return {
          title: 'Total Items Tracked',
          icon: Package,
          value: stats.totalItems,
          change: stats.totalItemsChange,
          color: 'blue',
          description: 'Complete inventory tracking across all categories'
        };
      case 'highRisk':
        return {
          title: 'High-Risk Items',
          icon: AlertTriangle,
          value: stats.highRiskItems,
          change: null,
          color: 'red',
          description: 'Products requiring immediate attention'
        };
      case 'savings':
        return {
          title: "Today's Potential Savings",
          icon: DollarSign,
          value: `$${stats.potentialSavings.toLocaleString()}`,
          change: stats.potentialSavingsChange,
          color: 'green',
          description: 'Revenue recovery opportunities through smart actions'
        };
      case 'wasteReduction':
        return {
          title: 'Waste Reduction',
          icon: Recycle,
          value: `${stats.wasteReduction}%`,
          change: 12,
          color: 'green',
          description: 'Percentage reduction in food waste this month'
        };
      default:
        return null;
    }
  };

  const details = getMetricDetails();
  if (!details) return null;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-50',
        border: darkMode ? 'border-blue-700' : 'border-blue-200',
        text: darkMode ? 'text-blue-300' : 'text-blue-800',
        icon: 'text-blue-500'
      },
      red: {
        bg: darkMode ? 'bg-red-900/30' : 'bg-red-50',
        border: darkMode ? 'border-red-700' : 'border-red-200',
        text: darkMode ? 'text-red-300' : 'text-red-800',
        icon: 'text-red-500'
      },
      green: {
        bg: darkMode ? 'bg-green-900/30' : 'bg-green-50',
        border: darkMode ? 'border-green-700' : 'border-green-200',
        text: darkMode ? 'text-green-300' : 'text-green-800',
        icon: 'text-green-500'
      }
    };
    return colors[color as keyof typeof colors];
  };

  const colorClasses = getColorClasses(details.color);

  const ProductCard: React.FC<{ product: Product; showRisk?: boolean; showSavings?: boolean }> = ({ 
    product, 
    showRisk = false, 
    showSavings = false 
  }) => (
    <div className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
      darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-white'
    }`}>
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
          style={{ backgroundColor: product.imageColor }}
        >
          <Package className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h5 className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {product.name}
            </h5>
            {showRisk && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.riskScore >= 90 ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                product.riskScore >= 80 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
              }`}>
                {product.riskScore}%
              </span>
            )}
            {showSavings && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                ${(product.quantity * product.costPerUnit * 0.3).toFixed(0)}
              </span>
            )}
          </div>
          <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="capitalize">{product.category}</span> • 
            <span className="ml-1">{product.quantity} units</span> • 
            <span className="ml-1">Expires in {product.daysUntilExpiry} day{product.daysUntilExpiry !== 1 ? 's' : ''}</span>
          </div>
          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Unit Cost: ${product.costPerUnit} • Total Value: ${(product.quantity * product.costPerUnit).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTotalItemsDetails = () => {
    const categoryBreakdown = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.quantity;
      return acc;
    }, {} as Record<string, number>);

    const categoryProducts = selectedCategory 
      ? products.filter(p => p.category === selectedCategory)
      : [];

    const recentChanges = [
      { item: 'Organic Bananas', change: +12, time: '2 hours ago' },
      { item: 'Greek Yogurt', change: -8, time: '4 hours ago' },
      { item: 'Fresh Strawberries', change: +15, time: '6 hours ago' },
      { item: 'Sandwich Bread', change: -5, time: '8 hours ago' }
    ];

    return (
      <div className="space-y-6">
        <div className={`p-4 rounded-lg border ${colorClasses.bg} ${colorClasses.border}`}>
          <h4 className={`font-semibold mb-3 ${colorClasses.text}`}>Category Breakdown</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(categoryBreakdown).map(([category, count]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 ${
                  selectedCategory === category
                    ? darkMode ? 'bg-blue-900/50 border-blue-600' : 'bg-blue-100 border-blue-300'
                    : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                } border`}
              >
                <div className="flex items-center space-x-2">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{category}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    selectedCategory === category ? 'rotate-90' : ''
                  } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <span className="font-semibold">{count} items</span>
              </button>
            ))}
          </div>
        </div>

        {selectedCategory && (
          <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedCategory} Products ({categoryProducts.length} items)
              </h4>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-sm px-3 py-1 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Inventory Changes</h4>
          <div className="space-y-2">
            {recentChanges.map((change, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <Package className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{change.item}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${change.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change.change > 0 ? '+' : ''}{change.change}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {change.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tracking Efficiency</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Scan Rate</span>
              <div className="font-semibold text-green-600">98.5%</div>
            </div>
            <div>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Last Update</span>
              <div className="font-semibold">2 min ago</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHighRiskDetails = () => {
    const criticalProducts = products.filter(p => p.riskScore >= 90);
    const highRiskProducts = products.filter(p => p.riskScore >= 80 && p.riskScore < 90);
    const urgentProducts = products.filter(p => p.daysUntilExpiry <= 1);

    const getRiskProducts = (level: string) => {
      switch (level) {
        case 'critical': return criticalProducts;
        case 'high': return highRiskProducts;
        case 'urgent': return urgentProducts;
        default: return [];
      }
    };

    const selectedProducts = selectedRiskLevel ? getRiskProducts(selectedRiskLevel) : [];

    const riskFactors = [
      { factor: 'Expiry Date', weight: '40%', description: 'Days until expiration' },
      { factor: 'Demand Pattern', weight: '25%', description: 'Historical sales velocity' },
      { factor: 'Seasonality', weight: '20%', description: 'Seasonal demand fluctuation' },
      { factor: 'Storage Conditions', weight: '15%', description: 'Temperature and humidity impact' }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedRiskLevel(selectedRiskLevel === 'critical' ? null : 'critical')}
            className={`p-4 rounded-lg text-center transition-all duration-200 ${
              selectedRiskLevel === 'critical'
                ? darkMode ? 'bg-red-900/50 border-red-600' : 'bg-red-100 border-red-300'
                : darkMode ? 'bg-red-900/30 hover:bg-red-900/40' : 'bg-red-50 hover:bg-red-100'
            } border`}
          >
            <div className="text-2xl font-bold text-red-600">{criticalProducts.length}</div>
            <div className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Critical (90%+)</div>
            <ChevronRight className={`h-4 w-4 mx-auto mt-1 transition-transform ${
              selectedRiskLevel === 'critical' ? 'rotate-90' : ''
            } text-red-500`} />
          </button>
          
          <button
            onClick={() => setSelectedRiskLevel(selectedRiskLevel === 'high' ? null : 'high')}
            className={`p-4 rounded-lg text-center transition-all duration-200 ${
              selectedRiskLevel === 'high'
                ? darkMode ? 'bg-yellow-900/50 border-yellow-600' : 'bg-yellow-100 border-yellow-300'
                : darkMode ? 'bg-yellow-900/30 hover:bg-yellow-900/40' : 'bg-yellow-50 hover:bg-yellow-100'
            } border`}
          >
            <div className="text-2xl font-bold text-yellow-600">{highRiskProducts.length}</div>
            <div className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>High Risk (80-89%)</div>
            <ChevronRight className={`h-4 w-4 mx-auto mt-1 transition-transform ${
              selectedRiskLevel === 'high' ? 'rotate-90' : ''
            } text-yellow-500`} />
          </button>
          
          <button
            onClick={() => setSelectedRiskLevel(selectedRiskLevel === 'urgent' ? null : 'urgent')}
            className={`p-4 rounded-lg text-center transition-all duration-200 ${
              selectedRiskLevel === 'urgent'
                ? darkMode ? 'bg-orange-900/50 border-orange-600' : 'bg-orange-100 border-orange-300'
                : darkMode ? 'bg-orange-900/30 hover:bg-orange-900/40' : 'bg-orange-50 hover:bg-orange-100'
            } border`}
          >
            <div className="text-2xl font-bold text-orange-600">{urgentProducts.length}</div>
            <div className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>Expires Today</div>
            <ChevronRight className={`h-4 w-4 mx-auto mt-1 transition-transform ${
              selectedRiskLevel === 'urgent' ? 'rotate-90' : ''
            } text-orange-500`} />
          </button>
        </div>

        {selectedRiskLevel && (
          <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedRiskLevel === 'critical' ? 'Critical Risk Products' :
                 selectedRiskLevel === 'high' ? 'High Risk Products' :
                 'Products Expiring Today'} ({selectedProducts.length} items)
              </h4>
              <button
                onClick={() => setSelectedRiskLevel(null)}
                className={`text-sm px-3 py-1 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedProducts.map((product) => (
                <ProductCard key={product.id} product={product} showRisk={true} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Risk Assessment Factors</h4>
          <div className="space-y-3">
            {riskFactors.map((factor, index) => (
              <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {factor.factor}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">{factor.weight}</span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSavingsDetails = () => {
    const savingsBreakdown = [
      { category: 'Price Reductions', amount: 1240, percentage: 44, color: 'yellow', strategy: 'price_cut' },
      { category: 'Donations', amount: 890, percentage: 31, color: 'green', strategy: 'donate' },
      { category: 'Transfers', amount: 520, percentage: 18, color: 'blue', strategy: 'relocate' },
      { category: 'Promotions', amount: 197, percentage: 7, color: 'purple', strategy: 'promote' }
    ];

    const getStrategyProducts = (strategy: string) => {
      return products.filter(p => 
        p.recommendations && p.recommendations.some(r => r.type === strategy)
      );
    };

    const selectedProducts = selectedStrategy ? getStrategyProducts(selectedStrategy) : [];

    const recentSavings = [
      { action: 'Banana price cut (30%)', savings: 238, time: '2 hours ago', status: 'completed' },
      { action: 'Yogurt donation scheduled', savings: 115, time: '4 hours ago', status: 'pending' },
      { action: 'Strawberry promotion', savings: 89, time: '6 hours ago', status: 'active' },
      { action: 'Bread transfer to Store #1205', savings: 67, time: '8 hours ago', status: 'completed' }
    ];

    return (
      <div className="space-y-6">
        <div className={`p-4 rounded-lg border ${colorClasses.bg} ${colorClasses.border}`}>
          <h4 className={`font-semibold mb-3 ${colorClasses.text}`}>Savings Breakdown by Strategy</h4>
          <div className="space-y-3">
            {savingsBreakdown.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedStrategy(selectedStrategy === item.strategy ? null : item.strategy)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  selectedStrategy === item.strategy
                    ? darkMode ? 'bg-blue-900/50 border-blue-600' : 'bg-blue-100 border-blue-300'
                    : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                } border`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.category}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    selectedStrategy === item.strategy ? 'rotate-90' : ''
                  } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div className="text-right">
                  <div className="font-semibold">${item.amount}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.percentage}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedStrategy && (
          <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Products for {savingsBreakdown.find(s => s.strategy === selectedStrategy)?.category} ({selectedProducts.length} items)
              </h4>
              <button
                onClick={() => setSelectedStrategy(null)}
                className={`text-sm px-3 py-1 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedProducts.map((product) => (
                <ProductCard key={product.id} product={product} showSavings={true} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Savings Actions</h4>
          <div className="space-y-2">
            {recentSavings.map((saving, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <DollarSign className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {saving.action}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {saving.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">${saving.savings}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    saving.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                    saving.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                  }`}>
                    {saving.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h5 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>This Week</h5>
            <div className="text-2xl font-bold text-green-600">${(stats.potentialSavings * 7).toLocaleString()}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Projected weekly savings</div>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h5 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Success Rate</h5>
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions implemented successfully</div>
          </div>
        </div>
      </div>
    );
  };

  const renderWasteReductionDetails = () => {
    const monthlyData = [
      { month: 'Dec', reduction: 23, target: 25 },
      { month: 'Jan', reduction: 47, target: 30 },
      { month: 'Feb', reduction: 52, target: 35 },
      { month: 'Mar', reduction: 58, target: 40 }
    ];

    const impactMetrics = [
      { metric: 'Food Saved', value: '2,847 lbs', change: '+23%', icon: Package },
      { metric: 'CO2 Reduced', value: '1.2 tons', change: '+18%', icon: Recycle },
      { metric: 'Water Saved', value: '15,420 gal', change: '+31%', icon: TrendingUp },
      { metric: 'Cost Avoided', value: '$8,940', change: '+27%', icon: DollarSign }
    ];

    const topPerformingProducts = products
      .filter(p => p.riskScore < 50)
      .sort((a, b) => a.riskScore - b.riskScore)
      .slice(0, 5);

    return (
      <div className="space-y-6">
        <div className={`p-4 rounded-lg border ${colorClasses.bg} ${colorClasses.border}`}>
          <h4 className={`font-semibold mb-3 ${colorClasses.text}`}>Monthly Progress vs Target</h4>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{data.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-20 h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${(data.reduction / 60) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold">{data.reduction}%</span>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    (Target: {data.target}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Environmental Impact</h4>
          <div className="grid grid-cols-2 gap-3">
            {impactMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <IconComponent className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {metric.metric}
                    </span>
                  </div>
                  <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-green-600">{metric.change}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top Performing Products (Low Waste Risk)</h4>
          <div className="space-y-2">
            {topPerformingProducts.map((product) => (
              <ProductCard key={product.id} product={product} showRisk={true} />
            ))}
          </div>
        </div>

        <div>
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reduction Strategies Performance</h4>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Smart Pricing</span>
                <span className="font-semibold">68% effective</span>
              </div>
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div className="w-2/3 h-2 rounded-full bg-blue-500"></div>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Donation Programs</span>
                <span className="font-semibold">84% effective</span>
              </div>
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div className="w-5/6 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Store Transfers</span>
                <span className="font-semibold">72% effective</span>
              </div>
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div className="w-3/4 h-2 rounded-full bg-purple-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (metricType) {
      case 'totalItems':
        return renderTotalItemsDetails();
      case 'highRisk':
        return renderHighRiskDetails();
      case 'savings':
        return renderSavingsDetails();
      case 'wasteReduction':
        return renderWasteReductionDetails();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-8">
      <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white'
      }`}>
        <div className={`sticky top-0 p-6 border-b ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                <details.icon className={`h-6 w-6 ${colorClasses.icon}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {details.title}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {storeName} • {details.description}
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
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-4 flex items-center space-x-6">
            <div>
              <div className={`text-3xl font-bold ${colorClasses.text}`}>
                {details.value}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Current Value
              </div>
            </div>
            {details.change && (
              <div className="flex items-center space-x-2">
                {details.change > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <div className={`font-semibold ${details.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {details.change > 0 ? '+' : ''}{details.change}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    from yesterday
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MetricDetailPanel;