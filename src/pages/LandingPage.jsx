import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FaShieldAlt,
  FaUsers,
  FaGlobe,
  FaLanguage,
  FaUniversalAccess,
  FaThumbsUp,
  FaArrowRight,
  FaBolt,
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="bg-gray-50 text-gray-800 antialiased">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gray-50 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#d1fae5,transparent)]"></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-emerald-600">CashPadi</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogin}
              className="px-6 py-2.5 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-all"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div
            className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl -z-10"
            aria-hidden="true"
          ></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                  Your Money's Best Friend, Right in Your Pocket.
                </h2>
                <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-gray-600">
                  CashPadi is the simple, secure way to send money, pay bills,
                  and manage your finances. Think of us as your financial "padi"
                  always there when you need it.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={handleRegister}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 w-full sm:w-auto"
                  >
                    <span>Get Started for Free</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
              <div className="relative flex items-center justify-center bg-emerald-100/50 border-2 border-emerald-200 rounded-3xl h-80 lg:h-[450px] shadow-lg lg:-mr-16 p-8">
                <div className="absolute -inset-2 bg-white/50 rounded-3xl transform -rotate-2"></div>
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full z-10"
                >
                  <defs>
                    <linearGradient
                      id="hero-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "var(--tw-gradient-from)" }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "var(--tw-gradient-to)" }}
                      />
                    </linearGradient>
                  </defs>
                  {/* Main Card */}
                  <rect
                    x="50"
                    y="30"
                    width="110"
                    height="150"
                    rx="15"
                    className="fill-white stroke-emerald-300"
                    strokeWidth="2"
                  />
                  <circle cx="70" cy="55" r="8" className="fill-emerald-400" />
                  <rect
                    x="70"
                    y="140"
                    width="70"
                    height="10"
                    rx="5"
                    className="fill-gray-200"
                  />
                  <rect
                    x="70"
                    y="120"
                    width="50"
                    height="10"
                    rx="5"
                    className="fill-gray-200"
                  />
                  {/* Floating Chip */}
                  <rect
                    x="35"
                    y="80"
                    width="50"
                    height="32"
                    rx="8"
                    className="fill-emerald-500 shadow-lg"
                    transform="rotate(-15 60 96)"
                  />
                  <rect
                    x="45"
                    y="90"
                    width="12"
                    height="8"
                    rx="2"
                    className="fill-emerald-200"
                  />
                  {/* Floating Chart */}
                  <path
                    d="M 150,130 Q 165,100 180,110 T 210,90"
                    stroke="url(#hero-gradient)"
                    className="from-emerald-500 to-cyan-500"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="150" cy="130" r="4" className="fill-cyan-500" />
                  <circle cx="210" cy="90" r="4" className="fill-emerald-500" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Key Statistics Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Numbers Speak for Themselves
              </h3>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                We're proud to be a trusted financial partner for a growing
                community across the globe.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <FaBolt className="text-emerald-500 text-3xl mx-auto mb-3" />
                <p className="text-5xl font-extrabold text-gray-900">17M+</p>
                <p className="text-gray-500 mt-1">Transactions</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <FaUsers className="text-emerald-500 text-3xl mx-auto mb-3" />
                <p className="text-5xl font-extrabold text-gray-900">1.5K+</p>
                <p className="text-gray-500 mt-1">Active users</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <FaGlobe className="text-emerald-500 text-3xl mx-auto mb-3" />
                <p className="text-5xl font-extrabold text-gray-900">10+</p>
                <p className="text-gray-500 mt-1">Countries</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-12">
              Designed for Everyone
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6">
                <FaLanguage className="text-emerald-500 text-4xl mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">
                  No language barrier
                </h4>
                <p className="mt-2 text-gray-600">
                  Communicate with your finances in the language you understand
                  best.
                </p>
              </div>
              <div className="p-6">
                <FaUniversalAccess className="text-emerald-500 text-4xl mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">
                  Made for everyone
                </h4>
                <p className="mt-2 text-gray-600">
                  Accessible and inclusive design for all users, regardless of
                  ability.
                </p>
              </div>
              <div className="p-6">
                <FaThumbsUp className="text-emerald-500 text-4xl mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">
                  Easy to use
                </h4>
                <p className="mt-2 text-gray-600">
                  A simple, intuitive interface that makes managing money a
                  breeze.
                </p>
              </div>
              <div className="p-6">
                <FaShieldAlt className="text-emerald-500 text-4xl mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">
                  AI integrated
                </h4>
                <p className="mt-2 text-gray-600">
                  Smart insights and voice commands to help you manage your
                  finances effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <div
            className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-3xl -z-10"
            aria-hidden="true"
          ></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Get Started in 3 Easy Steps
            </h3>
            <div className="relative grid md:grid-cols-3 gap-12 text-center">
              <div className="relative p-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold mx-auto mb-5 border-4 border-gray-50 shadow-sm">
                  1
                </div>
                <h4 className="text-xl font-semibold">Create Account</h4>
                <p className="mt-2 text-gray-600">
                  Sign up in minutes and get your account ready.
                </p>
              </div>
              <div className="relative p-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold mx-auto mb-5 border-4 border-gray-50 shadow-sm">
                  2
                </div>
                <h4 className="text-xl font-semibold">Add Funds</h4>
                <p className="mt-2 text-gray-600">
                  Easily add money to your CashPadi wallet.
                </p>
              </div>
              <div className="relative p-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold mx-auto mb-5 border-4 border-gray-50 shadow-sm">
                  3
                </div>
                <h4 className="text-xl font-semibold">Start Transacting</h4>
                <p className="mt-2 text-gray-600">
                  Send money, pay bills, and manage your finances.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 divide-y divide-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">
                CashPadi
              </h3>
              <p className="text-gray-400 max-w-xs">
                Your friendly financial partner for seamless digital payments.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-300">Quick links</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      About us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Contact us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Sign up
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300">Support</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Terms of Services
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300">Follow us</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center">
            <p className="text-gray-400">
              © 2025 CashPadi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
