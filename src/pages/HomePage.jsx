import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaPaperPlane as FaSend,
  FaMicrophone,
  FaRegMoneyBillAlt,
  FaPiggyBank,
  FaEye,
  FaEyeSlash,
  FaPaperPlane,
  FaFileInvoiceDollar,
  FaMobileAlt,
  FaWifi,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

import { useSelector } from "react-redux";
import Transaction from "../components/Transaction.jsx";
import { useFinancialAssistant } from "../hooks/useFinancialAssistant.js";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

const HomePage = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [textInput, setTextInput] = useState("");
  // Use Redux's useSelector to get state from the store
  const {
    processVoiceCommand,
    processTextCommand,
    response,
    error,
    isProcessing,
  } = useFinancialAssistant();
  const { user } = useSelector((state) => state.account); // Select the top-level user object

  // Safely access nested properties
  const balance = user?.user?.balance ?? 0;
  const accountNumber = user?.user?.accountNumber;
  const fullName = user?.user?.fullName;
  const transactions = user?.user?.transactions || []; // Default to an empty array
  console.log("User data from Redux:", user);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleCopy = () => {
    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber).then(() => {
        setIsCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        processVoiceCommand(audioBlob);
        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // You might want to set an error state here to inform the user
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      processTextCommand(textInput);
    }
  };
  // Format the balance from the context
  const formattedBalance = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(balance);
  const displayedTransactions = transactions.slice(0, 3);

  return (
    <main className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Main Dashboard */}
        <div className="lg:col-span-2 space-y-8">
          {/* Balance and Voice Command */}
          {fullName && (
            <div className="flex justify-between items-center">
              <div className="text-2xl font-semibold text-gray-800">
                <h2>Welcome back, {fullName.split(" ")[0]}!</h2>
              </div>
              <LanguageSwitcher />
            </div>
          )}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-500">
                Available Balance
              </h2>
              <button
                onClick={toggleBalanceVisibility}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                {isBalanceVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
              {isBalanceVisible ? formattedBalance : "₦******.**"}
            </p>
            {accountNumber && (
              <div className="flex items-center justify-left space-x-2 mt-3">
                <p className="text-base text-gray-600">A/C: {accountNumber}</p>
                <button
                  onClick={handleCopy}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Copy account number"
                >
                  {isCopied ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaCopy />
                  )}
                </button>
              </div>
            )}

            {/* Voice Command Area */}
            <div className="mt-8 bg-green-50 p-4 rounded-lg border border-green-200">
              <button
                onMouseDown={handleStartRecording}
                onMouseUp={handleStopRecording}
                onTouchStart={handleStartRecording}
                onTouchEnd={handleStopRecording}
                disabled={isProcessing}
                className="w-full flex flex-col items-center justify-center text-center text-green-800 hover:bg-green-100 p-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-wait"
              >
                <FaMicrophone className="text-4xl mb-2" />
                <span className="font-semibold">
                  {isProcessing ? "Processing..." : "Hold to Speak"}
                </span>
                <span className="text-sm">(Soro Bayi)</span>
              </button>
              {/* Text Input Area */}
              <form
                onSubmit={handleTextSubmit}
                className="mt-4 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Or type your command..."
                  disabled={isProcessing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !textInput.trim()}
                  className="p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  aria-label="Send text command"
                >
                  <FaSend />
                </button>
              </form>

              {/* Display Gemini Response or Error */}
              {response && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
                  <p>{response}</p>
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                  <p>Error: {error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <Link
                to="/transfer"
                className="flex flex-col items-center space-y-2 text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="p-3 bg-green-100 rounded-full">
                  <FaPaperPlane className="text-lg sm:text-xl text-green-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Transfer</span>
              </Link>
              <Link
                to="/bills"
                className="flex flex-col items-center space-y-2 text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="p-3 bg-green-100 rounded-full">
                  <FaFileInvoiceDollar className="text-lg sm:text-xl text-green-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Pay Bill</span>
              </Link>
              <Link
                to="/airtime"
                className="flex flex-col items-center space-y-2 text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="p-3 bg-green-100 rounded-full">
                  <FaMobileAlt className="text-lg sm:text-xl text-green-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Airtime</span>
              </Link>
              <Link
                to="/data"
                className="flex flex-col items-center space-y-2 text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="p-3 bg-green-100 rounded-full">
                  <FaWifi className="text-lg sm:text-xl text-green-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Data</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Activity
              </h2>
              {transactions.length > 3 && (
                <Link
                  to="/history"
                  className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors"
                >
                  View All
                </Link>
              )}
            </div>
            <ul className="space-y-3">
              {displayedTransactions.map((transaction, index) => (
                <span key={transaction._id || transaction.id}>
                  {index > 0 && <div className="border-t border-gray-200" />}
                  <Transaction {...transaction} />
                </span>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Section: Financial Tools */}
        <div className="lg:col-span-1 space-y-8">
          {/* Pay Bill by Picture */}
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaRegMoneyBillAlt className="text-2xl text-green-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Pay Bill by Picture
              </h3>
              <p className="text-gray-600 mt-1">
                Scan utility bills or invoices instantly.
              </p>
            </div>
          </div>

          {/* Start Micro-Savings */}
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaPiggyBank className="text-2xl text-green-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Start Micro-Savings
              </h3>
              <p className="text-gray-600 mt-1">
                Set a goal for market expansion or school fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
