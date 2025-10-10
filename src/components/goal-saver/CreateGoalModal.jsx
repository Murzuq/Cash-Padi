import { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";

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
    onClose(); // Close the modal on submission
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

export default CreateGoalModal;
