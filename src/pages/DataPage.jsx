import { useState, useMemo } from "react";
import { FaArrowLeft, FaMobileAlt, FaWifi } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import PinModal from "../components/PinModal";
import StatusModal from "../components/StatusModal";
import { transactionAdded } from "../features/account/accountSlice";
// Mock network providers and their data plans
const networks = ["MTN", "Airtel", "Glo", "9mobile"];
const dataPlans = {
  MTN: [
    { id: "mtn1", label: "1.5GB - 30 days", amount: 1000 },
    { id: "mtn2", label: "4.5GB - 30 days", amount: 2000 },
    { id: "mtn3", label: "10GB - 30 days", amount: 3500 },
    { id: "mtn4", label: "20GB - 30 days", amount: 5000 },
  ],
  Airtel: [
    { id: "airtel1", label: "1.5GB - 30 days", amount: 1000 },
    { id: "airtel2", label: "6GB - 30 days", amount: 2500 },
    { id: "airtel3", label: "11GB - 30 days", amount: 4000 },
    { id: "airtel4", label: "25GB - 30 days", amount: 6000 },
  ],
  Glo: [
    { id: "glo1", label: "2.9GB - 30 days", amount: 1000 },
    { id: "glo2", label: "7.7GB - 30 days", amount: 2000 },
    { id: "glo3", label: "13.25GB - 30 days", amount: 3000 },
    { id: "glo4", label: "18.25GB - 30 days", amount: 4000 },
  ],
  "9mobile": [
    { id: "9mobile1", label: "1.5GB - 30 days", amount: 1000 },
    { id: "9mobile2", label: "4.5GB - 30 days", amount: 2000 },
    { id: "9mobile3", label: "15GB - 30 days", amount: 5000 },
    { id: "9mobile4", label: "40GB - 30 days", amount: 10000 },
  ],
};

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DataPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  const token = user?.token;
  const balance = user?.user?.balance ?? 0;
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [planId, setPlanId] = useState("");
  const [error, setError] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState({
    status: "",
    title: "",
    message: "",
  });

  const selectedPlan = useMemo(() => {
    if (!network || !planId) return null;
    return dataPlans[network].find((p) => p.id === planId);
  }, [network, planId]);

  const handlePurchase = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 11) {
      setError("Please enter a valid 11-digit phone number.");
      return;
    }
    if (selectedPlan && selectedPlan.amount > balance) {
      setError("Insufficient balance for this purchase.");
      return;
    }
    setError("");
    setIsPinModalOpen(true);
  };

  const handleConfirmPurchase = async (pin) => {
    setIsConfirming(true);
    setError("");

    if (!selectedPlan) {
      setError("No data plan selected.");
      setIsConfirming(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/transactions/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          network,
          phoneNumber,
          amount: selectedPlan.amount,
          pin,
          planLabel: selectedPlan.label,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Purchase failed.");
      }

      // On success, update UI
      dispatch(
        transactionAdded({
          title: `${network} Data`,
          type: "Data",
          amount: -selectedPlan.amount,
          status: "Completed",
          description: `${selectedPlan.label} for ${phoneNumber}`,
        })
      );

      setTransactionStatus({
        status: "success",
        title: "Purchase Successful!",
        message: `You have successfully bought ${selectedPlan.label} for ${phoneNumber}.`,
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

  const isFormValid = network && phoneNumber.length === 11 && planId;

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-xl mr-4"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Buy Data</h1>
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
              onChange={(e) => {
                setNetwork(e.target.value);
                setPlanId("");
              }}
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
            {(error.includes("phone") || error.includes("Insufficient")) && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="plan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data Plan
            </label>
            <div className="relative">
              <FaWifi className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <select
                id="plan"
                value={planId}
                onChange={(e) => {
                  setPlanId(e.target.value);
                  if (error.includes("Insufficient")) {
                    setError("");
                  }
                }}
                required
                disabled={!network}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
              >
                <option value="" disabled>
                  Select a plan
                </option>
                {network &&
                  dataPlans[network].map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                    >{`${p.label} - ₦${p.amount}`}</option>
                  ))}
              </select>
            </div>
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
        title="Confirm Data Purchase"
        isConfirming={isConfirming}
        details={
          selectedPlan && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">You are buying</p>
              <p className="text-xl font-bold text-gray-800">
                {selectedPlan.label}
              </p>
              <p className="text-sm text-gray-500">for {phoneNumber}</p>
            </div>
          )
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

export default DataPage;
