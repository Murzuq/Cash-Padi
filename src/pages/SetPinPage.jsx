import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaSpinner, FaLock } from "react-icons/fa";
import { API_URL } from "../config";
import PinInput from "../components/PinInput";
import StatusModal from "../components/StatusModal";

const SetPinPage = () => {
  const navigate = useNavigate();
  const pinLength = 4;
  const [pin, setPin] = useState(new Array(pinLength).fill(""));
  const [confirmPin, setConfirmPin] = useState(new Array(pinLength).fill(""));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState({
    status: "",
    title: "",
    message: "",
  });

  const token = useSelector((state) => state.account.user?.token);

  const validate = () => {
    const finalPin = pin.join("");
    const finalConfirmPin = confirmPin.join("");
    const newErrors = {};

    if (finalPin.length !== pinLength) {
      newErrors.pin = "PIN is required.";
    }
    if (finalConfirmPin.length !== pinLength) {
      newErrors.confirmPin = "Confirmation PIN is required.";
    } else if (finalPin !== finalConfirmPin) {
      newErrors.confirmPin = "PINs do not match.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const finalPin = pin.join("");
      // NOTE: This assumes a backend endpoint exists at /api/users/set-pin
      const response = await fetch(`${API_URL}/api/users/set-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pin: finalPin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to set PIN.");
      }

      setTransactionStatus({
        status: "success",
        title: "PIN Set Successfully!",
        message: "Your transaction PIN has been updated.",
      });
    } catch (err) {
      setErrors({ api: err.message || "An unknown error occurred." });
    } finally {
      setIsLoading(false);
      setIsStatusModalOpen(true);
    }
  };

  return (
    <>
      <div className="relative min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
            <div className="text-center mb-8">
              <FaLock className="text-4xl text-emerald-500 mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Set Your Transaction PIN
              </h1>
              <p className="text-sm text-gray-600">
                This 4-digit PIN will be used to authorize your transactions.
              </p>
            </div>

            <form noValidate className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-700 text-center mb-2"
                >
                  New PIN
                </label>
                <PinInput pin={pin} setPin={setPin} />
                {errors.pin && (
                  <p className="text-red-500 text-xs mt-1 text-center">
                    {errors.pin}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPin"
                  className="block text-sm font-medium text-gray-700 text-center mb-2"
                >
                  Confirm New PIN
                </label>
                <PinInput pin={confirmPin} setPin={setConfirmPin} />
                {errors.confirmPin && (
                  <p className="text-red-500 text-xs mt-1 text-center">
                    {errors.confirmPin}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg transition-all disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Setting PIN...
                    </>
                  ) : (
                    "Set PIN"
                  )}
                </button>
                {errors.api && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {errors.api}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          if (transactionStatus.status === "success") navigate("/profile");
        }}
        {...transactionStatus}
      />
    </>
  );
};

export default SetPinPage;
