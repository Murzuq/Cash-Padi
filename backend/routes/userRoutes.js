import express from "express";
import {
  verifyAccount,
  getSavingsGoals,
  createSavingsGoal,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// @route   GET api/users/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    // req.user.id is set by the auth middleware
    const user = await User.findById(req.user.id).select("-password -pin");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// This defines the endpoint that your frontend is trying to reach
router.post("/verify-account", auth, verifyAccount);

// @route   GET /api/users/savings-goals
// @desc    Get all savings goals for a user
// @access  Private
router.get("/savings-goals", auth, getSavingsGoals);

// @route   POST /api/users/savings-goals
// @desc    Create a new savings goal
// @access  Private
router.post("/savings-goals", auth, createSavingsGoal);

export default router;
