import { API_URL } from "../config";

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
      if (!args.recipient || !args.amount) {
        return JSON.stringify({
          status: "error",
          message: "Recipient and amount are required.",
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
          to: args.recipient, // Assuming recipient name is the account number for simplicity
          amount: Number(args.amount),
          pin: "1234", // MOCK PIN - this needs a secure flow
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        return JSON.stringify({ status: "error", message: result.message });
      }
      return JSON.stringify({ status: "success", message: result.message });
    }
    case "getInvestmentAdvice": {
      // This remains a mock as there is no backend endpoint for it yet.
      return JSON.stringify({
        advice: `Based on your earnings and ${args.riskProfile} risk profile, we recommend a diversified portfolio.`,
      });
    }
    default:
      return JSON.stringify({ status: "error", message: "Unknown function." });
  }
};
