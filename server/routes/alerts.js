const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Product = require('../models/Product');

// GET /api/alerts?storeId=XXX - Get alerts for a store
router.get('/', async (req, res) => {
  try {
    const { storeId, resolved, limit = 50 } = req.query;
    let query = {};
    if (storeId) query.storeId = storeId;
    if (resolved !== undefined) query.resolved = resolved === 'true';

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/alerts/generate/:storeId - Auto-generate alerts from product risk scores
router.post('/generate/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { criticalThreshold = 80, warningThreshold = 60 } = req.body;

    // Get high-risk products
    const products = await Product.find({
      storeId,
      riskScore: { $gte: warningThreshold },
    }).sort({ riskScore: -1 });

    const newAlerts = [];

    for (const product of products) {
      // Check if an unresolved alert already exists for this product
      const existing = await Alert.findOne({
        storeId,
        productId: product._id,
        resolved: false,
      });

      if (!existing) {
        const alertType = product.riskScore >= criticalThreshold ? 'critical' : 'warning';
        const alert = await Alert.create({
          storeId,
          productId: product._id,
          productName: product.name,
          type: alertType,
          title: alertType === 'critical' ? '🔴 Critical Risk Alert' : '⚠️ Warning Alert',
          message: `${product.name}: ${product.quantity} units expire in ${product.daysUntilExpiry} day(s). Risk score: ${product.riskScore}%. Estimated loss: $${product.totalValue?.toFixed(2) || (product.quantity * product.costPerUnit).toFixed(2)}.`,
          riskScore: product.riskScore,
          actionRequired: 'Alerts',
        });
        newAlerts.push(alert);
      }
    }

    res.json({
      message: `Generated ${newAlerts.length} new alert(s) for ${storeId}`,
      alerts: newAlerts,
      totalActive: await Alert.countDocuments({ storeId, resolved: false }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/alerts/:alertId/resolve - Mark alert as resolved
router.patch('/:alertId/resolve', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.alertId,
      { resolved: true, resolvedAt: new Date(), resolvedBy: req.body.resolvedBy || 'Manager', unread: false },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/alerts/:alertId/read - Mark alert as read
router.patch('/:alertId/read', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.alertId, { unread: false }, { new: true });
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/alerts/count/:storeId - Get unread alert count
router.get('/count/:storeId', async (req, res) => {
  try {
    const count = await Alert.countDocuments({ storeId: req.params.storeId, unread: true });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
