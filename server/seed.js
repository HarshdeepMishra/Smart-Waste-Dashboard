require('dotenv').config();
const mongoose = require('mongoose');
const Store = require('./models/Store');
const Product = require('./models/Product');
const Alert = require('./models/Alert');
const Action = require('./models/Action');

const futureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INDIAN STORE NAMES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const STORES = [
  {
    storeId: 'RF001',
    name: 'Reliance Fresh - Connaught Place',
    location: 'Connaught Place, New Delhi',
    region: 'North India',
    manager: 'Rajesh Kumar',
    stats: { totalItems: 342, totalItemsChange: 12, highRiskItems: 18, potentialSavings: 28470, potentialSavingsChange: 3400, wasteReduction: 47, wasteReductionPercentage: 47 }
  },
  {
    storeId: 'BB002',
    name: 'BigBasket Express - Koramangala',
    location: 'Koramangala, Bengaluru',
    region: 'South India',
    manager: 'Priya Sharma',
    stats: { totalItems: 312, totalItemsChange: 8, highRiskItems: 12, potentialSavings: 32400, potentialSavingsChange: 4200, wasteReduction: 67, wasteReductionPercentage: 67 }
  },
  {
    storeId: 'DM003',
    name: 'D-Mart - Bandra West',
    location: 'Bandra West, Mumbai',
    region: 'West India',
    manager: 'Amit Patel',
    stats: { totalItems: 428, totalItemsChange: 18, highRiskItems: 24, potentialSavings: 21800, potentialSavingsChange: 2800, wasteReduction: 41, wasteReductionPercentage: 41 }
  },
  {
    storeId: 'MM004',
    name: 'More Megastore - Salt Lake',
    location: 'Salt Lake City, Kolkata',
    region: 'East India',
    manager: 'Sunita Reddy',
    stats: { totalItems: 367, totalItemsChange: 15, highRiskItems: 21, potentialSavings: 18900, potentialSavingsChange: 2200, wasteReduction: 38, wasteReductionPercentage: 38 }
  },
  {
    storeId: 'SR005',
    name: "Spencer's Retail - Anna Nagar",
    location: 'Anna Nagar, Chennai',
    region: 'South India',
    manager: 'Vikram Singh',
    stats: { totalItems: 295, totalItemsChange: 6, highRiskItems: 14, potentialSavings: 26500, potentialSavingsChange: 3100, wasteReduction: 52, wasteReductionPercentage: 52 }
  }
];

