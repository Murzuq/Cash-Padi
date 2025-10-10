import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../features/account/accountSlice";
import { API_ENDPOINTS } from "../config";

/**
 * A custom hook that automatically refetches user data when the browser tab becomes visible.
 * This helps keep the user's balance and transaction history synchronized.
 */
export const useDataRefetch = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.account);
  const token = user?.token;

  const refetchData = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(API_ENDPOINTS.GET_ME, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const updatedUser = await response.json();
        // Dispatch action to update the user data in Redux state
        dispatch(setUserData({ ...user, user: updatedUser }));
      }
    } catch (error) {
      console.error("Failed to refetch user data:", error);
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    // Add event listener for tab visibility change
    document.addEventListener("visibilitychange", refetchData);

    // Clean up the event listener when the component unmounts
    return () => document.removeEventListener("visibilitychange", refetchData);
  }, [refetchData]);
};
