import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ThumbsUp, ThumbsDown, User, Tag, ShoppingBag, Clock, ArrowLeft } from 'lucide-react';

const ReviewList = ({ reviews, initialFilter = 'all', onBack }) => {
    const [filter, setFilter] = useState(initialFilter); // all, positive, negative, neutral

    useEffect(() => {
        if (initialFilter) {
            setFilter(initialFilter);
        }
    }, [initialFilter]);
    const [search, setSearch] = useState('');

    const filteredReviews = reviews.filter(r => {
        const matchesFilter = filter === 'all' || r.sentiment === filter;
        const matchesSearch = r.text.toLowerCase().includes(search.toLowerCase()) || r.customerName.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'none', border: 'none', color: 'var(--text-muted)',
                        cursor: 'pointer', marginBottom: '1rem', padding: 0
                    }}
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Customer Reviews</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage and analyze individual customer feedback.</p>
            </div>

            {/* Controls */}
            <div className="glass-panel" style={{
                padding: '1rem', borderRadius: '12px', marginBottom: '2rem',
                display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'
            }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search reviews, food items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '8px',
                            padding: '10px 10px 10px 40px',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        color: 'white',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="all">All Sentiments</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                </select>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={18} /> Export CSV
                </button>
            </div>

            {/* List */}
            <div style={{ display: 'grid', gap: '1rem', paddingBottom: '2rem' }}>
                <AnimatePresence>
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}
                        >
                            No reviews found matching your criteria.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ReviewCard = ({ review }) => {
    const [expanded, setExpanded] = useState(false);

    const getSentimentColor = (s) => {
        switch (s) {
            case 'positive': return 'var(--success)';
            case 'negative': return 'var(--danger)';
            default: return 'var(--warning)';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                type: "spring",
                damping: 25,
                stiffness: 200
            }}
            whileHover={{ y: -4, borderColor: 'rgba(var(--primary-rgb), 0.2)' }}
            className="glass-panel"
            style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', transition: 'border-color 0.3s' }}
        >
            {/* Avatar / Score */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '60px' }}>
                <div style={{
                    width: '50px', height: '50px', borderRadius: '50%', background: '#333',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${getSentimentColor(review.sentiment)}`
                }}>
                    <User size={24} color="#ccc" />
                </div>
                <span style={{
                    fontSize: '0.8rem', fontWeight: 'bold',
                    color: getSentimentColor(review.sentiment),
                    background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '10px'
                }}>
                    {review.rating}/5
                </span>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{review.customerName}</h4>
                        {review.categories && review.categories.map(cat => (
                            <span key={cat} style={{
                                fontSize: '0.7rem', border: '1px solid var(--border-glass)',
                                padding: '2px 8px', borderRadius: '12px', color: 'var(--text-muted)'
                            }}>
                                {cat}
                            </span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {review.date} • {review.time}</span>
                    </div>
                </div>

                <p style={{ color: '#e2e2e2', lineHeight: '1.6', marginBottom: '1rem' }}>"{review.text}"</p>

                {/* Order Details & Keywords - Always visible or toggleable */}
                <div style={{
                    background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px',
                    marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px'
                }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
                        <ShoppingBag size={14} color="var(--text-muted)" />
                        <span style={{ color: 'var(--text-muted)' }}>Order:</span>
                        <span style={{ color: '#ccc' }}>{review.orderItems.join(', ')}</span>
                    </div>
                    {review.keywords && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
                            <Tag size={14} color="var(--text-muted)" />
                            <span style={{ color: 'var(--text-muted)' }}>Keywords:</span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {review.keywords.map(k => (
                                    <span key={k} style={{
                                        background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px',
                                        color: review.sentiment === 'positive' ? 'var(--success)' :
                                            review.sentiment === 'negative' ? 'var(--danger)' : 'var(--warning)'
                                    }}>
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }} className="hover-action">
                            <ThumbsUp size={16} /> Helpful
                        </button>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }} className="hover-action">
                            <ThumbsDown size={16} /> Ignore
                        </button>
                    </div>
                    <button style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Reply
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default ReviewList;
