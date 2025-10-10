import { API_URL, API_ENDPOINTS } from "../config";

/**
 * Helper to refetch user data after a transaction.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<object|null>} The updated user object or null on failure.
 */
const refetchUserData = async (token) => {
  const userResponse = await fetch(API_ENDPOINTS.GET_ME, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (userResponse.ok) {
    return await userResponse.json();
  }
  return null;
};

/**
 * Simulates a secure backend call to execute a financial function.
 * In a real app, this would be a fetch call to your authenticated server endpoints.
 * @param {string} functionName - The name of the function to execute.
 * @param {object} args - The arguments for the function.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<string>} A stringified JSON result of the operation.
 */
export const secureBackendCall = async (functionName, args, token) => {
  console.log(`Executing secure backend function: ${functionName}`, args);

  switch (functionName) {
    case "checkBalance": {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        return JSON.stringify({
          status: "error",
          message: "Failed to fetch balance.",
        });
      }
      const user = await response.json();
      return JSON.stringify({ balance: user.balance });
    }
    case "transferMoney": {
      if (!args.recipientAccountNumber || !args.amount) {
        return JSON.stringify({
          status: "error",
          message: "Recipient account number and amount are required.",
        });
      }
      // This is a simplified transfer. A real implementation would need account verification, PIN, etc.
      const response = await fetch(`${API_URL}/api/transactions/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // NOTE: This assumes the recipient is an account number and requires a PIN.
        // We are mocking the PIN for this example.
        body: JSON.stringify({
          to: args.recipientAccountNumber,
          amount: Number(args.amount),
          pin: "1234", // MOCK PIN - this needs a secure flow
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        return JSON.stringify({ status: "error", message: result.message });
      }
      const updatedUser = await refetchUserData(token);
      return JSON.stringify({
        status: "success",
        ...result,
        updatedUser, // Pass the updated user data back
      });
    }
    case "getInvestmentAdvice": {
      // This remains a mock as there is no backend endpoint for it yet.
      return JSON.stringify({
        advice: `Based on your earnings and ${args.riskProfile} risk profile, we recommend a diversified portfolio.`,
      });
    }
    case "buyAirtime": {
      if (!args.network || !args.phoneNumber || !args.amount) {
        return JSON.stringify({
          status: "error",
          message:
            "Network, phone number, and amount are required for airtime purchase.",
        });
      }
      const response = await fetch(`${API_URL}/api/transactions/airtime`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          network: args.network,
          phoneNumber: args.phoneNumber,
          amount: Number(args.amount),
          pin: "1234", // MOCK PIN
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        return JSON.stringify({ status: "error", message: result.message });
      }
      const updatedUser = await refetchUserData(token);
      return JSON.stringify({
        status: "success",
        ...result,
        updatedUser, // Pass the updated user data back
      });
    }
    case "payBill": {
      if (!args.billerName || !args.customerId || !args.amount) {
        return JSON.stringify({
          status: "error",
          message:
            "Biller name, customer ID, and amount are required for bill payment.",
        });
      }
      const response = await fetch(`${API_URL}/api/transactions/bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          billerName: args.billerName,
          customerId: args.customerId,
          amount: Number(args.amount),
          pin: "1234", // MOCK PIN
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        return JSON.stringify({ status: "error", message: result.message });
      }
      const updatedUser = await refetchUserData(token);
      return JSON.stringify({
        status: "success",
        ...result,
        updatedUser, // Pass the updated user data back
      });
    }
    case "getSavingsTips": {
      // This is a mock response. A real implementation would analyze user data.
      const tips = [
        "Try the 50/30/20 budget rule: 50% for needs, 30% for wants, and 20% for savings.",
        "Automate your savings. Set up a recurring transfer to your savings account right after you get paid.",
        "Review your subscriptions. You might be paying for services you no longer use.",
        "Consider rounding up your purchases to the nearest Naira and saving the difference.",
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      return JSON.stringify({
        tip: randomTip,
      });
    }
    default:
      return JSON.stringify({ status: "error", message: "Unknown function." });
  }
};
