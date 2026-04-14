import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import CommandCenter from './components/CommandCenter';
import RiskMonitor from './components/RiskMonitor';
import TabContent from './components/TabContent';
import RecommendationModal from './components/RecommendationModal';
import NotificationPanel from './components/NotificationPanel';
import SettingsPanel from './components/SettingsPanel';
import ProfilePanel from './components/ProfilePanel';
import Toast from './components/Toast';
import LandingPage from './components/LandingPage';
import { storeDataMap, StoreData, STORE_LIST } from './data/storeData';
import { Product } from './data/mockData';
import { api } from './services/api';

interface AuthUser { name: string; email: string; role: string; token: string; }

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('ecotrack_user');
      const token = localStorage.getItem('ecotrack_token');
      return stored && token ? { ...JSON.parse(stored), token } : null;
    } catch { return null; }
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedStore, setSelectedStore] = useState(STORE_LIST[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentStoreData, setCurrentStoreData] = useState<StoreData>(storeDataMap[STORE_LIST[0]]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning'; isVisible: boolean }>({ message: '', type: 'info', isVisible: false });

  // Activity Logging Helper
  const logUserAction = (action: string, details: any = {}) => {
    if (!authUser) return;
    api.analytics.logActivity({
      userId: authUser.email,
      userName: authUser.name,
      action,
      details,
      path: window.location.pathname
    });
  };

  // Auth handlers
  const handleAuth = (user: AuthUser) => {
    setAuthUser(user);
    // Explicitly log sign in (using user object directly as authUser might not be updated yet)
    api.analytics.logActivity({
      userId: user.email,
      userName: user.name,
      action: 'SIGN_IN',
      details: { timestamp: new Date() }
    });
  };

  const handleSignOut = () => {
    logUserAction('SIGN_OUT');
    localStorage.removeItem('ecotrack_token');
    localStorage.removeItem('ecotrack_user');
    setAuthUser(null);
    setShowProfile(false);
  };

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Store change
  useEffect(() => {
    const data = storeDataMap[selectedStore];
    if (data) {
      setCurrentStoreData(data);
      setToast({ message: `Switched to ${selectedStore}`, type: 'info', isVisible: true });
      logUserAction('STORE_SWITCH', { storeId: data.id, storeName: selectedStore });
    }
  }, [selectedStore]);

  // Tab change
  useEffect(() => {
    logUserAction('NAVIGATE', { tabName: activeTab });
  }, [activeTab]);

  // Dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (currentStoreData.settings.display.darkMode) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb';
      document.body.style.color = '#111827';
    }
  }, [currentStoreData.settings.display.darkMode]);

  // Auto-refresh
  useEffect(() => {
    if (!currentStoreData.settings.display.autoRefresh) return;
    const interval = currentStoreData.settings.display.refreshInterval * 1000;
    const timer = setInterval(() => {
      setCurrentStoreData(prev => {
        const updated = {
          ...prev,
          stats: {
            ...prev.stats,
            totalItems: prev.stats.totalItems + Math.floor(Math.random() * 3) - 1,
            potentialSavings: Math.max(0, prev.stats.potentialSavings + Math.floor(Math.random() * 200) - 100),
            highRiskItems: Math.max(0, prev.stats.highRiskItems + Math.floor(Math.random() * 2) - 1),
          },
          products: prev.products.map(p => ({
            ...p,
            quantity: Math.max(0, p.quantity + Math.floor(Math.random() * 2) - 1),
            riskScore: Math.min(100, Math.max(0, p.riskScore + Math.floor(Math.random() * 3) - 1)),
          })),
        };
        storeDataMap[selectedStore] = updated;
        return updated;
      });
      if (currentStoreData.settings.notifications.systemUpdates) {
        setToast({ message: `${selectedStore}: Inventory data updated`, type: 'info', isVisible: true });
      }
    }, interval);
    return () => clearInterval(timer);
  }, [currentStoreData.settings.display.autoRefresh, currentStoreData.settings.display.refreshInterval, selectedStore, currentStoreData.settings.notifications.systemUpdates]);

  // Critical alerts
  useEffect(() => {
    if (!currentStoreData.settings.notifications.criticalAlerts) return;
    const timer = setInterval(() => {
      const critical = currentStoreData.products.filter(p => p.riskScore >= currentStoreData.settings.alerts.criticalThreshold);
      if (critical.length > 0) {
        const p = critical[Math.floor(Math.random() * critical.length)];
        setToast({ message: `${selectedStore}: 🔴 ${p.name} needs immediate attention! (Risk: ${p.riskScore}%)`, type: 'warning', isVisible: true });
      }
    }, 90000);
    return () => clearInterval(timer);
  }, [selectedStore, currentStoreData.settings, currentStoreData.products]);

  // Peer insights
  useEffect(() => {
    if (!currentStoreData.settings.notifications.peerInsights) return;
    const insights = [
      'BigBasket Express - Koramangala achieved 71% waste reduction using Akshaya Patra donation strategy',
      "Spencer's Retail - Anna Nagar improved seafood sales with 40% discount timing",
      'Network coordination saved ₹18,340 across all 5 stores last week',
      'Best practice: Weekend produce bundles showing 85% success rate at D-Mart - Bandra West',
      'Reliance Fresh - Connaught Place reduced dairy waste by 45% with smart pricing',
      'Morning bakery discounts increase sell-through by 60% (network average)',
    ];
    const timer = setInterval(() => {
      const insight = insights[Math.floor(Math.random() * insights.length)];
      setToast({ message: `💡 Peer Insight: ${insight}`, type: 'info', isVisible: true });
    }, 180000);
    return () => clearInterval(timer);
  }, [currentStoreData.settings.notifications.peerInsights]);

  const addRecentActivity = (action: string, productName?: string) => {
    const entry = { action, store: selectedStore, time: 'Just now', timestamp: new Date(), productName };
    const updated = { ...currentStoreData, recentActivity: [entry, ...(currentStoreData.recentActivity || [])].slice(0, 15) };
    setCurrentStoreData(updated);
    storeDataMap[selectedStore] = updated;
  };

  const addNotification = (type: 'warning' | 'success' | 'info', title: string, message: string, actionRequired?: string) => {
    const n = { id: Date.now(), type, title, message, time: 'Just now', timestamp: new Date(), unread: true, actionRequired, storeId: selectedStore };
    const updated = { ...currentStoreData, notifications: [n, ...currentStoreData.notifications] };
    setCurrentStoreData(updated);
    storeDataMap[selectedStore] = updated;
  };

  const markNotificationAsRead = (id: number) => {
    const updated = { ...currentStoreData, notifications: currentStoreData.notifications.map(n => n.id === id ? { ...n, unread: false } : n) };
    setCurrentStoreData(updated);
    storeDataMap[selectedStore] = updated;
  };

  const handleSettingsUpdate = async (newSettings: any) => {
    const updated = { ...currentStoreData, settings: newSettings };
    setCurrentStoreData(updated);
    storeDataMap[selectedStore] = updated;
    // Persist to MongoDB
    await api.stores.updateSettings(currentStoreData.id, newSettings);
    setToast({ message: `Settings saved to MongoDB for ${selectedStore}`, type: 'success', isVisible: true });
  };

  const handleActionTaken = async (action: string) => {
    const product = selectedProduct;
    let message = '';
    let savingsIncrease = 0;
    let actionDesc = '';

    switch (action) {
      case 'price_cut':
        message = `✅ Price reduction applied at ${selectedStore}! Customers are responding.`;
        actionDesc = `Applied ${product?.recommendations?.[0]?.discount || 30}% price reduction for ${product?.name}`;
        savingsIncrease = product?.recommendations?.find(r => r.type === 'price_cut')?.savings || Math.floor(Math.random() * 3000 + 500);
        break;
      case 'donate':
        const org = product?.recommendations?.find(r => r.type === 'donate')?.organization || 'Akshaya Patra Foundation';
        message = `✅ Donation pickup scheduled with ${org}!`;
        actionDesc = `Scheduled donation pickup with ${org} for ${product?.name}`;
        savingsIncrease = product?.recommendations?.find(r => r.type === 'donate')?.savings || Math.floor(Math.random() * 4000 + 800);
        break;
      case 'relocate':
        const dest = product?.recommendations?.find(r => r.type === 'relocate')?.store || 'partner store';
        message = `✅ Transfer request sent to ${dest}!`;
        actionDesc = `Initiated transfer of ${product?.name} to ${dest}`;
        savingsIncrease = product?.recommendations?.find(r => r.type === 'relocate')?.savings || Math.floor(Math.random() * 3500 + 600);
        break;
      case 'promote':
        message = `✅ Promotion activated for ${product?.name}! Featured in displays.`;
        actionDesc = `Activated weekend promotion for ${product?.name}`;
        savingsIncrease = product?.recommendations?.find(r => r.type === 'promote')?.savings || Math.floor(Math.random() * 2000 + 400);
        break;
      default:
        message = `✅ Action completed for ${product?.name}`;
        actionDesc = `Completed action for ${product?.name}`;
        savingsIncrease = Math.floor(Math.random() * 1000 + 200);
    }

    addRecentActivity(actionDesc, product?.name);
    addNotification('success', '✅ Strategy Implemented', `${actionDesc} — Expected recovery: ₹${savingsIncrease.toLocaleString('en-IN')}`, 'Dashboard');
    setToast({ message, type: 'success', isVisible: true });

    // Track to MongoDB
    await api.analytics.recordAction({
      storeId: currentStoreData.id,
      productName: product?.name || 'Unknown',
      actionType: action,
      estimatedSavings: savingsIncrease,
      discount: action === 'price_cut' ? (product?.recommendations?.[0]?.discount || 30) : undefined,
      organization: action === 'donate' ? (product?.recommendations?.find(r => r.type === 'donate')?.organization) : undefined,
      destinationStore: action === 'relocate' ? (product?.recommendations?.find(r => r.type === 'relocate')?.store) : undefined,
    });

    // Update local stats
    const updatedStoreData = {
      ...currentStoreData,
      stats: {
        ...currentStoreData.stats,
        potentialSavings: currentStoreData.stats.potentialSavings + savingsIncrease,
        highRiskItems: Math.max(0, currentStoreData.stats.highRiskItems - 1),
        potentialSavingsChange: currentStoreData.stats.potentialSavingsChange + savingsIncrease,
      },
      products: currentStoreData.products.map(p =>
        p.id === product?.id ? { ...p, riskScore: Math.max(0, p.riskScore - 25) } : p
      ),
    };
    setCurrentStoreData(updatedStoreData);
    storeDataMap[selectedStore] = updatedStoreData;
  };

  // KPI card navigation handler
  const handleKPINavigate = (kpi: string) => {
    switch (kpi) {
      case 'items': setActiveTab('Analytics'); break;
      case 'critical': setActiveTab('Alerts'); break;
      case 'savings': setActiveTab('Analytics'); break;
      case 'waste': setActiveTab('Analytics'); break;
    }
    setToast({ message: `Opening detailed view for ${kpi === 'critical' ? 'Risk Monitor' : 'Analytics'}`, type: 'info', isVisible: true });
  };

  if (!authUser) {
    return <LandingPage onAuth={handleAuth} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentStoreData.settings.display.darkMode ? 'dark' : 'light'}`}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onSettingsClick={() => { setShowSettings(true); setShowNotifications(false); setShowProfile(false); }} darkMode={currentStoreData.settings.display.darkMode} />

      <TopNav
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
        onNotificationClick={() => { setShowNotifications(true); setShowSettings(false); setShowProfile(false); }}
        onProfileClick={() => { setShowProfile(true); setShowNotifications(false); setShowSettings(false); }}
        notificationCount={currentStoreData.notifications.filter(n => n.unread).length}
        darkMode={currentStoreData.settings.display.darkMode}
        products={currentStoreData.products}
        onProductClick={p => setSelectedProduct(p)}
        onTabChange={setActiveTab}
        userName={authUser.name}
      />

      <main className="fixed left-20 top-20 right-0 bottom-0 overflow-auto">
        <div className="container mx-auto px-8 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${currentStoreData.settings.display.darkMode ? 'text-white' : 'text-slate-900'}`}>
              {activeTab === 'Dashboard' ? 'Command Center' : activeTab === 'Alerts' ? 'Risk Monitor' : (activeTab === 'Analytics' || activeTab === 'Insights') ? 'Insights Lab' : 'AI Assistant'}
            </h1>
          </div>

          {activeTab === 'Dashboard' && (
            <CommandCenter
              stats={currentStoreData.stats}
              products={currentStoreData.products}
              onProductClick={p => setSelectedProduct(p)}
              storeName={selectedStore}
              darkMode={currentStoreData.settings.display.darkMode}
              alertThresholds={currentStoreData.settings.alerts}
              onKPINavigate={handleKPINavigate}
            />
          )}

          {activeTab === 'Alerts' && (
            <RiskMonitor
              products={currentStoreData.products}
              stats={currentStoreData.stats}
              onProductClick={p => setSelectedProduct(p)}
              darkMode={currentStoreData.settings.display.darkMode}
              alertThresholds={currentStoreData.settings.alerts}
            />
          )}

          {activeTab === 'AI' && (
            <AIAssistant
              products={currentStoreData.products}
              stats={currentStoreData.stats}
              onProductClick={p => setSelectedProduct(p)}
              darkMode={currentStoreData.settings.display.darkMode}
              storeName={selectedStore}
              user={authUser}
            />
          )}

          {(activeTab === 'Analytics' || activeTab === 'Insights') && (
            <TabContent
              activeTab={activeTab}
              stats={currentStoreData.stats}
              products={currentStoreData.products}
              onProductClick={p => setSelectedProduct(p)}
              storeName={selectedStore}
              compactView={currentStoreData.settings.display.compactView}
              darkMode={currentStoreData.settings.display.darkMode}
              alertThresholds={currentStoreData.settings.alerts}
            />
          )}
        </div>
      </main>

      <RecommendationModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onActionTaken={handleActionTaken} darkMode={currentStoreData.settings.display.darkMode} />

      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} notifications={currentStoreData.notifications} storeName={selectedStore} darkMode={currentStoreData.settings.display.darkMode}
        onNotificationClick={(actionRequired, id) => { if (id) markNotificationAsRead(id); if (actionRequired) { setActiveTab(actionRequired); setShowNotifications(false); } }} />

      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} settings={currentStoreData.settings} onSettingsUpdate={handleSettingsUpdate} storeName={selectedStore} darkMode={currentStoreData.settings.display.darkMode} />

      <ProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} currentStore={selectedStore} darkMode={currentStoreData.settings.display.darkMode} recentActivity={currentStoreData.recentActivity || []}
        userName={authUser.name} userEmail={authUser.email}
        onQuickAction={action => { if (action === 'analytics') setActiveTab('Analytics'); if (action === 'alerts') setActiveTab('Alerts'); if (action === 'insights') setActiveTab('Insights'); if (action === 'settings') setShowSettings(true); setShowProfile(false); }}
        onSignOut={handleSignOut}
      />

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={() => setToast(p => ({ ...p, isVisible: false }))} darkMode={currentStoreData.settings.display.darkMode} />
    </div>
  );
}

export default App;