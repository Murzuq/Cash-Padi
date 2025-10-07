import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../features/account/accountSlice";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!fullName) newErrors.name = "Full name is required.";
    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
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

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the backend (e.g., user already exists)
        setErrors({
          api: data.message || "Registration failed. Please try again.",
        });
        return;
      }

      // On successful registration, dispatch the login action with user data and navigate
      console.log("Registration successful:", data);
      dispatch(login(data)); // Pass the user data payload to the login action
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        api: "Could not connect to the server. Please try again later.",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div
        className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-emerald-400/50 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-cyan-400/50 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      ></div>
      <div className="max-w-md w-full space-y-8 p-10 bg-white/60 backdrop-blur-xl shadow-2xl rounded-2xl">
        <div>
          <Link to="/welcome">
            <h2 className="text-center text-3xl font-bold text-emerald-600">
              CashPadi
            </h2>
          </Link>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your Account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            And start your journey with CashPadi.
          </p>
          {errors.api && (
            <p className="mt-2 text-center text-sm text-red-600">
              {errors.api}
            </p>
          )}
        </div>
        <form noValidate className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`appearance-none rounded-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 px-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 px-1">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Create Account
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="font-medium text-emerald-600 hover:text-emerald-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
