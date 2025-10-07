import { createSlice } from "@reduxjs/toolkit";
import initialTransactions from "../../data/transactions.json";

const initialState = {
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
  },
});

export const { transactionAdded } = accountSlice.actions;

export default accountSlice.reducer;
