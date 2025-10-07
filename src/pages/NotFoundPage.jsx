import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <FaExclamationTriangle className="text-yellow-400 text-6xl mx-auto mb-4" />
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          Go Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