const NETWORK_STORES = STORES.map(s => s.name);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LARGE PRODUCT CATALOG — ALL PRICES IN ₹
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PRODUCT_CATALOG = [
  // PRODUCE
  { name: 'Organic Bananas (Dozen)', category: 'Produce', qty: 45, price: 45, color: '#fbbf24', days: [1, 3] },
  { name: 'Fresh Strawberries 250g', category: 'Produce', qty: 34, price: 149, color: '#ef4444', days: [1, 2] },
  { name: 'Organic Spinach Bunch', category: 'Produce', qty: 29, price: 49, color: '#16a34a', days: [2, 4] },
  { name: 'Baby Carrots 500g', category: 'Produce', qty: 52, price: 59, color: '#f97316', days: [4, 7] },
  { name: 'Roma Tomatoes 1kg', category: 'Produce', qty: 44, price: 60, color: '#f87171', days: [3, 6] },
  { name: 'Avocado 3-Pack', category: 'Produce', qty: 27, price: 249, color: '#4ade80', days: [2, 5] },
  { name: 'Romaine Lettuce Head', category: 'Produce', qty: 38, price: 49, color: '#22c55e', days: [3, 6] },
  { name: 'Raw Mangoes 1kg', category: 'Produce', qty: 60, price: 89, color: '#fbbf24', days: [3, 6] },
  { name: 'Pointed Gourd (Parwal)', category: 'Produce', qty: 40, price: 39, color: '#65a30d', days: [3, 5] },
  { name: 'Green Peas 500g', category: 'Produce', qty: 55, price: 55, color: '#86efac', days: [4, 7] },
  { name: 'Beetroot Bunch', category: 'Produce', qty: 30, price: 35, color: '#db2777', days: [5, 9] },
  { name: 'Coriander Leaves (Bundle)', category: 'Produce', qty: 80, price: 15, color: '#4ade80', days: [1, 2] },
  // DAIRY
  { name: 'Amul Full Cream Milk 1L', category: 'Dairy', qty: 80, price: 68, color: '#e0f2fe', days: [3, 5] },
  { name: 'Mother Dairy Greek Yogurt', category: 'Dairy', qty: 23, price: 99, color: '#3b82f6', days: [2, 5] },
  { name: 'Amul Butter 500g', category: 'Dairy', qty: 40, price: 275, color: '#fde68a', days: [6, 10] },
  { name: 'Fresh Paneer 250g', category: 'Dairy', qty: 18, price: 85, color: '#fef9c3', days: [1, 3] },
  { name: 'Amul Taaza Milk 500ml', category: 'Dairy', qty: 65, price: 30, color: '#bae6fd', days: [2, 4] },
  { name: 'Nestlé Milkmaid 400g', category: 'Dairy', qty: 25, price: 145, color: '#c7d2fe', days: [25, 45] },
  { name: 'Chhena (Fresh Cottage Cheese)', category: 'Dairy', qty: 20, price: 120, color: '#fef3c7', days: [1, 2] },
  { name: 'Shrikhand Mango 400g', category: 'Dairy', qty: 15, price: 130, color: '#fcd34d', days: [5, 8] },
  // BAKERY
  { name: 'Britannia Multigrain Bread', category: 'Bakery', qty: 19, price: 55, color: '#d97706', days: [2, 5] },
  { name: 'Blueberry Muffins (Pack 6)', category: 'Bakery', qty: 36, price: 199, color: '#6366f1', days: [2, 4] },
  { name: 'Sourdough Artisan Loaf', category: 'Bakery', qty: 14, price: 179, color: '#c2956c', days: [2, 4] },
  { name: 'Salted Croissants (Pack 4)', category: 'Bakery', qty: 24, price: 149, color: '#92400e', days: [1, 3] },
  { name: 'Whole Wheat Sandwich Bread', category: 'Bakery', qty: 22, price: 49, color: '#f59e0b', days: [3, 6] },
  { name: 'Focaccia Herb Bread', category: 'Bakery', qty: 10, price: 199, color: '#a8a29e', days: [1, 2] },
  // DELI / READY TO EAT
  { name: 'Tandoori Chicken Legs (Pair)', category: 'Deli', qty: 18, price: 299, color: '#dc2626', days: [1, 2] },
  { name: 'Smoked Salmon Fillet 200g', category: 'Deli', qty: 8, price: 649, color: '#f472b6', days: [1, 2] },
  { name: 'Deli Chicken Salami 200g', category: 'Deli', qty: 20, price: 245, color: '#f59e0b', days: [5, 8] },
  { name: 'Prawn Masala Ready-to-Cook', category: 'Deli', qty: 12, price: 349, color: '#fda4af', days: [1, 3] },
  { name: 'Mutton Keema (500g)', category: 'Deli', qty: 15, price: 449, color: '#b45309', days: [1, 2] },
  // MEAT
  { name: 'Chicken Breast Boneless 1kg', category: 'Meat', qty: 22, price: 349, color: '#fca5a5', days: [2, 4] },
  { name: 'Mutton Curry Cuts 500g', category: 'Meat', qty: 15, price: 499, color: '#b45309', days: [2, 3] },
  { name: 'Fish Rohu (Whole) 1kg', category: 'Meat', qty: 18, price: 219, color: '#6ee7b7', days: [1, 2] },
  { name: 'Egg Tray (30 Eggs)', category: 'Meat', qty: 35, price: 199, color: '#fef08a', days: [10, 20] },
  // FROZEN
  { name: 'McCain French Fries 400g', category: 'Frozen', qty: 48, price: 149, color: '#fde68a', days: [30, 60] },
  { name: 'Frozen Green Peas 500g', category: 'Frozen', qty: 55, price: 79, color: '#86efac', days: [25, 45] },
  { name: 'Vadilal Ice Cream Tub 1L', category: 'Frozen', qty: 31, price: 299, color: '#fef3c7', days: [30, 60] },
  { name: 'ITC Master Chef Paratha', category: 'Frozen', qty: 25, price: 89, color: '#d6d3d1', days: [30, 60] },
  // BEVERAGES
  { name: 'Real Juice Mango 1L', category: 'Beverages', qty: 55, price: 99, color: '#fde047', days: [10, 20] },
  { name: 'Tropicana Orange Juice 1L', category: 'Beverages', qty: 40, price: 119, color: '#fb923c', days: [8, 15] },
  { name: 'Amul Kool Lassi 200ml', category: 'Beverages', qty: 60, price: 30, color: '#fef9c3', days: [3, 5] },
  { name: 'Limca 600ml PET', category: 'Beverages', qty: 70, price: 35, color: '#d9f99d', days: [60, 90] },
  { name: 'Coconut Water (Sealed) 250ml', category: 'Beverages', qty: 45, price: 50, color: '#ecfccb', days: [5, 10] },
  // SNACKS
  { name: "Haldiram's Bhujia 400g", category: 'Snacks', qty: 60, price: 149, color: '#eab308', days: [30, 60] },
  { name: 'Lays Sour Cream Chips 50g', category: 'Snacks', qty: 90, price: 20, color: '#fde68a', days: [60, 90] },
  { name: 'Bingo Mad Angles 35g', category: 'Snacks', qty: 80, price: 20, color: '#f97316', days: [45, 75] },
  { name: "Parle-G Biscuits 400g", category: 'Snacks', qty: 70, price: 40, color: '#fbbf24', days: [60, 90] },
  { name: 'Britannia NutriChoice 150g', category: 'Snacks', qty: 45, price: 75, color: '#a8a29e', days: [30, 60] },
  // STAPLES
  { name: 'India Gate Basmati Rice 1kg', category: 'Snacks', qty: 50, price: 149, color: '#f5f5f4', days: [90, 180] },
  { name: 'Toor Dal (500g)', category: 'Snacks', qty: 55, price: 89, color: '#fde68a', days: [90, 180] },
];

