import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ReviewList from './components/ReviewList';
import LiveAnalysis from './components/LiveAnalysis';
import Hero from './components/Hero';
import Settings from './components/Settings';
import Trends from './components/Trends'; // Import Trends
import { mockReviews } from './data/mockData';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [reviews, setReviews] = useState(mockReviews);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (e) {
        console.log("Using local mock data as server is unreachable.");
      }
    };
    fetchReviews();
  }, []);

  const handleNavigate = (tab, filter = 'all') => {
    setReviewFilter(filter);
    setActiveTab(tab);
  };

  return (
    <>
      <div className="noise-overlay" />
      <div className="grid-bg" />

      <AnimatePresence mode="wait">
        {activeTab === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <Hero onStart={() => setActiveTab('dashboard')} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="layout"
          >
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="main-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {activeTab === 'dashboard' && <Dashboard reviews={reviews} onNavigate={handleNavigate} />}
                  {activeTab === 'reviews' && <ReviewList reviews={reviews} initialFilter={reviewFilter} onBack={() => handleNavigate('dashboard')} />}
                  {activeTab === 'live-ai' && <LiveAnalysis />}
                  {activeTab === 'settings' && <Settings />}
                  {activeTab === 'trends' && <Trends />}
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
