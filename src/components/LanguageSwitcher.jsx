import { useEffect } from "react";
import { FaGlobe } from "react-icons/fa";

const LanguageSwitcher = () => {
  useEffect(() => {
    const googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Define the init function globally so the script can call it
    window.googleTranslateElementInit = googleTranslateElementInit;

    // Check if the script already exists to avoid adding it multiple times
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // Clean up the global function when the component unmounts
      delete window.googleTranslateElementInit;
    };
  }, []);

  const changeLanguage = (lang) => {
    // Set a cookie to remember the language choice
    document.cookie = `googtrans=/en/${lang};path=/`;

    const translateElement = document.querySelector(".goog-te-combo");
    if (translateElement) {
      translateElement.value = lang;
      translateElement.dispatchEvent(new Event("change"));
    } else {
      // If the widget isn't ready, reloading the page will apply the cookie
      window.location.reload();
    }
  };

  return (
    <div className="relative">
      {/* This hidden div is what the Google Translate script targets */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      <div className="flex items-center space-x-2 text-sm">
        <FaGlobe className="text-gray-600" />
        <button
          onClick={() => changeLanguage("en")}
          className="text-gray-700 hover:text-green-600 font-medium"
        >
          EN
        </button>
        <span className="text-gray-400">|</span>
        <button
          onClick={() => changeLanguage("ha")}
          className="text-gray-700 hover:text-green-600 font-medium"
        >
          HA
        </button>
        <span className="text-gray-400">|</span>
        <button
          onClick={() => changeLanguage("ig")}
          className="text-gray-700 hover:text-green-600 font-medium"
        >
          IG
        </button>
        <span className="text-gray-400">|</span>
        <button
          onClick={() => changeLanguage("yo")}
          className="text-gray-700 hover:text-green-600 font-medium"
        >
          YO
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
