import { useState } from "react";
import { FaArrowLeft, FaMobileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { API_URL } from "../config"; // Import API_URL
import PinModal from "../components/PinModal";
import StatusModal from "../components/StatusModal";
import { setUserData } from "../features/account/accountSlice"; // Import setUserData
// Mock network providers
const networks = ["MTN", "Airtel", "Glo", "9mobile"];

const AirtimePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  const token = user?.token;
  const balance = user?.user?.balance ?? 0;
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState({
    status: "",
    title: "",
    message: "",
  });

  const handlePurchase = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 11) {
      setError("Please enter a valid 11-digit phone number.");
      return;
    }
    if (Number(amount) < 50) {
      setError("The minimum airtime purchase is ₦50.");
      return;
    }
    if (Number(amount) > balance) {
      setError("Insufficient balance for this purchase.");
      return;
    }
    setError("");
    setIsPinModalOpen(true);
  };

  const handleConfirmPurchase = async (pin) => {
    setIsConfirming(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/transactions/airtime`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          network,
          phoneNumber,
          amount: Number(amount),
          pin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Purchase failed.");
      }

      // On success, update UI
      // Refetch user data to get updated balance and transactions
      const userResponse = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = await userResponse.json();
      dispatch(setUserData(updatedUser)); // Dispatch action to update the whole user object

      setTransactionStatus({
        status: "success",
        title: "Purchase Successful!",
        message: `You have successfully bought ₦${Number(
          amount
        ).toLocaleString()} airtime for ${phoneNumber}.`,
      });
    } catch (err) {
      setTransactionStatus({
        status: "error",
        title: "Purchase Failed",
        message: err.message || "An unknown error occurred.",
      });
    } finally {
      setIsConfirming(false);
      setIsPinModalOpen(false);
      setIsStatusModalOpen(true);
    }
  };

  const isFormValid = network && phoneNumber.length === 11 && amount > 0;

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-xl mr-4"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Buy Airtime</h1>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <form
          onSubmit={handlePurchase}
          className="bg-white p-6 rounded-xl shadow-lg space-y-6"
        >
          <div>
            <label
              htmlFor="network"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mobile Network
            </label>
            <select
              id="network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="" disabled>
                Select network
              </option>
              {networks.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <FaMobileAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
                maxLength="11"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="08012345678"
              />
            </div>
            {error && error.includes("phone") && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (₦)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (
                  error.includes("minimum") ||
                  error.includes("Insufficient")
                ) {
                  setError("");
                }
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter amount"
            />
            {(error.includes("minimum") || error.includes("Insufficient")) && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
      </main>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onConfirm={handleConfirmPurchase}
        title="Confirm Airtime"
        isConfirming={isConfirming}
        details={
          <div className="space-y-1">
            <p className="text-sm text-gray-500">You are buying</p>
            <p className="text-2xl font-bold text-gray-800">
              ₦{Number(amount).toLocaleString()} Airtime
            </p>
            <p className="text-sm text-gray-500">for {phoneNumber}</p>
          </div>
        }
      />

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          if (transactionStatus.status === "success") navigate("/");
        }}
        {...transactionStatus}
      />
    </>
  );
};

export default AirtimePage;
