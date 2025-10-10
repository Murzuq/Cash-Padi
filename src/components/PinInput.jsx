import { useRef, useEffect } from "react";

const PinInput = ({ pin, setPin, pinLength = 4, onComplete }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Automatically focus the first empty input
    const firstEmptyIndex = pin.findIndex((digit) => digit === "");
    inputRefs.current[firstEmptyIndex]?.focus();
  }, [pin]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; // Only allow numbers

    const newPin = [...pin];
    newPin[index] = element.value;
    setPin(newPin);

    // Focus next input if there's a value
    if (element.value && index < pinLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check for completion
    if (newPin.every((digit) => digit !== "")) {
      onComplete?.(newPin.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    // Focus previous input on backspace if current is empty
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    if (new RegExp(`^\\d{${pinLength}}$`).test(pastedData)) {
      const newPin = pastedData.split("");
      setPin(newPin);
      inputRefs.current[pinLength - 1]?.focus();
      onComplete?.(newPin.join(""));
    }
  };

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {pin.map((data, index) => (
        <input
          className="w-10 h-12 text-center text-2xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
        />
      ))}
    </div>
  );
};

export default PinInput;
