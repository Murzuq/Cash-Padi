import express from "express";
import { body } from "express-validator";
import {
  createTransaction,
  getTransactions,
  verifyRecipient,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get("/", getTransactions);

router.post(
  "/",
  [
    body("title", "Title is required").not().isEmpty(),
    body("type", "Type is required").not().isEmpty(),
    body("amount", "Amount must be a number").isNumeric(),
  ],
  createTransaction
);

router.post("/verify-recipient", verifyRecipient);

export default router;
