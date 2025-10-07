import { createSlice } from "@reduxjs/toolkit";
import initialTransactions from "../../data/transactions.json";

const initialState = {
  user: null,
  isAuthenticated: false,
  // Note: balance, accountNumber, and fullName will now live inside the user object
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
    login: (state, action) => {
      // The payload is the full API response: { user: { ... }, token: "..." }
      // or from localStorage: { user: { ... }, token: "..." }
      state.user = action.payload.user;
      state.user.token = action.payload.token; // Attach token to the user object
      state.isAuthenticated = true;
    },
    // Action to handle user logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // We will also clear localStorage where the logout is dispatched
    },
  },
});

export const { transactionAdded, login, logout } = accountSlice.actions;

export default accountSlice.reducer;
