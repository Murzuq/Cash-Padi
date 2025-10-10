import { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";

const DepositModal = ({ isOpen, onClose, onDeposit, isLoading }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount > 0) {
      onDeposit(parseFloat(amount));
      setAmount(""); // Clear amount after deposit attempt
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Deposit Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to save"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? "Depositing..." : "Confirm Deposit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
