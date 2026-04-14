import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface AnalyticsSectionProps {
  compactView?: boolean;
  darkMode?: boolean;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ 
  compactView = false,
  darkMode = false 
}) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();
  
  // Generate stable 30-day waste data (this will be the same for the same day)
  const generateStableWasteData = () => {
    const data = [];
    const today = new Date();
    const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      // Use date as seed for consistent random values
      const seed = date.getTime();
      const pseudoRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      // Base waste amount with realistic patterns
      let baseWaste = 850;
      
      // Weekend patterns (higher waste on Sundays/Mondays)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 1) baseWaste *= 1.3; // Sunday/Monday
      if (dayOfWeek === 5 || dayOfWeek === 6) baseWaste *= 0.8; // Friday/Saturday
      
      // Holiday patterns
      const dayOfMonth = date.getDate();
      if (dayOfMonth === 1 || dayOfMonth === 25) baseWaste *= 1.5; // New Year/Christmas
      
      // Gradual improvement trend over time
      const improvementFactor = 1 - (i * 0.01); // 1% improvement per day
      baseWaste *= improvementFactor;
      
      // Add consistent variance based on date
      const variance = (pseudoRandom(seed) - 0.5) * 100;
      const finalWaste = Math.max(200, Math.round(baseWaste + variance));
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0],
        waste: finalWaste,
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        savings: Math.round(finalWaste * 0.65)
      });
    }
    return data;
  };

  const wasteData = generateStableWasteData();

  // Stable category breakdown (doesn't change unless it's a new day)
  const categoryData = [
    { 
      name: 'Produce', 
      value: 1847, 
      color: '#16a34a', 
      percentage: 42,
      trend: 'decreasing',
      lastWeek: 2140
    },
    { 
      name: 'Bakery', 
      value: 1203, 
      color: '#f59e0b', 
      percentage: 27,
      trend: 'stable',
      lastWeek: 1189
    },
    { 
      name: 'Dairy', 
      value: 892, 
      color: '#2563eb', 
      percentage: 20,
      trend: 'decreasing',
      lastWeek: 1045
    },
    { 
      name: 'Deli/Meat', 
      value: 487, 
      color: '#dc2626', 
      percentage: 11,
      trend: 'increasing',
      lastWeek: 423
    }
  ];

  // Generate realistic monthly savings data based on current date
  const generateRealisticMonthlySavings = () => {
    const months = [];
    
    // Generate data for the last 6 months, but current month shows realistic progress
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const isCurrentMonth = i === 0;
      
      // Fixed values for completed months
      const completedMonthTargets = [2000, 2200, 2400, 2600, 2800];
      const completedMonthActuals = [1850, 2090, 2640, 2470, 2950];
      
      let target, actual;
      
      if (isCurrentMonth) {
        // Current month: realistic progress based on current day
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const monthlyTarget = 3000;
        const dailyTarget = monthlyTarget / daysInMonth;
        
        // Current month target and actual based on days passed
        target = Math.round(dailyTarget * daysInMonth); // Full month target
        actual = Math.round(dailyTarget * currentDay * 0.95); // Slightly under target pace
        
      } else {
        // Completed months
        const monthIndex = 5 - i - 1;
        target = completedMonthTargets[monthIndex] || 2500;
        actual = completedMonthActuals[monthIndex] || 2500;
      }
      
      months.push({
        month: monthName,
        year: date.getFullYear(),
        fullDate: date.toISOString().split('T')[0],
        savings: actual,
        target: target,
        efficiency: Math.round((actual / target) * 100),
        isCurrentMonth
      });
    }
    return months;
  };

  const savingsData = generateRealisticMonthlySavings();

  // Generate hourly pattern that only updates once per hour
  const generateStableHourlyPattern = () => {
    const hours = [];
    const currentHour = now.getHours();
    
    // Base hourly patterns that don't change
    const baseHourlyWaste = [
      15, 12, 8, 5, 8, 25,     // 0-5 AM (low activity)
      45, 65, 75, 85, 70, 95,  // 6-11 AM (morning prep and rush)
      120, 110, 95, 80, 70, 85, // 12-5 PM (lunch and afternoon)
      110, 125, 95, 75, 45, 25, // 6-11 PM (dinner rush and closing)
      20, 15                    // 10-11 PM (late evening)
    ];
    
    for (let hour = 0; hour < 24; hour++) {
      const baseWaste = baseHourlyWaste[hour] || 20;
      
      // Only add small variance for current and future hours
      let finalWaste = baseWaste;
      if (hour <= currentHour) {
        // Past hours have fixed values
        finalWaste = baseWaste;
      } else {
        // Future hours show projected values
        finalWaste = Math.round(baseWaste * 0.9); // Slightly lower projections
      }
      
      hours.push({
        hour: hour,
        time: `${hour.toString().padStart(2, '0')}:00`,
        waste: finalWaste,
        isCurrentHour: hour === currentHour
      });
    }
    return hours;
  };

  const hourlyData = generateStableHourlyPattern();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 border rounded-lg shadow-lg ${
          darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200'
        }`}>
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('$') ? '$' : ''}{entry.value}
              {entry.name.includes('waste') ? ' lbs' : ''}
              {entry.name.includes('savings') ? '' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartHeight = compactView ? 180 : 220;

  // Calculate stable key insights
  const totalWasteThisMonth = wasteData.reduce((sum, day) => sum + day.waste, 0);
  const avgDailyWaste = Math.round(totalWasteThisMonth / wasteData.length);
  const wasteReduction = Math.round(((wasteData[0].waste - wasteData[wasteData.length - 1].waste) / wasteData[0].waste) * 100);
  const currentMonthSavings = savingsData[savingsData.length - 1]?.savings || 0;
  const targetAchievement = savingsData[savingsData.length - 1]?.efficiency || 0;

  return (
    <div className="space-y-6">
      {/* Key Insights Banner */}
      <div className={`p-4 rounded-lg border-l-4 border-l-blue-500 ${
        darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          📊 Analytics Dashboard - Last Updated: {now.toLocaleTimeString()}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className={darkMode ? 'text-blue-200' : 'text-blue-700'}>
              <strong>30-Day Trend:</strong> {wasteReduction}% waste reduction
            </span>
          </div>
          <div>
            <span className={darkMode ? 'text-blue-200' : 'text-blue-700'}>
              <strong>Daily Average:</strong> {avgDailyWaste} lbs waste
            </span>
          </div>
          <div>
            <span className={darkMode ? 'text-blue-200' : 'text-blue-700'}>
              <strong>Current Month Progress:</strong> Day {currentDay} of {new Date(currentYear, currentMonth + 1, 0).getDate()}
            </span>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ${compactView ? 'gap-4' : 'gap-6'}`}>
        {/* 30-Day Waste Trend */}
        <div className={`rounded-lg shadow-md hover:shadow-lg transition-shadow ${
          compactView ? 'p-4' : 'p-6'
        } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${compactView ? 'text-base' : 'text-lg'} ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              30-Day Waste Trend
            </h3>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {wasteData[0]?.fullDate} to {wasteData[wasteData.length - 1]?.fullDate}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={wasteData}>
              <defs>
                <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
              <XAxis 
                dataKey="date" 
                fontSize={12} 
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                axisLine={{ stroke: darkMode ? '#4b5563' : '#e5e7eb' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                fontSize={12} 
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                axisLine={{ stroke: darkMode ? '#4b5563' : '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="waste" 
                stroke="#dc2626" 
                strokeWidth={2}
                fill="url(#wasteGradient)"
                name="Daily Waste (lbs)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className={`mt-4 p-3 rounded-lg ${
            darkMode ? 'bg-green-900/30' : 'bg-green-50'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
              <strong>{wasteReduction}% reduction</strong> over 30 days
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              Saving approximately ${Math.round(avgDailyWaste * 0.65)} per day vs. month start
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className={`rounded-lg shadow-md hover:shadow-lg transition-shadow ${
          compactView ? 'p-4' : 'p-6'
        } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${compactView ? 'text-base' : 'text-lg'} ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Waste by Category
            </h3>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              This month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={compactView ? 60 : 80}
                dataKey="value"
                label={({ name, percentage }) => `${name} ${percentage}%`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${item.value}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className={`text-xs ${
                      item.trend === 'decreasing' ? 'text-green-600' :
                      item.trend === 'increasing' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {item.trend === 'decreasing' ? '↓' : item.trend === 'increasing' ? '↑' : '→'}
                      {item.trend === 'decreasing' ? 
                        Math.round(((item.lastWeek - item.value) / item.lastWeek) * 100) :
                        item.trend === 'increasing' ?
                        Math.round(((item.value - item.lastWeek) / item.lastWeek) * 100) : 0
                      }%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Savings Performance - FIXED FOR REALISTIC CURRENT MONTH */}
        <div className={`rounded-lg shadow-md hover:shadow-lg transition-shadow ${
          compactView ? 'p-4' : 'p-6'
        } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${compactView ? 'text-base' : 'text-lg'} ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              6-Month Savings
            </h3>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              vs. Target
            </div>
          </div>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
              <XAxis 
                dataKey="month" 
                fontSize={12} 
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                axisLine={{ stroke: darkMode ? '#4b5563' : '#e5e7eb' }}
              />
              <YAxis 
                fontSize={12} 
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                axisLine={{ stroke: darkMode ? '#4b5563' : '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="target" fill={darkMode ? '#4b5563' : '#e5e7eb'} name="Target ($)" />
              <Bar 
                dataKey="savings" 
                fill={(entry: any) => entry?.isCurrentMonth ? '#f59e0b' : '#16a34a'} 
                name="Actual Savings ($)" 
              />
            </BarChart>
          </ResponsiveContainer>
          <div className={`mt-4 p-3 rounded-lg ${
            darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              <strong>{now.toLocaleDateString('en-US', { month: 'long' })} Progress:</strong> ${currentMonthSavings.toLocaleString()}
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Day {currentDay} of {new Date(currentYear, currentMonth + 1, 0).getDate()} • On track for monthly target
            </p>
          </div>
        </div>
      </div>

      {/* Today's Hourly Pattern */}
      <div className={`rounded-lg shadow-md hover:shadow-lg transition-shadow ${
        compactView ? 'p-4' : 'p-6'
      } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${compactView ? 'text-base' : 'text-lg'} ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Today's Hourly Pattern
          </h3>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {now.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • Current: {now.getHours()}:00
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
            <XAxis 
              dataKey="time" 
              fontSize={12} 
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
              axisLine={{ stroke: darkMode ? '#4b5563' : '#e5e7eb' }}
              interval={3}
            />
            <YAxis 
              fontSize={12} 
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
              axisLine={{ stroke: darkMode ? '#4b5563' : '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="waste" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return payload.isCurrentHour ? (
                  <circle cx={cx} cy={cy} r={6} fill="#f59e0b" stroke="#ffffff" strokeWidth={2} />
                ) : (
                  <circle cx={cx} cy={cy} r={3} fill="#f59e0b" />
                );
              }}
              name="Hourly Waste (lbs)"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className={`mt-4 grid grid-cols-3 gap-4 text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div>
            <span className="font-medium">Peak Hours:</span>
            <div>5-8 PM (Dinner rush)</div>
          </div>
          <div>
            <span className="font-medium">Current Hour:</span>
            <div className="font-semibold text-orange-600">
              {hourlyData.find(h => h.isCurrentHour)?.waste || 0} lbs
            </div>
          </div>
          <div>
            <span className="font-medium">Today's Total:</span>
            <div className="font-semibold">
              {hourlyData.slice(0, now.getHours() + 1).reduce((sum, hour) => sum + hour.waste, 0)} lbs
            </div>
          </div>
        </div>
      </div>

      {/* Stable Insights */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
          <h4 className={`font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
            Best Day This Week
          </h4>
          <div className="text-2xl font-bold text-blue-600">Friday</div>
          <div className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            485 lbs waste
          </div>
        </div>

        <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
          <h4 className={`font-semibold mb-2 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
            Weekly Improvement
          </h4>
          <div className="text-2xl font-bold text-green-600">18%</div>
          <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            Week-over-week reduction
          </div>
        </div>

        <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
          <h4 className={`font-semibold mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
            Forecast Accuracy
          </h4>
          <div className="text-2xl font-bold text-purple-600">94%</div>
          <div className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            AI prediction accuracy
          </div>
        </div>

        <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
          <h4 className={`font-semibold mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
            Next Alert
          </h4>
          <div className="text-2xl font-bold text-yellow-600">2h</div>
          <div className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            Predicted high-risk item
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;