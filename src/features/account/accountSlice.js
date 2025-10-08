import { createSlice } from "@reduxjs/toolkit";

// Helper function to parse and normalize user data from localStorage
const getInitialUserState = () => {
  const storedUserString = localStorage.getItem("user");
  if (storedUserString) {
    try {
      const parsedData = JSON.parse(storedUserString); // Expects { user: { ... }, token: "..." }
      if (parsedData && parsedData.user) {
        // Ensure transactions array exists within the nested user object
        if (!parsedData.user.transactions) {
          parsedData.user.transactions = [];
        }
        return parsedData; // Return the full { user: { ... }, token: "..." } object
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem("user"); // Clear corrupted data
    }
  }
  return null;
};

const initialState = {
  user: getInitialUserState(), // This will be { user: { ... }, token: "..." } or null
  isAuthenticated: !!getInitialUserState(),
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    transactionAdded: (state, action) => {
      // Check if the nested user object exists
      if (state.user && state.user.user) {
        // Ensure transactions array exists before attempting to unshift
        if (!state.user.user.transactions) {
          state.user.user.transactions = [];
        }
        const newTransaction = {
          id: new Date().toISOString(), // Use a temporary unique ID
          date: new Date().toISOString(),
          ...action.payload,
        };
        // Add to the beginning of the array within the nested user object
        state.user.user.transactions.unshift(newTransaction);
        // Update balance within the nested user object
        state.user.user.balance += newTransaction.amount;
        // Update localStorage to persist the changes
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    login: (state, action) => {
      // action.payload is expected to be { token: "...", user: { ... } } from the API
      state.user = action.payload;
      state.isAuthenticated = true;
      // Defensive check: Ensure transactions array exists for new users
      if (state.user && !state.user.transactions) {
        state.user.transactions = [];
      }
      // Update localStorage after login
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Clear the persisted user data from localStorage
      localStorage.removeItem("user");
    },
  },
});

export const { transactionAdded, login, logout } = accountSlice.actions;

export default accountSlice.reducer;
