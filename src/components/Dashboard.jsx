import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, MessageCircle, Star, AlertTriangle, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { calculateMetrics } from '../data/mockData';

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Pos, Neu, Neg

const Dashboard = ({ reviews, onNavigate }) => {
    const metrics = calculateMetrics(reviews);

    const sentimentOverTime = [
        { name: 'Mon', score: 40, volume: 12 },
        { name: 'Tue', score: 30, volume: 15 },
        { name: 'Wed', score: 20, volume: 8 },
        { name: 'Thu', score: 27, volume: 20 },
        { name: 'Fri', score: 18, volume: 25 },
        { name: 'Sat', score: 23, volume: 30 },
        { name: 'Sun', score: 34, volume: 28 },
    ];

    const pieData = [
        { name: 'Positive', value: metrics.positive },
        { name: 'Neutral', value: metrics.neutral },
        { name: 'Negative', value: metrics.negative },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0, scale: 0.95 },
        show: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            className="dashboard-container"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
            {/* Header */}
            <div>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time sentiment analysis for Zomato reviews.</p>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <MetricCard
                    title="Net Sentiment Score"
                    value={`${metrics.sentimentScore}%`}
                    icon={TrendingUp}
                    trend="+12%"
                    trendUp={true}
                    color="#10b981"
                />
                <MetricCard
                    title="Total Reviews"
                    value={metrics.total}
                    icon={MessageCircle}
                    trend="+5"
                    trendUp={true}
                    color="#3b82f6"
                    onClick={() => onNavigate('reviews', 'all')}
                />
                <MetricCard
                    title="Avg Rating"
                    value={metrics.avgRating}
                    icon={Star}
                    trend="-0.1"
                    trendUp={false}
                    color="#f59e0b"
                />
                <MetricCard
                    title="Critical Issues"
                    value={metrics.negative}
                    icon={AlertTriangle}
                    trend="+2"
                    trendUp={false}
                    color="#ef4444"
                    onClick={() => onNavigate('reviews', 'negative')}
                />
            </div>

            {/* Charts Section Top Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Main Chart */}
                <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', minHeight: '350px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Sentiment Trends (7 Days)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sentimentOverTime}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#666" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Category Performance */}
                <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', minHeight: '350px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Category Performance</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.categoryPerformance} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="#666" hide />
                                <YAxis dataKey="name" type="category" stroke="#888" width={100} tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="score" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>

                {/* Sentiment Distribution */}
                <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', minHeight: '300px' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Overall Sentiment</h3>
                    <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{metrics.total}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: 'auto' }}>
                        {pieData.map((entry, index) => (
                            <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index] }}></div>
                                <span style={{ color: 'var(--text-muted)' }}>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Positive Keywords */}
                <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', minHeight: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <ThumbsUp size={18} color="var(--success)" />
                        <h3 style={{ fontSize: '1.1rem' }}>What People Love</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {metrics.topPositiveKeywords.map((k, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: '#e2e2e2' }}>{k.word}</span>
                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)',
                                    fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '600'
                                }}>
                                    {k.count} mentions
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Negative Keywords */}
                <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', minHeight: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <ThumbsDown size={18} color="var(--danger)" />
                        <h3 style={{ fontSize: '1.1rem' }}>Areas to Improve</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {metrics.topNegativeKeywords.map((k, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: '#e2e2e2' }}>{k.word}</span>
                                <div style={{
                                    background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)',
                                    fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '600'
                                }}>
                                    {k.count} mentions
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>

        </motion.div>
    );
};

const MetricCard = ({ title, value, icon: Icon, trend, trendUp, color, onClick }) => {
    return (
        <motion.div
            variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 }
            }}
            className="glass-panel"
            onClick={onClick}
            whileHover={onClick ? { scale: 1.02, cursor: 'pointer' } : {}}
            style={{ padding: '1.5rem', borderRadius: '16px', cursor: onClick ? 'pointer' : 'default' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '10px',
                    background: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: color
                }}>
                    <Icon size={20} />
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.8rem',
                    color: trendUp ? 'var(--success)' : 'var(--danger)',
                    background: trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    padding: '4px 8px', borderRadius: '20px'
                }}>
                    {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend}
                </div>
            </div>
            <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{value}</div>
            </div>
        </motion.div>
    );
}

export default Dashboard;
