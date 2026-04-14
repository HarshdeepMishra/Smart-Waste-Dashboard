const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  type: { type: String, enum: ['price_cut', 'donate', 'relocate', 'promote'], required: true },
  discount: Number,
  expectedSales: Number,
  savings: Number,
  organization: String,
  timeSlot: String,
  store: String,
  demand: String,
  distance: String,
  description: String,
});

const ProductSchema = new mongoose.Schema({
  storeId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Produce', 'Dairy', 'Bakery', 'Deli', 'Meat', 'Frozen', 'Beverages', 'Snacks'], required: true },
  quantity: { type: Number, required: true, min: 0 },
  expiryDate: { type: String, required: true },
  riskScore: { type: Number, min: 0, max: 100, default: 0 },
  costPerUnit: { type: Number, required: true },
  daysUntilExpiry: { type: Number, default: 0 },
  imageColor: { type: String, default: '#6b7280' },
  totalValue: { type: Number, default: 0 },
  recommendations: [RecommendationSchema],
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

// Auto-calculate totalValue before save
ProductSchema.pre('save', function (next) {
  this.totalValue = parseFloat((this.quantity * this.costPerUnit).toFixed(2));
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  this.daysUntilExpiry = Math.max(0, Math.ceil((expiry - today) / (1000 * 60 * 60 * 24)));
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
