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
import Preloader from './components/Preloader';


function App() {
  const [reviews, setReviews] = useState(mockReviews);
  const [activeTab, setActiveTab] = useState('landing');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [userPhoto, setUserPhoto] = useState(
    localStorage.getItem('userPhoto') || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
  );

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);


  const handlePhotoUpdate = (newPhoto) => {
    setUserPhoto(newPhoto);
    localStorage.setItem('userPhoto', newPhoto);
  };

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

      <AnimatePresence mode="popLayout">
        {isLoading && (
          <Preloader key="loader" />
        )}

        {!isLoading && activeTab === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <Hero onStart={() => setActiveTab('dashboard')} />
          </motion.div>
        )}

        {!isLoading && activeTab !== 'landing' && (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="layout"
          >
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userPhoto={userPhoto} />

            <main className="main-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'dashboard' && <Dashboard reviews={reviews || []} onNavigate={handleNavigate} />}
                  {activeTab === 'reviews' && <ReviewList reviews={reviews || []} initialFilter={reviewFilter} onBack={() => handleNavigate('dashboard')} />}
                  {activeTab === 'live-ai' && <LiveAnalysis />}
                  {activeTab === 'settings' && <Settings userPhoto={userPhoto} onUpdatePhoto={handlePhotoUpdate} />}
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
