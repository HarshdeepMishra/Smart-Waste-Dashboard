export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
};

export const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getRiskLevel = (riskScore: number): 'critical' | 'warning' | 'watch' => {
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 60) return 'warning';
  return 'watch';
};

export const getRiskColor = (riskScore: number): string => {
  if (riskScore >= 80) return 'text-red-600 bg-red-100';
  if (riskScore >= 60) return 'text-yellow-600 bg-yellow-100';
  return 'text-blue-600 bg-blue-100';
};

export const generateRealisticTimestamp = (hoursAgo: number = 0): Date => {
  const now = new Date();
  return new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
};

export const getBusinessHours = (): { start: number; end: number } => {
  return { start: 6, end: 22 }; // 6 AM to 10 PM
};

export const isBusinessHours = (date: Date = new Date()): boolean => {
  const hours = date.getHours();
  const { start, end } = getBusinessHours();
  return hours >= start && hours <= end;
};

export const getSeasonalMultiplier = (date: Date = new Date()): number => {
  const month = date.getMonth();
  // Seasonal patterns for grocery waste
  const seasonalFactors = [
    0.9,  // January - post-holiday low
    0.85, // February - lowest
    0.95, // March - spring increase
    1.0,  // April - normal
    1.1,  // May - spring high
    1.15, // June - summer peak
    1.2,  // July - summer peak
    1.15, // August - summer high
    1.05, // September - back to school
    1.1,  // October - fall increase
    1.25, // November - holiday prep
    1.3   // December - holiday peak
  ];
  return seasonalFactors[month];
};

export const getWeekdayMultiplier = (date: Date = new Date()): number => {
  const dayOfWeek = date.getDay();
  // 0 = Sunday, 1 = Monday, etc.
  const weekdayFactors = [1.3, 1.4, 0.8, 0.9, 0.9, 0.7, 0.8]; // Sun-Sat
  return weekdayFactors[dayOfWeek];
};

export const generateRealisticWasteAmount = (baseAmount: number, date: Date = new Date()): number => {
  const seasonal = getSeasonalMultiplier(date);
  const weekday = getWeekdayMultiplier(date);
  const random = 0.8 + (Math.random() * 0.4); // 80-120% variance
  
  return Math.round(baseAmount * seasonal * weekday * random);
};