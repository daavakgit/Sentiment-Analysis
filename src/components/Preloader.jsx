import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Pizza, Sandwich, Coffee, Soup, Sparkles, Brain } from 'lucide-react';

const Preloader = () => {
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
                backgroundColor: '#050505', // Deep black background
                perspective: '1500px',
                overflow: 'hidden'
            }}
        >
            <div style={{
                position: 'relative',
                width: '300px',
                height: '300px',
                transformStyle: 'preserve-3d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Central AI Core */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        filter: [
                            'drop-shadow(0 0 20px rgba(239, 68, 68, 0.4))',
                            'drop-shadow(0 0 50px rgba(239, 68, 68, 0.8))',
                            'drop-shadow(0 0 20px rgba(239, 68, 68, 0.4))'
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, #ff6b6b, #8E0E00)',
                        position: 'absolute',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'inset -5px -5px 20px rgba(0,0,0,0.5)',
                    }}
                >
                    <Brain color="#fff" size={40} strokeWidth={1.5} />
                </motion.div>

                {/* 3D Rotating Rings */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ rotateX: 360, rotateY: 360, rotateZ: 360 }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.5
                        }}
                        style={{
                            position: 'absolute',
                            width: `${200 + i * 40}px`,
                            height: `${200 + i * 40}px`,
                            borderRadius: '50%',
                            border: `1px solid rgba(255, 255, 255, ${0.1 - i * 0.02})`,
                            borderTop: '1px solid rgba(239, 68, 68, 0.8)',
                            borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                            transformStyle: 'preserve-3d',
                            boxShadow: `0 0 15px rgba(239, 68, 68, ${0.1})`
                        }}
                    />
                ))}

                {/* Orbiting Elements */}
                {[Pizza, Sandwich, Coffee, Soup, Utensils, Sparkles].map((Icon, idx) => {
                    const angle = (idx / 6) * 360;
                    const radius = 140;
                    return (
                        <motion.div
                            key={idx}
                            animate={{
                                rotateY: [0, 360],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear",
                                delay: idx * -1.5
                            }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <motion.div
                                    animate={{ rotateY: [360, 0] }} // Counter-rotate to keep icon facing forward
                                    transition={{
                                        duration: 10,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: idx * -1.5
                                    }}
                                    style={{
                                        background: 'rgba(20, 20, 20, 0.8)',
                                        padding: '12px',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(5px)'
                                    }}
                                >
                                    <Icon size={24} color={idx % 2 === 0 ? '#ef4444' : '#f59e0b'} />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    );
                })}

                {/* Loading Text with Glitch/Typewriter Effect */}
                <div style={{
                    position: 'absolute',
                    bottom: '-120px',
                    textAlign: 'center',
                    transform: 'translateZ(50px)'
                }}>
                    <motion.h2
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                            color: '#fff',
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            marginBottom: '10px',
                            textShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                        }}
                    >
                        Neuro-Analyzing
                    </motion.h2>
                    <motion.div
                        style={{
                            height: '4px',
                            background: '#333',
                            width: '200px',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            margin: '0 auto',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                        }}
                    >
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
                                width: '50%'
                            }}
                        />
                    </motion.div>
                    <p style={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.8rem',
                        marginTop: '10px',
                        letterSpacing: '0.1em'
                    }}>Processing Sentiment Data...</p>
                </div>
            </div>
        </motion.div>
    );
};

export default Preloader;
