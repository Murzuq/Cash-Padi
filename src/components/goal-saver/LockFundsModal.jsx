import { useState, useEffect } from "react";
import { FaLock, FaTimes, FaSpinner } from "react-icons/fa";

const LockFundsModal = ({
  isOpen,
  onClose,
  onConfirm,
  duration,
  isLoading,
  currentBalance,
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!amount) {
      setError("");
      return;
    }
    const numericAmount = parseFloat(amount);
    if (numericAmount < 5000) {
      setError("Minimum lock amount is ₦5,000.");
    } else if (numericAmount > 5000000) {
      setError("Maximum lock amount is ₦5,000,000.");
    } else if (numericAmount > currentBalance) {
      setError("Amount exceeds your available savings balance.");
    } else {
      setError("");
    }
  }, [amount, currentBalance]);

  if (!isOpen) return null;

  // Mock interest rates for display
  const interestRates = {
    3: 0.075, // 7.5%
    6: 0.1, // 10%
    12: 0.125, // 12.5%
  };

  const annualRate = interestRates[duration] || 0;
  const interestRateDisplay = `${(annualRate * 100).toFixed(1)}%`;

  const unlockDate = new Date();
  unlockDate.setMonth(unlockDate.getMonth() + parseInt(duration, 10));

  const calculatedInterest =
    amount > 0 ? amount * annualRate * (parseInt(duration, 10) / 12) : 0;

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(num);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FaLock className="text-2xl text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">Lock Funds</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center mb-4">
            <p className="text-gray-600">
              Lock for <span className="font-bold">{duration} months</span> and
              earn a{" "}
              <span className="font-bold text-emerald-600">
                {interestRateDisplay} p.a.
              </span>{" "}
              interest rate!
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Lock (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max: ${formatCurrency(currentBalance)}`}
              min="5000"
              max={currentBalance}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Interest:</span>
              <span className="font-bold text-emerald-700">
                {formatCurrency(calculatedInterest)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unlock Date:</span>
              <span className="font-bold text-gray-800">
                {unlockDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2">
          <button
            onClick={() => onConfirm(amount)}
            className="w-full flex justify-center items-center py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={
              isLoading ||
              !amount ||
              parseFloat(amount) < 5000 ||
              parseFloat(amount) > 5000000 ||
              parseFloat(amount) > currentBalance ||
              !!error
            }
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Confirm & Lock"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockFundsModal;
