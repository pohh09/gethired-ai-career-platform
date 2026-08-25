import User from "../models/User.js";

/**
 * Middleware that verifies if the authenticated user has administrative privileges.
 * Checks both database role/isAdmin flags and the environment ADMIN_EMAIL / FEEDBACK_RECEIVER_EMAIL configuration.
 */
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Authentication required.",
      });
    }

    // Fetch latest user document from DB to check permissions safely
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Configured admin emails list
    const adminEmailsConfig = (
      process.env.ADMIN_EMAIL ||
      process.env.ADMIN_EMAILS ||
      "poojadaki09@gmail.com"
    )
      .toLowerCase()
      .split(",")
      .map((e) => e.trim());

    const isDesignatedAdminEmail =
      user.email && adminEmailsConfig.includes(user.email.toLowerCase());

    const isAdmin =
      user.isAdmin === true || user.role === "admin" || isDesignatedAdminEmail;

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Administrator privileges required.",
      });
    }

    // Auto-sync admin flag in DB if user is in designated admin list but flag wasn't set
    if (isDesignatedAdminEmail && (!user.isAdmin || user.role !== "admin")) {
      user.isAdmin = true;
      user.role = "admin";
      await user.save().catch(() => {});
    }

    // Attach verified admin user to request
    req.adminUser = user;
    next();
  } catch (error) {
    console.error("[Admin Middleware Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error verifying authorization.",
    });
  }
};

export default adminMiddleware;
