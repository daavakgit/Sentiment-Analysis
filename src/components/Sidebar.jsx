import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, MessageSquare, TrendingUp, Settings, LogOut, UtensilsCrossed, Brain } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const [serverStatus, setServerStatus] = useState('offline');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/health');
                if (res.ok) setServerStatus('online');
                else setServerStatus('offline');
            } catch (e) {
                setServerStatus('offline');
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'live-ai', icon: Brain, label: 'AI Analyzer' },
        { id: 'reviews', icon: MessageSquare, label: 'Reviews' },
        { id: 'trends', icon: TrendingUp, label: 'Trends' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="sidebar glass-panel" style={{
            width: '280px',
            height: '100vh',
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="brand"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3.5rem' }}
            >
                <div style={{
                    width: '42px',
                    height: '42px',
                    background: 'var(--primary)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.2)'
                }}>
                    <UtensilsCrossed size={22} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.5px' }}>ZomaLens</h2>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>Analytics Hub</span>
                </div>
            </motion.div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + (index * 0.05) }}
                            onClick={() => setActiveTab(item.id)}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                background: isActive ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                border: 'none',
                                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                                borderRadius: '0 12px 12px 0',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                textAlign: 'left',
                                fontSize: '0.95rem',
                                fontWeight: isActive ? 600 : 400
                            }}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            {item.label}
                        </motion.button>
                    );
                })}
            </nav>

            <div style={{ padding: '8px 16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: serverStatus === 'online' ? 'var(--success)' : 'var(--danger)', boxShadow: serverStatus === 'online' ? '0 0 10px var(--success)' : 'none' }} />
                Server: <span style={{ color: serverStatus === 'online' ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>{serverStatus.toUpperCase()}</span>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="user-profile"
                style={{
                    marginTop: 'auto',
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}
            >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(45deg, #222, #444)', border: '1px solid var(--border-glass)' }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Admin</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Store Manager</div>
                </div>
                <LogOut size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
            </motion.div>
        </div>
    );
};

export default Sidebar;
