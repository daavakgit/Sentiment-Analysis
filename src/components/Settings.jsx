import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Key, Save, Trash2, ExternalLink, ShieldAlert, Cpu, Bell,
    Palette, Zap, Database, Globe, Sliders, Check, ShieldCheck
} from 'lucide-react';

const Settings = () => {
    const [apiKey, setApiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    // New States for expanded settings
    const [aiMode, setAiMode] = useState('advanced'); // eco, advanced
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [threshold, setThreshold] = useState(0.4);
    const [uiBlur, setUiBlur] = useState(true);
    const [autoReply, setAutoReply] = useState(false);
    const [activeSection, setActiveSection] = useState('ai');

    useEffect(() => {
        const savedKey = localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;
        if (savedKey) {
            setApiKey(savedKey);
            setIsSaved(true);
        }
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('GEMINI_API_KEY', apiKey);
            setIsSaved(true);
            alert('Settings synchronized successfully!');
        }
    };

    const handleClear = () => {
        localStorage.removeItem('GEMINI_API_KEY');
        setApiKey('');
        setIsSaved(false);
    };

    const sections = [
        { id: 'ai', label: 'AI Engine', icon: Cpu },
        { id: 'alerts', label: 'Notifications', icon: Bell },
        { id: 'ui', label: 'Appearance', icon: Palette },
        { id: 'data', label: 'Data Lab', icon: Database },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>System Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Tailor the ZomaLens intelligence and interface to your workflow.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>

                {/* Sidebar Nav */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {sections.map(s => {
                        const Icon = s.icon;
                        const isActive = activeSection === s.id;
                        return (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                                    background: isActive ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                    border: '1px solid',
                                    borderColor: isActive ? 'rgba(var(--primary-rgb), 0.2)' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                    cursor: 'pointer', textAlign: 'left', fontWeight: isActive ? 600 : 400,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Icon size={18} /> {s.label}
                            </button>
                        )
                    })}
                </div>

                {/* Content Area */}
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', minHeight: '500px' }}>

                    {/* AI ENGINE SECTION */}
                    {activeSection === 'ai' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionHeader
                                icon={Cpu} color="#f59e0b"
                                title="AI Core Configuration"
                                desc="Manage how large language models process your reviews."
                            />

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={labelStyle}>Deployment Mode</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <OptionCard
                                        active={aiMode === 'eco'}
                                        onClick={() => setAiMode('eco')}
                                        title="Eco Mode"
                                        desc="Local browser-based analysis. Low latency, zero tokens."
                                        icon={Zap}
                                    />
                                    <OptionCard
                                        active={aiMode === 'advanced'}
                                        onClick={() => setAiMode('advanced')}
                                        title="Advanced"
                                        desc="Gemini 1.5 Pro. High reasoning, sarcasm detection."
                                        icon={ShieldCheck}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={labelStyle}>API Architecture (Serverless)</label>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="Enter Gemini API Key..."
                                        style={inputStyle}
                                    />
                                    {isSaved ? (
                                        <button onClick={handleClear} className="btn-primary" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                                            Reset
                                        </button>
                                    ) : (
                                        <button onClick={handleSave} className="btn-primary">Save</button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* NOTIFICATIONS SECTION */}
                    {activeSection === 'alerts' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionHeader
                                icon={Bell} color="#3b82f6"
                                title="Real-time Alerts"
                                desc="Stay ahead of critical customer dissatisfaction."
                            />

                            <ToggleRow
                                title="Push Notifications"
                                desc="Receive browser alerts when a critical issue is detected."
                                value={alertsEnabled}
                                onChange={setAlertsEnabled}
                            />

                            <div style={{ marginTop: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Crisis Sensitivity Threshold</label>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{Math.round(threshold * 100)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="1" step="0.1"
                                    value={threshold}
                                    onChange={(e) => setThreshold(e.target.value)}
                                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                                />
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Notifications will trigger for scores below this level (Negative sentiment intensity).
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* APPEARANCE SECTION */}
                    {activeSection === 'ui' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionHeader
                                icon={Palette} color="#10b981"
                                title="Visual Interface"
                                desc="Optimize the dashboard for your system's performance."
                            />

                            <ToggleRow
                                title="Glassmorphism Effects"
                                desc="Enable high-quality background blurs and noise overlays."
                                value={uiBlur}
                                onChange={setUiBlur}
                            />

                            <ToggleRow
                                title="Auto-Reply Suggestions"
                                desc="Show AI-generated response drafts in the review list."
                                value={autoReply}
                                onChange={setAutoReply}
                            />
                        </motion.div>
                    )}

                    {/* DATA LAB SECTION */}
                    {activeSection === 'data' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionHeader
                                icon={Database} color="#8b5cf6"
                                title="Data Laboratory"
                                desc="Export findings and manage your analysis history."
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                                <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}>
                                    Export CSV Report
                                </button>
                                <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}>
                                    Clear Local Cache
                                </button>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ icon: Icon, title, desc, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ padding: '12px', background: `${color}15`, borderRadius: '14px', color: color }}>
            <Icon size={24} />
        </div>
        <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>{title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{desc}</p>
        </div>
    </div>
);

const OptionCard = ({ active, title, desc, icon: Icon, onClick }) => (
    <div
        onClick={onClick}
        style={{
            padding: '1.5rem', borderRadius: '16px', cursor: 'pointer',
            background: active ? 'rgba(var(--primary-rgb), 0.05)' : 'rgba(0,0,0,0.2)',
            border: '2px solid',
            borderColor: active ? 'var(--primary)' : 'var(--border-glass)',
            transition: 'all 0.3s'
        }}
    >
        <Icon size={20} color={active ? 'var(--primary)' : 'var(--text-muted)'} style={{ marginBottom: '1rem' }} />
        <div style={{ fontWeight: '700', marginBottom: '0.5rem', color: active ? 'white' : '#888' }}>{title}</div>
        <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>{desc}</div>
    </div>
);

const ToggleRow = ({ title, desc, value, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{desc}</div>
        </div>
        <div
            onClick={() => onChange(!value)}
            style={{
                width: '50px', height: '26px', borderRadius: '20px',
                background: value ? 'var(--primary)' : '#333',
                cursor: 'pointer', position: 'relative', transition: '0.3s'
            }}
        >
            <motion.div
                animate={{ x: value ? 26 : 2 }}
                style={{
                    width: '22px', height: '22px', borderRadius: '50%', background: 'white',
                    position: 'absolute', top: '2px'
                }}
            />
        </div>
    </div>
);

const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#eee', textTransform: 'uppercase', letterSpacing: '1px' };

const inputStyle = {
    flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)',
    borderRadius: '8px', padding: '12px', color: 'white', outline: 'none', fontFamily: 'monospace'
};

export default Settings;
