import Sentiment from 'sentiment';
import nlp from 'compromise';

const sentiment = new Sentiment();

// --- Local Analysis Tools (Fallback) ---

const customVocabulary = {
    'tasty': 3, 'delicious': 4, 'yummy': 4, 'stale': -4, 'cold': -3, 'late': -3, 'fast': 3,
    'spicy': 0, 'bland': -3, 'raw': -4, 'premium': 3, 'quantity': 1, 'portion': 0,
    'packaging': 0, 'hygiene': 0, 'hair': -5, 'bug': -5, 'love': 4, 'hate': -4, 'best': 4, 'worst': -4,
    'bad': -3, 'terrible': -4, 'horrible': -4, 'awful': -4, 'good': 3, 'great': 4, 'excellent': 4, 'average': 0, 'poor': -3,
    'salty': -3, 'bitter': -2, 'sour': -1, 'oily': -2, 'greasy': -2, 'dry': -2, 'hard': -2, 'tough': -2,
    'warm': 2, 'fresh': 3, 'hot': 2, 'crispy': 3, 'soft': 1, 'tender': 3,
    'burnt': -4, 'undercooked': -4, 'overcooked': -3
};

const CATEGORIES = {
    'Food Quality': ['taste', 'tasty', 'delicious', 'yummy', 'stale', 'cold', 'spicy', 'bland', 'raw', 'fresh', 'flavor', 'flavour', 'salt', 'salty', 'sweet', 'cooked', 'recipe', 'food', 'meal', 'dish', 'curry', 'bread', 'rice', 'rotten', 'sour', 'burnt', 'bitter', 'undercooked', 'overcooked', 'dry', 'oily', 'greasy'],
    'Delivery': ['delivery', 'late', 'fast', 'time', 'rider', 'driver', 'arrived', 'reach', 'delayed', 'quick', 'slow', 'tracking', 'earlier'],
    'Packaging': ['package', 'packaging', 'box', 'container', 'leak', 'spill', 'packed', 'bag', 'seal', 'open'],
    'Service': ['staff', 'polite', 'rude', 'manager', 'waiter', 'service', 'behavior', 'refund', 'support', 'chat', 'help', 'response', 'reply', 'attitude'],
    'Value for Money': ['price', 'cost', 'expensive', 'cheap', 'worth', 'value', 'amount', 'quantity', 'portion', 'size', 'money', 'bill']
};

const localAnalyze = (text) => {
    const result = sentiment.analyze(text, { language: 'en', extras: customVocabulary });
    let normalizedScore = result.comparative;

    // Normalize to -1 to 1 range more aggressively for short texts
    if (result.words.length < 5 && result.score !== 0) {
        normalizedScore = result.score > 0 ? 0.8 : -0.8;
    }

    if (normalizedScore > 1) normalizedScore = 1;
    if (normalizedScore < -1) normalizedScore = -1;

    // Amplify sensitivity
    if (result.negative.length > 0 && normalizedScore === 0) normalizedScore = -0.4;
    if (result.positive.length > 0 && normalizedScore === 0) normalizedScore = 0.4;

    let sentimentLabel = 'neutral';
    if (result.score > 0) sentimentLabel = 'positive';
    else if (result.score < 0) sentimentLabel = 'negative';

    const doc = nlp(text);
    // Get nouns and adjectives, filter short words
    const keywords = [...new Set([...doc.nouns().out('array'), ...doc.adjectives().out('array')])].filter(w => w.length > 2).slice(0, 8);

    const detectedCategories = new Set();
    const tokens = text.toLowerCase().split(/[\s,!.?]+/);
    Object.entries(CATEGORIES).forEach(([category, terms]) => {
        if (terms.some(term => tokens.includes(term))) detectedCategories.add(category);
    });

    const emotions = [];

    // Emotion Keyword Mapping
    const emotionKeywords = {
        'Anger/Frustration': ['angry', 'furious', 'mad', 'annoyed', 'irritated', 'ridiculous', 'useless', 'cheat', 'scam'],
        'Disgust': ['hair', 'bug', 'rotten', 'stale', 'smell', 'dirty', 'filthy', 'insect', 'cockroach', 'sick', 'vomit'],
        'Joy/Satisfaction': ['happy', 'love', 'best', 'great', 'excellent', 'amazing', 'wonderful', 'perfect', 'tasty', 'delicious', 'yummy', 'fresh', 'wow'],
        'Disappointment': ['disappointed', 'bad', 'poor', 'worst', 'hate', 'terrible', 'horrible', 'awful', 'bland', 'salty', 'raw', 'cold', 'late', 'waste', 'average', 'dry'],
        'Surprise': ['shocked', 'surprised', 'unexpected']
    };

    Object.entries(emotionKeywords).forEach(([emotion, terms]) => {
        if (terms.some(t => tokens.includes(t))) emotions.push(emotion);
    });

    // Fallback emotions based on sentiment score if no specific keywords found
    if (emotions.length === 0) {
        if (result.score <= -2) emotions.push('Disappointment');
        else if (result.score < 0) emotions.push('Dissatisfaction');
        else if (result.score >= 2) emotions.push('Joy/Satisfaction');
        else if (result.score > 0) emotions.push('Satisfaction');
        else emotions.push('Neutral');
    }

    // Ensure strictly unique emotions
    const uniqueEmotions = [...new Set(emotions)];

    return {
        score: result.score,
        comparative: result.comparative,
        normalizedScore: parseFloat(normalizedScore.toFixed(2)),
        sentiment: sentimentLabel,
        tokens: result.tokens,
        positiveWords: result.positive,
        negativeWords: result.negative,
        keywords: keywords,
        categories: Array.from(detectedCategories),
        emotions: uniqueEmotions,
        method: 'Local Logic'
    };
};

// --- Real AI Analysis (Gemini) ---

const geminiAnalyze = async (text, apiKey) => {
    try {
        const prompt = `
      Analyze the sentiment of the following Zomato customer review json format.
      Review: "${text}"
      
      Output strictly valid JSON with this schema:
      {
        "sentiment": "positive" | "negative" | "neutral",
        "score": number (-1.0 to 1.0),
        "emotions": ["emotion1", "emotion2"],
        "categories": ["Food Quality", "Delivery", "Packaging", "Service", "Value for Money"],
        "keywords": ["keyword1", "keyword2"]
      }
    `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        // Clean markdown code blocks if present
        const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonStr);

        return {
            score: result.score * 5, // Approximate raw score
            comparative: result.score,
            normalizedScore: result.score,
            sentiment: result.sentiment,
            tokens: [],
            positiveWords: [],
            negativeWords: [],
            keywords: result.keywords || [],
            categories: result.categories || [],
            emotions: result.emotions || [],
            method: 'Gemini AI'
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        return { ...localAnalyze(text), error: "API Failed, used Local Fallback" };
    }
};

// --- Main Export ---

const SERVER_URL = '/api';

export const analyzeText = async (text) => {
    // 1. Try Central Server First
    try {
        const response = await fetch(`${SERVER_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (response.ok) {
            const data = await response.json();
            return {
                ...data,
                normalizedScore: data.score,
                comparative: data.score,
                positiveWords: [],
                negativeWords: [],
                tokens: []
            };
        }
    } catch (e) {
        console.log("Server not reachable, falling back to browser/local analysis.");
    }

    // 2. Fallback to Browser-based Gemini or Local Logic
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
        return await geminiAnalyze(text, apiKey);
    } else {
        return new Promise(resolve => {
            setTimeout(() => resolve(localAnalyze(text)), 800);
        });
    }
};
