import { useState, useCallback, useRef, useEffect } from "react";
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
  const utteranceRef = useRef(null); // Keep a reference to the utterance
  const [voices, setVoices] = useState([]);

  // Effect to load speech synthesis voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Text-to-Speech not supported in this browser.");
      return;
    }

    // Function to populate the voices
    const loadVoices = () => {
      const voiceList = synth.getVoices();
      if (voiceList.length > 0) {
        setVoices(voiceList);
      }
    };

    // Load voices immediately
    loadVoices();

    // If voices are not loaded yet, set up an event listener
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  /**
   * Uses the Web Speech API to speak the provided text.
   * @param {string} text The text to be spoken.
   */
  const speak = (text) => {
    if ("speechSynthesis" in window && text) {
      // Cancel any currently speaking utterances
      window.speechSynthesis.cancel();

      utteranceRef.current = new SpeechSynthesisUtterance(text);

      // --- Voice Selection ---
      // You can change the priority here to select a different voice.
      // For a Nigerian accent, you might look for 'en-NG'.
      // For a British accent, you might look for 'en-GB'.
      const preferredVoice =
        voices.find((v) => v.lang === "en-GB" && v.name.includes("Google")) || // Google UK English
        voices.find((v) => v.lang === "en-NG") || // Any Nigerian voice
        voices.find((v) => v.lang === "en-GB") || // Any UK voice
        voices.find((v) => v.name === "Google US English") || // Fallback to US
        voices.find(
          (v) => v.lang.startsWith("en-") && v.name.includes("Google")
        ); // Fallback to any other Google English voice

      if (preferredVoice) {
        utteranceRef.current.voice = preferredVoice;
      }

      utteranceRef.current.rate = 0.95; // Slightly slower for clarity
      utteranceRef.current.pitch = 1;
      window.speechSynthesis.speak(utteranceRef.current);
    }
  };
  const processVoiceCommand = useCallback(
    async (audioData) => {
      if (!audioData) {
        setError("No audio data provided.");
        return;
      }

      // Prime the speech synthesis engine by speaking an empty string.
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));

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
            dispatch(setUserData({ ...user, ...apiResponseData.updatedUser }));
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

          const responseText = result2.response.text();
          setResponse(responseText);
          speak(responseText);
        } else {
          // It's a standard text response
          const responseText = modelResponse.text();
          setResponse(responseText);
          speak(responseText);
        }
      } catch (e) {
        console.error("Error processing voice command:", e);
        setError(e.message || "An unknown error occurred.");
      } finally {
        setIsProcessing(false);
      }
    },
    [token, dispatch, user, voices, speak]
  );

  const processTextCommand = useCallback(
    async (prompt) => {
      if (!prompt) {
        setError("No text prompt provided.");
        return;
      }

      // Prime the speech synthesis engine by speaking an empty string.
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));

      setIsProcessing(true);
      setResponse("");
      setError("");

      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-pro",
          tools,
        });
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
            dispatch(setUserData({ ...user, ...apiResponseData.updatedUser }));
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
          const responseText = result2.response.text();
          setResponse(responseText);
          speak(responseText);
        } else {
          const responseText = modelResponse.text();
          setResponse(responseText);
          speak(responseText);
        }
      } catch (e) {
        console.error("Error processing text command:", e);
        setError(e.message || "An unknown error occurred.");
      } finally {
        setIsProcessing(false);
      }
    },
    [token, dispatch, user, voices, speak]
  );

  return {
    processVoiceCommand,
    processTextCommand,
    response,
    error,
    isProcessing,
  };
};
