import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaSync,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import Transaction from "../components/Transaction.jsx";
import ReceiptModal from "../components/ReceiptModal.jsx";

const getUniqueTypes = (transactions) => {
  if (!transactions) return ["All"];
  const types = transactions.map((t) => t.type);
  return ["All", ...new Set(types)];
};

const getUniqueStatuses = (transactions) => {
  if (!transactions) return ["All"];
  const statuses = transactions.map((t) => t.status);
  return ["All", ...new Set(statuses)];
};

const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.account);

  // Safely access transactions, defaulting to an empty array
  const transactions = user?.user?.transactions || [];

  const [filterType, setFilterType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const uniqueTypes = useMemo(
    () => getUniqueTypes(transactions),
    [transactions]
  );
  const uniqueStatuses = useMemo(
    () => getUniqueStatuses(transactions),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        if (filterType === "All") return true;
        return transaction.type === filterType;
      })
      .filter((transaction) => {
        if (filterStatus === "All") return true;
        return transaction.status === filterStatus;
      })
      .filter((transaction) => {
        if (!startDate) return true;
        return new Date(transaction.date) >= new Date(startDate);
      })
      .filter((transaction) => {
        if (!endDate) return true;
        // Add 1 day to endDate to include the whole day
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        return new Date(transaction.date) < end;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filterType, startDate, endDate, filterStatus]);

  const handleResetFilters = () => {
    setFilterType("All");
    setStartDate("");
    setEndDate("");
    setFilterStatus("All");
    setIsFilterVisible(false);
  };

  const handleShareClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptModalOpen(true);
  };

  const activeFilterCount =
    (filterType !== "All" ? 1 : 0) +
    (filterStatus !== "All" ? 1 : 0) +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0);
  const areFiltersActive = activeFilterCount > 0;

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-xl mr-4"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Transaction History</h1>
        <button
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="ml-auto relative flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          {isFilterVisible ? <FaTimes /> : <FaFilter />}
          <span>{isFilterVisible ? "Close" : "Filter"}</span>
          {areFiltersActive && !isFilterVisible && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </header>
      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Modern Filter Controls - Collapsible on mobile */}
          <div
            className={`lg:block space-y-4 mb-8 ${
              isFilterVisible ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 border-b pb-4">
              <span className="text-sm font-medium text-gray-500 mr-2">
                Type:
              </span>
              {uniqueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                    filterType === type
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b pb-4">
              <span className="text-sm font-medium text-gray-500 mr-2">
                Status:
              </span>
              {uniqueStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                    filterStatus === status
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full">
                <label
                  htmlFor="start-date"
                  className="absolute -top-2 left-3 px-1 bg-white text-xs font-medium text-gray-500"
                >
                  Start Date
                </label>
                <FaCalendarAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="relative w-full">
                <label
                  htmlFor="end-date"
                  className="absolute -top-2 left-3 px-1 bg-white text-xs font-medium text-gray-500"
                >
                  End Date
                </label>
                <FaCalendarAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="w-full sm:w-auto">
                <button
                  onClick={handleResetFilters}
                  title="Reset Filters"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <FaSync />
                  <span className="sm:hidden">Reset</span>
                </button>
              </div>
            </div>
          </div>

          <ul className="space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <li key={transaction._id || transaction.id}>
                  {index > 0 && <div className="border-t border-gray-200" />}
                  <Transaction
                    {...transaction}
                    onShareClick={handleShareClick}
                  />
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No transactions match your filters.
              </p>
            )}
          </ul>
        </div>
      </main>
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default TransactionHistoryPage;
