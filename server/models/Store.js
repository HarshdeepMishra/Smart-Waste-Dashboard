const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  storeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: String,
  region: String,
  manager: { type: String, default: 'Store Manager' },
  stats: {
    totalItems: { type: Number, default: 0 },
    totalItemsChange: { type: Number, default: 0 },
    highRiskItems: { type: Number, default: 0 },
    potentialSavings: { type: Number, default: 0 },
    potentialSavingsChange: { type: Number, default: 0 },
    wasteReduction: { type: Number, default: 0 },
    wasteReductionPercentage: { type: Number, default: 0 },
  },
  settings: {
    notifications: {
      criticalAlerts: { type: Boolean, default: true },
      dailyReports: { type: Boolean, default: true },
      peerInsights: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true },
    },
    display: {
      darkMode: { type: Boolean, default: false },
      compactView: { type: Boolean, default: false },
      autoRefresh: { type: Boolean, default: true },
      refreshInterval: { type: Number, default: 30 },
    },
    alerts: {
      criticalThreshold: { type: Number, default: 80 },
      warningThreshold: { type: Number, default: 60 },
      advanceNotice: { type: Number, default: 2 },
    },
  },
  lastSynced: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Store', StoreSchema);
