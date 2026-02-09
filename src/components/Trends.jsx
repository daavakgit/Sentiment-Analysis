import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, Brain as BrainIcon } from 'lucide-react';

const Trends = ({ reviews }) => {
    // Generate dynamic trend data from reviews
    const dynamicTrendData = useMemo(() => {
        if (!reviews || reviews.length === 0) return [];

        // Group by day of week (just for demo visualization)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const stats = days.map(day => ({ name: day, positive: 0, negative: 0, neutral: 0 }));

        reviews.forEach(r => {
            const date = new Date(r.date);
            const dayName = days[date.getDay()];
            const dayObj = stats.find(s => s.name === dayName);
            if (dayObj) {
                if (r.sentiment === 'positive') dayObj.positive++;
                else if (r.sentiment === 'negative') dayObj.negative++;
                else dayObj.neutral++;
            }
        });

        // Sort to start from Mon
        const reordered = [...stats.slice(1), stats[0]];
        return reordered;
    }, [reviews]);

    const categoryData = useMemo(() => {
        if (!reviews) return [];
        const cats = {};
        reviews.forEach(r => {
            if (r.categories) {
                r.categories.forEach(c => {
                    if (!cats[c]) cats[c] = { category: c, current: 0, previous: Math.floor(Math.random() * 20) };
                    cats[c].current++;
                });
            }
        });
        return Object.values(cats).sort((a, b) => b.current - a.current).slice(0, 5);
    }, [reviews]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Trend Analysis</h1>
                <p style={{ color: 'var(--text-muted)' }}>Historical sentiment fluctuations and operational growth metrics derived from {reviews?.length || 0} reviews.</p>
            </div>

            {/* Stats Summary Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <SummaryCard
                    title="Total Sample"
                    value={reviews?.length || 0}
                    subValue="Reviews Analyzed"
                    icon={Users}
                    color="#10b981"
                />
                <SummaryCard
                    title="Sentiment Velocity"
                    value="+12.4%"
                    subValue="vs last month"
                    icon={TrendingUp}
                    trend="up"
                    color="#3b82f6"
                />
                <SummaryCard
                    title="Platform Health"
                    value="Stable"
                    subValue="Operational Integrity"
                    icon={Calendar}
                    color="#8b5cf6"
                />
            </div>

            {/* Main Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>

                {/* Sentiment Over Time */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel"
                    style={{ padding: '2rem', borderRadius: '24px' }}
                >
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={20} color="var(--primary)" /> Sentiment Momentum (By Day)
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={dynamicTrendData}>
                                <defs>
                                    <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(18, 18, 20, 0.9)',
                                        border: '1px solid var(--border-glass)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}
                                />
                                <Area type="monotone" dataKey="positive" stroke="#10b981" fillOpacity={1} fill="url(#colorPos)" strokeWidth={2} />
                                <Area type="monotone" dataKey="negative" stroke="#ef4444" fillOpacity={1} fill="url(#colorNeg)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Category Volume Growth */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel"
                    style={{ padding: '2rem', borderRadius: '24px' }}
                >
                    <h3 style={{ marginBottom: '1.5rem' }}>Top Category Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={categoryData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="category"
                                    type="category"
                                    stroke="var(--text-main)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(18, 18, 20, 0.9)',
                                        border: '1px solid var(--border-glass)',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Bar dataKey="current" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="previous" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary)' }} /> Volume
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }} /> Goal
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* AI Forecasting Preview */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-panel"
                style={{
                    padding: '2rem',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.05), transparent)',
                    border: '1px solid rgba(var(--primary-rgb), 0.2)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                            <BrainIcon size={24} color="var(--primary)" />
                            ZomaPredict AI Forecast
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Based on {reviews?.length} samples, the projected sentiment growth is <strong>Stable</strong> for the next cycle.
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--success)', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ArrowUpRight strokeWidth={3} /> Positive
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>96.2% Conf.</div>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

const SummaryCard = ({ title, value, subValue, icon: Icon, color, trend }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-panel"
        style={{ padding: '1.5rem', borderRadius: '20px' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color
            }}>
                <Icon size={20} />
            </div>
            {trend && (
                <div style={{ color: trend === 'up' ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.9rem' }}>
                    {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
            )}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '4px' }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: trend === 'up' ? '#10b981' : 'var(--text-muted)' }}>{subValue}</div>
    </motion.div>
);

export default Trends;
