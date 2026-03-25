import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// ----------------------------------------------------
// In-Memory Fallback Store (used when MongoDB is down)
// ----------------------------------------------------

let dbConnected = false;

const generateMockReviews = () => {
    const names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Ananya", "Rohan", "Kavita", "Arjun", "Meera", "Suresh", "Divya"];
    const itemPool = ["Butter Chicken", "Paneer Tikka", "Garlic Naan", "Biryani", "Dal Makhani", "Tandoori Roti", "Lassi", "Gulab Jamun", "Samosa", "Momos"];

    const scenarios = [
        { text: "Food was cold and delivery took 2 hours. Totally unacceptable.", sentiment: "negative", score: -0.8, cats: ["Delivery", "Food Quality"] },
        { text: "Best biryani I've had in a long time! Highly recommend to everyone.", sentiment: "positive", score: 0.9, cats: ["Food Quality", "Taste"] },
        { text: "Packaging was damaged, curry spilled everywhere in the bag.", sentiment: "negative", score: -0.7, cats: ["Packaging"] },
        { text: "Good portion size but the price is too high for what you get.", sentiment: "neutral", score: -0.1, cats: ["Value for Money", "Portion"] },
        { text: "Staff was rude when I called to check my order status.", sentiment: "negative", score: -0.6, cats: ["Service"] },
        { text: "Instant delivery and piping hot food! 5 stars service.", sentiment: "positive", score: 0.95, cats: ["Delivery", "Food Quality"] },
        { text: "Too much salt in the dal. Couldn't eat it at all.", sentiment: "negative", score: -0.5, cats: ["Food Quality"] },
        { text: "Loved the ambiance and the music. Great vibe.", sentiment: "positive", score: 0.8, cats: ["Ambiance"] },
        { text: "Average food, nothing special to write home about.", sentiment: "neutral", score: 0.1, cats: ["Food Quality"] },
        { text: "Found a hair in the rice. Disgusting! Never ordering again.", sentiment: "negative", score: -0.9, cats: ["Hygiene"] },
        { text: "Absolutely loved the momos, very spicy and authentic.", sentiment: "positive", score: 0.85, cats: ["Food Quality", "Taste"] },
        { text: "Rider was polite and followed instructions perfectly.", sentiment: "positive", score: 0.7, cats: ["Delivery", "Service"] }
    ];

    const reviews = [];
    const today = new Date();

    for (let i = 0; i < 40; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - Math.floor(Math.random() * 30));
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const name = names[Math.floor(Math.random() * names.length)] + " " + ["Sharma", "Verma", "Singh", "Gupta", "Patel", "Reddy"][Math.floor(Math.random() * 6)];

        reviews.push({
            id: i + 1,
            customerName: name,
            date: date.toISOString().split('T')[0],
            time: `${Math.floor(Math.random() * 12 + 10)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
            rating: scenario.sentiment === 'positive' ? 5 : scenario.sentiment === 'negative' ? 1 : 3,
            text: scenario.text,
            sentiment: scenario.sentiment,
            score: scenario.score,
            orderItems: [itemPool[Math.floor(Math.random() * itemPool.length)]],
            categories: scenario.cats,
            keywords: scenario.text.split(' ').filter(w => w.length > 4).slice(0, 3),
            source: 'Zomato'
        });
    }
    return reviews;
};

// In-memory data store
const memoryStore = {
    users: [{ username: 'admin', password: 'password', role: 'admin' }],
    reviews: generateMockReviews(),
    settings: {
        type: 'general',
        storeName: 'The Spicy Spoon',
        adminName: 'Vikram Malhotra',
        adminEmail: 'manager@spicydragon.com',
        userPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        theme: 'dark',
        notifications: true,
        aiMode: 'advanced'
    }
};

// ----------------------------------------------------
// MongoDB Connection (optional — falls back to memory)
// ----------------------------------------------------

const MONGODB_URI = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
    type: { type: String, default: 'general', unique: true },
    storeName: { type: String, default: 'Spicy Dragon Bistro' },
    adminName: { type: String, default: 'Vikram Malhotra' },
    adminEmail: { type: String, default: 'manager@spicydragon.com' },
    userPhoto: { type: String, default: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
    theme: { type: String, default: 'dark' },
    notifications: { type: Boolean, default: true },
    aiMode: { type: String, default: 'advanced' },
    updatedAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
    id: Number,
    customerName: String,
    date: String,
    time: String,
    rating: Number,
    text: String,
    sentiment: String,
    score: Number,
    orderItems: [String],
    categories: [String],
    keywords: [String],
    source: { type: String, default: 'Zomato' }
});

const User = mongoose.model('User', userSchema);
const Settings = mongoose.model('Settings', settingsSchema);
const Review = mongoose.model('Review', reviewSchema);

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000 // Fail fast if Atlas is down or password bad
    })
        .then(async () => {
            console.log('✅ Connected to MongoDB');
            dbConnected = true;

            // Re-seed DB if needed
            try {
                const count = await Review.countDocuments();
                if (count < 5) {
                    await Review.deleteMany({});
                    await Review.insertMany(generateMockReviews());
                }
                const settingsCount = await Settings.countDocuments();
                if (settingsCount === 0) {
                    await Settings.create(memoryStore.settings);
                }
                const userCount = await User.countDocuments();
                if (userCount === 0) {
                    await User.create({ username: 'admin', password: 'password', role: 'admin' });
                }
            } catch (seedErr) {
                console.warn('⚠️ Seeding failed:', seedErr.message);
            }
        })
        .catch(err => {
            console.warn('⚠️ MongoDB unavailable, running in local memory mode:', err.message);
            dbConnected = false;
        });
} else {
    console.warn('⚠️ No MONGODB_URI set. Running in local memory mode.');
}

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------

// --- Auth ---
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (dbConnected) {
            const user = await User.findOne({ username, password });
            if (user) return res.json({ success: true, user: { username: user.username, role: user.role } });
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        } else {
            // In-memory fallback
            const user = memoryStore.users.find(u => u.username === username && u.password === password);
            if (user) return res.json({ success: true, user: { username: user.username, role: user.role } });
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (e) {
        console.error('Auth Error:', e);
        res.status(500).json({ error: 'Auth Error' });
    }
});

// --- Settings ---
app.get('/api/settings', async (req, res) => {
    try {
        if (dbConnected) {
            const settings = await Settings.findOne({ type: 'general' });
            return res.json(settings || {});
        }
        res.json(memoryStore.settings);
    } catch (err) {
        res.json(memoryStore.settings);
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        if (dbConnected) {
            const settings = await Settings.findOneAndUpdate(
                { type: 'general' },
                { ...req.body, updatedAt: Date.now() },
                { new: true, upsert: true }
            );
            return res.json(settings);
        }
        // In-memory update
        memoryStore.settings = { ...memoryStore.settings, ...req.body };
        res.json(memoryStore.settings);
    } catch (err) {
        console.error('Settings Update Error:', err);
        memoryStore.settings = { ...memoryStore.settings, ...req.body };
        res.json(memoryStore.settings);
    }
});

// --- Reviews ---
app.get('/api/reviews', async (req, res) => {
    try {
        if (dbConnected) {
            const reviews = await Review.find().sort({ date: -1 });
            return res.json(reviews);
        }
        res.json(memoryStore.reviews);
    } catch (err) {
        res.json(memoryStore.reviews);
    }
});

// --- AI Analysis ---
app.post('/api/analyze', async (req, res) => {
    const { text } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!text) return res.status(400).json({ error: 'Text is required' });
    if (!apiKey) return res.status(500).json({ error: 'Server AI key not configured' });

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

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            { contents: [{ parts: [{ text: prompt }] }] }
        );

        const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonStr);

        res.json({ ...result, method: 'Gemini AI (Server)', timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Gemini Server Error:', error.message);
        res.status(500).json({ error: 'AI processing failed', details: error.message });
    }
});

// --- Health ---
app.get('/api/health', (req, res) => {
    const dbStatus = dbConnected ? 'connected' : 'memory-mode';
    res.json({ status: 'running', database: dbStatus, timestamp: new Date() });
});

// Catch-all: serve frontend
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        if (!dbConnected) {
            console.log('📦 Running in IN-MEMORY MODE — data resets on restart');
            console.log('🔑 Login: admin / password');
        }
    });
}

export default app;
