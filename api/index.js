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

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ----------------------------------------------------
// Data Models
// ----------------------------------------------------

// 1. User Model (for Auth)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Plaintext for demo simplicity
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

// 2. Settings Model (Singleton)
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

// 3. Review Model
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

// ----------------------------------------------------
// Mock Data Generators
// ----------------------------------------------------

const generateMockReviews = () => {
    const names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Ananya", "Rohan", "Kavita", "Arjun", "Meera", "Suresh", "Divya"];
    const itemPool = ["Butter Chicken", "Paneer Tikka", "Garlic Naan", "Biryani", "Dal Makhani", "Tandoori Roti", "Lassi", "Gulab Jamun", "Samosa", "Momos"];

    // Explicit scenarios for better analytics
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
        // Random date within last 30 days
        const date = new Date(today);
        date.setDate(today.getDate() - Math.floor(Math.random() * 30));

        // Random scenario
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        // Random customer
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

// Seed Database
const seedDatabase = async () => {
    try {
        // 1. Seed Reviews
        const count = await Review.countDocuments();
        if (count < 5) { // Re-seed if data is low or empty
            console.log('🌱 Seeding database with fresh reviews...');
            await Review.deleteMany({}); // Clear old data to ensure clean slate
            const mocks = generateMockReviews();
            await Review.insertMany(mocks);
            console.log(`✅ Database seeded with ${mocks.length} reviews`);
        }

        // 2. Seed Settings
        const settingsCount = await Settings.countDocuments();
        if (settingsCount === 0) {
            await Settings.create({
                type: 'general',
                storeName: "The Spicy Spoon",
                adminName: "Vikram Malhotra",
                userPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            });
            console.log('⚙️ Default settings initialized');
        }

        // 3. Seed Admin User
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            await User.create({
                username: "admin",
                password: "password", // Simple for demo
                role: "admin"
            });
            console.log('👤 Admin user created (admin/password)');
        }

    } catch (err) {
        console.error('Error seeding database:', err);
    }
};

mongoose.connection.once('open', seedDatabase);

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true, user: { username: user.username, role: user.role } });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (e) {
        res.status(500).json({ error: "Auth Error" });
    }
});

// --- Settings Routes ---
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await Settings.findOne({ type: 'general' });
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch settings" });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const updates = req.body;
        const settings = await Settings.findOneAndUpdate(
            { type: 'general' },
            { ...updates, updatedAt: Date.now() },
            { new: true, upsert: true } // Create if doesn't exist
        );
        res.json(settings);
    } catch (err) {
        console.error("Settings Update Error:", err);
        res.status(500).json({ error: "Failed to update settings" });
    }
});

// --- Review Routes ---
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

// --- AI Analysis Route ---
app.post('/api/analyze', async (req, res) => {
    const { text } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!text) return res.status(400).json({ error: "Text is required" });
    if (!apiKey) return res.status(500).json({ error: "Server AI key not configured" });

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

        res.json({
            ...result,
            method: 'Gemini AI (Server)',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Gemini Server Error:", error.message);
        res.status(500).json({ error: "AI processing failed", details: error.message });
    }
});

app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ status: 'running', database: dbStatus, timestamp: new Date() });
});

// Catch-all route to serve the frontend (must be after API routes)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// For local development
// Start server if not in Vercel environment (Render, Local, etc.)
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

export default app;
