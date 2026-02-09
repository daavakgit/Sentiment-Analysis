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
app.use(express.json({ limit: '50mb' })); // Increased limit for Base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas
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
    keywords: [String]
});

const settingsSchema = new mongoose.Schema({
    type: { type: String, default: 'general', unique: true }, // Singleton pattern
    userPhoto: String,
    updatedAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
const Settings = mongoose.model('Settings', settingsSchema);

// Mock database (for seeding)
const mockReviews = [
    {
        id: 1,
        customerName: "Rahul Sharma",
        date: "2026-05-12",
        time: "14:30",
        rating: 5,
        text: "The Paneer Tikka was absolute perfection! Melt in the mouth and the spicy chutney was a great addition. Highly recommend for any vegetarian food lover.",
        sentiment: "positive",
        score: 0.85,
        orderItems: ["Paneer Tikka", "Butter Naan", "Dal Makhani"],
        categories: ["Food Quality", "Taste"],
        keywords: ["perfection", "melt", "spicy chutney"]
    },
    {
        id: 2,
        customerName: "Ananya Iyer",
        date: "2026-05-12",
        time: "13:15",
        rating: 2,
        text: "Extremely disappointed. I found a hair in my biryani and when I called the restaurant, the manager was very rude. This is a huge hygiene concern.",
        sentiment: "negative",
        score: -0.9,
        orderItems: ["Chicken Biryani", "Coke"],
        categories: ["Hygiene", "Service"],
        keywords: ["hair in biryani", "rude manager", "hygiene concern"]
    },
    {
        id: 3,
        customerName: "Vikram Singh",
        date: "2026-05-11",
        time: "20:45",
        rating: 4,
        text: "Delivery was super fast. Food arrived piping hot. The packaging was neat and clean. Tasted good too, though slightly expensive for the portion size.",
        sentiment: "positive",
        score: 0.6,
        orderItems: ["Pepperoni Pizza 12\"", "Garlic Bread"],
        categories: ["Delivery", "Packaging", "Value for Money"],
        keywords: ["super fast", "piping hot", "portion size"]
    },
    {
        id: 4,
        customerName: "Priya Das",
        date: "2026-05-11",
        time: "19:20",
        rating: 1,
        text: "Cold food delivered after a 90 minute wait. The burger was soggy and the fries were cold. Totally wasted my money. Will not order again.",
        sentiment: "negative",
        score: -0.85,
        orderItems: ["Classic Veg Burger", "Peri Peri Fries"],
        categories: ["Delivery", "Food Quality"],
        keywords: ["cold food", "90 minute wait", "soggy"]
    }
];

// Seed Database if empty
const seedDatabase = async () => {
    try {
        const count = await Review.countDocuments();
        if (count === 0) {
            await Review.insertMany(mockReviews);
            console.log('🌱 Database seeded with mock reviews');
        }

        // Seed default settings if not exists
        const settingsCount = await Settings.countDocuments();
        if (settingsCount === 0) {
            await Settings.create({
                type: 'general',
                userPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
            });
            console.log('⚙️ Default settings initialized');
        }
    } catch (err) {
        console.error('Error seeding database:', err);
    }
};

mongoose.connection.once('open', seedDatabase);

// Routes

// Settings Routes
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
        const { userPhoto } = req.body;
        const settings = await Settings.findOneAndUpdate(
            { type: 'general' },
            { userPhoto, updatedAt: Date.now() },
            { new: true, upsert: true } // Create if doesn't exist
        );
        res.json(settings);
    } catch (err) {
        console.error("Settings Update Error:", err);
        res.status(500).json({ error: "Failed to update settings" });
    }
});

// Review Routes
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

app.post('/api/analyze', async (req, res) => {
    const { text } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!text) return res.status(400).json({ error: "Text is required" });

    if (!apiKey) {
        return res.status(500).json({ error: "Server AI key not configured" });
    }

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
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );

        const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonStr);

        // Optionally save the analyzed review to DB here if desired.
        // For now, adhering to existing behavior (just return analysis).

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
    res.json({ status: 'running', database: dbStatus, timestamp: new Date(), platform: 'vercel' });
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
