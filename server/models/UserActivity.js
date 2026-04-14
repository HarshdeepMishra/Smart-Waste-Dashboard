const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
  userId: { type: String, index: true },
  userName: { type: String },
  action: { 
    type: String, 
    required: true,
    enum: ['SIGN_IN', 'SIGN_OUT', 'NAVIGATE', 'STORE_SWITCH', 'AI_QUERY', 'SETTINGS_UPDATE', 'PRODUCT_VIEW'],
    index: true 
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  path: String,
  ip: String,
  deviceName: String
}, { timestamps: true });

module.exports = mongoose.model('UserActivity', UserActivitySchema);
