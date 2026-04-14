const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Product = require('../models/Product');

// GET /api/stores - Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find({}, 'storeId name location stats settings');
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stores/:storeId - Get single store with products
router.get('/:storeId', async (req, res) => {
  try {
    const store = await Store.findOne({ storeId: req.params.storeId });
    if (!store) return res.status(404).json({ error: 'Store not found' });

    const products = await Product.find({ storeId: req.params.storeId }).sort({ riskScore: -1 });

    // Recalculate live stats
    const highRiskItems = products.filter(p => p.riskScore >= (store.settings?.alerts?.criticalThreshold || 80)).length;
    const potentialSavings = products
      .filter(p => p.riskScore >= 60)
      .reduce((sum, p) => {
        const bestRec = p.recommendations?.[0];
        return sum + (bestRec?.savings || Math.round(p.quantity * p.costPerUnit * 0.3));
      }, 0);

    res.json({
      ...store.toObject(),
      stats: { ...store.stats, highRiskItems, potentialSavings },
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/stores/:storeId/settings - Update store settings
router.put('/:storeId/settings', async (req, res) => {
  try {
    const store = await Store.findOneAndUpdate(
      { storeId: req.params.storeId },
      { $set: { settings: req.body, lastSynced: new Date() } },
      { new: true }
    );
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json({ message: 'Settings saved to MongoDB', settings: store.settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/stores/:storeId/stats - Update store stats
router.put('/:storeId/stats', async (req, res) => {
  try {
    const store = await Store.findOneAndUpdate(
      { storeId: req.params.storeId },
      { $set: { stats: req.body, lastSynced: new Date() } },
      { new: true }
    );
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json({ message: 'Stats updated', stats: store.stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stores/:storeId/products - Get products for store
router.get('/:storeId/products', async (req, res) => {
  try {
    const { category, riskMin, riskMax, sort } = req.query;
    let query = { storeId: req.params.storeId };
    if (category) query.category = category;
    if (riskMin || riskMax) {
      query.riskScore = {};
      if (riskMin) query.riskScore.$gte = Number(riskMin);
      if (riskMax) query.riskScore.$lte = Number(riskMax);
    }
    const sortObj = sort === 'expiry' ? { daysUntilExpiry: 1 } : { riskScore: -1 };
    const products = await Product.find(query).sort(sortObj);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/stores/:storeId/products/:productId - Update product (after action)
router.patch('/:storeId/products/:productId', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: { ...req.body, lastUpdated: new Date() } },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
