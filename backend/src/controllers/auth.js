import { ONE_DAY } from "../constants/index.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  getUserById,
} from "../services/auth.js";

// Register a new user
export const registerUserController = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message || "Registration failed",
    });
  }
};

// Login a user
export const loginUserController = async (req, res) => {
  try {
    const { session, user } = await loginUser(req.body);

    // Set cookies
    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie("sessionId", session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
      status: 200,
      message: "Successfully logged in a user!",
      data: {
        accessToken: session.accessToken,
        user,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: error.message || "Login failed",
    });
  }
};

// Logout a user
export const logoutUserController = async (req, res) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    // Clear cookies
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message || "Logout failed",
    });
  }
};

// Helper function to setup session
const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

// Refresh user session
export const refreshUserSessionController = async (req, res) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    // Setup new session
    setupSession(res, session);

    res.json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    // Clear cookies on error
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(401).json({
      status: 401,
      message: error.message || "Session refresh failed",
    });
  }
};

// Get current user
export const getCurrentUserController = async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "User data retrieved successfully",
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message || "Failed to retrieve user data",
    });
  }
};
