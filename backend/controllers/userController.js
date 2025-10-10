import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Make sure your User model has a `savingsGoals` array and a `matchPin` method.

// @desc    Verify a user's account number
// @route   POST /api/users/verify-account
// @access  Private (should be accessible by logged-in users)
export const verifyAccount = async (req, res) => {
  const { accountNumber } = req.body;

  if (!accountNumber) {
    return res.status(400).json({ message: "Account number is required" });
  }

  try {
    // Find the user by their account number and select only the fullName
    const user = await User.findOne({ accountNumber }).select("fullName");

    if (!user) {
      return res.status(404).json({ message: "Account holder not found" });
    }

    // Return the full name on success
    res.status(200).json({ fullName: user.fullName });
  } catch (error) {
    console.error("Account verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user's savings goals
// @route   GET /api/users/savings-goals
// @access  Private
export const getSavingsGoals = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      savingsGoals: user.savingsGoals || [],
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Create a new savings goal
// @route   POST /api/users/savings-goals
// @access  Private
export const createSavingsGoal = asyncHandler(async (req, res) => {
  const {
    name,
    icon,
    targetAmount,
    targetDate,
    automation,
    recurringAmount,
    automationConfig,
    pin,
  } = req.body;

  const user = await User.findById(req.user.id).select("+pin");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // 1. Validate PIN
  const isPinMatch = await user.matchPin(pin);
  if (!isPinMatch) {
    res.status(401);
    throw new Error("Invalid PIN");
  }

  // 2. If there's another active goal, deactivate it
  const activeGoal = user.savingsGoals.find((g) => g.isActive);
  if (activeGoal) {
    activeGoal.isActive = false;
  }

  // 3. Create the new goal
  const newGoal = {
    name,
    icon,
    targetAmount,
    targetDate,
    currentAmount: 0,
    isActive: true, // Make the new goal active by default
    automation: {
      type: automation,
      recurringAmount: recurringAmount || 0,
      config: automationConfig || {},
    },
  };

  user.savingsGoals.push(newGoal);
  await user.save();

  // Find the newly created goal to send back (it now has a MongoDB _id)
  const createdGoal = user.savingsGoals[user.savingsGoals.length - 1];

  res.status(201).json({ goal: createdGoal });
});
