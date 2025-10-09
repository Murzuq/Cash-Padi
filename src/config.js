export const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  GET_ME: `${API_URL}/api/users/me`,
};
