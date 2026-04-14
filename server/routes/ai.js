const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Network context — only ever reference these 5 stores
const NETWORK_STORES = [
  { id: 'RF001', name: 'Reliance Fresh - Connaught Place', region: 'New Delhi', wasteReduction: 47 },
  { id: 'BB002', name: 'BigBasket Express - Koramangala', region: 'Bengaluru', wasteReduction: 67 },
  { id: 'DM003', name: 'D-Mart - Bandra West', region: 'Mumbai', wasteReduction: 41 },
  { id: 'MM004', name: 'More Megastore - Salt Lake', region: 'Kolkata', wasteReduction: 38 },
  { id: 'SR005', name: "Spencer's Retail - Anna Nagar", region: 'Chennai', wasteReduction: 52 },
];

// Historical success rates (used to pick best action)
const SUCCESS_RATES = {
  price_cut: { Produce: 85, Dairy: 80, Bakery: 75, Deli: 82, Meat: 78, Frozen: 65, Beverages: 70, Snacks: 60 },
  donate:    { Produce: 95, Dairy: 90, Bakery: 92, Deli: 88, Meat: 85, Frozen: 70, Beverages: 65, Snacks: 60 },
  relocate:  { Produce: 78, Dairy: 72, Bakery: 65, Deli: 80, Meat: 82, Frozen: 75, Beverages: 70, Snacks: 68 },
  promote:   { Produce: 65, Dairy: 58, Bakery: 72, Deli: 60, Meat: 55, Frozen: 70, Beverages: 80, Snacks: 85 },
};

function getBestAction(product) {
  if (!product) return null;
  const cat = product.category || 'Produce';
  const risk = product.riskScore || 0;
  const daysLeft = product.daysUntilExpiry || 5;

  const options = [];
  if (risk >= 70) options.push({ type: 'price_cut', rate: SUCCESS_RATES.price_cut[cat] || 75 });
  if (risk >= 80) options.push({ type: 'donate', rate: SUCCESS_RATES.donate[cat] || 85 });
  if (daysLeft > 2) options.push({ type: 'relocate', rate: SUCCESS_RATES.relocate[cat] || 70 });
  options.push({ type: 'promote', rate: SUCCESS_RATES.promote[cat] || 65 });

  options.sort((a, b) => b.rate - a.rate);
  return options[0];
}

function buildSystemPrompt(storeContext) {
  if (!storeContext) {
    return `You are EcoTrack AI, India's expert grocery waste management assistant. Always respond in Indian Rupees (₹). Only reference these 5 partner stores: ${NETWORK_STORES.map(s => s.name).join(', ')}. Never mention other stores. Provide specific, data-driven recommendations with estimated ₹ savings.`;
  }

  const { storeName, products = [], stats = {}, storeId } = storeContext;
  const criticalItems = products.filter(p => p.riskScore >= 80).sort((a, b) => b.riskScore - a.riskScore);
  const topRiskItems = criticalItems.slice(0, 5).map(p => {
    const best = getBestAction(p);
    return `• ${p.name} (${p.quantity} units, ${p.daysUntilExpiry}d to expiry, risk: ${p.riskScore}%, value: ₹${(p.quantity * p.costPerUnit).toFixed(0)}, BEST ACTION: ${best?.type.replace('_', ' ')} [${best?.rate}% success rate])`;
  }).join('\n');

  const networkContext = NETWORK_STORES.map(s =>
    s.id === storeId
      ? `★ ${s.name} [YOUR STORE] — ${stats.wasteReduction}% waste reduction`
      : `  ${s.name} — ${s.wasteReduction}% waste reduction`
  ).join('\n');

  return `You are EcoTrack AI, India's expert grocery waste management assistant for ${storeName}.

CURRENT INVENTORY STATUS:
• Total Items: ${stats.totalItems || 0}
• High-Risk Items: ${stats.highRiskItems || 0} (need immediate action)
• Potential Savings: ₹${(stats.potentialSavings || 0).toLocaleString('en-IN')}
• Waste Reduction Achieved: ${stats.wasteReduction || 0}%

TOP CRITICAL ITEMS (sorted by risk):
${topRiskItems || '• No critical items currently — great work!'}

PARTNER NETWORK (only reference these stores):
${networkContext}

HISTORICAL SUCCESS RATES FOR THIS STORE:
• Price Markdowns: 80% avg sell-through
• Food Donations (Akshaya Patra, Goonj, Robin Hood Army): 90% recovery
• Store-to-Store Transfers: 75% recovery  
• Weekend Promotions: 65% sell-through

YOUR RESPONSE RULES:
1. Always use ₹ (Indian Rupees), NEVER $ or USD
2. Only mention the 5 partner stores listed above — NEVER invent store numbers
3. Give 2-3 strategy options, then ONE clear "⭐ BEST ACTION" recommendation with % success rate from historical data
4. Quote exact product names, quantities, and ₹ amounts
5. Be concise — max 5 sentences total`;
}

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { query, storeContext } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    if (!process.env.GROQ_API_KEY) return res.json({ response: generateFallbackResponse(query, storeContext) });

    const systemPrompt = buildSystemPrompt(storeContext);
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: query }],
      temperature: 0.6,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || generateFallbackResponse(query, storeContext);
    res.json({ response, model: 'llama-3.3-70b-versatile', tokensUsed: completion.usage?.total_tokens });
  } catch (error) {
    console.error('Groq API error:', error.message);
    res.json({ response: generateFallbackResponse(req.body.query, req.body.storeContext) });
  }
});

