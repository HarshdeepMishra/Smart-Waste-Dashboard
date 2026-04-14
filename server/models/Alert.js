const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  storeId: { type: String, required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  type: { type: String, enum: ['critical', 'warning', 'info', 'success'], default: 'warning' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  riskScore: { type: Number, default: 0 },
  resolved: { type: Boolean, default: false },
  resolvedAt: Date,
  resolvedBy: String,
  actionRequired: String,
  unread: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
