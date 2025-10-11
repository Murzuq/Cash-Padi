import { useState, useEffect } from "react";
import {
  FaPiggyBank,
  FaPlus,
  FaLock,
  FaExclamationTriangle,
  FaTimes,
  FaArrowLeft,
  FaCalendarCheck,
  FaBullseye,
  FaSpinner, // Assuming you might want this for the modal
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PinModal from "../components/PinModal";
import { API_URL } from "../config";
import GoalProgressCard, {
  GoalProgressCardSkeleton,
} from "../components/goal-saver/GoalProgressCard";
import CreateGoalModal from "../components/goal-saver/CreateGoalModal";
import DepositModal from "../components/goal-saver/DepositModal";
import LockFundsCard from "../components/goal-saver/LockFundsCard";
import EmergencyWithdrawalCard from "../components/goal-saver/EmergencyWithdrawalCard";
import LockFundsModal from "../components/goal-saver/LockFundsModal";
import LockedSavingsCard from "../components/goal-saver/LockedSavingsCard";
import EmptyState from "../components/goal-saver/EmptyState";

const GoalSaverPage = () => {
  const navigate = useNavigate();
  const [activeGoal, setActiveGoal] = useState(null); // Will be fetched from backend
  const [allGoals, setAllGoals] = useState([]); // To store all goals
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isLockModalOpen, setLockModalOpen] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [lockDuration, setLockDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingGoalData, setPendingGoalData] = useState(null);
  const [pendingLockData, setPendingLockData] = useState(null);
  const [isPinModalOpenForGoal, setIsPinModalOpenForGoal] = useState(false);
  const [isPinModalOpenForLock, setIsPinModalOpenForLock] = useState(false);
  const [aiNudge, setAiNudge] = useState("Analyzing your savings habits...");
  const token = useSelector((state) => state.account.user?.token);

  const fetchSavingsData = async () => {
    if (!token) return;
    setIsLoading(true);

    // Fetch goals first
    try {
      const goalsResponse = await fetch(`${API_URL}/api/users/savings-goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (goalsResponse.ok) {
        const data = await goalsResponse.json();
        setAllGoals(data.savingsGoals || []);
        const foundActiveGoal = data.savingsGoals.find((g) => g.isActive);
        setActiveGoal(foundActiveGoal || null);
      } else {
        console.error("Failed to fetch savings goals.");
      }
    } catch (error) {
      console.error("Error fetching savings goals:", error);
    }

    // Then fetch the nudge
    try {
      const response = await fetch(`${API_URL}/api/users/savings-nudge`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    fetchSavingsData();
  }, [token]);

  const initiateCreateGoal = (newGoalData) => {
    setPendingGoalData(newGoalData);
    setCreateModalOpen(false);
    setIsPinModalOpenForGoal(true);
  };

  const handleConfirmCreateGoal = async (pin) => {
    if (!pendingGoalData) return;
    setIsCreatingGoal(true);
    try {
      const response = await fetch(`${API_URL}/api/users/savings-goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...pendingGoalData, pin }),
      });

      if (response.ok) {
        const data = await response.json();
        fetchSavingsData(); // Refetch all data to show the new goal correctly
      } else {
        // If the server returned an error, try to parse it as JSON, but fall back to text.
        const errorText = await response.text();
        try {
          const data = JSON.parse(errorText);
          console.error(data.message || "Failed to create goal.");
        } catch (e) {
          console.error("Server returned non-JSON error:", errorText);
        }
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("An error occurred while creating the goal.");
    } finally {
      setIsCreatingGoal(false);
      setIsPinModalOpenForGoal(false);
      setPendingGoalData(null);
    }
  };

  const handleDeposit = async (amount) => {
    if (!activeGoal) {
      console.error("No active goal to deposit into.");
      return;
    }
    setIsDepositing(true);
    try {
      const response = await fetch(
        `${API_URL}/api/users/savings-goals/${activeGoal._id}/deposit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setActiveGoal(data.goal); // Update active goal with new amount
        setDepositModalOpen(false);
      } else {
        console.error(data.message || "Deposit failed.");
      }
    } catch (error) {
      console.error("Error depositing:", error);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleOpenLockModal = (duration) => {
    setLockDuration(duration);
    setLockModalOpen(true);
  };

  const initiateLockFunds = (amountToLock) => {
    setPendingLockData({ amount: amountToLock, duration: lockDuration });
    setLockModalOpen(false);
    setIsPinModalOpenForLock(true);
  };

  const handleConfirmLock = async (pin) => {
    if (!pendingLockData) return;
    setIsLocking(true);
    try {
      // NOTE: Backend call would go here.
      // For now, we'll simulate a delay and show a success message.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const formattedAmount = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(pendingLockData.amount);

      // In a real app, you would refetch the locked funds list here.
    } catch (error) {
      console.error("Error locking funds:", error);
    } finally {
      setIsLocking(false);
      setIsPinModalOpenForLock(false);
      setPendingLockData(null);
    }
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
                Your Savings Goals
              </h2>
              {isLoading ? (
                <>
                  <GoalProgressCardSkeleton />
                  <GoalProgressCardSkeleton />
                </>
              ) : allGoals.length > 0 ? (
                allGoals.map((goal) => (
                  <GoalProgressCard
                    key={goal._id}
                    goal={goal}
                    onDepositClick={() => setDepositModalOpen(true)} // This might need adjustment if you want to deposit into a specific goal
                    aiNudge={goal.isActive ? aiNudge : null} // Show nudge only for active goal
                  />
                ))
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
        onCreate={initiateCreateGoal}
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
        onConfirm={initiateLockFunds}
        duration={lockDuration}
        isLoading={isLocking}
        currentBalance={activeGoal?.currentAmount || 0}
      />
      <PinModal
        isOpen={isPinModalOpenForGoal}
        onClose={() => setIsPinModalOpenForGoal(false)}
        onConfirm={handleConfirmCreateGoal}
        title="Confirm Goal Creation"
        isConfirming={isCreatingGoal}
        details={
          <div className="space-y-1">
            <p className="text-sm text-gray-500">You are creating the goal:</p>
            <p className="text-xl font-bold text-gray-800">
              {pendingGoalData?.name}
            </p>
          </div>
        }
      />
      <PinModal
        isOpen={isPinModalOpenForLock}
        onClose={() => setIsPinModalOpenForLock(false)}
        onConfirm={handleConfirmLock}
        title="Confirm Lock Funds"
        isConfirming={isLocking}
        details={
          <div className="space-y-1">
            <p className="text-sm text-gray-500">You are locking:</p>
            <p className="text-2xl font-bold text-gray-800">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(pendingLockData?.amount || 0)}
            </p>
          </div>
        }
      />
    </>
  );
};

export default GoalSaverPage;
