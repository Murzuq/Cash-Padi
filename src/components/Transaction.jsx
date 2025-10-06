const Transaction = ({ title, type, amount }) => {
  const isCredit = amount > 0;

  // Formats the number as currency, e.g., 15000 -> ₦15,000
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));

  return (
    <li className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-700">{title}</p>
        <p className="text-sm text-gray-500">{type}</p>
      </div>
      <p
        className={`font-bold text-lg ${
          isCredit ? "text-green-600" : "text-red-600"
        }`}
      >
        {isCredit ? "+" : "−"}
        {formattedAmount}
      </p>
    </li>
  );
};

export default Transaction;
