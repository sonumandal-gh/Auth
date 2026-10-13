const express = require('express');
const AuthRouter = express.Router();
const { check } = require("express-validator");

const AuthController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public: POST /api/auth/login
AuthRouter.post("/login", [
  check("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email")
    .normalizeEmail({ gmail_remove_dots: false }),
  check("password")
    .notEmpty().withMessage("Password is required")
], AuthController.postLogin);

// Shared validation rules for registration/signup
const signupValidators = [
  check("firstName")
    .trim()
    .notEmpty().withMessage("First name is required")
    .matches(/^[A-Za-z\s]+$/).withMessage("Name should contain only letters"),

  check("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required")
    .matches(/^[A-Za-z\s]+$/).withMessage("Name should contain only letters"),

  check("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email")
    .normalizeEmail({ gmail_remove_dots: false }),

  check("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/).withMessage("Password must contain one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain one number")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain one special character"),

  check("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("role")
    .notEmpty().withMessage("Please select account type")
    .isIn(["student", "admin", "owner"]).withMessage("Invalid role")
];

// Public: Register / Signup routes (supports both /register and /signup)
AuthRouter.post("/register", signupValidators, AuthController.postSignUp);
AuthRouter.post("/signup", signupValidators, AuthController.postSignUp);

// Public/Optional: Logout endpoint
AuthRouter.post("/logout", AuthController.postLogout);

// Protected: Get current user profile
AuthRouter.get("/profile", protect, AuthController.getProfile);

// Protected: Get all users directory
AuthRouter.get("/users", protect, AuthController.getUsers);

// Server-side Role Authorization: GET /api/auth/admin -> protect, authorize('admin', 'owner')
AuthRouter.get("/admin", protect, authorize("admin", "owner"), AuthController.getAdminData);

module.exports = AuthRouter;