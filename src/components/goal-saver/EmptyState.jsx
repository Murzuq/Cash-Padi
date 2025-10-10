import { FaPiggyBank, FaPlus } from "react-icons/fa";

const EmptyState = ({ onActionClick }) => (
  <div className="text-center py-16 px-6 bg-white/50 rounded-2xl shadow-md flex flex-col items-center">
    <FaPiggyBank className="text-6xl text-emerald-300 mb-4" />
    <h3 className="text-xl font-bold text-gray-700 mb-2">
      Start Saving Today!
    </h3>
    <p className="text-gray-600 max-w-xs mb-6">
      Create a goal for something important, like school fees or a new phone.
    </p>
    <button
      onClick={onActionClick}
      className="mt-4 py-2 px-6 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2"
    >
      <FaPlus /> Create Your First Goal
    </button>
  </div>
);

export default EmptyState;
