import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StatusModal = ({
  isOpen,
  onClose,
  status,
  title,
  message,
  buttonText,
}) => {
  if (!isOpen) {
    return null;
  }

  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
        {isSuccess ? (
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        ) : (
          <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>

        <button
          onClick={onClose}
          className={`w-full text-white font-bold py-3 px-4 rounded-lg transition duration-300 ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {buttonText || "Done"}
        </button>
      </div>
    </div>
  );
};

export default StatusModal;
