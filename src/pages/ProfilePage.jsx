import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaEnvelope,
  FaHashtag,
  FaUniversity,
  FaSignOutAlt,
  FaEdit,
  FaArrowLeft,
  FaKey,
} from "react-icons/fa";
import { logout } from "../features/account/accountSlice";

const ProfileInfoRow = ({ icon, label, value, isVerified }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200">
    <div className="flex items-center space-x-4">
      <div className="text-gray-500">{icon}</div>
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="font-semibold text-gray-800 text-right">{value}</span>
      {isVerified && (
        <span className="text-green-500" title="Verified">
          ✓
        </span>
      )}
    </div>
  </div>
);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.account);

  // Safely access user details from the nested structure
  const userDetails = user?.user;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-6 text-center border-b border-gray-200">
            <FaUserCircle className="text-6xl text-emerald-500 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              {userDetails?.fullName || "User Profile"}
            </h1>
            <p className="text-sm text-gray-600">{userDetails?.email}</p>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Information
            </h2>
            <div className="space-y-2">
              <ProfileInfoRow
                icon={<FaUserCircle />}
                label="Full Name"
                value={userDetails?.fullName}
              />
              <ProfileInfoRow
                icon={<FaEnvelope />}
                label="Email Address"
                value={userDetails?.email}
                isVerified={true} // Assuming email is always verified after registration
              />
              <ProfileInfoRow
                icon={<FaHashtag />}
                label="Account Number"
                value={userDetails?.accountNumber}
              />
              <ProfileInfoRow
                icon={<FaUniversity />}
                label="BVN"
                value="***********" // Masked for security
              />
            </div>
          </div>

          <div className="p-6 bg-gray-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  /* Navigate to edit profile page */
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => navigate("/set-pin")}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                <FaKey />
                <span>Set/Change PIN</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-all"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
