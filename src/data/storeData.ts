import { generateRealisticTimestamp, getRelativeTime } from '../utils/dateUtils';

export interface StoreData {
  id: string;
  name: string;
  stats: {
    totalItems: number;
    totalItemsChange: number;
    highRiskItems: number;
    potentialSavings: number;
    potentialSavingsChange: number;
    wasteReduction: number;
    wasteReductionPercentage: number;
  };
  products: any[];
  notifications: Array<{
    id: number;
    type: 'warning' | 'success' | 'info';
    title: string;
    message: string;
    time: string;
    timestamp: Date;
    unread: boolean;
    actionRequired?: string;
    storeId?: string;
  }>;
  recentActivity?: Array<{
    action: string;
    store: string;
    time: string;
    timestamp: Date;
    productName?: string;
  }>;
  settings: {
    notifications: {
      criticalAlerts: boolean;
      dailyReports: boolean;
      peerInsights: boolean;
      systemUpdates: boolean;
    };
    display: {
      darkMode: boolean;
      compactView: boolean;
      autoRefresh: boolean;
      refreshInterval: number;
    };
    alerts: {
      criticalThreshold: number;
      warningThreshold: number;
      advanceNotice: number;
    };
  };
}

const futureDate = (daysFromNow: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

// All 5 Indian partner stores
const NETWORK_STORES = [
  'Reliance Fresh - Connaught Place',
  'BigBasket Express - Koramangala',
  'D-Mart - Bandra West',
  'More Megastore - Salt Lake',
  "Spencer's Retail - Anna Nagar",
];

const NGO_PARTNERS = ['Akshaya Patra Foundation', 'Goonj NGO', 'Robin Hood Army', 'FoodBank India'];

const generateNotifications = (storeId: string, storeName: string) => {
  const notifications = [];
  const products = ['Amul Full Cream Milk 1L', 'Fresh Paneer 250g', 'Tandoori Chicken Legs', 'Smoked Salmon Fillet'];

  const t1 = generateRealisticTimestamp(0.5);
  notifications.push({
    id: Math.floor(Math.random() * 99999) + 1,
    type: 'warning' as const,
    title: '🔴 High Risk Alert',
    message: `${products[0]} expires in 6 hours! ${Math.floor(Math.random() * 20 + 5)} units worth ₹${Math.floor(Math.random() * 2000 + 500)} need immediate action.`,
    time: getRelativeTime(t1), timestamp: t1, unread: true, actionRequired: 'Alerts', storeId: storeName
  });

  const t2 = generateRealisticTimestamp(2);
  notifications.push({
    id: Math.floor(Math.random() * 99999) + 2,
    type: 'success' as const,
    title: '✅ Strategy Implemented',
    message: `${products[2]} price reduction successful. 18 units sold, ₹${Math.floor(Math.random() * 5000 + 2000)} saved.`,
    time: getRelativeTime(t2), timestamp: t2, unread: Math.random() > 0.5, actionRequired: 'Dashboard', storeId: storeName
  });

  const t3 = generateRealisticTimestamp(4);
  notifications.push({
    id: Math.floor(Math.random() * 99999) + 3,
    type: 'info' as const,
    title: '🤖 AI Insight',
    message: `Detected 23% increase in dairy demand this week at ${storeName}. Adjust order quantities to avoid overstocking.`,
    time: getRelativeTime(t3), timestamp: t3, unread: false, actionRequired: 'Analytics', storeId: storeName
  });

  const t4 = generateRealisticTimestamp(6);
  notifications.push({
    id: Math.floor(Math.random() * 99999) + 4,
    type: 'info' as const,
    title: '🔄 System Update',
    message: `Inventory data synchronized. ${Math.floor(Math.random() * 50) + 300} items updated from POS system.`,
    time: getRelativeTime(t4), timestamp: t4, unread: false, storeId: storeName
  });

  const t5 = generateRealisticTimestamp(8);
  const peerStore = NETWORK_STORES.filter(s => s !== storeName)[Math.floor(Math.random() * 4)];
  notifications.push({
    id: Math.floor(Math.random() * 99999) + 5,
    type: 'info' as const,
    title: '🏆 Peer Insight',
    message: `${peerStore} achieved 71% waste reduction using Akshaya Patra donation strategy. View and adopt?`,
    time: getRelativeTime(t5), timestamp: t5, unread: true, actionRequired: 'Insights', storeId: storeName
  });

  return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateRecentActivity = (storeName: string) => {
  const actions = [
    'Applied 30% markdown on perishables',
    'Scheduled donation pickup with Akshaya Patra',
    'Initiated transfer to partner store',
    'Updated alert threshold settings',
    'Reviewed daily analytics report',
    'Activated weekend produce bundle promotion',
  ];
  return actions.map((action, i) => {
    const ts = generateRealisticTimestamp(i * 1.5 + 0.5);
    return { action, store: storeName, time: getRelativeTime(ts), timestamp: ts };
  });
};

const generateProducts = (storeId: string) => {
  const catalog = [
    { name: 'Organic Bananas (Dozen)', category: 'Produce', qty: 45, price: 45, color: '#fbbf24', days: [1, 3] },
    { name: 'Amul Full Cream Milk 1L', category: 'Dairy', qty: 80, price: 68, color: '#e0f2fe', days: [3, 5] },
    { name: 'Fresh Strawberries 250g', category: 'Produce', qty: 34, price: 149, color: '#ef4444', days: [1, 2] },
    { name: 'Mother Dairy Greek Yogurt', category: 'Dairy', qty: 23, price: 99, color: '#3b82f6', days: [2, 5] },
    { name: 'Britannia Multigrain Bread', category: 'Bakery', qty: 19, price: 55, color: '#d97706', days: [2, 5] },
    { name: 'Deli Chicken Salami 200g', category: 'Deli', qty: 20, price: 245, color: '#f59e0b', days: [5, 8] },
    { name: 'Organic Spinach Bunch', category: 'Produce', qty: 29, price: 49, color: '#16a34a', days: [2, 4] },
    { name: 'Tandoori Chicken Legs (Pair)', category: 'Deli', qty: 18, price: 299, color: '#dc2626', days: [1, 2] },
    { name: 'Blueberry Muffins (Pack 6)', category: 'Bakery', qty: 36, price: 199, color: '#6366f1', days: [2, 4] },
    { name: 'Amul Butter 500g', category: 'Dairy', qty: 40, price: 275, color: '#fde68a', days: [6, 10] },
    { name: 'Baby Carrots 500g', category: 'Produce', qty: 52, price: 59, color: '#f97316', days: [4, 7] },
    { name: 'Salted Croissants (Pack 4)', category: 'Bakery', qty: 24, price: 149, color: '#92400e', days: [1, 3] },
    { name: 'Smoked Salmon Fillet 200g', category: 'Deli', qty: 8, price: 649, color: '#f472b6', days: [1, 2] },
    { name: 'Roma Tomatoes 1kg', category: 'Produce', qty: 44, price: 60, color: '#f87171', days: [3, 6] },
    { name: 'Vadilal Ice Cream Tub 1L', category: 'Frozen', qty: 31, price: 299, color: '#fef3c7', days: [30, 60] },
    { name: 'Amul Taaza Milk 500ml', category: 'Dairy', qty: 65, price: 30, color: '#bae6fd', days: [2, 4] },
    { name: 'Fresh Paneer 250g', category: 'Dairy', qty: 18, price: 85, color: '#fef9c3', days: [1, 3] },
    { name: 'Chicken Breast Boneless 1kg', category: 'Meat', qty: 22, price: 349, color: '#fca5a5', days: [2, 4] },
    { name: 'Real Juice Mango 1L', category: 'Beverages', qty: 55, price: 99, color: '#fde047', days: [10, 20] },
    { name: "Haldiram's Bhujia 400g", category: 'Snacks', qty: 60, price: 149, color: '#eab308', days: [30, 60] },
    { name: 'Avocado 3-Pack', category: 'Produce', qty: 27, price: 249, color: '#4ade80', days: [2, 5] },
    { name: 'Mutton Curry Cuts 500g', category: 'Meat', qty: 15, price: 499, color: '#b45309', days: [2, 3] },
    { name: 'Sourdough Artisan Loaf', category: 'Bakery', qty: 14, price: 179, color: '#c2956c', days: [2, 4] },
    { name: 'Frozen Green Peas 500g', category: 'Frozen', qty: 55, price: 79, color: '#86efac', days: [25, 45] },
    { name: 'Amul Kool Lassi 200ml', category: 'Beverages', qty: 60, price: 30, color: '#fef9c3', days: [3, 5] },
    { name: 'Prawn Masala Ready-to-Cook', category: 'Deli', qty: 12, price: 349, color: '#fda4af', days: [1, 3] },
    { name: 'Coriander Leaves (Bundle)', category: 'Produce', qty: 80, price: 15, color: '#4ade80', days: [1, 2] },
    { name: 'Fish Rohu (Whole) 1kg', category: 'Meat', qty: 18, price: 219, color: '#6ee7b7', days: [1, 2] },
    { name: 'Tropicana Orange Juice 1L', category: 'Beverages', qty: 40, price: 119, color: '#fb923c', days: [8, 15] },
    { name: "Parle-G Biscuits 400g", category: 'Snacks', qty: 70, price: 40, color: '#fbbf24', days: [60, 90] },
    { name: 'Raw Mangoes 1kg', category: 'Produce', qty: 60, price: 89, color: '#fbbf24', days: [3, 6] },
    { name: 'Chhena (Fresh Cottage Cheese)', category: 'Dairy', qty: 20, price: 120, color: '#fef3c7', days: [1, 2] },
    { name: 'ITC Master Chef Paratha', category: 'Frozen', qty: 25, price: 89, color: '#d6d3d1', days: [30, 60] },
    { name: 'Shrikhand Mango 400g', category: 'Dairy', qty: 15, price: 130, color: '#fcd34d', days: [5, 8] },
  ];

  const successRates: Record<string, Record<string, number>> = {
    price_cut: { Produce: 85, Dairy: 80, Bakery: 75, Deli: 82, Meat: 78, Frozen: 65, Beverages: 70, Snacks: 60 },
    donate: { Produce: 95, Dairy: 90, Bakery: 92, Deli: 88, Meat: 85, Frozen: 70, Beverages: 65, Snacks: 60 },
    relocate: { Produce: 78, Dairy: 72, Bakery: 65, Deli: 80, Meat: 82, Frozen: 75, Beverages: 70, Snacks: 68 },
    promote: { Produce: 65, Dairy: 58, Bakery: 72, Deli: 60, Meat: 55, Frozen: 70, Beverages: 80, Snacks: 85 },
  };

  const multiplier = storeId === 'BB002' ? 1.2 : storeId === 'DM003' ? 1.1 : storeId === 'MM004' ? 0.9 : 1.0;

  return catalog.map((base, idx) => {
    const days = Math.floor(Math.random() * (base.days[1] - base.days[0] + 1)) + base.days[0];
    let risk = Math.max(0, Math.min(100, Math.round(100 - days * 12 + (Math.random() * 20 - 10))));
    const qty = Math.max(5, Math.round(base.qty * multiplier * (0.7 + Math.random() * 0.6)));
    const totalValue = parseFloat((qty * base.price).toFixed(2));

    const recommendations = [];
    if (risk >= 70) {
      const disc = risk >= 90 ? 40 : risk >= 80 ? 30 : 20;
      const rate = successRates.price_cut[base.category] || 75;
      recommendations.push({ type: 'price_cut', discount: disc, expectedSales: Math.round(qty * 0.8), savings: Math.round(totalValue * 0.5), description: `${disc}% markdown — ${rate}% historical success rate. Recover ₹${Math.round(totalValue * 0.5).toLocaleString('en-IN')}` });
    }
    if (risk >= 80) {
      const ngo = NGO_PARTNERS[Math.floor(Math.random() * NGO_PARTNERS.length)];
      const rate = successRates.donate[base.category] || 85;
      recommendations.push({ type: 'donate', organization: ngo, timeSlot: '2-4 PM', savings: Math.round(totalValue * 0.7), description: `Donate to ${ngo} — ${rate}% success rate, full tax deduction, recover ₹${Math.round(totalValue * 0.7).toLocaleString('en-IN')}` });
    }
    if (qty > 20 && risk >= 60) {
      const destStore = NETWORK_STORES.filter(s => s !== NETWORK_STORES[0])[Math.floor(Math.random() * 4)];
      const rate = successRates.relocate[base.category] || 70;
      recommendations.push({ type: 'relocate', store: destStore, demand: 'High', distance: `${(Math.random() * 8 + 1).toFixed(1)} km`, savings: Math.round(totalValue * 0.6), description: `Transfer to ${destStore} — ${rate}% success, recover ₹${Math.round(totalValue * 0.6).toLocaleString('en-IN')}` });
    }
    if (recommendations.length === 0) {
      const rate = successRates.promote[base.category] || 65;
      recommendations.push({ type: 'promote', description: `Weekend combo promotion — ${rate}% sell-through rate. Recover ₹${Math.round(totalValue * 0.3).toLocaleString('en-IN')}`, expectedSales: Math.round(qty * 0.7), savings: Math.round(totalValue * 0.3) });
    }

    return { id: idx + 1, name: base.name, category: base.category, quantity: qty, expiryDate: futureDate(days), riskScore: risk, costPerUnit: base.price, daysUntilExpiry: days, imageColor: base.color, totalValue, recommendations };
  });
};

// Default settings — identical across all stores
const DEFAULT_SETTINGS = {
  notifications: { criticalAlerts: true, dailyReports: true, peerInsights: true, systemUpdates: true },
  display: { darkMode: false, compactView: false, autoRefresh: true, refreshInterval: 30 },
  alerts: { criticalThreshold: 80, warningThreshold: 60, advanceNotice: 2 }
};

export const STORE_LIST = [
  'Reliance Fresh - Connaught Place',
  'BigBasket Express - Koramangala',
  'D-Mart - Bandra West',
  'More Megastore - Salt Lake',
  "Spencer's Retail - Anna Nagar",
];

export const storeDataMap: Record<string, StoreData> = {
  'Reliance Fresh - Connaught Place': {
    id: 'RF001', name: 'Reliance Fresh - Connaught Place',
    stats: { totalItems: 342, totalItemsChange: 12, highRiskItems: 18, potentialSavings: 28470, potentialSavingsChange: 3400, wasteReduction: 47, wasteReductionPercentage: 47 },
    products: generateProducts('RF001'),
    notifications: generateNotifications('RF001', 'Reliance Fresh - Connaught Place'),
    recentActivity: generateRecentActivity('Reliance Fresh - Connaught Place'),
    settings: { ...DEFAULT_SETTINGS }
  },
  'BigBasket Express - Koramangala': {
    id: 'BB002', name: 'BigBasket Express - Koramangala',
    stats: { totalItems: 312, totalItemsChange: 8, highRiskItems: 12, potentialSavings: 32400, potentialSavingsChange: 4200, wasteReduction: 67, wasteReductionPercentage: 67 },
    products: generateProducts('BB002'),
    notifications: generateNotifications('BB002', 'BigBasket Express - Koramangala'),
    recentActivity: generateRecentActivity('BigBasket Express - Koramangala'),
    settings: { ...DEFAULT_SETTINGS }
  },
  'D-Mart - Bandra West': {
    id: 'DM003', name: 'D-Mart - Bandra West',
    stats: { totalItems: 428, totalItemsChange: 18, highRiskItems: 24, potentialSavings: 21800, potentialSavingsChange: 2800, wasteReduction: 41, wasteReductionPercentage: 41 },
    products: generateProducts('DM003'),
    notifications: generateNotifications('DM003', 'D-Mart - Bandra West'),
    recentActivity: generateRecentActivity('D-Mart - Bandra West'),
    settings: { ...DEFAULT_SETTINGS }
  },
  'More Megastore - Salt Lake': {
    id: 'MM004', name: 'More Megastore - Salt Lake',
    stats: { totalItems: 367, totalItemsChange: 15, highRiskItems: 21, potentialSavings: 18900, potentialSavingsChange: 2200, wasteReduction: 38, wasteReductionPercentage: 38 },
    products: generateProducts('MM004'),
    notifications: generateNotifications('MM004', 'More Megastore - Salt Lake'),
    recentActivity: generateRecentActivity('More Megastore - Salt Lake'),
    settings: { ...DEFAULT_SETTINGS }
  },
  "Spencer's Retail - Anna Nagar": {
    id: 'SR005', name: "Spencer's Retail - Anna Nagar",
    stats: { totalItems: 295, totalItemsChange: 6, highRiskItems: 14, potentialSavings: 26500, potentialSavingsChange: 3100, wasteReduction: 52, wasteReductionPercentage: 52 },
    products: generateProducts('SR005'),
    notifications: generateNotifications('SR005', "Spencer's Retail - Anna Nagar"),
    recentActivity: generateRecentActivity("Spencer's Retail - Anna Nagar"),
    settings: { ...DEFAULT_SETTINGS }
  },
};