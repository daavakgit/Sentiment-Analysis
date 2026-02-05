import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
const text = "The food was great!";
const prompt = `Analyze: ${text}`;
const model = 'gemini-flash-latest';

console.log(`Testing Gemini API with model: ${model}`);

try {
    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            contents: [{ parts: [{ text: prompt }] }]
        }
    );
    console.log("Success! Status:", response.status);
    console.log("Data:", JSON.stringify(response.data, null, 2));
} catch (error) {
    console.error("Error Status:", error.response?.status);
    console.error("Error Message:", error.message);
}
