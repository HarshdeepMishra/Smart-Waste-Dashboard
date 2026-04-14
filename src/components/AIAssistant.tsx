import React, { useState, useRef, useEffect } from 'react';
import { Send, Lightbulb, Zap, BarChart3, AlertTriangle, TrendingUp, Bot, Loader2, Sparkles } from 'lucide-react';
import { Product } from '../data/mockData';
import { StoreData } from '../data/storeData';
import { api } from '../services/api';

interface AIAssistantProps {
  products: Product[];
  stats: StoreData['stats'];
  onProductClick: (product: Product) => void;
  darkMode?: boolean;
  storeName?: string;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  products,
  stats,
  onProductClick,
  darkMode = false,
  storeName = 'Your Store'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: `Hi! I'm EcoTrack's AI Assistant powered by Groq LLM 🤖\n\nI have full visibility into **${storeName}**'s inventory:\n• **${stats.highRiskItems}** high-risk items need attention\n• **₹${stats.potentialSavings.toLocaleString()}** potential savings available\n• **${stats.wasteReduction}%** waste reduction achieved\n\nAsk me anything — I'll give you real, data-driven recommendations!`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { icon: AlertTriangle, text: `What's most urgent right now?`, color: 'text-red-400' },
    { icon: TrendingUp, text: 'How can I reduce dairy waste?', color: 'text-blue-400' },
    { icon: Zap, text: 'Show me quick wins this week', color: 'text-yellow-400' },
    { icon: BarChart3, text: 'Compare my store to top performers', color: 'text-green-400' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if backend is online
  useEffect(() => {
    api.health().then(result => {
      setBackendOnline(!!result);
    });
  }, []);

  const buildStoreContext = () => ({
    storeName,
    products: products.slice(0, 15), // Send top 15 for context
    stats,
  });

  const handleSendMessage = async (text?: string) => {
    const query = text || inputValue.trim();
    if (!query) return;

    const userMessage: Message = { role: 'user', content: query, timestamp: new Date() };
    const loadingMessage: Message = { role: 'ai', content: '...', timestamp: new Date(), isLoading: true };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Try real Groq API via backend
      const result = await api.ai.chat(query, buildStoreContext());

      const aiResponse = result?.response || generateLocalResponse(query, products, stats, storeName);

      setMessages(prev => [
        ...prev.filter(m => !m.isLoading),
        { role: 'ai', content: aiResponse, timestamp: new Date() }
      ]);
    } catch (error) {
      // Fallback to local response
      const fallback = generateLocalResponse(query, products, stats, storeName);
      setMessages(prev => [
        ...prev.filter(m => !m.isLoading),
        { role: 'ai', content: fallback, timestamp: new Date() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <Bot className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              EcoTrack AI
            </h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${backendOnline ? 'bg-green-400' : backendOnline === false ? 'bg-yellow-400' : 'bg-gray-400'}`} />
              <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {backendOnline ? 'Groq LLM Connected' : backendOnline === false ? 'Smart Fallback Mode' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
          <Sparkles className="h-3 w-3" />
          <span>llama-3.3-70b</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'ai' && (
              <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1 ${darkMode ? 'bg-blue-500/30' : 'bg-blue-100'}`}>
                <Bot className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            )}
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              message.role === 'user'
                ? darkMode ? 'bg-blue-600/40 text-white rounded-tr-sm' : 'bg-blue-500 text-white rounded-tr-sm'
                : darkMode ? 'bg-white/10 text-slate-200 rounded-tl-sm' : 'bg-white/70 text-slate-800 shadow-sm rounded-tl-sm'
            }`}>
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs opacity-70">AI is thinking...</span>
                </div>
              ) : (
                <p style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
              )}
              <p className={`text-xs mt-1 opacity-50`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (only before first user message) */}
      {messages.filter(m => m.role === 'user').length === 0 && (
        <div className="mb-4 space-y-2">
          <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            💡 Try asking:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 ${
                  darkMode ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-white/60 hover:bg-white/80 text-slate-700 shadow-sm'
                }`}
              >
                <q.icon className={`h-3.5 w-3.5 ${q.color}`} />
                <span className="truncate text-left">{q.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className={`flex items-center space-x-3 p-3 rounded-xl border ${
        darkMode ? 'bg-white/5 border-white/20' : 'bg-white/60 border-white/40 shadow-sm'
      }`}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          placeholder="Ask about waste reduction, alerts, or strategies..."
          className={`flex-1 bg-transparent outline-none text-sm ${
            darkMode ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'
          }`}
          disabled={isLoading}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className={`p-2 rounded-lg transition-all ${
            inputValue.trim() && !isLoading
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:scale-105'
              : darkMode ? 'bg-white/10 text-slate-500' : 'bg-slate-100 text-slate-400'
          }`}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

// Context-aware local fallback (used when backend is offline)
function generateLocalResponse(query: string, products: Product[], stats: any, storeName: string): string {
  const lower = query.toLowerCase();
  const criticalItems = products.filter(p => p.riskScore >= 80).sort((a, b) => b.riskScore - a.riskScore);
  const topItem = criticalItems[0];

  if (lower.includes('urgent') || lower.includes('critical') || lower.includes('immediate') || lower.includes('now')) {
    if (topItem) {
      return `🚨 Most urgent at ${storeName}:\n\n**${topItem.name}** — ${topItem.riskScore}% risk score, expires in ${topItem.daysUntilExpiry} day(s).\n${topItem.quantity} units worth ₹${(topItem.quantity * topItem.costPerUnit).toFixed(2)} at stake.\n\nRecommend: ${topItem.riskScore >= 90 ? '40% markdown immediately' : '30% price reduction + donation option'}\n\n${criticalItems.length > 1 ? `Plus ${criticalItems.length - 1} other critical items need attention.` : ''}`;
    }
    return `No critical items right now! 🎉 ${storeName} is in good shape. Review the watch list to stay ahead.`;
  }
  if (lower.includes('dairy') || lower.includes('milk') || lower.includes('yogurt') || lower.includes('paneer')) {
    const dairy = products.filter(p => p.category === 'Dairy' && p.riskScore >= 60);
    return `Dairy situation at ${storeName}:\n\n${dairy.length} dairy products at elevated risk. Best strategy: 25-30% markdown on items with 2 days or less. Bundle with bread/cereal for breakfast deals — historically 80% sell-through rate.\n\nIf items expire within 24h, call Local Food Bank for same-day pickup and claim full tax deduction (recovers ~70% of value).`;
  }
  if (lower.includes('waste') || lower.includes('reduc') || lower.includes('improv')) {
    return `${storeName} is at ${stats.wasteReduction}% waste reduction. Here's how to improve:\n\n1️⃣ Morning produce markdowns (6-9 AM) → +60% sell-through\n2️⃣ Weekend bundle promotions → reduces end-of-week waste by 35%\n3️⃣ Store-to-store transfers for low-risk high-value items\n\nTop performer Store #1205 hits 67% using structured donation partnerships. You could match that within 30 days.`;
  }
  if (lower.includes('peer') || lower.includes('network') || lower.includes('other') || lower.includes('compare')) {
    return `Network comparison:\n\n🥇 Store #1205: 67% waste reduction (best in network)\n🥈 Store #5678: 52% \n🥉 ${storeName}: ${stats.wasteReduction}%\n📊 Store #0987: 41%\n📊 Store #2341: 38%\n\nGap analysis: ${storeName} can close distance to #1205 by adopting their weekday donation strategy and early-morning markdown schedule.`;
  }
  if (lower.includes('saving') || lower.includes('money') || lower.includes('revenue')) {
    return `💰 Savings opportunity at ${storeName}:\n\nCurrent potential: ₹${stats.potentialSavings.toLocaleString()}\n\nBreakdown:\n• Price reductions: ~44% of savings\n• Donation tax benefits: ~31%\n• Store transfers: ~18%\n• Promotions: ~7%\n\nImplementing all ${stats.highRiskItems} critical alerts today could recover most of that in the next 24 hours.`;
  }
  return `I can help with:\n\n🔴 Urgent risk alerts and actions\n📊 Category-specific strategies (produce, dairy, bakery)\n🤝 Network benchmark comparisons\n💰 Revenue recovery calculations\n\nWhat specific challenge can I help you solve at ${storeName}?`;
}

export default AIAssistant;
