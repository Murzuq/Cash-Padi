import express from "express";
import { synthesizeSpeech } from "../controllers/ttsController.js";

const router = express.Router();

// @route   POST /api/tts/synthesize
// @desc    Takes text and returns synthesized speech audio
// @access  Public
router.post("/synthesize", synthesizeSpeech);

export default router;
