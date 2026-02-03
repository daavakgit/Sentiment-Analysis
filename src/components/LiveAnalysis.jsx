import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, Activity, Zap, CheckCircle, AlertOctagon, Terminal, Play } from 'lucide-react';
import { analyzeText } from '../utils/aiEngine';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LiveAnalysis = () => {
    const [inputText, setInputText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;

        setIsAnalyzing(true);
        setResult(null);

        const analysis = await analyzeText(inputText);
        setResult(analysis);
        setIsAnalyzing(false);
    };

    const getConfidenceLevel = (score) => {
        // Simulate confidence based on how extreme the score is
        const abs = Math.abs(score);
        if (abs > 0.6) return { val: 98, label: 'High' };
        if (abs > 0.3) return { val: 85, label: 'Medium' };
        return { val: 65, label: 'Low (Ambiguous)' };
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Brain color="var(--primary)" size={32} />
                    ZomaMind AI Engine
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Real-time Natural Language Processing (NLP) allowing you to classify customer feedback instantly.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', gap: '2rem' }}>

                {/* Left Column: Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Terminal size={18} /> Review Input
                        </h3>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste a customer review here to analyze its sentiment, operational categories, and emotional tone..."
                            style={{
                                width: '100%',
                                minHeight: '200px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--border-glass)',
                                borderRadius: '8px',
                                padding: '1rem',
                                color: 'white',
                                fontFamily: 'monospace',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                outline: 'none'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !inputText.trim()}
                                className="btn-primary"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    opacity: (isAnalyzing || !inputText.trim()) ? 0.7 : 1,
                                    cursor: (isAnalyzing || !inputText.trim()) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isAnalyzing ? (
                                    <>Processing <Activity className="spin" size={18} /></>
                                ) : (
                                    <>Analyze Review <Zap size={18} /></>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Quick Samples */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button onClick={() => setInputText("Totally unacceptable service! Food was cold and rider was rude.")} style={sampleBtnStyle}>Sample: Negative</button>
                        <button onClick={() => setInputText("Best biryani in town! Loved the packaging and quick delivery.")} style={sampleBtnStyle}>Sample: Positive</button>
                        <button onClick={() => setInputText("It was okay, portion size is decent but taste is accurate.")} style={sampleBtnStyle}>Sample: Neutral</button>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div style={{ position: 'relative' }}>
                    <AnimatePresence mode='wait'>
                        {isAnalyzing ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="glass-panel"
                                style={{ height: '100%', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}
                            >
                                <Cpu size={64} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>Processing Neural Network...</h3>
                                <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <motion.div
                                        animate={{ x: [-200, 200] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                        style={{ width: '100px', height: '100%', background: 'var(--primary)' }}
                                    />
                                </div>
                                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    Tokenizing Input... <br /> Use Support Vector Machine... <br /> Extracting Entities...
                                </div>
                            </motion.div>
                        ) : result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="glass-panel"
                                style={{ borderRadius: '16px', padding: '1.5rem', height: '100%' }}
                            >
                                {/* Top Result Banner */}
                                <div style={{
                                    background: result.sentiment === 'positive' ? 'rgba(16, 185, 129, 0.1)' : result.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    border: `1px solid ${result.sentiment === 'positive' ? 'var(--success)' : result.sentiment === 'negative' ? 'var(--danger)' : 'var(--warning)'}`,
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Predicted Sentiment</div>
                                        <div style={{ fontSize: '2rem', fontWeight: '800', textTransform: 'capitalize', color: 'white' }}>{result.sentiment}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>{Math.round(Math.abs(result.normalizedScore) * 100)}%</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Confidence Score</div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                                    <div style={cardStyle}>
                                        <div style={labelStyle}>Emotions Detected</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {result.emotions.map(e => (
                                                <span key={e} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>{e}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={cardStyle}>
                                        <div style={labelStyle}>Operational Categories</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {result.categories.length > 0 ? result.categories.map(c => (
                                                <span key={c} style={{ border: '1px solid var(--border-glass)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>{c}</span>
                                            )) : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>None detected</span>}
                                        </div>
                                    </div>

                                    <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
                                        <div style={labelStyle}>Significant Keywords</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {result.keywords.map(k => (
                                                <span key={k} style={{ color: 'var(--primary)', fontWeight: '600', background: 'rgba(203, 32, 45, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>#{k}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Technical Debug Info */}
                                    <div style={{ ...cardStyle, gridColumn: 'span 2', background: 'rgba(0,0,0,0.3)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div style={labelStyle}>Engine Output (JSON)</div>
                                            <span style={{ color: result.method === 'Gemini AI' ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.7rem' }}>
                                                Powered by: {result.method}
                                            </span>
                                        </div>
                                        <div style={{ color: 'var(--text-muted)' }}>
                                            {"{"}<br />
                                            &nbsp;&nbsp;"raw_score": {result.score},<br />
                                            &nbsp;&nbsp;"comparative": {result.comparative.toFixed(4)},<br />
                                            &nbsp;&nbsp;"pos_lexicon": [{result.positiveWords.join(", ")}],<br />
                                            &nbsp;&nbsp;"neg_lexicon": [{result.negativeWords.join(", ")}]<br />
                                            {"}"}
                                        </div>
                                    </div>

                                </div>

                            </motion.div>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, border: '2px dashed var(--border-glass)', borderRadius: '16px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <Play size={48} />
                                    <p>Waiting for input...</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const sampleBtnStyle = {
    background: 'transparent',
    border: '1px solid var(--border-glass)',
    color: 'var(--text-muted)',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8.5rem',
    transition: 'all 0.2s'
};

const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    padding: '1rem',
    borderRadius: '8px'
};

const labelStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '0.5rem',
    letterSpacing: '0.5px'
};

export default LiveAnalysis;
