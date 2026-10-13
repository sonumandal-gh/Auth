const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper to generate JWT token with user id, email, and role
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'supersecret',
    { expiresIn: '1h' }
  );
};

// GET /api/auth/users (Protected)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ message: "Users fetched successfully.", users });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Fetching users failed." });
  }
};

// POST /api/auth/signup & /api/auth/register
exports.postSignUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }

  const { firstName, lastName, email, password, role } = req.body;

  try {
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(422).json({ message: "User exists already, please pick a different email." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName: firstName ? firstName.trim() : '',
      lastName: lastName ? lastName.trim() : '',
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'student'
    });

    await user.save();

    const token = generateToken(user);

    const userData = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      message: "User registered successfully!",
      token: token,
      user: userData,
      userId: user._id.toString()
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "User registration failed." });
  }
};

// POST /api/auth/login
exports.postLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "A user with this email could not be found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password!" });
    }

    const token = generateToken(user);

    const userData = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    res.status(200).json({
      message: "Logged in successfully!",
      token: token,
      user: userData,
      // Backward compatibility fields
      userId: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed." });
  }
};

// GET /api/auth/profile (Protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      message: "Profile retrieved successfully.",
      user: {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};

// GET /api/auth/admin (Protected & Authorized for admin/owner)
exports.getAdminData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'student' });
    const adminsCount = await User.countDocuments({ role: 'admin' });
    const ownersCount = await User.countDocuments({ role: 'owner' });

    const recentUsers = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      message: "Admin metrics and privileged data retrieved.",
      stats: {
        totalUsers,
        studentsCount,
        adminsCount,
        ownersCount
      },
      recentUsers
    });
  } catch (err) {
    console.error("Admin data error:", err);
    res.status(500).json({ message: "Failed to fetch admin data." });
  }
};

// POST /api/auth/logout
exports.postLogout = (req, res) => {
  // Stateless JWT: client removes token from localStorage
  res.status(200).json({ message: "Logged out successfully." });
};
