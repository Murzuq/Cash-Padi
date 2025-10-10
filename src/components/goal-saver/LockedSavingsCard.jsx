import { useMemo } from "react";
import { FaLock, FaCalendarCheck } from "react-icons/fa";

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

export default LockedSavingsCard;