// POST /api/ai/recommendations — single product insight + best action
router.post('/recommendations', async (req, res) => {
  try {
    const { product, storeContext } = req.body;
    if (!product) return res.status(400).json({ error: 'Product data required' });

    const best = getBestAction(product);
    const totalValue = (product.quantity * product.costPerUnit).toFixed(0);

    if (!process.env.GROQ_API_KEY) {
      return res.json({ insight: generateProductInsight(product), bestAction: best });
    }

    const prompt = `You are EcoTrack AI for ${storeContext?.storeName || 'Indian grocery store'}. Analyze and recommend ONE best action. Always use ₹. Never mention stores outside our network (${NETWORK_STORES.map(s=>s.name).join(', ')}).

Product: ${product.name} | Category: ${product.category}
Quantity: ${product.quantity} units | Days to Expiry: ${product.daysUntilExpiry}
Risk Score: ${product.riskScore}% | Price: ₹${product.costPerUnit}/unit
Total Value at Risk: ₹${totalValue}
Historical Best Action for ${product.category}: ${best?.type} (${best?.rate}% success rate)

Give ONE specific recommendation in 2 sentences max with ₹ savings figure.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 120,
    });

    res.json({ insight: completion.choices[0]?.message?.content || generateProductInsight(product), bestAction: best });
  } catch (error) {
    res.json({ insight: generateProductInsight(req.body.product), bestAction: getBestAction(req.body.product) });
  }
});

// GET /api/ai/success-rates — return historical success rates for frontend
router.get('/success-rates', (req, res) => res.json(SUCCESS_RATES));

function generateFallbackResponse(query, ctx) {
  const lower = (query || '').toLowerCase();
  const storeName = ctx?.storeName || 'your store';
  const criticalItems = (ctx?.products || []).filter(p => p.riskScore >= 80).sort((a, b) => b.riskScore - a.riskScore);
  const top = criticalItems[0];
  const savings = ctx?.stats?.potentialSavings || 0;

  if (lower.includes('urgent') || lower.includes('critical') || lower.includes('now') || lower.includes('immediate')) {
    if (top) {
      const best = getBestAction(top);
      const tv = (top.quantity * top.costPerUnit).toFixed(0);
      return `🚨 Most Urgent at ${storeName}:\n\n**${top.name}** — ${top.riskScore}% risk, expires in ${top.daysUntilExpiry} day(s)\n${top.quantity} units worth ₹${tv} at risk\n\n⭐ BEST ACTION: **${best?.type.replace('_',' ')}** (${best?.rate}% historical success rate)\nEstimated recovery: ₹${Math.round(Number(tv)*0.6).toLocaleString('en-IN')}\n\n${criticalItems.length > 1 ? `${criticalItems.length - 1} more critical items need attention next.` : ''}`;
    }
    return '✅ No critical items right now! Great store management. Keep monitoring the Risk Monitor.';
  }
  if (lower.includes('dairy') || lower.includes('milk') || lower.includes('paneer') || lower.includes('yogurt')) {
    return `Dairy strategy for ${storeName}:\n\n• 25-30% price markdown for items expiring in ≤2 days (80% success rate)\n• Bundle with bread for breakfast combos\n• Donate to Akshaya Patra Foundation for full tax deduction\n\n⭐ BEST ACTION: **Price markdown** (80% historical sell-through for dairy at Indian stores)\nExpected recovery: ~₹${Math.round(savings * 0.3).toLocaleString('en-IN')}`;
  }
  if (lower.includes('produce') || lower.includes('vegetable') || lower.includes('fruit')) {
    return `Produce strategy for ${storeName}:\n\n• 30-40% markdown for day-1 items (85% sell-through rate)\n• Morning display at store entrance for impulse buys\n• Donate unsold items to Goonj NGO (95% donation success rate)\n\n⭐ BEST ACTION: **Donate to Goonj NGO** (95% success rate for produce — highest in network)\nExpected tax recovery: ~₹${Math.round(savings * 0.4).toLocaleString('en-IN')}`;
  }
  if (lower.includes('network') || lower.includes('peer') || lower.includes('compare') || lower.includes('other store')) {
    const networkText = NETWORK_STORES.map(s => `• ${s.name} (${s.region}): ${s.wasteReduction}% waste reduction`).join('\n');
    return `Network Comparison — All 5 Partner Stores:\n\n${networkText}\n\n⭐ BEST PRACTICE: BigBasket Express - Koramangala leads at 67% using structured donation schedule + morning markdowns. Adopting their produce markdown timing could add ~8% reduction at ${storeName}.`;
  }
  return `I can help you:\n🔴 Identify urgent items → "What's critical now?"\n🥗 Reduce category waste → "How to reduce dairy waste?"\n🏪 Compare stores → "How do we compare to network?"\n💰 Maximize savings → "Best action for ₹${savings.toLocaleString('en-IN')} recovery"\n\nWhat would you like to tackle at ${storeName}?`;
}

function generateProductInsight(product) {
  if (!product) return 'No product data.';
  const best = getBestAction(product);
  const tv = (product.quantity * product.costPerUnit).toFixed(0);
  return `⭐ BEST ACTION for ${product.name}: **${best?.type.replace('_',' ')}** (${best?.rate}% historical success rate)\n${product.riskScore >= 80 ? `⚡ Urgent: ₹${tv} at risk. Act within ${product.daysUntilExpiry} day(s).` : `📊 Monitor: ₹${tv} value. ${best?.type === 'price_cut' ? 'Consider markdown soon.' : 'Schedule promotion.'}`}`;
}

module.exports = router;
