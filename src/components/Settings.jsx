import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save, Cpu, Bell, Palette, Zap, Database, Check, ShieldCheck, UserCircle, Store, Mail, Upload, Loader
} from 'lucide-react';

const Settings = ({ settings, onUpdate }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [apiKey, setApiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');

    useEffect(() => {
        setLocalSettings(settings);
        const savedKey = localStorage.getItem('GEMINI_API_KEY') || "";
        setApiKey(savedKey);
    }, [settings]);

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            await onUpdate(localSettings);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (e) {
            alert("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleApiKeySave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('GEMINI_API_KEY', apiKey);
            alert('AI Key saved locally for browser fallback.');
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 2MB for DB storage)
        if (file.size > 2 * 1024 * 1024) {
            alert("Image too large. Please use an image under 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const newPhoto = reader.result;
            // Update local state immediately for preview
            setLocalSettings(prev => ({ ...prev, userPhoto: newPhoto }));

            // Auto-save photo to database immediately
            setIsSaving(true);
            try {
                await onUpdate({ userPhoto: newPhoto });
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            } catch (err) {
                console.error("Photo save failed:", err);
                alert("Failed to save photo. Try a smaller image.");
            } finally {
                setIsSaving(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const sections = [
        { id: 'profile', label: 'Admin Profile', icon: UserCircle },
        { id: 'ai', label: 'AI Engine', icon: Cpu },
        { id: 'alerts', label: 'Notifications', icon: Bell },
        { id: 'ui', label: 'Appearance', icon: Palette },
        { id: 'data', label: 'Data Lab', icon: Database },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>System Settings</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Configure the ZomaLens platform and admin identity.</p>
                </div>
                <button
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isSaving ? 0.7 : 1 }}
                >
                    {isSaving ? <Loader className="spin" size={18} /> : isSaved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save All</>}
                </button>
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

                    {/* PROFILE SECTION */}
                    {activeSection === 'profile' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionHeader
                                icon={UserCircle} color="#3b82f6"
                                title="Admin Profile"
                                desc="Manage store manager identity and branding. Photo is saved instantly on upload."
                            />

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginBottom: '3rem' }}>
                                {/* Photo Upload Box */}
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        width: '140px', height: '140px', borderRadius: '24px', overflow: 'hidden',
                                        border: '4px solid var(--primary)',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                                    }}>
                                        <img
                                            src={localSettings.userPhoto}
                                            alt="Admin"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <label style={{
                                        position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                                        background: 'var(--primary)', color: 'white',
                                        fontSize: '0.75rem', padding: '6px 12px', borderRadius: '20px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                    }}>
                                        <Upload size={14} /> Upload
                                        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                                    </label>
                                    {isSaving && (
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Loader className="spin" size={24} color="white" />
                                        </div>
                                    )}
                                </div>

                                {/* Other Fields */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={labelStyle}>Store Name</label>
                                            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                                <Store size={16} style={iconInputStyle} />
                                                <input
                                                    type="text"
                                                    style={inputStyle}
                                                    value={localSettings.storeName || ''}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, storeName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Admin Name</label>
                                            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                                <UserCircle size={16} style={iconInputStyle} />
                                                <input
                                                    type="text"
                                                    style={inputStyle}
                                                    value={localSettings.adminName || ''}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, adminName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={labelStyle}>Contact Email</label>
                                            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                                <Mail size={16} style={iconInputStyle} />
                                                <input
                                                    type="email"
                                                    style={inputStyle}
                                                    value={localSettings.adminEmail || ''}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, adminEmail: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* AI ENGINE SECTION */}
                    {activeSection === 'ai' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionHeader
                                icon={Cpu} color="#f59e0b"
                                title="AI Engine"
                                desc="Configure analysis logic and API priorities."
                            />

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={labelStyle}>Analysis Mode</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <OptionCard
                                        active={localSettings.aiMode === 'eco'}
                                        onClick={() => setLocalSettings({ ...localSettings, aiMode: 'eco' })}
                                        title="Eco Model"
                                        desc="Uses local sentiment libraries. Fast, works offline."
                                        icon={Zap}
                                    />
                                    <OptionCard
                                        active={localSettings.aiMode === 'advanced'}
                                        onClick={() => setLocalSettings({ ...localSettings, aiMode: 'advanced' })}
                                        title="Advanced LLM"
                                        desc="Uses Gemini. Recognizes sarcasm and emotions."
                                        icon={ShieldCheck}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Browser Fallback API Key</label>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="Enter Gemini API Key..."
                                        style={inputStyleRaw}
                                    />
                                    <button onClick={handleApiKeySave} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Update Key</button>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
                                    This key is used if the central server is unreachable.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* NOTIFICATIONS SECTION */}
                    {activeSection === 'alerts' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionHeader
                                icon={Bell} color="#3b82f6"
                                title="Notifications"
                                desc="Get alerted on critical customer feedback."
                            />

                            <ToggleRow
                                title="Instant Push Alerts"
                                desc="Notify when a very negative review is detected."
                                value={localSettings.notifications}
                                onChange={(val) => setLocalSettings({ ...localSettings, notifications: val })}
                            />
                        </motion.div>
                    )}

                    {/* APPEARANCE SECTION */}
                    {activeSection === 'ui' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionHeader
                                icon={Palette} color="#10b981"
                                title="Appearance"
                                desc="Customize your dashboard theme."
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <OptionCard
                                    active={localSettings.theme === 'dark'}
                                    onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                                    title="Midnight Pro"
                                    desc="Dark glassmorphism theme with neon accents."
                                    icon={Palette}
                                />
                                <OptionCard
                                    active={localSettings.theme === 'light'}
                                    onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                                    title="Solaris"
                                    desc="Clean, professional light mode with white backgrounds."
                                    icon={Zap}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* DATA LAB SECTION */}
                    {activeSection === 'data' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <SectionHeader
                                icon={Database} color="#8b5cf6"
                                title="Data Laboratory"
                                desc="Export and manage history."
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={dataCardStyle}>
                                    <div>
                                        <h4>Export Analysis</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generate a CSV report of all sentiments and keywords.</p>
                                    </div>
                                    <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}>Export CSV</button>
                                </div>
                                <div style={dataCardStyle}>
                                    <div>
                                        <h4 style={{ color: 'var(--danger)' }}>Wipe History</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Permanently delete all stored reviews from database.</p>
                                    </div>
                                    <button className="btn-primary" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Purge Data</button>
                                </div>
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

const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' };

const inputStyle = {
    width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border-glass)', borderRadius: '10px', color: 'white', outline: 'none'
};

const inputStyleRaw = {
    flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)',
    borderRadius: '10px', padding: '12px', color: 'white', outline: 'none'
};

const iconInputStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' };

const dataCardStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-glass)'
};

export default Settings;
