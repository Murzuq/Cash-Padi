import { useMemo } from "react";
import GoalIcon from "./GoalIcon";

export const GoalProgressCardSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="bg-gray-200 rounded-full w-14 h-14"></div>
      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <div className="h-7 bg-gray-200 rounded w-28"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4"></div>
    </div>
    <div className="bg-gray-100 p-4 rounded-lg text-center">
      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
    </div>
    <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
  </div>
);

const GoalProgressCard = ({ goal, onDepositClick, aiNudge }) => {
  const progress = useMemo(() => {
    if (!goal || goal.targetAmount === 0) return 0;
    return (goal.currentAmount / goal.targetAmount) * 100;
  }, [goal]);

  const daysRemaining = useMemo(() => {
    if (!goal?.targetDate) return "N/A";
    const today = new Date();
    const target = new Date(goal.targetDate);
    const diffTime = Math.max(target - today, 0);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [goal?.targetDate]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-emerald-100 p-3 rounded-full">
          <GoalIcon icon={goal.icon} className="text-2xl text-emerald-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{goal.name}</h2>
          <p className="text-sm text-gray-600">
            Target: {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-lg font-bold text-emerald-600">
            {formatCurrency(goal.currentAmount)}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {daysRemaining} days left
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-emerald-50/50 p-4 rounded-lg text-center">
        <p className="text-emerald-800 font-medium italic">"{aiNudge}"</p>
      </div>

      <button
        onClick={onDepositClick}
        className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-all text-lg"
      >
        Make a Deposit
      </button>
    </div>
  );
};

export default GoalProgressCard;
