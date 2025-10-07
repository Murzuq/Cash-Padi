import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/account/accountSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.account.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/welcome");
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-green-400 hover:text-green-300 transition duration-300"
        >
          Cash Padi
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-green-400 transition duration-300">
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-green-400 transition duration-300"
          >
            About
          </Link>
          <Link
            to="/services"
            className="hover:text-green-400 transition duration-300"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="hover:text-green-400 transition duration-300"
          >
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-green-400 hover:text-green-300 font-semibold transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="md:hidden mt-4">
          <Link
            to="/"
            className="block py-2 px-4 text-sm hover:bg-gray-700"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block py-2 px-4 text-sm hover:bg-gray-700"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/services"
            className="block py-2 px-4 text-sm hover:bg-gray-700"
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="block py-2 px-4 text-sm hover:bg-gray-700"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-700"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block py-2 px-4 text-sm text-green-400 hover:bg-gray-700"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block py-2 px-4 text-sm hover:bg-gray-700"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
