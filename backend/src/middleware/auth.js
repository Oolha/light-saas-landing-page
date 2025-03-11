import { verifyAccessToken } from "../services/token.js";
import { getUserById } from "../services/auth.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Authentication failed. Token required.",
      });
    }

    // Verify token
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        status: 401,
        message: "Authentication failed. Invalid token.",
      });
    }

    // Get user from token
    const user = await getUserById(decoded.userId);

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Authentication failed. " + error.message,
    });
  }
};

// Middleware for role-based access
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication required",
      });
    }

    if (roles.length === 0 || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      status: 403,
      message: "Access denied. Insufficient permissions.",
    });
  };
};
