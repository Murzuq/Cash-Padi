import User from "../models/User.js";

// @desc    Verify a user's account number
// @route   POST /api/users/verify-account
// @access  Private (should be accessible by logged-in users)
export const verifyAccount = async (req, res) => {
  const { accountNumber } = req.body;

  if (!accountNumber) {
    return res.status(400).json({ message: "Account number is required" });
  }

  try {
    // Find the user by their account number and select only the fullName
    const user = await User.findOne({ accountNumber }).select("fullName");

    if (!user) {
      return res.status(404).json({ message: "Account holder not found" });
    }

    // Return the full name on success
    res.status(200).json({ fullName: user.fullName });
  } catch (error) {
    console.error("Account verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
