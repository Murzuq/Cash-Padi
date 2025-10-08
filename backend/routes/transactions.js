import express from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// @route   POST api/transactions/transfer
// @desc    Transfer money to another user
// @access  Private
router.post(
  "/transfer",
  [
    auth,
    [
      check("to", "Recipient account number is required").not().isEmpty(),
      check("amount", "Amount must be a positive number").isFloat({ gt: 0 }),
      check("pin", "Transaction PIN is required").isLength({ min: 4, max: 4 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to, amount, pin, narration } = req.body;

    try {
      // Using a session for atomicity
      const session = await User.startSession();
      session.startTransaction();

      const sender = await User.findById(req.user.id)
        .select("+pin")
        .session(session);
      if (!sender) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Sender not found" });
      }

      const isPinValid = await sender.comparePin(pin);
      if (!isPinValid) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Incorrect PIN" });
      }

      if (sender.balance < amount) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const recipient = await User.findOne({ accountNumber: to }).session(
        session
      );
      if (!recipient) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Recipient account not found" });
      }

      // Perform the transfer
      sender.balance -= amount;
      recipient.balance += amount;

      // Create transaction records for both sender and recipient
      const senderTransaction = {
        title: `To ${recipient.fullName}`,
        type: "Transfer",
        amount: -amount,
        status: "Completed",
        description: narration || `Transfer to ${recipient.fullName}`,
      };
      sender.transactions.unshift(senderTransaction);

      const recipientTransaction = {
        title: `From ${sender.fullName}`,
        type: "Transfer",
        amount: amount,
        status: "Completed",
        description: narration || `Transfer from ${sender.fullName}`,
      };
      recipient.transactions.unshift(recipientTransaction);

      await sender.save({ session });
      await recipient.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.json({ message: "Transfer successful", newBalance: sender.balance });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/transactions/airtime
// @desc    Buy airtime
// @access  Private
router.post(
  "/airtime",
  [
    auth,
    [
      check("network", "Network provider is required").not().isEmpty(),
      check("phoneNumber", "Phone number is required").isLength({
        min: 11,
        max: 11,
      }),
      check("amount", "Amount must be a positive number").isFloat({ gt: 0 }),
      check("pin", "Transaction PIN is required").isLength({ min: 4, max: 4 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { network, phoneNumber, amount, pin } = req.body;

    try {
      const user = await User.findById(req.user.id).select("+pin");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPinValid = await user.comparePin(pin);
      if (!isPinValid) {
        return res.status(400).json({ message: "Incorrect PIN" });
      }

      if (user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Perform transaction
      user.balance -= amount;
      user.transactions.unshift({
        title: `${network} Airtime`,
        type: "Airtime",
        amount: -amount,
        description: `Airtime for ${phoneNumber}`,
      });

      await user.save();
      res.json({
        message: "Airtime purchase successful",
        newBalance: user.balance,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/transactions/bill
// @desc    Pay a bill
// @access  Private
router.post(
  "/bill",
  [
    auth,
    [
      check("billerName", "Biller name is required").not().isEmpty(),
      check("customerId", "Customer ID is required").not().isEmpty(),
      check("amount", "Amount must be a positive number").isFloat({ gt: 0 }),
      check("pin", "Transaction PIN is required").isLength({ min: 4, max: 4 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { billerName, customerId, amount, pin } = req.body;

    try {
      const user = await User.findById(req.user.id).select("+pin");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPinValid = await user.comparePin(pin);
      if (!isPinValid) {
        return res.status(400).json({ message: "Incorrect PIN" });
      }

      if (user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Perform transaction
      user.balance -= amount;
      user.transactions.unshift({
        title: billerName,
        type: "Bills",
        amount: -amount,
        description: `Payment to ${billerName} for ${customerId}`,
      });

      await user.save();
      res.json({
        message: "Bill payment successful",
        newBalance: user.balance,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Note: The logic for Data is identical to Airtime for this implementation.
// A real-world app might have different logic (e.g., specific data plan IDs).
// For simplicity, we'll reuse the airtime logic structure.
router.post(
  "/data",
  [
    auth,
    [
      check("network", "Network provider is required").not().isEmpty(),
      check("phoneNumber", "Phone number is required").isLength({
        min: 11,
        max: 11,
      }),
      check("amount", "Amount must be a positive number").isFloat({ gt: 0 }),
      check("pin", "Transaction PIN is required").isLength({ min: 4, max: 4 }),
    ],
  ],
  async (req, res) => {
    // This is a simplified version. The logic is the same as airtime for now.
    // In a real app, you'd handle specific data plan details.
    const { network, phoneNumber, amount, pin, planLabel } = req.body;

    try {
      const user = await User.findById(req.user.id).select("+pin");
      if (!user) return res.status(404).json({ message: "User not found" });

      const isPinValid = await user.comparePin(pin);
      if (!isPinValid)
        return res.status(400).json({ message: "Incorrect PIN" });

      if (user.balance < amount)
        return res.status(400).json({ message: "Insufficient balance" });

      user.balance -= amount;
      user.transactions.unshift({
        title: `${network} Data`,
        type: "Data",
        amount: -amount,
        description: `${planLabel || "Data purchase"} for ${phoneNumber}`,
      });

      await user.save();
      res.json({
        message: "Data purchase successful",
        newBalance: user.balance,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
