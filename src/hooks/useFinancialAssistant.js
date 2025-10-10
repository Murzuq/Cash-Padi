import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { genAI } from "../gemini/config";
import { setUserData } from "../features/account/accountSlice";
import { secureBackendCall } from "../utils/secureBackend";

// Define the Tool Schemas for the Gemini model
const tools = [
  {
    functionDeclarations: [
      {
        name: "checkBalance",
        description: "Checks the current balance for a user's primary account.",
        parameters: { type: "OBJECT", properties: {} },
      },
      {
        name: "transferMoney",
        description: "Executes a money transfer to a specific recipient.",
        parameters: {
          type: "OBJECT",
          properties: {
            recipientAccountNumber: {
              type: "STRING",
              description:
                "The 10-digit account number of the person to receive the money.",
            },
            amount: { type: "NUMBER" },
          },
          required: ["recipientAccountNumber", "amount"],
        },
      },
      {
        name: "getInvestmentAdvice",
        description:
          "Provides personalized investment recommendations based on earnings and profile.",
        parameters: {
          type: "OBJECT",
          properties: {
            earnings: { type: "NUMBER" },
            riskProfile: { type: "STRING", enum: ["low", "moderate", "high"] },
          },
          required: ["earnings", "riskProfile"],
        },
      },
      {
        name: "buyAirtime",
        description: "Purchases airtime for a specified phone number.",
        parameters: {
          type: "OBJECT",
          properties: {
            network: {
              type: "STRING",
              enum: ["MTN", "Airtel", "Glo", "9mobile"],
            },
            phoneNumber: { type: "STRING" },
            amount: { type: "NUMBER" },
          },
          required: ["network", "phoneNumber", "amount"],
        },
      },
      {
        name: "payBill",
        description: "Pays a utility bill, like electricity or cable TV.",
        parameters: {
          type: "OBJECT",
          properties: {
            billerName: {
              type: "STRING",
              description: "e.g., 'Ikeja Electric', 'DSTV'",
            },
            customerId: {
              type: "STRING",
              description: "The meter number or account ID for the bill.",
            },
            amount: { type: "NUMBER" },
          },
          required: ["billerName", "customerId", "amount"],
        },
      },
      {
        name: "getSavingsTips",
        description:
          "Provides personalized tips for saving money based on spending habits.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
    ],
  },
];

export const useFinancialAssistant = () => {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useSelector((state) => state.account.user);
  const token = user?.token;
  const dispatch = useDispatch();

  const processVoiceCommand = useCallback(
    async (audioData) => {
      if (!audioData) {
        setError("No audio data provided.");
        return;
      }

      setIsProcessing(true);
      setResponse("");
      setError("");

      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-pro",
          tools,
        });
        const chat = model.startChat();

        // Convert audio blob to a base64 string
        const reader = new FileReader();
        const base64Audio = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(audioData);
        });

        const result = await chat.sendMessage([
          {
            inlineData: { mimeType: audioData.type, data: base64Audio },
          },
        ]);

        const modelResponse = result.response;
        const functionCalls = modelResponse.functionCalls();

        if (functionCalls && functionCalls.length > 0) {
          console.log("Gemini requested a function call:", functionCalls[0]);
          const call = functionCalls[0];

          // Call the simulated secure backend
          const apiResponse = await secureBackendCall(
            call.name,
            call.args,
            token
          );
          const apiResponseData = JSON.parse(apiResponse);

          // If the backend call returned updated user data, dispatch it to Redux
          if (apiResponseData.updatedUser) {
            dispatch(
              setUserData({ ...user, user: apiResponseData.updatedUser })
            );
            delete apiResponseData.updatedUser; // Don't send this back to Gemini
          }

          // Send the result back to the model
          const result2 = await chat.sendMessage([
            {
              functionResponse: {
                name: call.name,
                response: { result: apiResponse },
              },
            },
          ]);

          setResponse(result2.response.text());
        } else {
          // It's a standard text response
          setResponse(modelResponse.text());
        }
      } catch (e) {
        console.error("Error processing voice command:", e);
        setError(e.message || "An unknown error occurred.");
      } finally {
        setIsProcessing(false);
      }
    },
    [token, dispatch, user]
  );

  const processTextCommand = useCallback(
    async (prompt) => {
      if (!prompt) {
        setError("No text prompt provided.");
        return;
      }

      setIsProcessing(true);
      setResponse("");
      setError("");

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro", tools });
        const chat = model.startChat();

        const result = await chat.sendMessage(prompt);
        const modelResponse = result.response;
        const functionCalls = modelResponse.functionCalls();

        if (functionCalls && functionCalls.length > 0) {
          const call = functionCalls[0];
          const apiResponse = await secureBackendCall(
            call.name,
            call.args,
            token
          );
          const apiResponseData = JSON.parse(apiResponse);

          // If the backend call returned updated user data, dispatch it to Redux
          if (apiResponseData.updatedUser) {
            dispatch(
              setUserData({ ...user, user: apiResponseData.updatedUser })
            );
            delete apiResponseData.updatedUser; // Don't send this back to Gemini
          }
          const result2 = await chat.sendMessage([
            {
              functionResponse: {
                name: call.name,
                response: { result: apiResponse },
              },
            },
          ]);
          setResponse(result2.response.text());
        } else {
          setResponse(modelResponse.text());
        }
      } catch (e) {
        console.error("Error processing text command:", e);
        setError(e.message || "An unknown error occurred.");
      } finally {
        setIsProcessing(false);
      }
    },
    [token, dispatch, user]
  );

  return {
    processVoiceCommand,
    processTextCommand,
    response,
    error,
    isProcessing,
  };
};
