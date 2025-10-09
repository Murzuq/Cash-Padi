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
    // This reducer is used to completely replace the user state with fresh data
    // from the backend (e.g., after login or a successful transaction).
    setUserData: (state, action) => {
      // action.payload is expected to be { user: { ... }, token: "..." } from the API
      state.user = action.payload;
      state.isAuthenticated = true;
      // Defensive check: Ensure transactions array exists within the nested user object
      if (state.user && state.user.user && !state.user.user.transactions) {
        state.user.user.transactions = [];
      }
      // Update localStorage after setting user data
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    login: (state, action) => {
      // action.payload is expected to be { token: "...", user: { ... } } from the API
      // The login action now simply calls setUserData to handle the state update
      accountSlice.caseReducers.setUserData(state, action);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Clear the persisted user data from localStorage
      localStorage.removeItem("user");
    },
  },
});

export const { setUserData, login, logout } = accountSlice.actions;

export default accountSlice.reducer;
