import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Pizza, Sandwich, Coffee, Soup } from 'lucide-react';

const Preloader = () => {
    const icons = [
        { Icon: Pizza, color: '#f59e0b', delay: 0, x: -60, y: -60 },
        { Icon: Sandwich, color: '#ef4444', delay: 0.2, x: 60, y: -60 },
        { Icon: Coffee, color: '#92400e', delay: 0.4, x: 60, y: 60 },
        { Icon: Soup, color: '#10b981', delay: 0.6, x: -60, y: 60 },
        { Icon: Utensils, color: '#fff', delay: 0.3, x: 0, y: 0, size: 48 },
    ];

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-dark)',
            }}
        >
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                {/* 3D Orbiting Glow */}
                <motion.div
                    animate={{
                        rotateZ: 360,
                        rotateX: [60, 70, 60],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        inset: -20,
                        borderRadius: '50%',
                        border: '2px dashed var(--primary)',
                        opacity: 0.2,
                        perspective: '1000px',
                    }}
                />

                {/* Pulsing Core */}
                <motion.div
                    animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        inset: '30%',
                        background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                        filter: 'blur(20px)',
                    }}
                />

                {/* Floating Icons */}
                {icons.map(({ Icon, color, delay, x, y, size = 32 }, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: x,
                            y: y,
                            rotateY: [0, 360],
                            rotateZ: [0, 10, -10, 0],
                            translateZ: [0, 50, 0]
                        }}
                        transition={{
                            opacity: { delay: delay, duration: 0.5 },
                            scale: { delay: delay, duration: 0.5 },
                            rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                            rotateZ: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                            translateZ: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            x: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                            y: { duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                        }}
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            marginLeft: -(size / 2),
                            marginTop: -(size / 2),
                            color: color,
                            filter: `drop-shadow(0 0 10px ${color}44)`,
                            perspective: '1000px',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <Icon size={size} />
                    </motion.div>
                ))}

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        position: 'absolute',
                        bottom: '-80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        width: 'max-content'
                    }}
                >
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        background: 'linear-gradient(90deg, #fff, var(--primary), #fff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundSize: '200% auto',
                        animation: 'shine 2s linear infinite'
                    }}>
                        Analyzing Flavors
                    </div>
                    <div style={{
                        width: '100px',
                        height: '2px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <motion.div
                            animate={{ left: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                width: '50%',
                                height: '100%',
                                background: 'var(--primary)',
                                boxShadow: '0 0 10px var(--primary)'
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Preloader;
