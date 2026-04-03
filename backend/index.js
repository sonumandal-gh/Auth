require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoConnect = require("./database/database");

const AuthRouter = require("./routes/authRouter");

const app = express();

// Middlewares
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", AuthRouter); // Prefix with /api/auth

const PORT = process.env.PORT || 3100;

mongoConnect().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}).catch(err => {
  console.error("Database connection failed", err);
});