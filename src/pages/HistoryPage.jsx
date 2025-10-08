import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Transaction from "../components/Transaction";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.account);

  // Safely access transactions, defaulting to an empty array
  const transactions = user?.user?.transactions || [];

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
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {transactions.length > 0 ? (
            <ul className="space-y-3">
              {transactions.map((transaction, index) => (
                <li key={transaction._id || transaction.id}>
                  {index > 0 && <div className="border-t border-gray-200" />}
                  <Transaction {...transaction} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="mt-2">Your recent activity will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default HistoryPage;
