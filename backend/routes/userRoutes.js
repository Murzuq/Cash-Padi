import express from "express";
import { verifyAccount } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// This defines the endpoint that your frontend is trying to reach
router.post("/verify-account", protect, verifyAccount);

export default router;
