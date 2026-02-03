import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, Brain, Zap, Star, MessageCircle, MousePointer2 } from 'lucide-react';

const Hero = ({ onStart }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Parallax effect on mouse move
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5),
                y: (e.clientY / window.innerHeight - 0.5)
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            padding: '0 2rem',
            backgroundColor: 'var(--bg-dark)'
        }}>
            {/* Glow Orbs */}
            <motion.div
                animate={{
                    x: mousePosition.x * -50,
                    y: mousePosition.y * -50
                }}
                transition={{ type: 'spring', damping: 50, stiffness: 100 }}
                style={{
                    position: 'absolute', top: '10%', left: '10%',
                    width: '40vw', height: '40vw',
                    background: 'radial-gradient(circle, rgba(203, 32, 45, 0.2) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(100px)', zIndex: 0
                }}
            />

            {/* Floating Elements */}
            <FloatingIcon delay={0} x="15%" y="25%" icon={Star} color="#f59e0b" size={24} />
            <FloatingIcon delay={1.5} x="80%" y="20%" icon={MessageCircle} color="#cb202d" size={30} />
            <FloatingIcon delay={0.8} x="20%" y="75%" icon={Zap} color="#10b981" size={26} />

            {/* Navigation */}
            <nav style={{
                padding: '2rem 0', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', maxWidth: '1200px', width: '100%', margin: '0 auto', zIndex: 100
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: '1.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: '14px', height: '14px', background: 'var(--primary)', borderRadius: '3px', transform: 'rotate(45deg)' }} />
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ position: 'absolute', inset: -4, background: 'var(--primary)', borderRadius: '50%', filter: 'blur(8px)', zIndex: -1 }}
                        />
                    </div>
                    <span style={{ letterSpacing: '-1px' }}>ZomaLens</span>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    {/* Sign In button removed */}
                </motion.div>
            </nav>

            {/* Main Hero Section */}
            <main style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', textAlign: 'center', maxWidth: '1000px',
                margin: '0 auto', zIndex: 10, position: 'relative'
            }}>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '6px 12px', borderRadius: '100px',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)',
                            marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)'
                        }}
                    >
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                        AI Sentiment Engine v2.0 is live
                    </motion.div>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '800', lineHeight: '1', margin: '0 0 2rem 0',
                        letterSpacing: '-2px'
                    }}>
                        <RevealText text="Uncover the hidden" delay={0.4} /> <br />
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            style={{
                                background: 'linear-gradient(90deg, #fff, var(--primary), #fff)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'shine 4s linear infinite'
                            }}
                        >
                            voice of customers.
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}
                    >
                        Harness the power of Neural NLP to automatically evaluate, classify, and interpret the emotional tone of Zomato reviews.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    style={{ marginTop: '3rem' }}
                >
                    <MagneticButton onClick={onStart}>
                        Launch Dashboard <ArrowRight size={20} />
                    </MagneticButton>
                </motion.div>

                {/* Feature Highlights */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem', marginTop: '8rem', width: '100%'
                }}>
                    <InfoCard
                        icon={Brain}
                        title="Operational Intelligence"
                        desc="Deep-dive into hygiene, taste, and service categories automatically."
                        index={0}
                    />
                    <InfoCard
                        icon={Activity}
                        title="Volatility Tracking"
                        desc="Real-time sentiment heatmaps to track service consistency."
                        index={1}
                    />
                    <InfoCard
                        icon={Zap}
                        title="Zero-Latency NLP"
                        desc="Proprietary engine built for high-scale feedback loops."
                        index={2}
                    />
                </div>
            </main>

            <footer style={{ padding: '3rem 2rem', borderTop: '1px solid var(--border-glass)', marginTop: '4rem', zIndex: 10 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.85rem' }}>
                    <div>© 2026 ZomaLens Analytics. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Contact</span>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}} />
        </div>
    );
};

// Text Reveal Component
const RevealText = ({ text, delay }) => {
    return (
        <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
            <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-block' }}
            >
                {text}
            </motion.span>
        </span>
    );
};

// Magnetic Button Component
const MagneticButton = ({ children, onClick }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x: x * 0.3, y: y * 0.3 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.5 }}
            onClick={onClick}
            className="btn-primary"
            style={{
                padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '100px',
                display: 'flex', alignItems: 'center', gap: '12px'
            }}
        >
            {children}
        </motion.button>
    );
};

const InfoCard = ({ icon: Icon, title, desc, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 + (index * 0.2), duration: 0.8 }}
            whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="glass-panel"
            style={{
                padding: '2.5rem', borderRadius: '32px', textAlign: 'left',
                cursor: 'default', transition: 'background-color 0.3s'
            }}
        >
            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
                <Icon size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>{desc}</p>
        </motion.div>
    );
};

const FloatingIcon = ({ delay, x, y, icon: Icon, color, size }) => {
    return (
        <motion.div
            animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay }}
            style={{ position: 'absolute', left: x, top: y, color, zIndex: 1, pointerEvents: 'none' }}
        >
            <Icon size={size} />
        </motion.div>
    );
};

export default Hero;
