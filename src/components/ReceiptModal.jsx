import { useState, useRef } from "react";
import { FaTimes, FaShareAlt, FaPrint, FaDownload } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReceiptDocument from "./ReceiptDocument";

const ReceiptModal = ({ isOpen, onClose, transaction }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  if (!isOpen || !transaction) return null;

  const { title, type, amount, date, status, description, _id, id } =
    transaction;
  const isCredit = amount > 0;

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Math.abs(amount));

  const formattedDate = new Date(date).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  const transactionId = _id || id;

  const handleShare = async () => {
    const receiptText = `
Transaction Receipt - CashPadi
--------------------------------
Title: ${title}
Amount: ${isCredit ? "+" : "−"}${formattedAmount}
Type: ${type}
Date: ${formattedDate}
Status: ${status}
Transaction ID: ${transactionId}
Description: ${description || "N/A"}
--------------------------------
Thank you for using CashPadi!
    `;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "CashPadi Transaction Receipt",
          text: receiptText,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(receiptText);
      alert("Receipt details copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Transaction Receipt
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div
          ref={receiptRef}
          id="receipt-content"
          className="p-6 space-y-4 bg-white"
        >
          <div className="text-center pb-4 border-b border-dashed">
            <p className="text-sm text-gray-500">{type}</p>
            <p
              className={`text-4xl font-bold ${
                isCredit ? "text-green-600" : "text-gray-800"
              }`}
            >
              {isCredit ? "+" : "−"}
              {formattedAmount}
            </p>
            <p className="font-semibold text-gray-700">{title}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                  status === "Completed"
                    ? "text-green-700 bg-green-100"
                    : "text-yellow-700 bg-yellow-100"
                }`}
              >
                {status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-semibold text-gray-800">
                {formattedDate}
              </span>
            </div>
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-xs text-gray-600 pt-1">
                  {transactionId}
                </span>
              </div>
            )}
            {description && (
              <div className="flex justify-between">
                <span className="text-gray-500">Description</span>
                <span className="font-semibold text-gray-800 text-right">
                  {description}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-xl flex justify-around">
          <button
            onClick={handleShare}
            className="flex flex-col items-center text-green-600 hover:text-green-800"
          >
            <FaShareAlt size={20} />
            <span className="text-xs mt-1">Share</span>
          </button>
          <PDFDownloadLink
            document={<ReceiptDocument transaction={transaction} />}
            fileName={`cashpadi-receipt-${transactionId}.pdf`}
            className="flex flex-col items-center text-green-600 hover:text-green-800"
          >
            {({ blob, url, loading, error }) => (
              <>
                <FaDownload size={20} />
                <span className="text-xs mt-1">
                  {loading ? "Generating..." : "Download PDF"}
                </span>
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
