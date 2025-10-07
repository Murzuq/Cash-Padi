import { createSlice } from "@reduxjs/toolkit";
import initialTransactions from "../../data/transactions.json";

const initialState = {
  // Check localStorage to see if the user was previously logged in
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  // Retrieve account number from localStorage or set to null
  accountNumber: localStorage.getItem("accountNumber") || null,
  // The initial balance from your original context
  balance: 25759992.79,
  transactions: initialTransactions,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // This is our action. It handles adding a new transaction.
    transactionAdded: (state, action) => {
      const newTransaction = {
        id: new Date().toISOString(),
        date: new Date().toISOString(), // We'll format this in the component
        ...action.payload,
      };

      // Redux Toolkit allows us to "mutate" state directly in reducers
      // because it uses Immer under the hood.
      state.transactions.unshift(newTransaction);
      state.balance += newTransaction.amount; // Assumes amount is negative for debits
    },
    // Action to handle user login
    login: (state) => {
      // Only generate a new account number if one doesn't already exist
      if (!state.accountNumber) {
        // Generate a random 10-digit account number
        const newAccountNumber = Math.floor(
          1000000000 + Math.random() * 9000000000
        ).toString();
        state.accountNumber = newAccountNumber;
        localStorage.setItem("accountNumber", newAccountNumber);
      }
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true");
    },
    // Action to handle user logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.accountNumber = null;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accountNumber");
    },
  },
});

export const { transactionAdded, login, logout } = accountSlice.actions;

export default accountSlice.reducer;
