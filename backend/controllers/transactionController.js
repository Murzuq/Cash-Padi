import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

const createAndSaveTransaction = async (
  userId,
  title,
  type,
  amount,
  description
) => {
  const transaction = new Transaction({
    user: userId,
    title,
    type,
    amount, // Should be negative for debits
    status: "Completed",
    description,
  });
  await transaction.save();
  return transaction;
};

export const createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, type, amount, description } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (type !== "Deposit" && user.balance < Math.abs(amount)) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update user balance
    user.balance += amount; // amount is negative for debits, positive for credits
    await user.save();

    // Create transaction record
    const transaction = await createAndSaveTransaction(
      req.user.id,
      title,
      type,
      amount,
      description
    );

    res.status(201).json({
      message: `${type} successful!`,
      transaction,
      newBalance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mock recipient verification
export const verifyRecipient = async (req, res) => {
  const { accountNumber, bank } = req.body;

  if (!accountNumber || accountNumber.length !== 10 || !bank) {
    return res
      .status(400)
      .json({ message: "Valid account number and bank are required." });
  }

  // In a real app, you would look this up in your DB or via a 3rd party API
  // For now, we'll just return a mock name.
  setTimeout(() => {
    // Simulate network delay
    if (accountNumber.startsWith("0")) {
      res.status(200).json({ recipientName: "Murzuq Isah" });
    } else if (accountNumber.startsWith("1")) {
      res.status(200).json({ recipientName: "Jane Doe" });
    } else {
      res.status(404).json({ message: "Recipient not found" });
    }
  }, 1500);
};
