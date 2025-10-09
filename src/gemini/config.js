import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: Add your Gemini API key to your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

if (API_KEY === "YOUR_API_KEY_HERE") {
  console.warn("Please add your VITE_GEMINI_API_KEY to your .env file.");
}

export const genAI = new GoogleGenerativeAI(API_KEY);
