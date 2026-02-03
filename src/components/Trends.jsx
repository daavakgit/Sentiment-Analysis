import React from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const sentimentTrendData = [
    { name: 'Mon', positive: 45, negative: 12, neutral: 10 },
    { name: 'Tue', positive: 52, negative: 15, neutral: 8 },
    { name: 'Wed', positive: 48, negative: 10, neutral: 15 },
    { name: 'Thu', positive: 61, negative: 18, neutral: 5 },
    { name: 'Fri', positive: 55, negative: 25, neutral: 12 },
    { name: 'Sat', positive: 70, negative: 20, neutral: 10 },
    { name: 'Sun', positive: 65, negative: 14, neutral: 8 },
];

const categoryVolumeData = [
    { category: 'Food Quality', current: 120, previous: 95 },
    { category: 'Delivery', current: 85, previous: 110 },
    { category: 'Packaging', current: 65, previous: 40 },
    { category: 'Service', current: 45, previous: 50 },
    { category: 'Value', current: 30, previous: 25 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const Trends = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Trend Analysis</h1>
                <p style={{ color: 'var(--text-muted)' }}>Historical sentiment fluctuations and operational growth metrics.</p>
            </div>

            {/* Stats Summary Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <SummaryCard
                    title="Peak Volume Day"
                    value="Saturday"
                    subValue="70 Positive Reviews"
                    icon={Calendar}
                    color="#10b981"
                />
                <SummaryCard
                    title="Sentiment Growth"
                    value="+14.2%"
                    subValue="vs last 7 days"
                    icon={TrendingUp}
                    trend="up"
                    color="#3b82f6"
                />
                <SummaryCard
                    title="Retention Rate"
                    value="82%"
                    subValue="Customer Satisfaction"
                    icon={Users}
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
                        <TrendingUp size={20} color="var(--primary)" /> Sentiment Velocity
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={sentimentTrendData}>
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
                                <XAxis
                                    dataKey="name"
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
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
                    <h3 style={{ marginBottom: '1.5rem' }}>Category Volume Variance</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={categoryVolumeData} layout="vertical">
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
                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary)' }} /> Current Week
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }} /> Previous Week
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
                            <Brain size={24} color="var(--primary)" />
                            ZomaPredict AI Forecast
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Based on current trajectory, customer satisfaction is predicted to increase by 8% next week.
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--success)', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ArrowUpRight strokeWidth={3} /> Optimistic
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>92.4% Confidence Score</div>
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

const Brain = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v1a7 7 0 0 1-14 0v-1" /><line x1="12" y1="19" x2="12" y2="22" />
    </svg>
);

export default Trends;
