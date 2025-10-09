import { useState, useMemo } from "react";
import {
  FaArrowLeft,
  FaBolt,
  FaTv,
  FaWifi,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useSelector, useDispatch } from "react-redux";

import { transactionAdded } from "../features/account/accountSlice";
import PinModal from "../components/PinModal";
import StatusModal from "../components/StatusModal";
// Mock data for billers
const billers = {
  Electricity: [
    { id: "ikeja-electric", name: "Ikeja Electric (IKEDC)", icon: FaBolt },
    { id: "eko-electric", name: "Eko Electric (EKEDC)", icon: FaBolt },
    { id: "aedc", name: "Abuja Electric (AEDC)", icon: FaBolt },
  ],
  "Cable TV": [
    { id: "dstv", name: "DSTV", icon: FaTv },
    { id: "gotv", name: "GoTV", icon: FaTv },
    { id: "startimes", name: "StarTimes", icon: FaTv },
  ],
  Internet: [
    { id: "spectranet", name: "Spectranet", icon: FaWifi },
    { id: "smile", name: "Smile Communications", icon: FaWifi },
  ],
};

const getBillerDetails = (billerId) => {
  for (const category in billers) {
    const foundBiller = billers[category].find((b) => b.id === billerId);
    if (foundBiller) return foundBiller;
  }
  return null;
};

const BillsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  const token = user?.token;
  const balance = user?.user?.balance ?? 0;
  const [category, setCategory] = useState("");
  const [billerId, setBillerId] = useState("");
  const [customerId, setCustomerId] = useState("");
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

  const availableBillers = useMemo(
    () => (category ? billers[category] : []),
    [category]
  );

  const handlePayment = (e) => {
    e.preventDefault();
    if (Number(amount) < 100) {
      setError("The minimum payment amount is ₦100.");
      return;
    }
    if (Number(amount) > balance) {
      setError("Insufficient balance for this payment.");
      return;
    }
    setError("");
    setIsPinModalOpen(true);
  };

  const handleConfirmPayment = async (pin) => {
    setIsConfirming(true);
    setError("");

    const biller = getBillerDetails(billerId);
    if (!biller) {
      setError("Biller details not found.");
      setIsConfirming(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/transactions/bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          billerName: biller.name,
          customerId,
          amount: Number(amount),
          pin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed.");
      }

      // On success, update UI
      dispatch(
        transactionAdded({
          title: biller.name,
          type: "Bills",
          amount: -Number(amount),
          status: "Completed",
          description: `Payment for ${biller.name}`,
        })
      );

      setTransactionStatus({
        status: "success",
        title: "Payment Successful!",
        message: `Your payment of ₦${Number(amount).toLocaleString()} to ${
          biller.name
        } was successful.`,
      });
    } catch (err) {
      setTransactionStatus({
        status: "error",
        title: "Payment Failed",
        message: err.message || "An unknown error occurred.",
      });
    } finally {
      setIsConfirming(false);
      setIsPinModalOpen(false);
      setIsStatusModalOpen(true);
    }
  };

  const isFormValid = category && billerId && customerId && amount > 0;

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-xl mr-4"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Pay Bills</h1>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <form
          onSubmit={handlePayment}
          className="bg-white p-6 rounded-xl shadow-lg space-y-6"
        >
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bill Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setBillerId("");
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="" disabled>
                Select a category
              </option>
              {Object.keys(billers).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="biller"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Biller
            </label>
            <select
              id="biller"
              value={billerId}
              onChange={(e) => setBillerId(e.target.value)}
              required
              disabled={!category}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
            >
              <option value="" disabled>
                Select a biller
              </option>
              {availableBillers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="customerId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer/Account ID
            </label>
            <div className="relative">
              <FaUserCircle className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Meter or Smartcard number"
              />
            </div>
            {/* This space is reserved for customer ID-specific errors in the future */}
            {/* {error && error.includes("Customer") && <p className="text-sm text-red-600 mt-2">{error}</p>} */}
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
        onConfirm={handleConfirmPayment}
        title="Confirm Bill Payment"
        isConfirming={isConfirming}
        details={
          <div className="space-y-1">
            <p className="text-sm text-gray-500">You are paying</p>
            <p className="text-2xl font-bold text-gray-800">
              ₦{Number(amount).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              to {getBillerDetails(billerId)?.name}
            </p>
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

export default BillsPage;
