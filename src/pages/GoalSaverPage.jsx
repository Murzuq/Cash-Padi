import { useState, useMemo, useEffect } from "react";
import {
  FaPiggyBank,
  FaPlus,
  FaSchool,
  FaStore,
  FaLock,
  FaExclamationTriangle,
  FaTimes,
  FaArrowLeft,
  FaCalendarCheck,
  FaBullseye,
  FaSpinner, // Assuming you might want this for the modal
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { API_URL } from "../config";

const GoalIcon = ({ icon, className }) => {
  switch (icon) {
    case "school":
      return <FaSchool className={className} />;
    case "store":
      return <FaStore className={className} />;
    default:
      return <FaBullseye className={className} />;
  }
};

const GoalProgressCardSkeleton = () => (
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

const CreateGoalModal = ({ isOpen, onClose, onCreate, isLoading }) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [automation, setAutomation] = useState("none"); // none, daily, weekly, monthly
  const [recurringAmount, setRecurringAmount] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [time, setTime] = useState("09:00");

  useEffect(() => {
    if (automation === "none" || !targetAmount || !targetDate) {
      setRecurringAmount("");
      return;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);

    if (target <= today) {
      setRecurringAmount("");
      return;
    }

    const diffTime = target.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let numberOfIntervals;
    if (automation === "daily") {
      numberOfIntervals = daysRemaining > 0 ? daysRemaining : 1;
    } else if (automation === "weekly") {
      numberOfIntervals = Math.ceil(daysRemaining / 7) || 1;
    } else if (automation === "monthly") {
      numberOfIntervals = Math.ceil(daysRemaining / 30.44) || 1; // Using average days in a month
    }

    const calculatedAmount = Math.ceil(amount / numberOfIntervals);
    setRecurringAmount(calculatedAmount > 0 ? calculatedAmount.toString() : "");
  }, [targetAmount, targetDate, automation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const goalIcon = name.toLowerCase().includes("school")
      ? "school"
      : name.toLowerCase().includes("stall")
      ? "store"
      : "bullseye";
    onCreate({
      name,
      icon: goalIcon,
      targetAmount: parseFloat(targetAmount),
      targetDate,
      automation,
      recurringAmount: parseFloat(recurringAmount),
      automationConfig: {
        ...(automation === "weekly" && { dayOfWeek }),
        ...(automation === "monthly" && { dayOfMonth }),
        ...(automation !== "none" && { time }),
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Create a New Goal
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., School Fees, New Stall"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount (₦)
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g., 150000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Automation Settings
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={automation}
                  onChange={(e) => setAutomation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="none">Manual (No automatic savings)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {automation !== "none" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount per Interval (₦)
                    </label>
                    <input
                      type="number"
                      value={recurringAmount}
                      readOnly
                      placeholder="Calculated..."
                      className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed focus:ring-0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time of Day
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  {automation === "weekly" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day of the Week
                      </label>
                      <select
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                        <option>Saturday</option>
                        <option>Sunday</option>
                      </select>
                    </div>
                  )}
                  {automation === "monthly" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day of the Month
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={dayOfMonth}
                        onChange={(e) => setDayOfMonth(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Creating...
                  </>
                ) : (
                  "Create Goal"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

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
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Depositing...
              </>
            ) : (
              "Confirm Deposit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

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
            // disabled={
            //   isLoading ||
            //   !amount ||
            //   parseFloat(amount) < 5000 ||
            //   parseFloat(amount) > 5000000 ||
            //   parseFloat(amount) > currentBalance ||
            //   !!error
            // }
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

const LockedSavingsCard = ({ lockedFunds = [] }) => {
  const interestRates = {
    3: 0.075,
    6: 0.1,
    12: 0.125,
  };

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);

  const totalLocked = useMemo(
    () => lockedFunds.reduce((acc, lock) => acc + lock.amount, 0),
    [lockedFunds]
  );

  if (lockedFunds.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
        <FaLock className="text-3xl text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-800">Your Locked Savings</h3>
        <p className="text-sm text-gray-500 mt-1">
          You have no locked funds yet. Lock savings to earn higher interest.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Your Locked Savings</h3>
      <div className="bg-blue-50 p-4 rounded-lg flex justify-around text-center">
        <div>
          <p className="text-sm text-blue-800 font-semibold">Total Locked</p>
          <p className="text-xl font-bold text-blue-900">
            {formatCurrency(totalLocked)}
          </p>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        {lockedFunds.map((lock) => {
          const unlockDate = new Date(lock.lockDate);
          unlockDate.setMonth(unlockDate.getMonth() + lock.duration);
          const annualRate = interestRates[lock.duration] || 0;

          return (
            <div
              key={lock.id}
              className="bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(lock.amount)}
                </p>
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  {`${(annualRate * 100).toFixed(1)}% p.a.`}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaCalendarCheck className="mr-2" />
                <span>
                  Unlocks on{" "}
                  {unlockDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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

const GoalSaverPage = () => {
  const navigate = useNavigate();
  const [activeGoal, setActiveGoal] = useState(null); // Will be fetched from backend
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isLockModalOpen, setLockModalOpen] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [lockDuration, setLockDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [aiNudge, setAiNudge] = useState("Analyzing your savings habits...");
  const token = useSelector((state) => state.account.user?.token);

  useEffect(() => {
    const fetchSavingsData = async () => {
      if (!token) return;
      setIsLoading(true);

      // Fetch goals first
      try {
        const goalsResponse = await fetch(`/api/users/savings-goals`, {
          headers: { Authorization: `Bearer ` },
        });
        if (goalsResponse.ok) {
          const data = await goalsResponse.json();
          const foundActiveGoal = data.savingsGoals.find((g) => g.isActive);
          setActiveGoal(foundActiveGoal || null);
        } else {
          console.error("Failed to fetch savings goals.");
          toast.error("Failed to load savings goals.");
        }
      } catch (error) {
        console.error("Error fetching savings goals:", error);
        toast.error("Network error fetching goals.");
      }

      // Then fetch the nudge
      try {
        const response = await fetch(`/api/users/savings-nudge`, {
          headers: {
            Authorization: `Bearer `,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAiNudge(data.nudge);
        }
      } catch (err) {
        console.error("Failed to fetch AI nudge:", err);
        setAiNudge("Keep up the great work on your savings goal!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavingsData();
  }, [token]);

  const handleCreateGoal = async (newGoalData) => {
    setIsCreatingGoal(true);
    try {
      const response = await fetch(`/api/users/savings-goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer `,
        },
        body: JSON.stringify(newGoalData),
      });
      const data = await response.json();
      if (response.ok) {
        setActiveGoal(data.goal); // Set the newly created goal as active
        setCreateModalOpen(false);
        toast.success("Savings goal created successfully!");
      } else {
        toast.error(data.message || "Failed to create goal.");
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Network error creating goal.");
    } finally {
      setIsCreatingGoal(false);
    }
  };

  const handleDeposit = async (amount) => {
    if (!activeGoal) {
      toast.error("No active goal to deposit into.");
      return;
    }
    setIsDepositing(true);
    try {
      const response = await fetch(
        `/api/users/savings-goals/${activeGoal._id}/deposit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer `,
          },
          body: JSON.stringify({ amount }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setActiveGoal(data.goal); // Update active goal with new amount
        setDepositModalOpen(false);
        toast.success("Deposit successful!");
      } else {
        toast.error(data.message || "Deposit failed.");
      }
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Network error during deposit.");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleOpenLockModal = (duration) => {
    setLockDuration(duration);
    setLockModalOpen(true);
  };

  const handleConfirmLock = async (amountToLock) => {
    setIsLocking(true);
    // NOTE: Backend call would go here.
    // For now, we'll simulate a delay.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const formattedAmount = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amountToLock);

    setIsLocking(false);
    setLockModalOpen(false);
    toast.success(
      `${formattedAmount} has been locked for ${lockDuration} months!`
    );
  };

  // Mock data for locked funds - in a real app, this would come from the backend
  const [lockedFunds, setLockedFunds] = useState([
    {
      id: 1,
      amount: 50000,
      duration: 6,
      lockDate: "2024-05-15T10:00:00.000Z",
    },
    {
      id: 2,
      amount: 25000,
      duration: 3,
      lockDate: "2024-07-01T10:00:00.000Z",
    },
  ]);

  return (
    <>
      <main className="relative min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaPiggyBank className="text-emerald-500" />
              Personal Savings
            </h1>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center space-x-2 py-2 px-4 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-all"
            >
              <FaPlus />
              <span>New Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Goal Management */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-emerald-300 pb-2">
                Active Goal
              </h2>
              {isLoading ? (
                <GoalProgressCardSkeleton />
              ) : activeGoal ? (
                <GoalProgressCard
                  goal={activeGoal}
                  onDepositClick={() => setDepositModalOpen(true)}
                  aiNudge={aiNudge}
                />
              ) : (
                <EmptyState onActionClick={() => setCreateModalOpen(true)} />
              )}
            </div>

            {/* Right Column: Safety and Controls */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-300 pb-2">
                Safety & Flexibility
              </h2>
              <LockFundsCard onLockClick={handleOpenLockModal} />
              <LockedSavingsCard lockedFunds={lockedFunds} />
              <EmergencyWithdrawalCard />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateGoal}
        isLoading={isCreatingGoal}
      />
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onDeposit={handleDeposit}
        isLoading={isDepositing}
      />
      <LockFundsModal
        isOpen={isLockModalOpen}
        onClose={() => setLockModalOpen(false)}
        onConfirm={handleConfirmLock}
        duration={lockDuration}
        isLoading={isLocking}
        currentBalance={activeGoal?.currentAmount || 0}
      />
    </>
  );
};

export default GoalSaverPage;
