import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ReviewList from './components/ReviewList';
import LiveAnalysis from './components/LiveAnalysis';
import Hero from './components/Hero';
import Settings from './components/Settings';
import Trends from './components/Trends';
import Login from './components/Login';
import Preloader from './components/Preloader';

function App() {
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('landing');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userSettings, setUserSettings] = useState({
    userPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    storeName: "The Spicy Spoon",
    adminName: "Vikram Malhotra",
    theme: 'dark',
    aiMode: 'advanced',
    notifications: true
  });

  // Apply theme to document root whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', userSettings.theme);
  }, [userSettings.theme]);

  useEffect(() => {
    const storedAuth = localStorage.getItem('authToken');
    if (storedAuth) {
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [reviewsRes, settingsRes] = await Promise.all([
          fetch('/api/reviews'),
          fetch('/api/settings')
        ]);

        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          setReviews(data);
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data && Object.keys(data).length > 0) {
            setUserSettings(prev => ({ ...prev, ...data }));
          }
        }
      } catch (e) {
        console.error("Data fetch failed:", e);
      }
    };

    fetchData();
  }, [isAuthenticated, activeTab]);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', 'true');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    setActiveTab('landing');
  };

  const handleUpdateSettings = async (updates) => {
    // Optimistic update
    setUserSettings(prev => ({ ...prev, ...updates }));

    // Send to backend
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error("Failed to save settings to database");
    }

    const savedData = await response.json();
    // Update with confirmed data from server
    setUserSettings(prev => ({ ...prev, ...savedData }));
    return savedData;
  };

  const handleNavigate = (tab, filter = 'all') => {
    setReviewFilter(filter);
    setActiveTab(tab);
  };

  return (
    <>
      <div className="noise-overlay" />
      <div className="grid-bg" />

      <AnimatePresence mode="wait">

        {isLoading && (
          <motion.div key="preloader" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Preloader />
          </motion.div>
        )}

        {!isLoading && !isAuthenticated && (
          <motion.div
            key="auth-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'landing' ? (
              <Hero onStart={() => setActiveTab('login')} />
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </motion.div>
        )}

        {!isLoading && isAuthenticated && (
          <motion.div
            key="dashboard-layout"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="layout"
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userPhoto={userSettings.userPhoto}
              onLogout={handleLogout}
            />

            <main className="main-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {activeTab === 'dashboard' && <Dashboard reviews={reviews} onNavigate={handleNavigate} />}
                  {activeTab === 'reviews' && <ReviewList reviews={reviews} initialFilter={reviewFilter} onBack={() => handleNavigate('dashboard')} />}
                  {activeTab === 'live-ai' && <LiveAnalysis />}
                  {activeTab === 'settings' && <Settings settings={userSettings} onUpdate={handleUpdateSettings} />}
                  {activeTab === 'trends' && <Trends reviews={reviews} />}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}

export default App;