// Generate smart recommendations in ₹
const generateRecs = (name, riskScore, qty, price) => {
  const recs = [];
  const tv = qty * price;
  if (riskScore >= 70) {
    const disc = riskScore >= 90 ? 40 : riskScore >= 80 ? 30 : 20;
    recs.push({ type: 'price_cut', discount: disc, expectedSales: Math.round(qty * 0.8), savings: Math.round(tv * 0.5), description: `${disc}% markdown — clear stock before expiry, recover ₹${Math.round(tv * 0.5)}` });
  }
  if (riskScore >= 80) {
    const org = ['Akshaya Patra Foundation', 'Goonj NGO', 'FoodBank India', 'Robin Hood Army'][Math.floor(Math.random() * 4)];
    recs.push({ type: 'donate', organization: org, timeSlot: '2-4 PM', savings: Math.round(tv * 0.7), description: `Donate to ${org} — full tax deduction, recover ₹${Math.round(tv * 0.7)}` });
  }
  if (qty > 20 && riskScore >= 60) {
    const destStore = NETWORK_STORES[Math.floor(Math.random() * NETWORK_STORES.length)];
    recs.push({ type: 'relocate', store: destStore, demand: 'High', distance: `${(Math.random() * 8 + 1).toFixed(1)} km`, savings: Math.round(tv * 0.6), description: `Transfer to ${destStore} (high demand) — save ₹${Math.round(tv * 0.6)}` });
  }
  if (recs.length === 0) recs.push({ type: 'promote', description: `Feature in this week's special deals combo — estimated recovery ₹${Math.round(tv * 0.3)}`, expectedSales: Math.round(qty * 0.7), savings: Math.round(tv * 0.3) });
  return recs;
};

