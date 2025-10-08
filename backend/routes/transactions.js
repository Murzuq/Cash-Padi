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

      // Create transaction records (optional, but good practice)
      // You would typically save these to a 'Transactions' collection

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

export default router;
