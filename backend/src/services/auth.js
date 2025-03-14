import User from "../models/User.js";
import Session from "../models/Session.js";
import { generateTokens, verifyRefreshToken } from "./token.js";

// Register a new user
export const registerUser = async (userData) => {
  const { name, email, password, subscription } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    subscription: subscription || {
      plan: "Free",
      startDate: new Date(),
      isActive: true,
      endDate: null,
    },
  });

  // Return user data without password
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscription: user.subscription,
  };
};

// Login user
export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  if (
    user.subscription &&
    user.subscription.plan !== "Free" &&
    user.subscription.endDate &&
    new Date() > new Date(user.subscription.endDate)
  ) {
    user.subscription.plan = "Free";
    user.subscription.endDate = null;
    await user.save();
  }

  const tokens = generateTokens(user._id);

  // Create session
  const session = await Session.create({
    userId: user._id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
  });

  // Return session and user data
  return {
    session,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription,
    },
  };
};

// Logout user (invalidate session)
export const logoutUser = async (sessionId) => {
  await Session.findByIdAndDelete(sessionId);
  return true;
};

// Refresh user session
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  // Find session
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new Error("Invalid session");
  }

  // Compare refresh tokens
  if (session.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    await Session.findByIdAndDelete(sessionId);
    throw new Error("Session expired");
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    await Session.findByIdAndDelete(sessionId);
    throw new Error("Invalid refresh token");
  }

  // Generate new tokens
  const tokens = generateTokens(session.userId);

  // Update session
  session.accessToken = tokens.accessToken;
  session.refreshToken = tokens.refreshToken;
  session.expiresAt = tokens.expiresAt;
  await session.save();

  // Return updated session
  return session;
};

// Get user by ID
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
