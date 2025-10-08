import {
  FaPaperPlane,
  FaArrowDown,
  FaBolt,
  FaWifi,
  FaMobileAlt,
  FaFileInvoiceDollar,
  FaArrowUp,
  FaShareAlt,
} from "react-icons/fa";

const Transaction = ({
  title,
  type,
  amount,
  date,
  status,
  onShareClick,
  ...rest
}) => {
  const isCredit = amount > 0;

  // Formats the number as currency, e.g., 15000 -> ₦15,000
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statusStyles = {
    Completed: "text-green-700 bg-green-100",
    Pending: "text-yellow-700 bg-yellow-100",
    Failed: "text-red-700 bg-red-100",
  };

  const typeIcons = {
    Transfer: <FaPaperPlane className="text-blue-500" />,
    Deposit: <FaArrowDown className="text-green-500" />,
    Utilities: <FaBolt className="text-orange-500" />,
    Data: <FaWifi className="text-purple-500" />,
    Airtime: <FaMobileAlt className="text-indigo-500" />,
    Bills: <FaFileInvoiceDollar className="text-pink-500" />,
    Withdrawal: <FaArrowUp className="text-red-500" />,
  };

  const Icon = typeIcons[type] || <FaPaperPlane className="text-gray-500" />;

  return (
    <div className="flex items-center justify-between py-2 gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-3 rounded-full">{Icon}</div>
        <div>
          <p className="font-semibold text-gray-700">{title}</p>
          <p className="text-sm text-gray-500">
            {type} • {formattedDate}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-bold text-lg ${
            isCredit ? "text-green-600" : "text-gray-800"
          }`}
        >
          {isCredit ? "+" : "−"}
          {formattedAmount}
        </p>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            statusStyles[status] || "text-gray-700 bg-gray-100"
          }`}
        >
          {status}
        </span>
        {onShareClick && (
          <button
            onClick={() =>
              onShareClick({ title, type, amount, date, status, ...rest })
            }
            className="text-gray-400 hover:text-green-600 mt-1 ml-auto"
            title="Share Receipt"
          >
            <FaShareAlt />
          </button>
        )}
      </div>
    </div>
  );
};

export default Transaction;