// Historical success rates for AI recommendations
const SUCCESS_RATES = {
  price_cut: { Produce: 85, Dairy: 80, Bakery: 75, Deli: 82, Meat: 78, Frozen: 65, Beverages: 70, Snacks: 60 },
  donate: { Produce: 95, Dairy: 90, Bakery: 92, Deli: 88, Meat: 85, Frozen: 70, Beverages: 65, Snacks: 60 },
  relocate: { Produce: 78, Dairy: 72, Bakery: 65, Deli: 80, Meat: 82, Frozen: 75, Beverages: 70, Snacks: 68 },
  promote: { Produce: 65, Dairy: 58, Bakery: 72, Deli: 60, Meat: 55, Frozen: 70, Beverages: 80, Snacks: 85 },
};

const DEFAULT_SETTINGS = {
  notifications: { criticalAlerts: true, dailyReports: true, peerInsights: true, systemUpdates: true },
  display: { darkMode: false, compactView: false, autoRefresh: true, refreshInterval: 30 },
  alerts: { criticalThreshold: 80, warningThreshold: 60, advanceNotice: 2 }
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB Atlas');

    await Promise.all([Store.deleteMany({}), Product.deleteMany({}), Alert.deleteMany({}), Action.deleteMany({})]);
    console.log('🧹 Cleared existing data');

    // Seed stores
    await Store.insertMany(STORES.map(s => ({ ...s, settings: DEFAULT_SETTINGS })));
    console.log(`✅ Seeded ${STORES.length} stores with Indian names`);

    let totalProducts = 0;
    for (const store of STORES) {
      const multiplier = store.storeId === 'BB002' ? 1.2 : store.storeId === 'DM003' ? 1.1 : store.storeId === 'MM004' ? 0.9 : 1.0;
      const products = PRODUCT_CATALOG.map((base) => {
        const days = Math.floor(Math.random() * (base.days[1] - base.days[0] + 1)) + base.days[0];
        let risk = Math.max(0, Math.min(100, Math.round(100 - days * 12 + (Math.random() * 20 - 10))));
        const qty = Math.max(5, Math.round(base.qty * multiplier * (0.7 + Math.random() * 0.6)));
        return {
          storeId: store.storeId,
          name: base.name,
          category: base.category,
          quantity: qty,
          expiryDate: futureDate(days),
          riskScore: risk,
          costPerUnit: base.price,
          daysUntilExpiry: days,
          imageColor: base.color,
          totalValue: parseFloat((qty * base.price).toFixed(2)),
          recommendations: generateRecs(base.name, risk, qty, base.price),
          lastUpdated: new Date(),
        };
      });
      await Product.insertMany(products);
      totalProducts += products.length;

      // Seed historical actions (last 60 days)
      const actionTypes = ['price_cut', 'donate', 'relocate', 'promote'];
      const histActions = Array.from({ length: 25 }, (_, i) => {
        const base = PRODUCT_CATALOG[Math.floor(Math.random() * PRODUCT_CATALOG.length)];
        const aType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
        const savings = Math.floor(Math.random() * 5000) + 500;
        return {
          storeId: store.storeId,
          productName: base.name,
          actionType: aType,
          status: 'completed',
          estimatedSavings: savings,
          actualSavings: Math.round(savings * (0.8 + Math.random() * 0.3)),
          implementedBy: store.manager,
          createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        };
      });
      await Action.insertMany(histActions);
    }

    console.log(`✅ Seeded ${totalProducts} products across all stores`);
    console.log(`✅ Seeded ${STORES.length * 25} historical actions`);
    console.log('\n🎉 Database seeded successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    mongoose.disconnect();
    process.exit(1);
  }
}

seed();
