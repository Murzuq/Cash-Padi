import { useState } from "react";
import {
  FaMicrophone,
  FaRegMoneyBillAlt,
  FaPiggyBank,
  FaEye,
  FaEyeSlash,
  FaPaperPlane,
  FaFileInvoiceDollar,
  FaMobileAlt,
  FaWifi,
} from "react-icons/fa";

const HomePage = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <main className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Main Dashboard */}
        <div className="lg:col-span-2 space-y-8">
          {/* Balance and Voice Command */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-500">
                Available Balance
              </h2>
              <button
                onClick={toggleBalanceVisibility}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                {isBalanceVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
              {isBalanceVisible ? "₦257,592.79" : "₦******.**"}
            </p>

            {/* Voice Command Area */}
            <div className="mt-8 bg-green-50 p-4 rounded-lg border border-green-200">
              <button className="w-full flex flex-col items-center justify-center text-center text-green-800 hover:bg-green-100 p-4 rounded-md transition duration-300">
                <FaMicrophone className="text-4xl mb-2" />
                <span className="font-semibold">Tap to Speak</span>
                <span className="text-sm">(Soro Bayi)</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <button className="flex flex-col items-center space-y-2 text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaPaperPlane className="text-lg sm:text-xl text-green-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Transfer</span>
              </button>
              <button className="flex flex-col items-center space-y-2 text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaFileInvoiceDollar className="text-lg sm:text-xl text-green-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Pay Bill</span>
              </button>
              <button className="flex flex-col items-center space-y-2 text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaMobileAlt className="text-lg sm:text-xl text-green-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Airtime</span>
              </button>
              <button className="flex flex-col items-center space-y-2 text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaWifi className="text-lg sm:text-xl text-green-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Data</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Activity
              </h2>
              <button className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors">
                View All
              </button>
            </div>
            <ul className="space-y-4">
              {/* Transaction 1 */}
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">To Sikiru</p>
                  <p className="text-sm text-gray-500">Transfer</p>
                </div>
                <p className="font-bold text-red-600 text-lg">−₦15,000</p>
              </li>

              {/* Divider */}
              <li className="border-t border-gray-200"></li>

              {/* Transaction 2 */}
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">Market Sales</p>
                  <p className="text-sm text-gray-500">Deposit</p>
                </div>
                <p className="font-bold text-green-600 text-lg">+₦25,000</p>
              </li>

              {/* Divider */}
              <li className="border-t border-gray-200"></li>

              {/* Transaction 3 */}
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">
                    Electricity Bill
                  </p>
                  <p className="text-sm text-gray-500">Utilities</p>
                </div>
                <p className="font-bold text-red-600 text-lg">−₦8,500</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section: Financial Tools */}
        <div className="lg:col-span-1 space-y-8">
          {/* Pay Bill by Picture */}
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaRegMoneyBillAlt className="text-2xl text-green-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Pay Bill by Picture
              </h3>
              <p className="text-gray-600 mt-1">
                Scan utility bills or invoices instantly.
              </p>
            </div>
          </div>

          {/* Start Micro-Savings */}
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaPiggyBank className="text-2xl text-green-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Start Micro-Savings
              </h3>
              <p className="text-gray-600 mt-1">
                Set a goal for market expansion or school fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
