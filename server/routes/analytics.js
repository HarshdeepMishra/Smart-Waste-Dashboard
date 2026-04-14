const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Action = require('../models/Action');

// GET /api/analytics/:storeId - Full analytics data for a store
router.get('/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const products = await Product.find({ storeId });
    const actions = await Action.find({ storeId }).sort({ createdAt: -1 }).limit(100);

    // Category breakdown
    const categoryBreakdown = {};
    products.forEach(p => {
      if (!categoryBreakdown[p.category]) categoryBreakdown[p.category] = { count: 0, value: 0, riskItems: 0 };
      categoryBreakdown[p.category].count += p.quantity;
      categoryBreakdown[p.category].value += p.quantity * p.costPerUnit;
      if (p.riskScore >= 80) categoryBreakdown[p.category].riskItems++;
    });

    // Risk distribution
    const riskDistribution = {
      critical: products.filter(p => p.riskScore >= 80).length,
      warning: products.filter(p => p.riskScore >= 60 && p.riskScore < 80).length,
      watch: products.filter(p => p.riskScore < 60).length,
    };

    // Savings breakdown by action type
    const savingsBreakdown = { price_cut: 0, donate: 0, relocate: 0, promote: 0 };
    actions.forEach(a => { savingsBreakdown[a.actionType] = (savingsBreakdown[a.actionType] || 0) + a.estimatedSavings; });

    // Total potential savings from current inventory
    const potentialSavings = products
      .filter(p => p.riskScore >= 60)
      .reduce((sum, p) => sum + (p.recommendations?.[0]?.savings || Math.round(p.quantity * p.costPerUnit * 0.3)), 0);

    // Expiry timeline (next 7 days)
    const expiryTimeline = [];
    for (let i = 0; i <= 7; i++) {
      const dayProducts = products.filter(p => p.daysUntilExpiry === i);
      expiryTimeline.push({
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `Day ${i}`,
        count: dayProducts.length,
        value: dayProducts.reduce((sum, p) => sum + p.quantity * p.costPerUnit, 0).toFixed(2),
      });
    }

    // Recent actions summary (last 30 days)
    const recentActions = actions.slice(0, 10).map(a => ({
      action: a.actionType.replace('_', ' '),
      product: a.productName,
      savings: a.estimatedSavings,
      status: a.status,
      time: a.createdAt,
    }));

    // Top critical products (for insights)
    const topCritical = products
      .filter(p => p.riskScore >= 80)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        category: p.category,
        riskScore: p.riskScore,
        daysUntilExpiry: p.daysUntilExpiry,
        valueAtRisk: (p.quantity * p.costPerUnit).toFixed(2),
        recommendedAction: p.recommendations?.[0]?.type || 'promote',
      }));

    res.json({
      storeId,
      categoryBreakdown,
      riskDistribution,
      savingsBreakdown,
      potentialSavings,
      expiryTimeline,
      recentActions,
      topCritical,
      generatedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/analytics/action - Record an action taken
router.post('/action', async (req, res) => {
  try {
    const { storeId, productId, productName, actionType, estimatedSavings, discount, organization, destinationStore } = req.body;
    if (!storeId || !productName || !actionType) {
      return res.status(400).json({ error: 'storeId, productName, and actionType are required' });
    }

    const action = await Action.create({
      storeId, productId, productName, actionType,
      estimatedSavings: estimatedSavings || 0,
      discount, organization, destinationStore,
      status: 'completed',
    });

    // Update product risk score after action
    if (productId) {
      await Product.findByIdAndUpdate(productId, { $inc: { riskScore: -20 } });
    }

    res.json({ message: 'Action recorded in MongoDB', action });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/network/comparison - Compare all 5 Indian partner stores
router.get('/network/comparison', async (req, res) => {
  try {
    const storeIds = ['RF001', 'BB002', 'DM003', 'MM004', 'SR005'];
    const storeNames = {
      RF001: 'Reliance Fresh - Connaught Place',
      BB002: 'BigBasket Express - Koramangala',
      DM003: 'D-Mart - Bandra West',
      MM004: 'More Megastore - Salt Lake',
      SR005: "Spencer's Retail - Anna Nagar",
    };
    const comparison = await Promise.all(storeIds.map(async (storeId) => {
      const products = await Product.find({ storeId });
      const actions = await Action.find({ storeId });
      const totalSavings = actions.reduce((sum, a) => sum + (a.estimatedSavings || 0), 0);
      return {
        storeId,
        name: storeNames[storeId],
        totalProducts: products.length,
        criticalItems: products.filter(p => p.riskScore >= 80).length,
        potentialSavings: products.filter(p => p.riskScore >= 60).reduce((s, p) => s + p.quantity * p.costPerUnit * 0.3, 0),
        totalSavings,
        actionsCount: actions.length,
      };
    }));
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
