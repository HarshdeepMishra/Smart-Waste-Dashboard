const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  storeId: { type: String, required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  actionType: { type: String, enum: ['price_cut', 'donate', 'relocate', 'promote'], required: true },
  status: { type: String, enum: ['pending', 'active', 'completed', 'failed'], default: 'completed' },
  estimatedSavings: { type: Number, default: 0 },
  actualSavings: { type: Number, default: 0 },
  discount: Number,
  organization: String,
  destinationStore: String,
  notes: String,
  implementedBy: { type: String, default: 'Store Manager' },
}, { timestamps: true });

module.exports = mongoose.model('Action', ActionSchema);
