import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import userRoutes from "./routes/userRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js"; // 1. Import the new TTS routes

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: [
    "http://localhost:5173", // Your local frontend
    "https://cashpadi.netlify.app", // Your deployed frontend
  ],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions)); // Use specific CORS options
app.use(express.json()); // Body parser for JSON

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 5000;

// Connect to Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
    app.listen(PORT, HOST, () =>
      console.log(`Server running on http://${HOST}:${PORT}`)
    );
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes); // 2. Tell Express to use the user routes
app.use("/api/tts", ttsRoutes); // 2. Tell Express to use the TTS routes
