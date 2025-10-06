import { useState, useEffect } from "react";
import { FaArrowLeft, FaUniversity, FaUserCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Mock bank list
const banks = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "Fidelity Bank",
  "First Bank",
  "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTB)",
  "Kuda Bank",
  "Opay",
  "Palmpay",
  "Polaris Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Union Bank",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
].sort();

// Mock recipient verification
const verifyRecipient = async (accountNumber, bank) => {
  console.log(`Verifying ${accountNumber} at ${bank}...`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (accountNumber && accountNumber.length === 10 && bank) {
    return "Murzuq Isah"; // Mocked recipient name
  }
  return null;
};

const TransferPage = () => {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (accountNumber.length === 10 && bank) {
        setIsVerifying(true);
        setRecipientName("");
        setError("");
        try {
          const name = await verifyRecipient(accountNumber, bank);
          if (name) {
            setRecipientName(name);
          } else {
            setError(
              "Could not verify account details. Please check and try again."
            );
          }
        } catch (e) {
          setError("An error occurred during verification.");
        } finally {
          setIsVerifying(false);
        }
      } else {
        setRecipientName("");
        setError("");
      }
    };

    const timeoutId = setTimeout(verify, 500); // Debounce verification
    return () => clearTimeout(timeoutId);
  }, [accountNumber, bank]);

  const handleTransfer = (e) => {
    e.preventDefault();
    // Here you would handle the transfer logic, e.g., show a confirmation modal, require a PIN, and make an API call.
    alert(
      `Transfer of ₦${amount} to ${recipientName} (${accountNumber} - ${bank}) initiated with narration: "${narration}"`
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-xl mr-4"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Transfer Funds</h1>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <form
          onSubmit={handleTransfer}
          className="bg-white p-6 rounded-xl shadow-lg space-y-6"
        >
          <div>
            <label
              htmlFor="bank"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipient's Bank
            </label>
            <div className="relative">
              <FaUniversity className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <select
                id="bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="" disabled>
                  Select a bank
                </option>
                {banks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value.replace(/\D/g, ""))
              }
              maxLength="10"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="0123456789"
            />
            {isVerifying && (
              <p className="text-sm text-gray-500 mt-2">Verifying account...</p>
            )}
            {recipientName && !isVerifying && (
              <div className="flex items-center mt-2 text-green-600">
                {" "}
                <FaUserCheck className="mr-2" />{" "}
                <p className="font-semibold">{recipientName}</p>{" "}
              </div>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (₦)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="narration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Narration (Optional)
            </label>
            <input
              type="text"
              id="narration"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., For food"
            />
          </div>

          <button
            type="submit"
            disabled={!recipientName || isVerifying || !amount}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
      </main>
    </div>
  );
};

export default TransferPage;
