// middleware/roleCheck.js

/**
 * Restricts route access to specific roles.
 * Must be placed AFTER authMiddleware (protect) in the middleware chain.
 *
 * Usage: restrictTo("admin") or restrictTo("admin", "student")
 */
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user object exists from authMiddleware
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Authentication required before checking permissions.",
      });
    }

    // Check if the user's role is permitted
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Forbidden: You do not have permission to perform this action.",
      });
    }

    next();
  };
};

export const adminOnly = restrictTo("admin");
