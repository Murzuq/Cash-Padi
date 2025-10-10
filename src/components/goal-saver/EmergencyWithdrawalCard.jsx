import { FaExclamationTriangle } from "react-icons/fa";

const EmergencyWithdrawalCard = () => {
  const handleWithdraw = () => {
    // In a real app, this would trigger a more complex flow with warnings and confirmations.
    alert(
      "Emergency withdrawal initiated. Note that this may affect your interest."
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="bg-red-100 p-3 rounded-full">
          <FaExclamationTriangle className="text-2xl text-red-700" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Emergency Withdrawal
          </h3>
          <p className="text-sm text-gray-600">
            Access locked funds before maturity. Penalties may apply.
          </p>
        </div>
      </div>
      <button
        onClick={handleWithdraw}
        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
      >
        Withdraw Now
      </button>
    </div>
  );
};

export default EmergencyWithdrawalCard;
