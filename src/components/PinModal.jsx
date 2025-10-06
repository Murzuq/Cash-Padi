import { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const PinModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  details,
  isConfirming,
}) => {
  const [pin, setPin] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      // Reset pin and focus on the first input when the modal opens
      setPin(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false; // Only allow numbers

    setPin([...pin.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Focus previous input on backspace
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    if (!/^\d{6}$/.test(pastedData)) {
      return; // Only paste if it's exactly 6 digits
    }
    const newPin = pastedData.split("");
    setPin(newPin);
    inputRefs.current[5].focus();
  };

  const handleSubmit = () => {
    const finalPin = pin.join("");
    if (finalPin.length === 6) {
      onConfirm(finalPin);
    }
  };

  if (!isOpen) {
    return null;
  }

  const isPinComplete = pin.every((digit) => digit !== "");

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
          {details}
        </div>

        <div className="mb-6">
          <p className="text-center text-sm font-medium text-gray-600 mb-2">
            Enter your 6-digit PIN
          </p>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {pin.map((data, index) => (
              <input
                className="w-10 h-12 text-center text-2xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                type="password"
                name="pin"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                ref={(el) => (inputRefs.current[index] = el)}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isPinComplete || isConfirming}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isConfirming ? "Confirming..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
};

export default PinModal;
