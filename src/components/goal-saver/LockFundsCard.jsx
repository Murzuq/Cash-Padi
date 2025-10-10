import { FaLock } from "react-icons/fa";

const LockFundsCard = ({ onLockClick }) => (
  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4">
    <div className="flex items-center space-x-4">
      <div className="bg-blue-100 p-3 rounded-full">
        <FaLock className="text-2xl text-blue-700" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800">
          Lock Funds for Interest
        </h3>
        <p className="text-sm text-gray-600">
          Earn more by locking your savings for a fixed duration.
        </p>
      </div>
    </div>
    <div className="flex justify-around pt-2">
      {["3", "6", "12"].map((months) => (
        <button
          key={months}
          onClick={() => onLockClick(months)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
        >
          {months} months
        </button>
      ))}
    </div>
  </div>
);

export default LockFundsCard;
