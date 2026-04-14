export interface Product {
  id: number;
  name: string;
  category: 'Produce' | 'Dairy' | 'Bakery' | 'Deli' | 'Meat' | 'Frozen' | 'Beverages' | 'Snacks';
  quantity: number;
  expiryDate: string;
  riskScore: number;
  costPerUnit: number;
  daysUntilExpiry: number;
  imageColor: string;
  totalValue: number;
  recommendations: Recommendation[];
}

export interface Recommendation {
  type: 'price_cut' | 'donate' | 'relocate' | 'promote';
  discount?: number;
  expectedSales?: number;
  savings?: number;
  organization?: string;
  timeSlot?: string;
  store?: string;
  demand?: string;
  distance?: string;
  description?: string;
}

export interface Stats {
  totalItems: number;
  totalItemsChange: number;
  highRiskItems: number;
  potentialSavings: number;
  potentialSavingsChange: number;
  wasteReduction: number;
  wasteReductionPercentage: number;
}

// Generate a date string relative to today
const futureDate = (daysFromNow: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Organic Bananas",
    category: "Produce",
    quantity: 45,
    expiryDate: futureDate(1),
    riskScore: 87,
    costPerUnit: 0.68,
    daysUntilExpiry: 1,
    imageColor: "#fbbf24",
    totalValue: 30.6,
    recommendations: [
      { type: "price_cut", discount: 30, expectedSales: 35, savings: 238, description: "30% discount expected to sell 35/45 units before expiry" },
      { type: "donate", organization: "Local Food Bank", timeSlot: "3-5 PM", savings: 306, description: "Food bank pickup available today, full tax deduction" },
      { type: "relocate", store: "Store #1205", demand: "High", distance: "2.3 miles", savings: 280, description: "High banana demand at nearby location, transfer recommended" }
    ]
  },
  {
    id: 2,
    name: "Greek Yogurt 32oz",
    category: "Dairy",
    quantity: 23,
    expiryDate: futureDate(2),
    riskScore: 82,
    costPerUnit: 4.99,
    daysUntilExpiry: 2,
    imageColor: "#3b82f6",
    totalValue: 114.77,
    recommendations: [
      { type: "price_cut", discount: 25, expectedSales: 20, savings: 92, description: "25% discount for quick sale, high success rate for dairy" },
      { type: "promote", description: "Feature in weekend health promotion bundle", expectedSales: 18, savings: 85 }
    ]
  },
  {
    id: 3,
    name: "Fresh Strawberries",
    category: "Produce",
    quantity: 34,
    expiryDate: futureDate(1),
    riskScore: 91,
    costPerUnit: 3.49,
    daysUntilExpiry: 1,
    imageColor: "#ef4444",
    totalValue: 118.66,
    recommendations: [
      { type: "price_cut", discount: 40, expectedSales: 30, savings: 105, description: "Aggressive pricing for immediate sale, berries deteriorate quickly" },
      { type: "donate", organization: "Shelter Kitchen", timeSlot: "2-4 PM", savings: 119, description: "Shelter needs fresh produce for today's meal prep" }
    ]
  },
  {
    id: 4,
    name: "Whole Milk Gallon",
    category: "Dairy",
    quantity: 28,
    expiryDate: futureDate(4),
    riskScore: 64,
    costPerUnit: 3.79,
    daysUntilExpiry: 4,
    imageColor: "#f8fafc",
    totalValue: 106.12,
    recommendations: [
      { type: "price_cut", discount: 15, expectedSales: 25, savings: 95, description: "Small discount for steady sales, milk has consistent demand" },
      { type: "promote", description: "Bundle with cereal promotion for family breakfast deals", expectedSales: 22, savings: 83 }
    ]
  },
  {
    id: 5,
    name: "Sandwich Bread",
    category: "Bakery",
    quantity: 19,
    expiryDate: futureDate(5),
    riskScore: 58,
    costPerUnit: 2.49,
    daysUntilExpiry: 5,
    imageColor: "#d97706",
    totalValue: 47.31,
    recommendations: [
      { type: "price_cut", discount: 20, expectedSales: 16, savings: 40, description: "Standard bakery discount strategy, proven effective" },
      { type: "relocate", store: "Store #0987", demand: "Medium", distance: "4.1 miles", savings: 35, description: "Consistent bread sales at downtown location" }
    ]
  },
  {
    id: 6,
    name: "Deli Turkey Slices",
    category: "Deli",
    quantity: 41,
    expiryDate: futureDate(8),
    riskScore: 45,
    costPerUnit: 6.99,
    daysUntilExpiry: 8,
    imageColor: "#f59e0b",
    totalValue: 286.59,
    recommendations: [
      { type: "promote", description: "Feature in lunch combo deals with bread and cheese", expectedSales: 35, savings: 203 }
    ]
  },
  {
    id: 7,
    name: "Organic Spinach",
    category: "Produce",
    quantity: 29,
    expiryDate: futureDate(2),
    riskScore: 76,
    costPerUnit: 2.99,
    daysUntilExpiry: 2,
    imageColor: "#16a34a",
    totalValue: 86.71,
    recommendations: [
      { type: "price_cut", discount: 25, expectedSales: 24, savings: 72, description: "Quick sale strategy for leafy greens, wilts rapidly" },
      { type: "donate", organization: "Community Center", timeSlot: "1-3 PM", savings: 87, description: "Community meal prep program accepts fresh vegetables" }
    ]
  },
  {
    id: 8,
    name: "Rotisserie Chicken",
    category: "Deli",
    quantity: 12,
    expiryDate: futureDate(1),
    riskScore: 89,
    costPerUnit: 5.98,
    daysUntilExpiry: 1,
    imageColor: "#dc2626",
    totalValue: 71.76,
    recommendations: [
      { type: "price_cut", discount: 35, expectedSales: 10, savings: 60, description: "End of day chicken special, popular evening discount" },
      { type: "donate", organization: "Senior Center", timeSlot: "4-6 PM", savings: 72, description: "Daily meal program for seniors, immediate pickup available" }
    ]
  },
  {
    id: 9,
    name: "Blueberry Muffins",
    category: "Bakery",
    quantity: 36,
    expiryDate: futureDate(3),
    riskScore: 71,
    costPerUnit: 1.99,
    daysUntilExpiry: 3,
    imageColor: "#6366f1",
    totalValue: 71.64,
    recommendations: [
      { type: "price_cut", discount: 30, expectedSales: 30, savings: 54, description: "Morning special pricing for fresh bakery items" },
      { type: "promote", description: "Coffee and muffin breakfast combo promotion", expectedSales: 28, savings: 50 }
    ]
  },
  {
    id: 10,
    name: "Cheddar Cheese Block",
    category: "Dairy",
    quantity: 15,
    expiryDate: futureDate(6),
    riskScore: 52,
    costPerUnit: 4.49,
    daysUntilExpiry: 6,
    imageColor: "#f59e0b",
    totalValue: 67.35,
    recommendations: [
      { type: "promote", description: "Include in sandwich-making promotion with deli meats", expectedSales: 12, savings: 40 }
    ]
  },
  {
    id: 11,
    name: "Baby Carrots",
    category: "Produce",
    quantity: 52,
    expiryDate: futureDate(5),
    riskScore: 68,
    costPerUnit: 1.79,
    daysUntilExpiry: 5,
    imageColor: "#f97316",
    totalValue: 93.08,
    recommendations: [
      { type: "price_cut", discount: 20, expectedSales: 45, savings: 81, description: "Healthy snack promotion, good shelf life remaining" },
      { type: "relocate", store: "Store #1205", demand: "High", distance: "2.3 miles", savings: 75, description: "High demand for healthy snacks at family-oriented location" }
    ]
  },
  {
    id: 12,
    name: "Chocolate Croissants",
    category: "Bakery",
    quantity: 24,
    expiryDate: futureDate(2),
    riskScore: 79,
    costPerUnit: 2.79,
    daysUntilExpiry: 2,
    imageColor: "#92400e",
    totalValue: 66.96,
    recommendations: [
      { type: "price_cut", discount: 35, expectedSales: 20, savings: 67, description: "Premium bakery discount for quick turnover" },
      { type: "donate", organization: "Local Food Bank", timeSlot: "Morning pickup", savings: 67, description: "Breakfast items needed for morning meal program" }
    ]
  },
  {
    id: 13,
    name: "Fresh Salmon Fillet",
    category: "Deli",
    quantity: 8,
    expiryDate: futureDate(1),
    riskScore: 94,
    costPerUnit: 12.99,
    daysUntilExpiry: 1,
    imageColor: "#f472b6",
    totalValue: 103.92,
    recommendations: [
      { type: "price_cut", discount: 40, expectedSales: 7, savings: 104, description: "Premium seafood requires immediate sale, high value item" },
      { type: "relocate", store: "Store #0987", demand: "Very High", distance: "4.1 miles", savings: 91, description: "Downtown location has higher seafood demand" }
    ]
  },
  {
    id: 14,
    name: "Romaine Lettuce",
    category: "Produce",
    quantity: 38,
    expiryDate: futureDate(4),
    riskScore: 61,
    costPerUnit: 2.29,
    daysUntilExpiry: 4,
    imageColor: "#22c55e",
    totalValue: 87.02,
    recommendations: [
      { type: "promote", description: "Salad kit promotion with dressing and toppings", expectedSales: 32, savings: 73 }
    ]
  },
  {
    id: 15,
    name: "Vanilla Ice Cream",
    category: "Frozen",
    quantity: 31,
    expiryDate: futureDate(11),
    riskScore: 35,
    costPerUnit: 3.99,
    daysUntilExpiry: 11,
    imageColor: "#fef3c7",
    totalValue: 123.69,
    recommendations: [
      { type: "promote", description: "Weekend family dessert promotion with pie and toppings", expectedSales: 25, savings: 100 }
    ]
  },
  {
    id: 16,
    name: "Amul Butter 500g",
    category: "Dairy",
    quantity: 40,
    expiryDate: futureDate(7),
    riskScore: 48,
    costPerUnit: 2.99,
    daysUntilExpiry: 7,
    imageColor: "#fde68a",
    totalValue: 119.6,
    recommendations: [
      { type: "promote", description: "Bundle with bread for breakfast combos", expectedSales: 32, savings: 60 }
    ]
  },
  {
    id: 17,
    name: "Fresh Paneer 250g",
    category: "Dairy",
    quantity: 18,
    expiryDate: futureDate(2),
    riskScore: 83,
    costPerUnit: 3.49,
    daysUntilExpiry: 2,
    imageColor: "#fef9c3",
    totalValue: 62.82,
    recommendations: [
      { type: "price_cut", discount: 30, expectedSales: 15, savings: 55, description: "Quick sale for fresh paneer before expiry" },
      { type: "donate", organization: "Community Kitchen", timeSlot: "2-4 PM", savings: 44, description: "Accepted for today's community meal prep" }
    ]
  },
  {
    id: 18,
    name: "Ground Beef 80/20",
    category: "Meat",
    quantity: 22,
    expiryDate: futureDate(2),
    riskScore: 84,
    costPerUnit: 7.49,
    daysUntilExpiry: 2,
    imageColor: "#b45309",
    totalValue: 164.78,
    recommendations: [
      { type: "price_cut", discount: 25, expectedSales: 18, savings: 135, description: "Mark down ground beef before sell-by date" },
      { type: "relocate", store: "Store #2341", demand: "High", distance: "3.5 miles", savings: 99, description: "High demand for meat at Westside location" }
    ]
  },
  {
    id: 19,
    name: "Orange Juice 1L",
    category: "Beverages",
    quantity: 55,
    expiryDate: futureDate(6),
    riskScore: 42,
    costPerUnit: 2.49,
    daysUntilExpiry: 6,
    imageColor: "#fb923c",
    totalValue: 136.95,
    recommendations: [
      { type: "promote", description: "Breakfast bundle with bread and butter", expectedSales: 40, savings: 80 }
    ]
  },
  {
    id: 20,
    name: "Haldirams Bhujia",
    category: "Snacks",
    quantity: 60,
    expiryDate: futureDate(14),
    riskScore: 22,
    costPerUnit: 1.99,
    daysUntilExpiry: 14,
    imageColor: "#eab308",
    totalValue: 119.4,
    recommendations: [
      { type: "promote", description: "Feature as store snack deal of the week", expectedSales: 50, savings: 40 }
    ]
  }
];

export const dashboardStats: Stats = {
  totalItems: 324,
  totalItemsChange: 12,
  highRiskItems: 18,
  potentialSavings: 2847,
  potentialSavingsChange: 340,
  wasteReduction: 47,
  wasteReductionPercentage: 47
};