import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { trackEvent } from "../services/analyticsService.js";

// Helper to check if email is designated as admin
const isDesignatedAdmin = (email = "") => {
  const adminEmails = (
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_EMAILS ||
    "poojadaki09@gmail.com"
  )
    .toLowerCase()
    .split(",")
    .map((e) => e.trim());
  return !!email && adminEmails.includes(email.toLowerCase());
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdminUser = isDesignatedAdmin(normalizedEmail);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isAdmin: isAdminUser,
      role: isAdminUser ? "admin" : "user",
      lastLoginAt: new Date(),
      lastLogoutAt: null,
      loginCount: 1,
      lastActiveAt: new Date(),
      isOnline: true,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Track analytics events
    trackEvent(user._id, "register", { email: user.email });
    trackEvent(user._id, "login", { email: user.email, method: "register_auto_login" });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Auto-elevate admin if designated email
    const isAdminUser = user.isAdmin || user.role === "admin" || isDesignatedAdmin(normalizedEmail);
    if (isAdminUser && (!user.isAdmin || user.role !== "admin")) {
      user.isAdmin = true;
      user.role = "admin";
    }

    // Update login metrics
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    user.lastActiveAt = new Date();
    user.isOnline = true;
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Track login event
    trackEvent(user._id, "login", {
      email: user.email,
      loginCount: user.loginCount,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check designated admin on getMe as well
    const isAdminUser =
      user.isAdmin || user.role === "admin" || isDesignatedAdmin(user.email);

    if (isAdminUser && (!user.isAdmin || user.role !== "admin")) {
      user.isAdmin = true;
      user.role = "admin";
      await user.save().catch(() => {});
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        loginCount: user.loginCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.userId;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already taken",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If account exists, password reset instructions have been sent to email.",
      });
    }

    const resetToken = jwt.sign({ userId: user._id, type: "password_reset" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      success: true,
      message: "Password reset instructions sent successfully",
      resetToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.type !== "password_reset") {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully. You can now login with your new password." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.user && req.user.userId) {
      const user = await User.findById(req.user.userId);
      if (user) {
        user.isOnline = false;
        user.lastLogoutAt = new Date();
        user.lastActiveAt = new Date();
        await user.save().catch(() => {});

        trackEvent(user._id, "logout", {
          email: user.email,
          logoutAt: user.lastLogoutAt,
          durationSinceLogin: user.lastLoginAt
            ? Math.round((new Date() - new Date(user.lastLoginAt)) / 1000)
            : null,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("[Logout Controller Error]:", error);
    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  }
};

export const heartbeat = async (req, res) => {
  try {
    if (req.user && req.user.userId) {
      await User.findByIdAndUpdate(req.user.userId, {
        lastActiveAt: new Date(),
        isOnline: true,
      }).catch(() => {});
    }
    res.status(200).json({ success: true });
  } catch {
    res.status(200).json({ success: true });
  }
};
